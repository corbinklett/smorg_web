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

function FriendsCtrl($scope) {

}

function CityCtrl($scope) {
   $scope.activities = ActivityDatabase.query();
/*
  $scope.favoriteItem = function(id) {
      var saveObject = new FavoritesDatabase(); 
            saveObject.id_entries = id; 
            saveObject.user =  $cookies.user; 
            saveObject.$save();
  }
*/
    $scope.isCollapsed = true;
     $scope.itemClicked = function() {
    $scope.isCollapsed = !$scope.isCollapsed;
  }

}

function MineCtrl($scope) {

}

function LogoutCtrl($scope) {

}
