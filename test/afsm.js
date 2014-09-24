var afsm = require("../index.js");
var assert = require("assert");

suite("afsm functionality",function(){

	var fsm = afsm({
		"start": function(states,error,next){
			states.push("start");

			if(error){
				next(new Error("deliberate Failure!"),"phase1",states,true);
			}
			else{
				next(null,"phase1",states,true);
			}
		},

		"phase1": function(states,keepgoing,next){
			states.push("phase1");

			if(keepgoing){
				next(null,"phase2",states);
			}
			else{
				next(null,null,states,true,true);
			}
		},

		"phase2": function(states,next){
			states.push("phase2");
			next(null,"phase1",states,false);
		}
	});

	test("fsm executes",function(done){
		fsm("start",[],null,function(err,states,crap1,crap2){
			assert.ifError(err,"there should be no errors");
			assert.notEqual(states,undefined,"the final args should be passed");
			assert.notEqual(crap1,undefined,"the final args should be passed")
			assert.notEqual(crap2,undefined,"the final args should be passed")
			done();
		});
	});

	test("fsm transitions correctly",function(done){
		fsm("start",[],null,function(err,states,crap1,crap2){
			assert.ifError(err,"there should be no errors");
			assert.deepEqual(states,["start","phase1","phase2","phase1"],"the states should be ordered correctly");
			done();
		});
	});


	test("fsm errors out",function(done){
		fsm("start",[],true,function(err,states,crap1,crap2){
			assert.ok(err,"there should be an error");
			assert.deepEqual(states,["start"],"only the first state should have been reached");
			done();
		});
	})
});