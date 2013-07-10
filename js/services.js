'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('MemberDatabase', function($resource) {
		var MemberDatabase = $resource('http://smorgasbored.com/api/index.php/login/:username/:password');
		return MemberDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		var ActivityDatabase = $resource('http://smorgasbored.com/api/index.php/activity');
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		var FavoritesDatabase = $resource('http://smorgasbored.com/api/index.php/favorites/:username');
		return FavoritesDatabase
});

