'use strict';

/* Services */

angular.module('services', ['ngResource']).
	factory('MemberDatabase', function($resource) {
		//var MemberDatabase = $resource('../api/index.php/login/:username/:password');
		var MemberDatabase = $resource('http://smorgasbored.com/api/index.php/login/:username/:password');
		return MemberDatabase;
}).
	factory('ActivityDatabase', function($resource) {
		//var ActivityDatabase = $resource('../api/index.php/activity/:id');
		var ActivityDatabase = $resource('http://smorgasbored.com/api/index.php/activity/:id'); //include id if you want to get friend feed
		return ActivityDatabase;
}).
	factory('FavoritesDatabase', function($resource) {
		//var FavoritesDatabase = $resource('../api/index.php/favorites/:id');
		var FavoritesDatabase = $resource('http://smorgasbored.com/api/index.php/favorites/:id');
		return FavoritesDatabase;
}).
	factory('ProfileDatabase', function($resource) {
		//var ProfileDatabase = $resource('../api/index.php/profile/:id')
		var ProfileDatabase = $resource('http://smorgasbored.com/api/index.php/profile/:id');
		return ProfileDatabase;
}).
	factory('SearchTag', function($resource) {
		//var SearchTag = $resource('../api/index.php/search_tag/:tag');
		var SearchTag = $resource('http://smorgasbored.com/api/index.php/search_tag/:tag');
		return SearchTag;
}).
	factory('SearchResults', function($resource) {
		//var SearchResults = $resource('../api/index.php/search_results/:array');
		var SearchResults = $resource('http://smorgasbored.com/api/index.php/search_results/:array');
		return SearchResults;		
});






