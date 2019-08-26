// assume that WebGL Earth JS has already been loaded
// also I am using global variables. fight me

var earth;
var marker;
var options = { zoom: 3.0, position: [47.19537,-122] };

function nextYear() {
  return (new Date()).getFullYear()+1;
}

function displayNextYear() {
  document.getElementById("next_year").innerText = nextYear();
}

countdown = {
  timezone: {
    offset: -8,
    name: "America/Los_Angeles",
    lat: 34.052235,
    lng: -118.243683
  },
  seconds: function() {
    var d1 = Math.floor(Date.now()/1000); // current time in UTC
    var d2 = Math.floor(Date.UTC(nextYear(),0,1,0,0,0,0)/1000); // next new year in UTC
    var diff = d2-d1;
    var offset = this.timezone.offset * 60 * 60;
    return diff - offset;
  },
  minutes: function() {
    var secondsPerMin = 60;
    var mins = (this.seconds() % (60*60)) / secondsPerMin;
    return Math.floor(mins);
  },
  hours: function() {
    var secondsPerHour = 60*60;
    return Math.floor((this.seconds() % (60*60*24))/secondsPerHour);
  },
  days: function() {
    var secondsPerDay = 60 * 60 * 24;
    return Math.floor(this.seconds() / secondsPerDay);
  }
};

function updateCountdown() {
  var tick = function() {
    document.getElementById("seconds").innerText = countdown.seconds() % 60;
    document.getElementById("minutes").innerText = countdown.minutes();
    document.getElementById("hours").innerText = countdown.hours();
    document.getElementById("days").innerText = countdown.days();
  }
  tick();
  setTimeout(updateCountdown, 1000);
}

function initialize() {
  earth = new WE.map('earth_div', options);

  WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(earth);

  document.getElementById("la").click();
  displayNextYear();
  updateCountdown();
}

function panTo(that) {
  var lat = that.getAttribute("data-lat");
  var lng = that.getAttribute("data-lng");
  var offset = Number.parseFloat(that.getAttribute("data-offset"));
  countdown.timezone.offset = offset;
  earth.panTo([lat, lng], 0.5);
  // remove current marker
  if(marker !== undefined) {
    marker.removeFrom(earth);
  }
  marker = WE.marker([lat, lng]).addTo(earth);
  marker.addTo(earth);
}
