<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_data";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle form submission
if (isset($_POST['submit'])) {
    $platform_name = $_POST['platform_name'];
    $profile_url = $_POST['profile_url'];

    // Insert data into the database
    $sql = "INSERT INTO competitive_programming (platform_name, profile_url) 
            VALUES ('$platform_name', '$profile_url')";

    if ($conn->query($sql) === TRUE) {
        echo "Data stored successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>