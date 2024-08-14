<?php
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $fullName = htmlspecialchars($_POST['full_name']);
    $email = htmlspecialchars($_POST['email']);
    $mobileNumber = htmlspecialchars($_POST['mobile_number']);
    $message = htmlspecialchars($_POST['message']);

    $to = "mennaelhosiny3@gmail.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    $body = "Full Name: $fullName\nEmail: $email\nMobile Number: $mobileNumber\n\nMessage:\n$message";
    $headers = "From: $email";

    if(mail($to, $subject, $body, $headers)){
        echo "Message sent successfully!";
    } else {
        echo "Failed to send the message.";
    }
}
?>
