<?php

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$app->get('/login/:username/:password', 'getUser'); //for use with Login form
$app->get('/login/:username', 'checkUsername'); //for use with Signup form
$app->post('/login', 'addUser'); //for use with Signup form - add new user
$app->get('/activity', 'getActivities');
$app->post('/favorites', 'saveFavorite'); //save activity ID to member's profile
$app->get('/favorites/:username', 'getFavorites'); //query a user's favorite items

$app->run();


function getUser($user, $password) { //login by verifying user
	$salt1 = "$87#"; $salt2 = "3@!87";
	$pass = sha1($salt1 . $password . $salt2);
	$mysqli = getConnection();
	$result = $mysqli->query("SELECT * FROM members WHERE user = '$user' and pass = '$pass'");
	$member = $result->fetch_object();
	echo json_encode($member);
	$mysqli->close();

}

function checkUsername($user) { //check username when signing up new member
	$mysqli = getConnection();
	$result = $mysqli->query("SELECT * FROM members WHERE user = '$user'");
	$member = $result->fetch_object();
	echo json_encode($member);
	$mysqli->close();
}

function addUser() { //save new member to database
	$salt1 = "$87#"; $salt2 = "3@!87";
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$newmember = json_decode($request->getBody());
	$pass = sha1($salt1 . $newmember->password . $salt2);
	$mysqli = getConnection();
	$sql = "INSERT INTO `members` (`user`, `pass`, `email`, `fullname`) VALUES ('$newmember->username', '$pass', '$newmember->email', '$newmember->fullname')";
	$result = $mysqli->query($sql);  
}

function getActivities() {
	$sql = "SELECT * FROM entries ORDER BY RAND() LIMIT 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	$activities = $result->fetch_all(MYSQLI_ASSOC);
	echo json_encode($activities);
	$mysqli->close();
}

function saveFavorite() {
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$activity = json_decode($request->getBody());
	$mysqli = getConnection();
	$sql = "INSERT INTO `favorites` (`user`, `entry_id`) VALUES ('$activity->user', '$activity->id_entries')";
	$result = $mysqli->query($sql);
}

function getFavorites($user) {
	$sql = "SELECT entries.*, favorites.timestamp FROM entries INNER JOIN favorites ON id_entries = entry_id WHERE favorites.user = '$user' ORDER BY favorites.timestamp DESC LIMIT 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	$favorites = $result->fetch_all(MYSQLI_ASSOC);
	echo json_encode($favorites);
	$mysqli->close();
}

function getConnection() {
	$db_hostname = 'localhost';
	$db_database = 'smorgasbored_test';
	$db_username = 'root';
	$db_password = 'Jesusisking!12';
	$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
	return $mysqli;
}

?>