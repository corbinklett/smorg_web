<?php

require 'Slim/Slim.php';
\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();

$response = $app->response();
$response->header('Access-Control-Allow-Origin','*');
$response->header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
$response->header('Access-Control-Request-Method', 'OPTIONS'); 

$app->get('/login/:username/:password', 'getUser'); //for use with Login form
$app->get('/login/:username', 'checkUsername'); //for use with Signup form
$app->post('/login', 'addUser'); //for use with Signup form - add new user
$app->get('/activity', 'getActivities');
$app->post('/favorites', 'saveFavorite'); //save activity ID to member's profile
$app->get('/favorites/:username', 'getFavorites'); //query a user's favorite items

$app->run();


function getUser($user, $password) { //login by verifying user
	$salt1 = "$8!#"; $salt2 = "3@!27";
	$pass = $password;
	$pass = sha1($salt1 . $password . $salt2);
	$mysqli = getConnection();
	$result = $mysqli->query("SELECT * FROM member WHERE user = '$user' and pass = '$pass'");
	$member = $result->fetch_object();
	echo json_encode($member);
	$mysqli->close();

}

function checkUsername($user) { //check username when signing up new member
	$mysqli = getConnection();
	$result = $mysqli->query("SELECT * FROM member WHERE user = '$user'");
	$member = $result->fetch_object();
	echo json_encode($member);
	$mysqli->close();
}

function addUser() { //save new member to database
	$salt1 = "$8!#"; $salt2 = "3@!27";
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$member = json_decode($request->getBody());
	$pass = sha1($salt1 . $member->password . $salt2);
	$mysqli = getConnection();
	$sql = "INSERT INTO `member` (`user`, `pass`, `email`, `firstname`, `lastname`) VALUES ('$member->username', '$pass', '$member->email', '$member->firstname',  '$member->lastname')";
	$result = $mysqli->query($sql);	
	$id_member = $mysqli->insert_id;
//echo $id_member;	
echo json_encode($id_member); //echo the  previous inserted id 
}

function getActivities() {
	$sql = "SELECT * FROM activity ORDER BY RAND() LIMIT 16";
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
	$sql = "INSERT INTO favorite (`id_member`, `id_activity`) VALUES ((select id_member from member where user = '$activity->user'), '$activity->id_activity')";
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
	$db_database = 'smorg';
	$db_username = 'corbin';
	$db_password = 'corbin';
	$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
	return $mysqli;
}

?>

