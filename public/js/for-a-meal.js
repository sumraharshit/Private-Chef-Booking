const x = document.getElementById("demo");

function successCallBack(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
  console.log(position);
};

function errorCallback(error) {
  console.log(error);
};

navigator.geolocation.getCurrentPosition(successCallBack, errorCallback);
