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

// Fetch student information
echo "<div class='data-section'>";
echo "<h2>Student Information</h2>";
$student_query = "SELECT * FROM info";
$student_result = $conn->query($student_query);

if ($student_result->num_rows > 0) {
    while ($row = $student_result->fetch_assoc()) {
        echo "First Name: " . $row['first_name'] . "<br>";
        echo "Last Name: " . $row['last_name'] . "<br>";
        echo "College Name: " . $row['college_name'] . "<br>";
        echo "Address: " . $row['student_address'] . "<br><br>";
    }
} else {
    echo "No student information found.<br><br>";
}
echo "</div>";

// Fetch marks data
echo "<div class='data-section'>";
echo "<h2>Marks</h2>";
$marks_query = "SELECT * FROM marks";
$marks_result = $conn->query($marks_query);

if ($marks_result->num_rows > 0) {
    while ($row = $marks_result->fetch_assoc()) {
        echo "10th Score: " . $row['tenth_score'] . "<br>";
        echo "Inter/Polytechnic Score: " . $row['inter_poly_score'] . "<br>";
        echo "B.Tech Percentage: " . $row['btech_percentage'] . "<br><br>";
    }
} else {
    echo "No marks data found.<br><br>";
}
echo "</div>";

// Fetch internships data
echo "<div class='data-section'>";
echo "<h2>Internships</h2>";
$internships_query = "SELECT * FROM internships";
$internships_result = $conn->query($internships_query);

if ($internships_result->num_rows > 0) {
    while ($row = $internships_result->fetch_assoc()) {
        echo "internship Type: " . $row['internship_type'] . "<br>";
        echo "Certificate: " . $row['certificate']['name'] . "<br><br>";
    }
} else {
    echo "No internships data found.<br><br>";
}
echo "</div>";

// Fetch projects data
echo "<div class='data-section'>";
echo "<h2>Projects</h2>";
$projects_query = "SELECT * FROM projects";
$projects_result = $conn->query($projects_query);

if ($projects_result->num_rows > 0) {
    while ($row = $projects_result->fetch_assoc()) {
        echo "Mini Project: " . $row['mini_project']['name'] . "<br>";
        echo "Major Project: " . $row['major_project']['name'] . "<br><br>";
    }
} else {
    echo "No projects data found.<br><br>";
}
echo "</div>";

// Fetch external courses data
echo "<div class='data-section'>";
echo "<h2>External Courses</h2>";
$courses_query = "SELECT * FROM courses";
$courses_result = $conn->query($courses_query);

if ($courses_result->num_rows > 0) {
    while ($row = $courses_result->fetch_assoc()) {
        echo "Course Name: " . $row['course_name'] . "<br>";
        echo "Certificate: " . $row['course_certificate'] . "<br><br>";
    }
} else {
    echo "No external courses data found.<br><br>";
}
echo "</div>";

// Fetch additional skills data
echo "<div class='data-section'>";
echo "<h2>Additional Skills</h2>";
$skills_query = "SELECT * FROM skills";
$skills_result = $conn->query($skills_query);

if ($skills_result->num_rows > 0) {
    while ($row = $skills_result->fetch_assoc()) {
        echo "Skill: " . $row['skill_name'] . "<br><br>";
    }
} else {
    echo "No additional skills data found.<br><br>";
}
echo "</div>";

// Fetch competitive programming data
echo "<div class='data-section'>";
echo "<h2>Competitive Programming</h2>";
$cp_query = "SELECT * FROM competitive_programming";
$cp_result = $conn->query($cp_query);

if ($cp_result->num_rows > 0) {
    while ($row = $cp_result->fetch_assoc()) {
        echo "Platform Name: " . $row['platform_name'] . "<br>";
        echo "Profile URL: " . $row['profile_url'] . "<br><br>";
    }
} else {
    echo "No competitive programming data found.<br><br>";
}
echo "</div>";

$conn->close();
?>