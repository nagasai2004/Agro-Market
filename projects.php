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

// Handle file upload
if (isset($_POST['submit'])) {
    $mini_project = $_FILES['mini_project']['name'];
    $major_project = $_FILES['major_project']['name'];
    
    // Folder where files will be uploaded
    $target_dir = "uploads/";

    // Path for mini project
    $mini_project_target = $target_dir . basename($mini_project);

    // Path for major project
    $major_project_target = $target_dir . basename($major_project);

    // Upload files
    if (move_uploaded_file($_FILES['mini_project']['tmp_name'], $mini_project_target) &&
        move_uploaded_file($_FILES['major_project']['tmp_name'], $major_project_target)) {

        // Insert project details into the database
        $sql = "INSERT INTO projects (project_type, project_file)
                VALUES ('Mini Project', '$mini_project'), ('Major Project', '$major_project')";
        
        if ($conn->query($sql) === TRUE) {
            echo "Projects uploaded and stored successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Sorry, there was an error uploading your files.";
    }
}

$conn->close();
?>