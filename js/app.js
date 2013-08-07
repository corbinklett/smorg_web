'use strict';


// Declare app level module which depends on filters, and services
//angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers']).
  
var smorg = angular.module('smorg', ['ui.bootstrap', 'services', 'ngCookies', 'directives', 'imageupload', 'ngUpload', 'ui.select2']);

smorg.config(['$routeProvider', function($routeProvider) {
$routeProvider.    
    when('/login', {templateUrl: 'partials/login.html', controller: LoginCtrl}).
    when('/signup', {templateUrl: 'partials/signup.html', controller: SignupCtrl}).
    when('/friends', {templateUrl: 'partials/friends.html', controller: FriendsCtrl}).
    when('/city', {templateUrl: 'partials/city.html', controller: CityCtrl}).
    when('/profile/:id', {templateUrl: 'partials/profile.html', controller: ProfileCtrl}).
    when('/home', {templateUrl: 'partials/home.html', controller: HomeCtrl}).    
    when('/logout', {templateUrl: 'partials/logout.html', controller: LogoutCtrl}).
    when('/search_results/:search_tags/:tag_text', {templateUrl: 'partials/search_results.html', controller:SearchResCtrl}).
    when('/upload', {templateUrl: 'partials/upload.html', controller: UploadCtrl}).
    otherwise({redirectTo: '/login'});
  }]);



