Async FSM
============

an [async](https://github.com/caolan/async) style finite state machine.

#How do I use this thing?

you pass it a state table, and it gives you back a function to kick off your state machine

```
var asfm = require("async-fsm");

var fsm = asfm({
	"start":function(your,args,here,next){
		//do some stuff
		next(null,"phase1",)
	},
	"phase1":function(something,else,next){
		//do what you need here
	},
	"phase2":function(whatever,you,want,next){
		//do some more stuff
		try{
			risky_biz();
		}
		catch(err){
			//we had an error, end things here
			next(err,null,final,args)
		}

		//end here!
		next(null,null,stuff,to,pass,to,the,end);
	}
});

//give it the first state
fsm("start",the,first,args,function(err,args,they,passed,to,the,end){
	//do whatever you want here!
});
```

each method passes the values after the error and the new state, right now states are only strings, if you pass a non-string into the function it will interpret that as a request to finish the machine and call the end function.