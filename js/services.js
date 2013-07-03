'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('UserDatabase', function($resource) {
		var UserDatabase = $resource('api/index.php/login/:username/:password');
		return UserDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		var ActivityDatabase = $resource('api/index.php/activity');
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		var FavoritesDatabase = $resource('api/index.php/favorites/:username');
		return FavoritesDatabase
});
       