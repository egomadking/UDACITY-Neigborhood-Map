// on ready jQuery wrapper
// $( document ).ready(function() {

  // model
  var markers = [];

  var geoFetch = function(address, name){
    address = address + ' Savannah, GA';
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

        marker.addListener('click', function() {
          map.setCenter(marker.getPosition());
          infowindowClick.open(map, marker);
        });

        marker.addListener('mouseover', function() {
          infowindowOver.open(map, marker);
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


  var addToMap = function(address, name) {
      geoFetch(address, name);
      //add binding for map crap
  };
    

  var ViewModel = function() {
    var self = this;
    self.staticDining = ko.observableArray([
      {name: 'Cotton & Rye', address: '1801 Habersham St', type: 'dining'},
      {name: "Tequila's Town Mexican", address: '109 Whitaker Street', type: 'dining'},
      {name: 'Flying Monk Noodle Bar', address: '5 W Broughton St', type: 'dining'}
    ] // {name: 'val', address: 'val', type: 'val'}
    );
    self.staticCafe = ko.observableArray([
      {name: 'Foxy Loxy Cafe', address: '1919 Bull St', type: 'café'},
      {name: 'Foundery Coffee Pub', address: '1313 Habersham St', type: 'café'},
      {name: 'The Coffee Fox', address: '102 W Broughton St', type: 'café'}
    ] // {name: 'val', address: 'val', type: 'val'}
    );
    self.staticDessert = ko.observableArray([
      {name: "Leopold's Ice Cream", address: '212 E Broughton St', type: 'dessert'},
      {name: "Lulu's Chocolate Bar", address: '42 Martin Luther King Jr Blvd', type: 'dessert'},
      {name: 'River Street Sweets', address: '13 E River St', type: 'dessert'}
    ] // {name: 'val', address: 'val', type: 'val'}
    );

    // style toggles
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
    self.isSidebarActive = ko.observable(true);
    self.toggleSidebarActive = function() {
      self.isSidebarActive(!self.isSidebarActive());
    };

    // IIFE to map points in observable arrays
    (function(){
      for(var i = 0; i < self.staticDining().length; i++) {
        addToMap(self.staticDining()[i].address, self.staticDining()[i].name);
      }
      for(var j = 0; j < self.staticCafe().length; j++) {
        addToMap(self.staticCafe()[j].address, self.staticCafe()[j].name);
      }
      for(var k = 0; k < self.staticDessert().length; k++) {
        addToMap(self.staticDessert()[k].address, self.staticDessert()[k].name);
      }
    }(this));
    };
    

  ko.applyBindings(new ViewModel());

// });
