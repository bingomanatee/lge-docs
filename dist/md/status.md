Stores have a load status that progresses through the following stages. 
Each stage is indicated by a symbol - **`S_NEW`**, **`S_STARTING`**, **`S_STARTED`**, 
**`S_ERROR`** or **`S_STOPPED`**

1. **`S_NEW`** is the first stage, before `.start()` is called.
2. **`S_STARTING`** is the stage entered into as soon as `.start()` is called.
3. **`S_STARTED`** is the stage the store is in when store is resolved(). 
   this will happen immediately unless the starter function is asynchronous.
4. **`S_ERROR`** is the stage that the store will be put into if an action emits an 
   untrapped error. 
5. **`S_STOPPED`** is the stage the store will be in if a store is manually stopped. 
   (which is optional)
   
Most stores will be in **`S_STARTING`** stage for the bulk of their lifespan,
which is fortunate because that's the only stage that actions can complete in.

* If a store is in **`S_NEW`** or **`S_STARTING`** actions will be delayed until 
  the store ends in **`S_STARTED`**. 
* If a store is in **`S_STOPPED`** or **`S_ERROR`** actions will be blocked. 

That being said ... the presence and absence of state and status affects the status
of the store:

<div style="width: 100%; display: flex; flex-direction: row; justify-content: center"><img src="/img/status.svg" /></div>

If there is no starter function, the store begins in status **`S_STARTED`**. 
(without a starter function there is no meaningful status changes pending so why not?)

If there is a starter function but not state value, the value of state
is the symbol **`STORE_SET_UNSET_VALUE`** 
until it is overwritten by the result of the starter function

If neither is present, the state is set to an empty object ({}) 
and status is set to **`S_STARTED`** from the beginning

## Final States

There are two ways to shut the store down:

1. Accidentally. if an uncaught error emits from an action, and the state is 
   set to **`S_ERROR`**. The error will be streamed through the second listener
   to `.subscribe()`.
2. Intentionally by calling `myStore.stop()`, which sets the status to **`S_STOPPED`** 
   and freezes the state of the store in its current state
   and blocks all future actions. You can optionally
   set a final value to the state as an argument to `myStore.stop(finalValue)`.
   
Either of those final states can be reset to **`S_STARTED`** by calling `myStore.restart()`.

