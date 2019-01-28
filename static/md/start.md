This tutorial assumes you have a react website or know how to create one with create-react-app. 

We will use yarn as the basis for tutorials here. There's no reason not to use
npm, it's just slower and more verbose. 

The first step is of course, installing Looking Glass Engine:

```jsx harmony

yarn add @wonderlandlabs/looking-glass-engine

```

The next step is to create a store. For now we'll assume you have a shopping
cart that you want to connect to from more than one view. 

```jsx harmony
// in stores/cart.js

import store from '@wonderlandlabs/looking-glass-engine'

const cart = new Store({
    state: {cart: [], total: 0},
    actions: {
      addProduct: (store, product) => ({
        ...store.state, 
        cart: [...store.state.cart, product], 
        total: store.state.total + product.cost
      })
  }
});

export default cart;

```

note - unlike a component.setState, the result of addProduct _completely replaces_ 
the value of `cart.state` and triggers an event out of cart.stream.

Lastly, add the store to a product page.

We'll assume that 
1. the name and cost of the product is injected as props
2. for this simple example we only support buying single products

```jsx harmony

import cart from '../stores/cart';

export default class ProductPage extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {...cart.state , product: {...props}};
  }
  
  componentDidMount() {
    this._cartSub = cart.stream.subscribe(
      (store) => this.setState(store.state),
      (error) => console.log('state error: ', error)
    )
  }
  
  componentWillUnmount() {
    if (this._cartSub) this._cartSub.unsubscribe();
  }
  
  render () {
    
    return (
      <article>
      <div>
        Cart total: {this.state.total},
        {this.state.cart.length} products in cart.
      </div>
      
      <h1>{product.name}</h1>
      
      <p>{product.text}</p>
      
      <div><button onClick={() => cart.actions.addProduct(this.state.product)
      .then(() => document.location = '/shop')
      } /></div>
     
      </article>
    )
    
  }
}

```

Let's walk through the most important parts of this component part by part: 

1. In the constructor, we copy the store's state into the component's state
   We can always filter a store's state (or a combination of multiple store's states)
   into a component, or simply leave it in the component. 
   
2. We assume a specific product is passed into this component and put it into state as well.

3. in the render portion of the component we give some information from the cart in a `div`.

4. We also describe the product in text.

5. Lastly we trigger a purchase with a click action. Note that the first argument to all
   actions is the store itself - we don't have to pass it through action calls, its 
   automatically passed in by LGE. 
   
A few things to notice:

* The cart is subscribed to in `componentDidMount`; when the store's state changes
  the view will redraw with the cart's current content, because with every state change,
  we will trigger a `this.setState(...)` with current values. 
  
* `cart.stream` is an __RxJS BehaviorSubject__. the `cart.stream.subscribe(...)` method  
  follows the RxJS Observable pattern. 
  
* `cart.actions.___` methods all return promises. Because of this we can delay the 
  re-loading of the page until after the cart loads. This is useful, because it gives
  an opportunity to put AJAX in actions to load/update a REST back end, etc. 
  
* For good hygiene we un-subscribe to the stream in `componentWillUnmount`. 
