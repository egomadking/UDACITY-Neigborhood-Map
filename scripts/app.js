
/*
Atlantic- a Neighborhood Eatery
Green Truck Neighborhood Pub
Cotton & Rye
Sandfly BBQ
Sandfly BBQ
The Vault Kitchen & Market
Chromatic Dragon
Tequila's Town Mexican
The Olde Pink House
Flying Monk Noodle Bar


Foxy Loxy Cafe
Foundery Coffee Pub
Sentient Bean
Maté Factor
The Coffee Fox
Starbucks


Leopold's Ice Cream
Lulu's Chocolate Bar
River Street Sweets
Back in the Day Bakery
*/



function Model() {

}

function ViewModel () {
  var self = this;
  this.isSidebarActive = ko.observable(false);
  this.toggleSidebarActive = function(data, event) {
    this.isSidebarActive(!this.isSidebarActive());
  };


}

ko.applyBindings(new ViewModel());