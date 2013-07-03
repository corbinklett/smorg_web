'use strict';

/* Controllers */

function MainCtrl($scope) {

}

function LoginCtrl($scope, $location) {
  $scope.signUpClick = function() {
    $location.path('/signup');
  }
}

function SignupCtrl($scope) {
  $scope.signUp = function() {
    
  }
}

function FriendsCtrl($scope) {

}

function CityCtrl($scope) {

}

function MineCtrl($scope) {

}

function LogoutCtrl($scope) {

}
