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
$app->get('/profile_activities/:id', 'getProfileActivities'); //get activity ID's for profile page
$app->get('/profile_following/:id' ,'getProfileFollowing'); //get ID's of those the user is following
$app->get('/find_friend/:myId/:visitingId', 'findFriend'); //check if I am following the profile I am visiting
$app->get('/activity', 'getActivities'); 
$app->get('/activity/:id', 'getFriendActivities'); //pass member ID to get friends activities
$app->post('/favorites', 'saveFavorite'); //save activity ID to member's profile
$app->get('/favorites/:id', 'getFavorites'); //query a user's favorite items
$app->post('/post_activity', 'postActivity');
$app->get('/search_tag/:tag', 'searchTag');
$app->get('/search_results/:array/:text', 'getSearchedActivities');

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
	$sql = "select *, (select count(*) from favorite inner join activity on favorite.id_activity = activity.id_activity where activity.id_member = $id) as fav_count, (select count(*) from friendship where id_member_friend = $id) as followers from member where id_member = $id";
	$result = $mysqli->query($sql);
	$member = $result->fetch_object();
	echo json_encode($member);
	$result->close();
	$mysqli->close();
}

function getProfileActivities($id) {
	$sql = "select id_activity, title from activity where id_member = $id";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$activities[] = $row;
	}
	echo json_encode($activities);
	$result->close();
	$mysqli->close();
}

function getProfileFollowing($id) {
	$sql = "select id_member_friend from friendship where id_member = $id";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$following[] = $row;
	}
	echo json_encode($following);
	$result->close();
	$mysqli->close();
}

function findFriend($my_id, $visiting_id) {
	$sql = "select * from friendship where id_member = $my_id and $id_member_friend = $visiting_id";
	$mysqli = getConnection();
	if($result = $mysqli->query($sql)) {
		echo 'true';
	}
	$result->close();
	$mysqli->close();
}

function getActivities() {
	$sql = "SELECT * FROM activity ORDER BY RAND() LIMIT 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$activities[] = $row;
	}
	$result->close();

	$i=0;
	foreach($activities as $activity) {
		$id_activity = $activity["id_activity"];
		$sql = "select tag_text from tag inner join goodfor on tag.id_tag = goodfor.id_tag where goodfor.id_activity = $id_activity";
		$result = $mysqli->query($sql);
		$goodfor = '';
		while($row = $result->fetch_assoc()) {
			$goodfor = $row["tag_text"] . ", " . $goodfor;
		}
		$goodfor = substr($goodfor, 0, strlen($goodfor)-2);
		$activities[$i]["goodfor"] = $goodfor;
		$i++;
	}
	echo json_encode($activities);
	$result->close();
	$mysqli->close();
}

function getFriendActivities($id) {
	$sql = "select activity.* from activity inner join friendship on activity.id_member = friendship.id_member_friend where friendship.id_member = $id order by activity.timestamp desc limit 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$activities[] = $row;
	}
	
	$i=0;
	foreach($activities as $activity) {
		$id_activity = $activity["id_activity"];
		$sql = "select tag_text from tag inner join goodfor on tag.id_tag = goodfor.id_tag where goodfor.id_activity = $id_activity";
		$result = $mysqli->query($sql);
		$goodfor = '';
		while($row = $result->fetch_assoc()) {
			$goodfor = $row["tag_text"] . ", " . $goodfor;
		}
		$goodfor = substr($goodfor, 0, strlen($goodfor)-2);
		$activities[$i]["goodfor"] = $goodfor;
		$i++;
	}
	echo json_encode($activities);
	$result->close();
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

function getFavorites($id) {
	$sql = "select activity.* from activity inner join favorite on favorite.id_activity = activity.id_activity where favorite.id_member = $id order by favorite.timestamp limit 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$rows[] = $row;
	}
	echo json_encode($rows);
	$mysqli->close();
}

function postActivity() {
	$mysqli = getConnection();
	$id_member = $_POST["id_member"];
	$title = $_POST["title"];
	$description = $_POST["description"];
	$goodfor = $_POST["goodfor"];

	//parse tags and insert each into tag table if they don't exist
	$goodfor_array = explode(',', $goodfor);
	foreach ($goodfor_array as $tag) {
		$tag = str_replace(' ','',$tag);
		$sql = "select * from tag where tag_text = '$tag'";
		$result = $mysqli->query($sql);		
		if ($result->num_rows == 0) {		
			$sql = "insert into `tag` (`tag_text`) values ('$tag')";
			$mysqli->query($sql);
			$id_tag[] = $mysqli->insert_id;
		}
		else {
			$queried_result = $result->fetch_assoc();
			$id_tag[] = $queried_result["id_tag"];
		}
		$result->close();
	}

	// Insert activity into DB and save picture in img/activity folder
	$sql = "insert into `activity` (`id_member`, `title`, `description`) values ($id_member, '$title', '$description')";
	$mysqli->query($sql);
	$id_activity = $mysqli->insert_id;

	$temp = explode(".", $_FILES["photo"]["name"]);
	$ext = end($temp);

	$upload_path = "../img/activity/";
	$tmp_file = $_FILES["photo"]["tmp_name"];
	$new_file = $id_activity . "." . $ext;
	move_uploaded_file($tmp_file, $upload_path . $new_file);

	//Use id_tag array to and id_activity to insert tags into goodfor table
	foreach($id_tag as $tag) {
		$sql = "insert into `goodfor` (`id_tag`, `id_activity`) values ($tag, $id_activity)";
		$mysqli->query($sql);
	}
}

function searchTag($tag) {
	$sql = "select id_tag, tag_text from tag where tag_text like '$tag" . "%' limit 20";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$rows[] = $row;
	}
	echo json_encode($rows);
	$mysqli->close();

}

function getSearchedActivities($array) {
	$tags_arr = str_getcsv($array, ',');
	$sql_part = '';
	$i = 1; $arr_length = count($tags_arr);
	foreach ($tags_arr as $tag) {
		$sql_part .= 'id_tag = ' . $tag;
			if ($i < $arr_length) $sql_part .= ' or ';	
		$i++;
	}
	
	$sql = "select * from activity where id_activity in (select id_activity from goodfor where $sql_part) limit 16";
	$mysqli = getConnection();
	$result = $mysqli->query($sql);
	while($row = $result->fetch_assoc()) {
		$activities[] = $row;
	}
	$result->close();

	$i = 0;
	foreach($activities as $activity) {
		$id_activity = $activity["id_activity"];
		$sql = "select tag_text from tag inner join goodfor on tag.id_tag = goodfor.id_tag where goodfor.id_activity = $id_activity";
		$result = $mysqli->query($sql);
		$goodfor = '';
		while($row = $result->fetch_assoc()) {
			$goodfor = $row["tag_text"] . ", " . $goodfor;
		}
		$goodfor = substr($goodfor, 0, strlen($goodfor)-2);
		$activities[$i]["goodfor"] = $goodfor;
		$i++;
	}
	echo json_encode($activities);
	$result->close();

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
