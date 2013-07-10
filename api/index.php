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
$app->get('/profile/:id', 'getUserInfo'); //get user info for profile page
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
	echo json_encode($id_member); //echo the  previous inserted id 
}

function getUserInfo($id) { //get member info for profile page
	$mysqli = getConnection();
	$result = $mysqli->query("select * from member where id_member = $id");
	$member = $result->fetch_object();
	echo json_encode($member);
	$mysqli->close();
}

function getActivities() {
	$sql = "SELECT * FROM activity ORDER BY RAND() LIMIT 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$rows[] = $row;
	}
	echo json_encode($rows);
	$mysqli->close();
}

function saveFavorite() {
	$app = \Slim\Slim::getInstance();
	$request = $app->request();
	$activity = json_decode($request->getBody());
	$mysqli = getConnection();
	$sql_id = "select id_member from member where user = '$activity->user'";
	//check to see if this user already favorited this item	
	$result_id = $mysqli->query($sql_id);	
	while($row = $result_id->fetch_assoc()) {
		$id_member = $row['id_member'];
	}
	$result_id->close();
	$sql_check = "select id_activity from favorite where id_activity = $activity->id_activity and id_member = $id_member"; 
	if ($result_check = $mysqli->query($sql_check)) {	
		if ($result_check->num_rows == 0) {
			$sql = "INSERT INTO favorite (`id_member`, `id_activity`) VALUES ($id_member, $activity->id_activity)";	
			$result = $mysqli->query($sql);
		}
	}
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
	$db_username = 'root';
	$db_password = 'Jesusisking!12';
	$mysqli = new mysqli($db_hostname, $db_username, $db_password, $db_database);
	return $mysqli;
}

?>
