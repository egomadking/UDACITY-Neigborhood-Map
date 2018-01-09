
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

}

ko.applyBindings(new MapViewModel());


// protyping function for menu. Dump into KO as appropriate
$(function() {
  $('.c-header__hamburger').click(function(){
    $('.c-header__hamburger').toggleClass('c-header__hamburger--is-toggled');
    $('.l-sidebar').toggleClass('l-sidebar--is-toggled');
    $('.l-sidebar__search').toggleClass('l-sidebar__search--is-toggled');
    $('.l-sidebar__results').toggleClass('l-sidebar__results--is-toggled');
  });

});
