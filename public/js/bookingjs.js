const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 2000,
};

const map = L.map('map').setView([51.505, -0.09], 15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

navigator.geolocation.watchPosition(successCallBack,errorCallback,options);

let marker;
let circle;
let zoomed;

function successCallBack(position)
{
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    if(marker)
    {
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

  marker = L.marker([lat,lng]).addTo(map);
  circle = L.circle([lat,lng],{radius: accuracy}).addTo(map);
 
  if(!zoomed)
  {
    zoomed = map.fitBounds(circle.getBounds());
  }

  map.setView([lat,lng]);
   
}

function errorCallback(error)
{
    if(error.code === 1)
    {
        alert("Please Allow Geolocation Access");
    }
    else{
        alert("Cannot get current Location");
    }
}