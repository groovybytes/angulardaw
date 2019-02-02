var timerID=null;
var interval=200;
var tick=0;

console.log("starting tick thread");
self.onmessage=function(e){

  function ticker() {
    tick=0;
    return setInterval(function(){

      postMessage({hint:"tick",value:tick});
      tick++;
    },interval);

  }
  if (e.data.command=="start") {
    console.log("starting");

    postMessage({hint:"start"});
    timerID=ticker();

  }
  else if (e.data.command=="reset") {

    tick=0;
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
    if (timerID){
      clearInterval(timerID);
      timerID=ticker();
    }
    postMessage({hint:"set-interval",value:interval});
  }
};

