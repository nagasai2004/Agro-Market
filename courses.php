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
    $course_name = $_POST['course_name'];
    $course_certificate = $_FILES['course_certificate']['name'];

    // Folder where certificates will be uploaded
    $target_dir = "uploads/";

    // Path for the certificate
    $certificate_target = $target_dir . basename($course_certificate);

    // Upload the certificate file
    if (move_uploaded_file($_FILES['course_certificate']['tmp_name'], $certificate_target)) {

        // Insert course data into the database
        $sql = "INSERT INTO courses (course_name, course_certificate) 
                VALUES ('$course_name', '$course_certificate')";

        if ($conn->query($sql) === TRUE) {
            echo "Course details uploaded and stored successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Sorry, there was an error uploading your certificate.";
    }
}

$conn->close();
?>