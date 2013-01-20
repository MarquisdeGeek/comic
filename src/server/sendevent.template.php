<?php
require('../Pusher.php');

header('Access-Control-Allow-Origin: ???');

$key = "???";
$secret = "???";
$app_id = "???";

$data = $_GET['cmd'];

$pusher = new Pusher($key, $secret, $app_id);
$pusher->trigger('comic-channel', 'my_event', array('message' => "$data") );

?>