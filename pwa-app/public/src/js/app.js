var defferedPrompt;
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(function () {
    console.log("Service worker registered!");
  }).catch((errr)=>{
    console.log(errr)
  })
}

window.addEventListener('beforeinstallprompt', function (e){
  console.log("beforeinstallprompt")
  e.preventDefault();
  defferedPrompt = e;
  return false;
});

var promise = new Promise(function(resolve, reject){
  setTimeout(function(){
    // resolve('This is executed after timer is done');
    reject({code: 500,message: 'An error occured'})
    // console.log("This is executed after timer is done")
  },3000)
})

// promise.then(function(text){
//   return text;
// }, function(err){
//   console.log(err.code,err.message)
// }).then(function(changedText){
//   console.log(changedText)
// })

promise.then(function(text){
  return text;
}).then(function(changedText){
  console.log(changedText)
}).catch((err)=>{
  console.log(err.code,err.message)
})


// console.log("This is executed right after setTimeout()")