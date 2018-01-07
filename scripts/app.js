$(function() {
  $('.c-header__hamburger').click(function(){
    $('.c-header__hamburger').toggleClass('c-header__hamburger--is-toggled');
    $('.l-sidebar').toggleClass('l-sidebar--is-toggled');
    $('.l-sidebar__search').toggleClass('l-sidebar__search--is-toggled');
    $('.l-sidebar__results').toggleClass('l-sidebar__results--is-toggled');
  });

});

