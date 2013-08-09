'use strict';

/* Controllers */

function MainCtrl($scope) {

}

function LoginCtrl($scope, $location, MemberDatabase, $cookies, $rootScope) {
  
  $scope.signUpClick = function() {
    $location.path('/signup');
  }

  $scope.memberLogin = function() {
    $scope.member = MemberDatabase.get({username:$scope.member.username, password:$scope.member.password},
      function(data){
        if (data.user) {
          $cookies.user = $scope.member.user;
          $cookies.firstname = $scope.member.firstname;
          $cookies.lastname = $scope.member.lastname;
          $cookies.id_member = data.id_member;
          $rootScope.$broadcast('loggedin', $cookies.user);
          $location.path('/friends');
        }
        else {
          $scope.member.loginErr = 'Incorrect Username/Password';
        } 
      });
  }
}

function SignupCtrl($scope, $location, MemberDatabase, $cookies, $rootScope) {
  $scope.signUp = function() {
    MemberDatabase.get({username:$scope.member.username},
       function(data){
         if (data.user) {
            $scope.member.signupErr = 'Username already exists';
         }
         else {
          //create a new member
          var pobject = new MemberDatabase(); 
          pobject.username = $scope.member.username; 
          pobject.password = $scope.member.password; 
          pobject.firstname = $scope.member.firstname;
          pobject.lastname = $scope.member.lastname;
          pobject.email = $scope.member.email; 
          pobject.$save( {}, function(data, headers) {
            alert(JSON.stringify(data));
          //  $cookies.id_member = data["0"]+data["1"];
          });
            $cookies.user = $scope.member.username;
            $cookies.firstname = $scope.member.firstname;
            $cookies.lastname = $scope.member.lastname;
            $rootScope.$broadcast('loggedin', $cookies.user);
            $location.path('/friends');             
         }
     });
  }
}

function FriendsCtrl($scope, $cookies, ActivityDatabase, $location, FavoritesDatabase) {
  $scope.activities = ActivityDatabase.query({id:$cookies.id_member});
  $scope.isCollapsed = true;

   $scope.favoriteItem = function(id) {
    //check and see if it exists, if not insert it
     var saveObject = new FavoritesDatabase(); 
        saveObject.id_activity = id; 
        saveObject.user =  $cookies.user; 
        saveObject.$save(); 
        
        var button_id = 'star_' + id;
        var img = document.getElementById(button_id);
        img.setAttribute("src", "img/icons/star_yellow.png");
  }

    $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }
}

function CityCtrl($scope, $cookies, $location, $http, ActivityDatabase, FavoritesDatabase, SearchTag) {

 $scope.activities = ActivityDatabase.query();
 $scope.isCollapsed = true;
 $scope.scroll = 0;

 $scope.showSearch = function() {
    var search_div = $('.smorg-search');
    if (search_div.css("visibility") === "hidden") {
      search_div.css("visibility","visible");
  }
  else {
    search_div.css("visibility","hidden");
  }
}

$scope.tags = [];

$scope.select2Options = {
  minimumInputLength: 1,
  maximumSelectionSize: 3,
  query: function(query) {
    var data = {results: []};
    $http.get('http://smorgasbored.com/api/index.php/search_tag/' + query.term).success(function(info) {
      angular.forEach(info, function(value, key) {
        data.results.push({id: value["id_tag"], text: value["tag_text"]});
      });
    query.callback(data); 
    });
  }  
}

$scope.submitSearch = function(tags) {
  var search_tags = [];
  var tag_text = [];
  angular.forEach(tags, function(value, key) {
    search_tags.push(value["id"]);
    tag_text.push(value["text"]);
  });
  $location.path('/search_results/' + search_tags + '/' + tag_text);
}

  $scope.favoriteItem = function(id) {
    
//check and see if it exists, if not insert it
     var saveObject = new FavoritesDatabase(); 
        saveObject.id_activity = id; 
        saveObject.user =  $cookies.user; 
        saveObject.$save(); 
        
        var button_id = 'star_' + id;
        var img = document.getElementById(button_id);
        img.setAttribute("src", "img/icons/star_yellow.png");
  }

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }
}

