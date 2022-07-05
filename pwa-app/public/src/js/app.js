var defferedPrompt;
if(!window.Promise){
  window.Promise = Promise;
}

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

// AJAX
var xhr = new XMLHttpRequest();
xhr.open('GET','https://httpbin.org/ip');
xhr.responseType = 'json';

xhr.onload = function (){
  console.log(xhr.response)
}

xhr.onerror = function (){
  console.log('Error!')
}

xhr.send();

fetch('https://httpbin.org/ip').then((res)=>{
  console.log(res,"RESPONSE")
  return res.json()
}).then((data)=>{
  console.log(data)
}).catch((err)=>{
  console.log(err)
})

fetch('https://httpbin.org/post',
{
  method: 'POST',
  headers: {
    "Content-Type" : "application/json",
    "Accept" : "application/json"
  },
  mode: 'cors',
  body: JSON.stringify({message: "Does this works !"})
}).then((res)=>{
  console.log(res,"RESPONSE")
  return res.json()
}).then((data)=>{
  console.log(data)
}).catch((err)=>{
  console.log(err)
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