var points = {
  'dining' : [
    {'name': 'Cotton & Rye', 'address': '1801 Habersham St, Savannah, GA 31401'},
    {'name': 'Sandfly BBQ', 'address': '8413 Ferguson Ave, Savannah, GA 31406'},
    {'name': 'Chromatic Dragon', 'address': '514 Martin Luther King Jr Blvd, Savannah, GA 31401'},
    {'name': "Tequila's Town Mexican", 'address': '109 Whitaker Street, Savannah, GA 31401'},
    {'name': 'The Olde Pink House', 'address': '23 Abercorn St, Savannah, GA 31401'},
    {'name': 'Flying Monk Noodle Bar', 'address': '5 W Broughton St, Savannah, GA 31401'},
  ],
  'café' : [
    {'name': 'Foxy Loxy Cafe', 'address': '1919 Bull St, Savannah, GA 31401'},
    {'name': 'Foundery Coffee Pub', 'address': '1313 Habersham St, Savannah, GA 31401'},
    {'name': 'Sentient Bean', 'address': '13 E Park Ave, Savannah, GA 31401'},
    {'name': 'Maté Factor', 'address': '401 E Hall St, Savannah, GA 31401'},
    {'name': 'The Coffee Fox', 'address': '102 W Broughton St, Savannah, GA 31401'},
  ],
  'dessert' : [
    {'name': "Leopold's Ice Cream", 'address': '212 E Broughton St, Savannah, GA 31401'},
    {'name': "Lulu's Chocolate Bar", 'address': '42 Martin Luther King Jr Blvd, Savannah, GA 31401'},
    {'name': 'River Street Sweets', 'address': '13 E River St, Savannah, GA 31401'},
  ]
};

function Model() {

  // Google geocoding

  // Google map API calls

  // Yelp reviews API calls

}

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


/*
 for each point I need to use:
var marker = new google.maps.Marker({
  position: myLatLng,
  map: map,
  title: 'Hello World!'
});

*/