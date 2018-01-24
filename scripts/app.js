// places google API script into index.html
function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAHFXxlZ9f8tSwrIPQlhRqpW_UzSlSYyDU&libraries=places,geometry&callback=initApp';
  document.body.appendChild(script);
}
window.onload = function() {
  loadScript();
};

// called in ititApp so that google exists
// before bindings applied.
var applyBindings = function() {
  ko.applyBindings(new ViewModel());
};

var map;
var markers = [];
var infowindowClick = null;

// callback for google api that adds in map.
// also applies KO bindinds
function initApp() {
  var originalMapCenter = new google.maps.LatLng(32.072, -81.093);
  map = new google.maps.Map(document.getElementById('map'), {
    center: originalMapCenter,
    zoom: 15
  });
  // applies KO bindings after Google JS API
  applyBindings();
}

// Uses the name passed from clicked KO-created list item
// to briefly bounce corresponding map marker and
// open an infoWindow panel. Would use index of
// index of staticPoints in ViewModel but have not
// found a way to reference it.
var listItemsMarkerToggle = function(name, event) {
  if(event){
    var nodeName = event.srcElement.nodeName;
    // KO trips click binding on foreach when updating
    // listItemsToShow. Cannot suppress bubble. This is unwanted.
    // Filter for click events on only LI and SPAN
    if(nodeName === 'LI' || nodeName === 'SPAN') {
      // find by marker name and return the index as var target
      var target = markers.findIndex(function(e){
        if(e.name === name) {
          return e;
        }
      });
      var infoWindow = new google.maps.InfoWindow({
        content: name
      });
      infoWindow.open(map, markers[target]);
      setTimeout(function(){
        infoWindow.close(map, markers[target]);
      }, 2100);
      markers[target].setAnimation(google.maps.Animation.BOUNCE);
      setTimeout(function(){
        markers[target].setAnimation(null); 
      }, 2100);
    }
  }
    
};

// creates new markers and pushes them into markers array
// fed by loadPoints() in KO ViewModel
var geoFetch = function(point){
  var name = point.name;
  var address = point.address + ' Savannah, GA';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status){
    if (status === 'OK') {
      // Needs rate throttle if more points are used
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: results[0].geometry.location
      });
      //hover infowindow
      var infowindowOver = new google.maps.InfoWindow({
        content: name
      });
      //infowindow that opens on click
      infowindowClick = new google.maps.InfoWindow({
        content: ''
      });

      marker.type = point.type;
      marker.name = point.name;
      marker.address = address;

      marker.addListener('click', function() {
        infowindowOver.close(map, marker);
        populateInfoWindow(marker, infowindowClick);
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 700);
      });

      marker.addListener('mouseover', function() {
        var test = infowindowClick.getMap();
        // forces the mouseover infowindow to stay shut
        // if the click-activated infowindow is active
        if(test) {
          return;
          } else {
            infowindowOver.open(map, marker);
          }
        
      });

      marker.addListener('mouseout', function() {
        infowindowOver.close(map, marker);
      });
      markers.push(marker);
    } else {
      alert ('Geocode was unsuccessful for ' + address + ' for the following reason: ' + status);
    }
  });
};
// places panorama and FourSquare contentinto infowindow.
// Adapted from Udacity Google APIs course
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.setContent('');
        infowindow.marker = marker;
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;
        });
    var streetSvc = new google.maps.StreetViewService();
    var radius = 50;

    var getStreetView = function(data, status) {
      if(status == google.maps.StreetViewStatus.OK) {
        var nearLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearLocation, marker.position);
        infowindow.setContent('<h1>' + marker.name + '</h1><div id="pano"></div><h2>' + 
          marker.address + '</h2>');
        var panoramaOptions = {
          position: nearLocation,
          pov: {
            heading: heading,
            pitch: 10
              }
          };
          var panorama = new google.maps.StreetViewPanorama(
            document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.name + '</div><div>No Street View Found</div>');
      }
    };

    streetSvc.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
    fetchFourSqBusiness(marker);
  }
}

//
// FourSquare Functionality
//

var fourSqClientID = 'EZSBPUVTQ1AQJSGEU3K35EP0L1GQAPC2ETGGPK24FUAKV4LJ';
var fourSqClientSecret = 'XMIPDO0YWVMXHMRDA2YNJXZYEGMVY5RPN3C4Z12TICUL532O';
var fourSqV = '20180122';

