<?php
// This code has been adapted from here: https://gist.github.com/lgladdy/5141615
// Code implements steps from here: https://developer.twitter.com/en/docs/basics/authentication/overview/application-only.html
// If you've never used PHP before, you should download something like XAMPP (https://www.apachefriends.org/index.html) as you'll need to start a web server to run the code. 

// This is all you need to configure.
$consumer_key = '';
$consumer_secret = '';

// These are our constants.
$api_base = 'https://api.twitter.com/';
// The key and secret need to be concatenated and encoded.
$bearer_token_creds = base64_encode($consumer_key.':'.$consumer_secret);

// Request the bearer token. Grant type is required, client_credentials is the only available option (for now).
$opts = array(
  'http'=>array(
    'method' => 'POST',
    'header' => 'Authorization: Basic '.$bearer_token_creds."\r\n".
               'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
    'content' => 'grant_type=client_credentials'
  )
);

// Check response for errors. 
$context = stream_context_create($opts);
$json = file_get_contents($api_base.'oauth2/token',false,$context);
$result = json_decode($json,true);
if (!is_array($result) || !isset($result['token_type']) || !isset($result['access_token'])) {
  die("Something went wrong. This isn't a valid array: ".$json);
}
if ($result['token_type'] !== "bearer") {
  die("Invalid token type. Twitter says we need to make sure this is a bearer.");
}

// Set our bearer token. Now issued, this won't ever* change unless it's invalidated by a call to /oauth2/invalidate_token.
// *probably - it's not documentated that it'll ever change.
$bearer_token = $result['access_token'];

// Prints token on the webpage. 
echo "Success, here's your bearer token: ", $bearer_token;
?>