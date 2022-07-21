var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll(
  ".enable-notifications"
);

if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      console.log("Service worker registered!");
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

// INITIAL NOTIFICATIONS SETUP

function displayConfirmNotification() {
  var options = {
    body: "You successfully subscribed to our notifiaction service.",
    icon: "/src/images/icons/app-icon-96x96.png",
    image: "/src/images/sf-boat.jpg",
    dir: "ltr",
    lang: "en-US", // BCP 47
    vibrate: [100, 50, 200],
    badge: "/src/images/icons/app-icon-96x96.png",
    tag: "confirm-notifications",
    renotify: true,
    actions: [
      {
        action: "confirm",
        title: "Okay",
        icon: "/src/images/icons/app-icon-96x96.png",
      },
      {
        action: "cancel",
        title: "Cancel",
        icon: "/src/images/icons/app-icon-96x96.png",
      },
    ],
  };
  navigator.serviceWorker.ready.then(function (swReg) {
    swReg.showNotification("Sucessfully Subscribed", options);
  });
}

function configurePushSub() {
  var reg;
  if (!(serviceWorker in navigator)) {
    return;
  }
  navigator.serviceWorker.ready
    .then(function (swReg) {
      reg = swReg;
      return swReg.pushManager.getSubscription();
    })
    .then(function (subs) {
      var vapidPublicKey = 'BDhTZA4JGrLBYmCbEiHQiSpMcObcsRb-qNj-x3HMCgWvAjMTF-cJAYbPubq9BaiaOzpWPmIYg5jDFx0p0mHYyMA';
      var convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey)
      if (subs === null) {
        // Create Subscription
        reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKey,
        });
      } else {
        // We have a Subscription
      }
    }).then(function(newSub){
      return fetch('https://pwagram-99adf.firebaseio.com/subscriptions.json',{
        method: 'POST',
        headers: {
          "Content-Type" : "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          newSub
        })
      })
    }).then(function(res){
      if(res.ok){
        displayConfirmNotification();
      }
    }).catch(function(err){
      console.log(err)
    });
}

function askForNotificationPermission() {
  Notification.requestPermission(function (result) {
    console.log(result);
    if (result !== "granted") {
      console.log("No notification permission granted!");
    } else {
      // enableNotificationsButtons[i].style.display = 'none';
      configurePushSub();
      // displayConfirmNotification();
      console.log("User Choice", result);
    }
  });
}

if ("Notification" in window && serviceWorker in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = "inline-block";
    enableNotificationsButtons[i].addEventListener(
      "click",
      askForNotificationPermission
    );
  }
}

// $ npm run web-push generate-vapid-keys

// > web-push
// > web-push "generate-vapid-keys"


// =======================================

// Public Key:
// BDhTZA4JGrLBYmCbEiHQiSpMcObcsRb-qNj-x3HMCgWvAjMTF-cJAYbPubq9BaiaOzpWPmIYg5jDFx0p0mHYyMA

// Private Key:
// YD4X7gE1TPtNPi3H0xnl2POe088ws8WfLysbdAqszYY

// =======================================