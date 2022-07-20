
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

// INITIAL NOTIFICATIONS SETUP

function displayConfirmNotification(){
  var options = {
    body: 'You successfully subscribed to our notifiaction service.',
    icon: '/src/images/icons/app-icon-96x96.png',
    image: '/src/images/sf-boat.jpg',
    dir: 'ltr',
    lang: 'en-US', // BCP 47
    vibrate: [100,50,200],
    badge: '/src/images/icons/app-icon-96x96.png'
  }
  
  if('serviceWorker' in navigator){
    navigator.serviceWorker.ready.then(function(swReg){
      swReg.showNotification('Sucessfully Subscribed [SW]',options)
    })
  }
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log(result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      // enableNotificationsButtons.css("display","none");
      displayConfirmNotification();
      console.log('User Choice', result);
    }
  });
}

if ('Notification' in window) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}