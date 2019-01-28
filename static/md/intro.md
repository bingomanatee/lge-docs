Looking Glass Engine(LGE) combines features of Redux, RxjS,
Saga and Freactal to provide a state model
that seamlessly blends asynchronous and synchronous actions, initialization statefullness,
and streaming to inject state into React or any other Javascript/UI system that needs it. 

Unlike Redux, LGE's state are objects that have a formal initialization cycle, and 
when Actions return promises or functions those are resolved/executed in order to return a new
state. 

LGEs' engines can be reduced like Redux actions, or can be maintained as a seperate series of 
states that can be independently created, accessed, and combined. as needed.

Under the hood LGEs use streams that can be `subscribe()`d to; when the state changes, 
the subscription functions receive values. 

While predefined actions are provided you can also pass a function through `myState.change()`
to transform state in a dynamic manner. 