// makes names URL-friendly
var replaceChars = function(name) {
  name = name.replace(/\s+/g, '-');
  name = name.replace(/\&/g, 'and');
  name = name.replace(/(\')|(\,)/g, '');
  name = name.toLowerCase();
  return name;
};

// creates URL used to retrieve venue ID
var makeFourSqSearchURL = function(marker) {
  var baseURL = 'https://api.foursquare.com/v2/venues/search?near=savannah&query=';
  var name = replaceChars(marker.name);
  return baseURL+name+'&client_id='+fourSqClientID+
    '&client_secret='+fourSqClientSecret+'&v='+fourSqV;
};

// consumes search URl, provides UI update for slow load
var searchFourSq = function(marker) {
  var settings = {
    'async': true,
    'url': makeFourSqSearchURL(marker),
    'method': 'GET',
    beforeSend: function() {
      $('.gm-style-iw').append('<h3 class="forSqSearch">Searching Foursquare...</h3>');
    },
    success: function(json) {
      marker.fourSqId = json.response.venues[0].id;
      $('.gm-style-iw > h3').remove();
      fetchFourSqContent(marker);
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(textStatus, errorThrown);
    }
  };
  $.ajax(settings).done(function (response) {
  });
};

// creates URL used to retrieve venue content
var makeFourSqDetailsURL = function(marker) {
  var baseUrl = 'https://api.foursquare.com/v2/venues/';
  return baseUrl+marker.fourSqId+'?&client_id='+fourSqClientID+
  '&client_secret='+fourSqClientSecret+'&v='+fourSqV;
};

// consumes content URL and populates infowindow under panorama
var fetchFourSqContent = function(marker) {
  var settings = {
    'async': true,
    'url': makeFourSqDetailsURL(marker),
    'method': 'GET',
    beforeSend: function() {
      $('.gm-style-iw').append('<h3 class="forSqSearch">Loading Foursquare Content...</h3>');
    },
    success: function(json) {
      var mobileUrl;
      var rating = json.response.venue.rating;
      rating = rating+'/10 with '+json.response.venue.ratingSignals+' ratings.';
      $('.gm-style-iw > h3').remove();
      $('.gm-style-iw').append('<div id="l-map__fourSq"></div>');
      $('#l-map__fourSq').append('<img id=fourSqImg src="/assets/fourSq.png">');
      $('#l-map__fourSq').append('<h2>'+rating+'</h2>');
      if(json.response.venue.hasMenu) {
        mobileUrl = json.response.venue.menu.mobileUrl;
        mobileUrl = '<h3><a href ="'+mobileUrl+'" target="_blank">Link to '+marker.name+'\'s menu</a></h3>';
      } else {
        mobileUrl = '<p>No menu found</p>';
      }
      $('#l-map__fourSq').append(mobileUrl);
      //grab some interesting stuffs
      //put them into the infowindow
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      alert(textStatus, errorThrown);
    }
  };
  $.ajax(settings).done(function(response) {
    
  });
};

//determines if venue ID is locally stored
var fetchFourSqBusiness = function(marker) {
  // only use FourSquare serch API if not been used yet
  if(!marker.fourSqId){
    searchFourSq(marker);
  } else {
    fetchFourSqContent(marker);
  }

};

//KO extenders used to show/hide markers on map based on POI filter
ko.extenders.dinnerItemsToShow = function(target, option) {
  target.subscribe(function(newValue) {
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].type === 'dining') {
        markers[i].setVisible(newValue);
      }
    }
  });
  return target;
};
ko.extenders.cafeItemsToShow = function(target, option) {
  target.subscribe(function(newValue) {
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].type === 'café') {
        markers[i].setVisible(newValue);
      }
    }
  });
  return target;
};
ko.extenders.dessertItemsToShow = function(target, option) {
  target.subscribe(function(newValue) {
    for(var i = 0; i < markers.length; i++) {
      if(markers[i].type === 'dessert') {
        markers[i].setVisible(newValue);
      }
    }
  });
  return target;
};

var ViewModel = function() {
  // ko bindings applied inside initMap()
  // so google exists for loadPoints

  var self = this;

  //observable array containing all POI
  self.staticPoints = ko.observableArray([
    {name: 'Cotton & Rye', address: '1801 Habersham St', type: 'dining'},
    {name: "Tequila's Town Mexican", address: '109 Whitaker Street', type: 'dining'},
    {name: 'Flying Monk Noodle Bar', address: '5 W Broughton St', type: 'dining'},
    //café
    {name: 'Foxy Loxy Cafe', address: '1919 Bull St', type: 'café'},
    {name: 'Foundery Coffee Pub', address: '1313 Habersham St', type: 'café'},
    {name: 'The Coffee Fox', address: '102 W Broughton St', type: 'café'},
    //dessert
    {name: "Leopold's Ice Cream", address: '212 E Broughton St', type: 'dessert'},
    {name: "Lulu's Chocolate Bar", address: '42 Martin Luther King Jr Blvd', type: 'dessert'},
    {name: 'River Street Sweets', address: '13 E River St', type: 'dessert'}
  ]);

  // uses geoFetch to load points on map
  var loadPoints = function() {
    for(var i = 0; i < self.staticPoints().length; i++){
      geoFetch(self.staticPoints()[i]);
    }
  };
  window.onload = loadPoints();

  // filter toggles used to show/hide categories of POI on sidebar
  self.showDining = ko.observable(true).extend({dinnerItemsToShow: "point"});
  self.toggleDiningFilter = function() {
    self.showDining(!self.showDining());
  };
  self.showCafe = ko.observable(true).extend({cafeItemsToShow: "point"});
  self.toggleCafeFilter = function() {
    self.showCafe(!self.showCafe());
  };
  self.showDessert = ko.observable(true).extend({dessertItemsToShow: "point"});
  self.toggleDessertFilter = function() {
    self.showDessert(!self.showDessert());
  };

  //sidebar toggle for med, small screens
  self.isSidebarActive = ko.observable(true);
  self.toggleSidebarActive = function() {
    self.isSidebarActive(!self.isSidebarActive());
  };

  // determines which POI show on sidebar
  self.listItemsToShow = ko.computed(function() {
    return ko.utils.arrayFilter(self.staticPoints(), function(point) {
      if(self.showDining()){
        if(point.type === 'dining'){
          return point;
        }
      }if(self.showCafe()){
        if(point.type === 'café'){
          return point;
        }
      }if(self.showDessert()){
        if(point.type === 'dessert'){
          return point;
        }
      }
    });
  });

};
