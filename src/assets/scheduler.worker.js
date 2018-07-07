/*setInterval(()=>{
  self.postMessage("hallo");
})*/

requestAnimationFrame(()=>self.loop);
self.addEventListener("message",  e => {
  //self.postMessage(err.message);
});


 self.loop=function(){
   console.log("here");
   requestAnimationFrame(()=>self.loop());
}
