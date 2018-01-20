// on ready jQuery wrapper
//$( document ).ready(function() {

  // model

  function loadScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAHFXxlZ9f8tSwrIPQlhRqpW_UzSlSYyDU&&libraries=places&callback=initMap';
    document.body.appendChild(script);
  }
  window.onload = function() {
    loadScript();
  };
  
  // called in ititMap so that google exists
  // before bindings applied.
  var applyBindings = function() {
    ko.applyBindings(new ViewModel());
  };

  var map;
  function initMap() {
    var originalMapCenter = new google.maps.LatLng(32.072, -81.093);
    map = new google.maps.Map(document.getElementById('map'), {
      center: originalMapCenter,
      zoom: 15
    });
    //var geocoder = new google.maps.Geocoder();
    map.addListener('click', function() {
      //nothing
    });
    // applies KO bindings after GoogleJSAPI
    applyBindings();
  }

  var markers = [];

  var geoFetch = function(point){
    console.log(point);
    var name = point.name;
    address = point.address + ' Savannah, GA';
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status){
      if (status === 'OK') {
        //I need a throttle if I add more points
        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location
        });
        var infowindowOver = new google.maps.InfoWindow({
          content: name
        });

        var infowindowClick = new google.maps.InfoWindow({
          content: '<p>'+ name +'</p><p>'+ address +'</p>'
        });
        marker.type = point.type;

        marker.addListener('click', function() {
          //map.setCenter(marker.getPosition());
          infowindowOver.close(map, marker);
          infowindowClick.open(map, marker);
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

    // Yelp reviews API calls    

  var ViewModel = function() {
    var self = this;

    //observable array per category of POI
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

    var loadPoints = function() {
      for(var i = 0; i < self.staticPoints().length; i++){
        geoFetch(self.staticPoints()[i]);
      }
    };

    window.onload = loadPoints();

    // filter toggles show/hide categories of POI
    self.showDining = ko.observable(true);
    self.toggleDiningFilter = function() {
      self.showDining(!self.showDining());
    };
    self.showCafe = ko.observable(true);
    self.toggleCafeFilter = function() {
      self.showCafe(!self.showCafe());
    };
    self.showDessert = ko.observable(true);
    self.toggleDessertFilter = function() {
      self.showDessert(!self.showDessert());
    };

    //sidebar toggle for med, small screens
    self.isSidebarActive = ko.observable(true);
    self.toggleSidebarActive = function() {
      self.isSidebarActive(!self.isSidebarActive());
    };

  
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
  
    // does nothing for now
    self.mapItemsToShow = function() {
      for(var i = 0; i < markers.length; i++) {
          if(self.staticPoints[i].type === 'dining'){
            if(self.showDining()){
              markers[i].setVisible(true);
            } else {
              markers[i].setVisible(false);
            }
          }
          if(self.staticPoints[i].type === 'café'){
            if(self.showCafe()){
              markers[i].setVisible(true);
            } else {
              markers[i].setVisible(false);
            }
          }
          if(self.staticPoints[i].type === 'dessert'){
            if(self.showDessert()){
              markers[i].setVisible(true);
            } else {
              markers[i].setVisible();
            }
          }
        }
      };

    // IIFE to place POI on map

    

  };
  

//});