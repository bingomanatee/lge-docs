## Store

The Looking Glass Store is a class designed to track, mutate and stream out state. 

### Store constructor: `new Store({state, starter, actions})`

The Constructor takes a single argument all of whose values are optional. 

**`state`** is the starting value of the store. without **`state`**, the initial state of the store
is a symbol, **`STORE_STATE_UNSET_VALUE`**. 

**`starter`** is a method triggered by `myStore.start()`. Its expected to take the store as its argument
and return a value that the store's state will be initialized to. 

**`actions`** must be an object whose key values are functions (or lambdas).

```javascript
{
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
```

Actions can return a wide variety of return values: functions, promises, objects, or even nothing at all/undefined. 
Promises and functions will be "unravelled" until a return value -- or no value -- is reached.

The actions' function (and any returned functions) will be passed the store itself as the first argument. The initial 
action can take other functions from calling contexts. 

### Store.state property: (usually) object | Symbol(STORE_STATE_UNSET_VALUE)

Store.state is a read-only property that reflects the current value of the Store. Its generally expected to be an object,
but this is not enforced by the code.

State is initially set by the values of store changed by actions or the `.change(..)` method. 

### Store.actions property: object({string: function ... })

This property reflects an augmented set of actions based on the actions value of the constructor configs. 

### Store.status property: Symbol

This is a read-only value that is advanced as the store is initialized. see [Status and Initialization](/status) for details. 

### Store.stream property: BehaviorSubject (RxJS)

Stream is a read-only Observable emitter that updates every time state is updated. It exists to
allow outside elements to subscribe to updates:

```jsx harmony

let subscriber = myStore.stream.subscribe(onChange, onError, onClosed);

```

### Store.start() method : ChangePromise.

Store.start advances the status of a store to **`S_STARTED`** when it resolves. 
It calls the starter method from the constructor's configuration, if it exists. 

### Store.update(value, {options}) method: ChangePromise

The `update(...)` method is the underlying method that handles the results of action calls.

Although it can be called directly to modify state, its advised to use actions rather than
calling the method directly. 

### Store.stop(value (optional)) method: ChangePromise

Stops the store, blocking future updates. If an argument is passed, this value is locked in
as the final value of the store.

### Store.restart() method: ChangePromise

Returns the store to a **`S_STARTED`** status if it is in final states 
(**`S_STOPPED`** or **`S_ERROR`**). 

### Store.addAction(name, function) method: Store

Adds a new action to the store. Its the lower level method that is called to process the 
action property of the constructor, but can be used post-costructor to add extra actions. 

### Store.addActions(object) method: Store

adds multiple actions to the store. It is the method that the actions property of the constructor
is passed to. will override/merge with existing action set. 

### Store.addProp(name, {type, start, test, valueifTestFails}) method: Store

Adds a named value to the store, and a set action to the store to update it; 

```jsx harmony

let userStore = new Store({state: {loggedIn: false}});

userStore.addProp('name', {type: 'string'})
.addProp('email', {type: 'string'})
.addProp('age', {type: 'number'});

userStore.start();

userStore.setName('Bob Jones');
userStore.setEmail('foo@yahoo.com');
userStore.setAge(44);

console.log('state:', userStore.state);

// log state: {loggedIn: false, name: 'Bob Jones', email: 'foo@yahoo.com'}

```

addProp is an alternate way of setting values and updater actions that is more succinct when 
individual fields need to be updated one by one. The actions created by addProp are synchronous.

## ChangePromise

ChangePromise is an object with the signature and behavior of a promise and other fields. 
It is used to track an action or update as it is unravelled through the code of a store. 

### ChangePromise constructor(change(optional), {info} (optional))

change is (usually) the output of the action. the info object is optional and can contain 
values including the status that the store is to be set to after the ChangePromise resolves
and 'noop', a switch that suppresses the out value of the action from changing the store. 

### ChangePromise.then(function)

As with a promise, adds an event that triggers when the ChangePromise is resolved.

### ChangePromise.catch(function)

As with a Promise, adds an event that triggers when the ChangePromise is rejected.

### ChangePromise.value

The current unravelled value that the ChangePromise has resolved to. 
