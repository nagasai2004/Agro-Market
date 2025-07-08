<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "student_data"; // Change this to your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch company vacancies
$sql = "SELECT company_name, roles, packages, eligibility_criteria, pre_requirements FROM company";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
                <td>" . $row['company_name'] . "</td>
                <td>" . $row['roles'] . "</td>
                <td>" . $row['packages'] . "</td>
                <td>" . $row['eligibility_criteria'] . "</td>
                <td>" . $row['pre_requirements'] . "</td>
              </tr>";
    }
} else {
    echo "<tr><td colspan='5'>No vacancies available</td></tr>";
}

$conn->close();
?>