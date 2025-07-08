<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_data";  // Change this to your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if form is submitted
if (isset($_POST['submit'])) {
    $company_name = $_POST['company_name'];
    $roles = $_POST['roles'];
    $packages = $_POST['packages'];
    $eligibility_criteria = $_POST['eligibility_criteria'];
    $pre_requirements = $_POST['pre_requirements'];

    // Insert data into the database
    $sql = "INSERT INTO company (company_name, roles, packages, eligibility_criteria, pre_requirements)
            VALUES ('$company_name', '$roles', '$packages', '$eligibility_criteria', '$pre_requirements')";

    if ($conn->query($sql) === TRUE) {
        echo "Company information stored successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

$conn->close();
?>