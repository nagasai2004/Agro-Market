<?php
error_reporting(E_ALL);
ini_set('display_errors',1);
        // MySQL Database connection
        $servername = "localhost";
        $username = "root"; // Change if you have a different user
        $password = ""; // Add your password if any
        $dbname = "student_data"; 

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);

        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        // Check if the form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['update'])) {
            $tenth_score = $_POST['tenth_score'];
            $inter_poly_score = $_POST['inter_poly_score'];
            $btech_percentage = $_POST['btech_percentage'];

            // Insert or Update the data in MySQL
            $sql = "INSERT INTO marks (tenth_score, inter_poly_score, btech_percentage) 
                    VALUES ('$tenth_score', '$inter_poly_score', '$btech_percentage')
                    ON DUPLICATE KEY UPDATE
                    tenth_score = '$tenth_score', inter_poly_score = '$inter_poly_score', btech_percentage = '$btech_percentage'";

            if ($conn->query($sql) === TRUE) {
                echo "<p style='color: green; text-align: center;'>Marks updated successfully!</p>";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }

        // Close the connection
        $conn->close();
    ?>