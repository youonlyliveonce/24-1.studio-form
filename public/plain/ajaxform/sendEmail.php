<?php
if($_POST['author'] === "CADMAN"){
	// HONEYPOT
	if ( !isset($_POST['emailvalidation']) || !empty($_POST['emailvalidation']) ) {
		die( json_encode( array( 'error' => true, 'message' => 'no valid author' ) ) );
	}

	// SETTINGS
	// $mailTo = $_POST['emailTo'];
	// $mailBcc = $_POST['emailBcc'];
	// $mailFrom = $_POST['emailFrom'];
	// $subject = $_POST['subject'];

	$mailTo = 'interactive@cadman.de';
	$mailBcc = 'interactive@cadman.de';
	$mailFrom= 'no-reply@cadman.de';
	$subject= 'Web Kontakt Anfrage (vom Projekt name)';

	$charset = 'UTF-8'; // ISO-8859-1

	$_GOBAL = array();
	$_GOBAL['project'] = 'Dein Projekt';
	$_GOBAL['copyright'] = 'Dein Projekt &copy; ' . date('Y');

	$_GOBAL['colorci'] = '#898989';

	// TEMPLATE
	$post = array_merge($_POST, $_GOBAL);
	$mailmessage = file_get_contents('de.mail.contact.html.tpl');
	foreach( $post as $mail_key => $mail_value ) {
		$mailmessage = str_replace('%'.$mail_key.'%', $mail_value, $mailmessage);
	}
	// $message = nl2br($mailmessage);

	// HEADER
	$headers = "MIME-Version: 1.0" . "\r\n";
	$headers .= "Content-Type: text/html; charset=".$charset . "\r\n";
	$headers .= "From: " . $mailFrom . "\r\n";
	$headers .= "Reply-To: ". $mailTo . "\r\n";

	mail($mailTo, $subject, $message, $headers);
	//mail($mailTo, $subject, $message, "From: ".$mailFrom);
	//mail($mailBcc, $subject, $message, "From: ".$mailFrom);

	die( json_encode( array( 'success' => true, 'message' => $message ) ) );#

} else {

	die( json_encode( array( 'error' => true, 'message' => 'no valid author' ) ) );
}

?>
