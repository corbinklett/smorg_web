'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('MemberDatabase', function($resource) {
		var MemberDatabase = $resource('http://smorgasbored.com/api/index.php/login/:username/:password');
		return MemberDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		var ActivityDatabase = $resource('http://smorgasbored.com/api/index.php/activity/:id'); //include id if you want to get friend feed
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		var FavoritesDatabase = $resource('http://smorgasbored.com/api/index.php/favorites/:id');
		return FavoritesDatabase;
}).
	factory('ProfileDatabase', function($resource) {
		var ProfileDatabase = $resource('http://smorgasbored.com/api/index.php/profile/:id');
		return ProfileDatabase;
}).
	factory('SearchTag', function($resource) {
		var SearchTag = $resource('http://smorgasbored.com/api/index.php/search_tag/:tag');
		return SearchTag;
	});


