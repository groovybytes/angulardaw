var timerID=null;
var interval=200;
var tick=0;

console.log("starting tick thread");
self.onmessage=function(e){
  if (e.data.command=="start") {
    console.log("starting");
    tick=0;
    postMessage({hint:"start"});
    timerID=setInterval(function(){

        postMessage({hint:"tick",value:tick});
        tick++;
        },interval);

  }

  else if (e.data.command=="stop") {
    console.log("stopping");

    clearInterval(timerID);
    timerID=null;
    postMessage({hint:"stop"});
  }
  else if (e.data.command=="set-interval") {
    console.log("set interval to "+e.data.params);
    interval=e.data.params;
    postMessage({hint:"set-interval",value:interval});
  }
};

