<?php
if($_POST['author'] === "YOLO"){
	// HONEYPOT
	if ( !isset($_POST['emailvalidation']) || !empty($_POST['emailvalidation']) ) {
		die( json_encode( array( 'error' => true, 'message' => 'no valid author' ) ) );
	}

	// SETTINGS
	// $mailTo = $_POST['emailTo'];
	// $mailBcc = $_POST['emailBcc'];
	// $mailFrom = $_POST['emailFrom'];
	// $subject = $_POST['subject'];

	$mailTo = 'post@kremin.de';
	$mailFrom= 'no-reply@matteng.de';
	$subject= 'Web Anmeldung';

	$charset = 'UTF-8'; // ISO-8859-1

	// TEMPLATE
	$post = array_merge($_POST, $_GOBAL);
	$mailmessage = file_get_contents('de.mail.contact.tpl');
	foreach( $post as $mail_key => $mail_value ) {
		$mailmessage = str_replace('%'.$mail_key.'%', $mail_value, $mailmessage);
	}

	// HEADER
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-Type: text/html; charset=".$charset . "\r\n";
	$headers .= "From: " . $mailFrom . "\r\n";
	$headers .= "Reply-To: ". $mailTo . "\r\n";

	mail($mailTo, $subject, $message, $headers);

	die( json_encode( array( 'success' => true, 'message' => $message ) ) );#

} else {

	die( json_encode( array( 'error' => true, 'message' => 'no valid author' ) ) );
}

?>
