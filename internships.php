<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_data";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['submit'])) {
    $internship_type = $_POST['internship_type'];
    $certificate = $_FILES['certificate']['name'];
    $target_dir = "uploads/";
    $target_file = $target_dir . basename($certificate);
    $uploadOk = 1;
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    // Check if the file is a valid format
    if ($fileType != "pdf" && $fileType != "jpg" && $fileType != "png") {
        echo "Sorry, only PDF, JPG, & PNG files are allowed.";
        $uploadOk = 0;
    }

    // Check if upload was successful
    if ($uploadOk == 1 && move_uploaded_file($_FILES["certificate"]["tmp_name"], $target_file)) {
        $stmt = $conn->prepare("INSERT INTO internships (internship_type, certificate_path) VALUES (?, ?)");
        $stmt->bind_param("ss", $internship_type, $target_file);

        if ($stmt->execute()) {
            echo "Record stored successfully!";
        } else {
            echo "Error: " . $stmt->error;
        }

        $stmt->close();
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

$conn->close();
?>