function ProfileCtrl($scope, $cookies, $routeParams, FavoritesDatabase, $location, ProfileDatabase, ProfileDatabaseActivity, ProfileDatabaseFollowing, FindFriend) {
  var profile_id = $routeParams.id;
  $scope.memberdata = ProfileDatabase.get({id: profile_id});
  /*$scope.activities = [
    {"id_activity": "3", "title":"Title"},
    {"id_activity": "1", "title":"Title2"},
    {"id_activity": "2", "title":"Title3"},
    {"id_activity": "4", "title":"Title4"},
    {"id_activity": "7", "title":"Title5"},
    {"id_activity": "6", "title":"Title6"}
  ]; */
  
  $scope.activities = ProfileDatabaseActivity.query({id: profile_id});
  $scope.following = ProfileDatabaseFollowing.query({id: profile_id});
  /*$scope.following = [
    {"id_member_friend": "27"},
    {"id_member_friend": "28"},
    {"id_member_friend": "29"},
    {"id_member_friend": "30"},
    {"id_member_friend": "31"},
    {"id_member_friend": "32"}
  ]; */

  //determine whose profile this is for follow button
  $scope.whoami = [];
  if (profile_id = $cookies.id_member) {
    $scope.whoami = "myprofile";
  }
  else if (FindFriend.get({myId: $cookies.id_member, visitingId: profile_id}) {
    $scope.whoami = "following"
  }
  else {
    $scope.whoami = []; 
  }

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }

  $scope.followMember = function(id) {
    alert(id);
  }
  $scope.unfollowMember = function(id) {
    alert(id);
  }
}

function HomeCtrl($scope, $cookies, $routeParams, FavoritesDatabase) {
  $scope.favorites = FavoritesDatabase.query({id: $cookies.id_member}); 
  $scope.oneAtATime = true;
  $scope.isCollapsed = true;
  $scope.groups = [
  {"title":"RECEIVED"},
  {"title":"STARRED"},
  {"title":"ADD CATEGORY"},
  {"title":"SENT"},
  {"title":"EDIT"}];

}

function LogoutCtrl($scope) {

}

function SearchResCtrl($scope, $routeParams, $cookies, $location, SearchResults, FavoritesDatabase) {
  var tags = $routeParams.tag_text;
  $scope.activities = SearchResults.query({array: $routeParams.search_tags, text:tags});
  $scope.isCollapsed = true;
  $scope.tags = tags.replace(',', ', ');

  $scope.favoriteItem = function(id) {
      
    var saveObject = new FavoritesDatabase(); 
    saveObject.id_activity = id; 
    saveObject.user =  $cookies.user; 
    saveObject.$save(); 
    
    var button_id = 'star_' + id;
    var img = document.getElementById(button_id);
    img.setAttribute("src", "img/icons/star_yellow.png");
  }

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
  }

}

function UploadCtrl($scope, $cookies, SearchTag) {
    $scope.id_member = $cookies.id_member;

    /* From ngUpload directive */
   $scope.uploadComplete = function (content, completed) {
    if (completed && content.length > 0) {
      $scope.response = JSON.parse(content); // Presumed content is a json string!
      $scope.response.style = {
        color: $scope.response.color,
        "font-weight": "bold"
      };

      // Clear form (reason for using the 'ng-model' directive on the input elements)
      $scope.fullname = '';
      $scope.gender = '';
      $scope.color = '';
      // Look for way to clear the input[type=file] element
    }
  };

  $scope.searchTag = function() {
    if ($scope.tag) {
    $scope.tag_results = SearchTag.query({tag: $scope.tag});
    }
    else {
      $scope.tag_results = [];
    }
  }

}