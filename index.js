module.exports = function(stateTable){
	
	return function() {
		var startState = arguments[0];
		var endFunction = arguments[arguments.length - 1];
		var initArgs = [];

		//this is to keep the optimiser happy, it doesn't like 
		//manipulations of the arguments context variable
		for(var i=1;i<arguments.length - 1;++i){
			initArgs.push(arguments[i]);
		}

		var callback = function(){
			var err = arguments[0];
			var newState = arguments[1];

			//lots of code to keep this bad boy optimizable because hey why not
			var rest = [];
			for(var i=2;i < arguments.length; ++i){
				rest.push(arguments[i]);
			}

			if(err !== null){
				//we had an error
				process.nextTick(function(){
					endFunction.apply(null,[err].concat(rest));
				});
			}
			else if(typeof(newState) !== 'string'){
				//we are done!
				process.nextTick(function(){
					endFunction.apply(null,[null].concat(rest));
				});
			}
			else{
				//we got a new state
				var stateFunction = stateTable[newState];


				if(stateFunction === undefined){
					//if we don't support that state, give an error
					process.nextTick(function(){
						endFunction.apply(null,[new Error("invalid state: " + newState)].concat(rest));
					});
				}
				else{
					//otherwise pass all the arguments on to the next function with the 
					//callback added.
					process.nextTick(function(){
						stateFunction.apply(null,rest.concat([callback]));
					})
				}
			}
		}

		//todo:: make this stuff a function so it isn't copy-pasted
		var stateFunction = stateTable[startState];

		if(stateFunction === undefined){
			process.nextTick(function(){
				endFunction.apply(null,[new Error("invalid state: " + startState)].concat(initArgs));
			});
		}
		else{
			process.nextTick(function(){
				stateFunction.apply(null,initArgs.concat(callback));
			})
		}
	}
}