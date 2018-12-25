var timerID=null;
var interval=200;
var tick=0;

console.log("starting tick thread");
self.onmessage=function(e){
  if (e.data.command=="start") {
    console.log("starting");
    tick=0;
    //postMessage("tick");
    timerID=setInterval(function(){

        postMessage(tick);
        tick++;
        },interval);

  }

  else if (e.data.command=="stop") {
    console.log("stopping");
    clearInterval(timerID);
    timerID=null;
  }
  else if (e.data.command=="set-interval") {
    console.log("set interval to "+e.data.params);
    interval=e.data.params;
  }
};

