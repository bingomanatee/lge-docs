_note - this is a partial guide to the anatomy of a store. the API is a more complete list
of the stores' anatomy._

A **store** is a **two-way stream** that emits updates as its' state changes. The state is the "product"
of the store. Like any good store, it "advertises" when its products change. 

Stores exposed change api is through *actions*. Actions are methods that ultimately return
an updated version of the state. 

## Creating a Store

Stores are Class Instances of Looking Glass Engine Stores. 

They have a single configuration property with one or more of the following fields:

* **state** -- the initial value of `store.state`. 
* **start** -- a function that returns a new value of state, or a promise that resolves
to a new value of state. Start receives the store as an initial property.
note, start is a special purpose action and so follows all the rules of actions
(see below). 
* **actions** -- an object of named changes that take in the store -- and other user-provided
arguments -- and returns a new store state value, or optionally a promise that
resolves to a new state value. 

While all these values are optional, if you have neither a state or start value,
the store's value will be initialized to an empty object -- `{}`. 

## Starting a Store
             
A store is closed until you "start" it. Until you call `myStore.start()`, all actions are delayed.
There are more nuances but for the most part

## Stopping a Store

To "freeze" the value of store and prevent further actions to change its value, call 
`myStore.stop()`. If you want to set its' state one last time to a specific value you can
pass a new state as an argument to `myStore.stop({foo: 'bar'})` but that is optional. 

## Subscribing to Store updates

If you want to listen to the Stores' change, you *subscribe* to the stores' *stream*. 
A store's stream is an RxJS Observable - specifically a [`BehaviorSubject`](http://reactivex.io/rxjs/manual/overview.html#behaviorsubject).

RxJS has more information about Behavior subjects but for now here are the 
"Need to Knows" about streams: 

1. They are synchronous
2. To subscribe to a stream, call `myStore.stream.subscribe(store => console.log("store is now " + store.state"))`;
3. The full API of subscribe is:

```jsx harmony

let subscriber = myStore.stream.subscribe(onChange, onError, onClosed);

```

* `onChange` receives the store, and is emitted every time the store's state changes.
* `onError` receives data every time the store's actions throw errors. That data varies
  but usually includes an `.error` property that is an Error instance. 
* `onClosed` receives no information; it is called when the store is closed. 

As a shortcut you can subscribe directly to your store -- `myStore.subscribe(...)`.
This is a direct passtrhough to `myStore.stream.subscribe(...)`

## Actions

The real power in Stores are actions. 
Actions are functions that "unravel" to a specific value that updates the store. 

By default actions are synchronous. If you call an action on a store, the store's state
should be changed by the next line of code, and a stream notification is emitted immediately. 

The return value of all actions are Promises, which you can do the usual promise-y things
to. However this does _not_ mean there is necessarily any sort of delay to the resolution
of the action. 

Think of it this way. _some_ actions resolve immediately; some do not. But if you 
want to be _sure_ you wait for the action to complete, 
use `await myStore.actions.myAction()` 
or `myStore.actions.myAction().then(..)` to make sure you wait for the action to complete.

### Async Actions 

If an Action returns a Promise, the result of that Action is resolved and its value replaces
the stores' state, triggering a stream notification.

### Functional Actions

An action that returns a function is further unravelled by passing your store to that 
function and resolving it. 

I.e., 

```jsx harmony

myStore = new Store({
    state: {count: 1}, 
    actions: {
      addRandom: (currentMyStore) => {
        let rand = Math.random();
        return function(evenMoreCurrentMyStore) {
            let count = evenMoreCurrentMyStore.state.count;
            count += rand;
            return {count};
        }
      } // end addRandom
    } // end actions
});

myStore.subscribe((store) => console.log('store is now ', store.state));

myStore.start();

myStore.actions.addRandom();

// log: 'store is now ', 1.151552

```

This is the "Freactal Pattern". It may seem redundant, but hold on, it makes more sense later.

## No-return Actions

An action doesn't have to return anything. Because an action has access to other actions,
it might call other actions but not *directly* make any changes:

```jsx harmony

myStore = new Store({
    state: {count: 1}, 
    actions: {
      doubleCount: (store) => {
        return {...store.state, count: store.state.count * 2}
      },
      incCount: (store) => {
        return {...store.state, count: store.state.count + 1}
      },
      doubleAndIncCount: (currentMyStore) => {
        currentMyStore.actions.doubleCount();
        currentMyStore.actions.incCount();
      }
    } // end actions
});

myStore.subscribe((store) => console.log('store is now ', store.state));

myStore.start();

myStore.actions.doubleAndIncCount();

// log: 'store is now ', 3

myStore.actions.doubleAndIncCount();

// log: 'store is now ', 7

```

doubleCount and incCount *do* return values -- but doubleAndIncCount does **not**.
It doesn't need to - it accomplishes all it needs to by calling other actions. 

### A combination of the above

The "Great unravelling" of actions allow you to combine promises, functions, and values
and even call remote / async actions in any combination you want. Unravelling stops 
when:

* A function returns no value (a No-return action) 
* A function returns a non-promise, non-function value (at which point the state updates
  with that value).
  
So you can do great messy functions as actions and they will be resolved:

```jsx harmony

const shoppingStore = new Store ({
  state: {cart: [], total: 0},
  actions: {
    
    updateCart: (store, newCart) => {
      const total = newCart.reduce((total, product) => total + product.cost, 0);
      return {...store.state, cart: newCart, total};
    }
    addProduct: (store, productID) => {
      if (!productID) throw new Error('addProduct requires a productID');
      
      return axios.get('http://myapi.com/products/' + productID)
      .then(({data}) => {
        return (myStore) => {
          const cart = myStore.state.cart;
          myStore.actions.updateCart([...cart, data]);
          // note - no return.
        }
      })
    }
  } 

})

```

`addProduct` is an action that:
 
 1. calls a promise that 
 2. returns a function that 
 3. updates state via actions but 
 4. doesn't return a value (No-return).
  
the inner function gets the store again, giving you a chance
to synchronously get the most recent state from it.

## Errors in actions

An untrapped error will freeze up the store in an error state and freeze it until
you fix the error and restart the store. Errors will emit out of subscribers, giving
you a chance to restart the store. 

```jsx harmony

const myState = new Store({
    state: {
      value: 1000
    },
    actions: 
    {
      divide : (store, n) => {
          return {
            value: store.value / n
          };
      }
   }
});


myStore.subscribe((store) => {
      console.log('store value is now ', store.state.value);
     }, 
    ({error}) => {
      console.log('error: ', error);
      myStore.restart({value: 1000});
    });

myStore.start();

myStore.actions.divide(2);
// log `store value is now', 500;

myStore.actions.divide(0)
.catch(err => console.log('error caught: ', err));

// log 'error: ', <div by zero error>
// log 'error caught: err
// store restarted from stream

console.log('myStore value:', myStore.state.value)

// 'myStore value:', 1000

```
