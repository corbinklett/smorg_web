<!DOCTYPE html>
<html lang="en" ng-app="smorg">
<head>
	<meta charset="utf-8">
	<title>Smorg</title>
	<link rel="stylesheet" href="css/bootstrap.css" />
	<link rel="stylesheet" href="css/styles.css"/>
	<link rel="stylesheet" href="css/login_styles.css"/>
	<link rel="stylesheet" href="css/activity_styles.css"/>
  	<link href='http://fonts.googleapis.com/css?family=Lato:300' rel='stylesheet' type='text/css'>
  	<link href='http://fonts.googleapis.com/css?family=PT+Mono' rel='stylesheet' type='text/css'>
  	<link type="text/css" rel="stylesheet" href="css/font-awesome/css/font-awesome.css">
    <link type="text/css" rel="stylesheet" href="css/bootstrap-social-buttons.css">
</head>

<body ng-controller="MainCtrl">

	<div id="content" ng-view></div>

	<script src="lib/angular/angular.js"></script>
	<script src="lib/angular/angular-resource.js"></script>
	<script src="lib/angular/angular-cookies.js"></script>
	<script src="lib/angular/ui-bootstrap-tpls-0.4.0.js"></script>
	<script src="js/app.js"></script>
	<script src="js/services.js"></script>
	<script src="js/controllers.js"></script>

</body>
</html>