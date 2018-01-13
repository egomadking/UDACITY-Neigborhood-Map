// model

var staticPoints = ([
    //dining
    {name: 'Cotton & Rye', address: '1801 Habersham St', type: 'dining'},
    {name: 'Sandfly BBQ', address: '8413 Ferguson Ave', type: 'dining'},
    {name: 'Chromatic Dragon', address: '514 Martin Luther King Jr Blvd', type: 'dining'},
    {name: "Tequila's Town Mexican", address: '109 Whitaker Street', type: 'dining'},
    {name: 'The Olde Pink House', address: '23 Abercorn St', type: 'dining'},
    {name: 'Flying Monk Noodle Bar', address: '5 W Broughton St', type: 'dining'},
    //café
    {name: 'Foxy Loxy Cafe', address: '1919 Bull St', type: 'café'},
    {name: 'Foundery Coffee Pub', address: '1313 Habersham St', type: 'café'},
    {name: 'Sentient Bean', address: '13 E Park Ave', type: 'café'},
    {name: 'Maté Factor', address: '401 E Hall St', type: 'café'},
    {name: 'The Coffee Fox', address: '102 W Broughton St', type: 'café'},
    //dessert
    {name: "Leopold's Ice Cream", address: '212 E Broughton St', type: 'dessert'},
    {name: "Lulu's Chocolate Bar", address: '42 Martin Luther King Jr Blvd', type: 'dessert'},
    {name: 'River Street Sweets', address: '13 E River St', type: 'dessert'}
  ]
);

var markers = [];

function fetchGeo(address){
  address = address + ' Savannah, GA';
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function(results, status){
    if (status === 'OK') {
      // centers the map on pin
      //resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: results[0].geometry.location
      });
      markers.push(marker);
    } else {
      alert ('Geocode was unsuccessful for ' + address + ' for the following reason: ' + status);
    }
  });
}

  // Yelp reviews API calls

var Category = function(category) {
  var self = this;
  self.addPoint = function(){
    
  };
  self.isFilterActive = ko.observable(true);
  self.toggleFilter = function() {
    self.isFilterActive(!self.isFilterActive());
  };
  self.points = ko.observableArray();
  console.log(category[0]);
  console.log(self.isFilterActive());
};

var Point = function(point) {
  var self = this;
  self.addToMap = function(){
    fetchGeo(point);
    //add binding for map crap
  };
  self.isSelected = ko.observable(false);
  self.toggleSelected = function() {
    self.isSelected(!self.isSelected());
  };
};

var ViewModel = function(staticPoints) {
  var self = this;
  
  self.isSidebarActive = ko.observable(true);
  self.toggleSidebarActive = function() {
    self.isSidebarActive(!self.isSidebarActive());
  };

  var dining = new Category(staticPoints);
// populate sidebar
// call for initial Google Maps search of each point
};

ko.applyBindings(new ViewModel(staticPoints));


