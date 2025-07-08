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
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $college_name = $_POST['college_name'];
    $student_address = $_POST['student_address'];

    // Insert data into the database
    $sql = "INSERT INTO info (first_name, last_name, college_name, student_address) 
            VALUES ('$first_name', '$last_name', '$college_name', '$student_address')";

    if ($conn->query($sql) === TRUE) {
        echo "Student information stored successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>