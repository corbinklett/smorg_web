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

function CityCtrl($scope, $cookies, $location, ActivityDatabase, FavoritesDatabase) {
 $scope.activities = ActivityDatabase.query();
 $scope.isCollapsed = true;
 $scope.scroll = 0;
/* $scope.$watch('scroll', function() {
  var navbar = $(".smorg-navbar");
  if ($scope.scroll > 50 && $scope.scroll < 90) {
    navbar.css({"top": 50 - $scope.scroll});
  }
});*/
 

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

function UploadCtrl($scope) {
  
}