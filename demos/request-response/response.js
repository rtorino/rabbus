var util = require("util");
var Rabbit = require("wascally");

var Rabbus = require("../../index");
var config = require("../../specs/config");

Rabbit.configure({
  connection: config
}).then(function(){;
  
  function SomeResponder(rabbus){
    Rabbus.Responder.call(this, rabbus, {
      exchange: "req-res.exchange",
      queue: "req-res.queue",
      routingKey: "req-res.key",
      limit: 1,
      messageType: "req-res.messageType"
    });
  }

  util.inherits(SomeResponder, Rabbus.Responder);

  var responder = new SomeResponder(Rabbit);

  responder.handle(function(message, respond){
    respond({
      place: "world"
    });
  });

}).then(null, function(err){
  setImmediate(function(){
    throw err;
  });
});

function exit(){
  console.log("");
  console.log("shutting down ...");
  Rabbit.closeAll().then(function(){
    process.exit();
  });
}

process.once("SIGINT", function(){
  exit();
});

process.on("unhandledException", function(err){
  console.log(err);
  exit();
});


