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
    $skill_name = $_POST['skill_name'];

    // Insert skill data into the database
    $sql = "INSERT INTO skills (skill_name) VALUES ('$skill_name')";

    if ($conn->query($sql) === TRUE) {
        echo "Skill added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>