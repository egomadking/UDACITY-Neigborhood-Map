// model

var points = {
  'dining' : [
    {'name': 'Cotton & Rye', 'address': '1801 Habersham St'},
    {'name': 'Sandfly BBQ', 'address': '8413 Ferguson Ave'},
    {'name': 'Chromatic Dragon', 'address': '514 Martin Luther King Jr Blvd'},
    {'name': "Tequila's Town Mexican", 'address': '109 Whitaker Street'},
    {'name': 'The Olde Pink House', 'address': '23 Abercorn St'},
    {'name': 'Flying Monk Noodle Bar', 'address': '5 W Broughton St'},
  ],
  'café' : [
    {'name': 'Foxy Loxy Cafe', 'address': '1919 Bull St'},
    {'name': 'Foundery Coffee Pub', 'address': '1313 Habersham St'},
    {'name': 'Sentient Bean', 'address': '13 E Park Ave'},
    {'name': 'Maté Factor', 'address': '401 E Hall St'},
    {'name': 'The Coffee Fox', 'address': '102 W Broughton St'},
  ],
  'dessert' : [
    {'name': "Leopold's Ice Cream", 'address': '212 E Broughton St'},
    {'name': "Lulu's Chocolate Bar", 'address': '42 Martin Luther King Jr Blvd'},
    {'name': 'River Street Sweets', 'address': '13 E River St'},
  ]
};

  // Google geocoding
  // this is not working properly!!!
  function fetchGeo(address){
    address = address + ' Savannah, GA';
    var addrStr = address;
    var prefix = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    var key = '&key=AIzaSyAHFXxlZ9f8tSwrIPQlhRqpW_UzSlSYyDU';
    address = address.replace(/ /g, '+');
    url = prefix + address + key;
    var latLon =$.getJSON(url, function(json){
      //console.log(json.results[0].geometry.location);
      var loc = json.results[0].geometry.location;
      return loc;
      }).fail(function(jqxhr, textStatus, error) {
      alert("Request for " + addrStr + ' failed. Verify your network connection.');
      });
      return latLon;
  }

  /*
 for each point I need to use:
var marker = new google.maps.Marker({
  position: myLatLng,
  map: map,
  title: 'Hello World!'

*/

  // Google map API calls

  // Yelp reviews API calls

var Category = function(category) {
  var self = this;

};

var Point = function(point) {
  var self = this;
  this.addToMap = function(){

  };
};

var ViewModel = function() {
  var self = this;
  this.isSidebarActive = ko.observable(true);
  this.toggleSidebarActive = function() {
    this.isSidebarActive(!this.isSidebarActive());
  };
// populate sidebar
// call for initial Google Maps search of each point
};

ko.applyBindings(new ViewModel());


