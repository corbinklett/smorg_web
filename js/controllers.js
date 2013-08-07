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
  $(".chosen-select").chosen()
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
  angular.forEach(tags, function(value, key) {
    search_tags.push(value["id"]);
  });
  $location.path('/search_results/' + search_tags);
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

function ProfileCtrl($scope, stellar, $cookies, $routeParams, FavoritesDatabase, $location, ProfileDatabase) {
  $scope.memberdata = ProfileDatabase.get({id:$routeParams.id});
   stellar.against(window);

  $scope.goToProfile = function(id) {
    $location.path('/profile/' + id);
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

function SearchResCtrl($scope, $routeParams, $cookies) {
  var tags = $routeParams.search_tags.split(",");
  console.log(tags);
  angular.forEach(tags, function(value, key) {
    console.log(value);
  });
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