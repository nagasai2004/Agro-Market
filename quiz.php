<?php
session_start();

// Redirect to login page if not logged in


// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Here, collect the user's answers and store them in the database
    $q1 = $_POST['question1'];
    $q2 = $_POST['question2'];
    $q3 = $_POST['question3'];
    
    // Database connection
    $conn = new mysqli('localhost', 'root', '', 'student_data');

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Insert data into the database
    $sql = "INSERT INTO quiz (question1, question2, question3) VALUES ('$q1', '$q2', '$q3')";

    if ($conn->query($sql) === TRUE) {
        $msg = "Quiz submitted successfully!";
    } else {
        $msg = "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz Page</title>
    <link rel="stylesheet" href="quiz.css">
</head>
<body>
    <div class="quiz-container">
        <h1>Take the Quiz</h1>
        <form action="quiz.php" method="POST">
            <div class="question">
                <p>1. What is the time complexity of binary search?</p>
                <input type="radio" id="q1a" name="question1" value="O(n)" required>
                <label for="q1a">O(n)</label><br>
                <input type="radio" id="q1b" name="question1" value="O(n^2)">
                <label for="q1b">O(n^2)</label><br>
                <input type="radio" id="q1c" name="question1" value="O(log n)">
                <label for="q1c">O(log n)</label><br>
                <input type="radio" id="q1d" name="question1" value="O(1)">
                <label for="q1d">O(1)</label>
            </div>

            <div class="question">
                <p>2.In which type of memory stack is implemented?</p>
                <input type="radio" id="q2a" name="question2" value="RAM" required>
                <label for="q2a">RAM</label><br>
                <input type="radio" id="q2b" name="question2" value="ROM">
                <label for="q2b">ROM</label><br>
                <input type="radio" id="q2c" name="question2" value="Hard disk">
                <label for="q2c">Hard disk</label><br>
                <input type="radio" id="q2d" name="question2" value="Cache memory">
                <label for="q2d">Cache Memory</label>
            </div>

            <div class="question">
                <p>3.If A=1,B=2,C=3.....,Z=26,what is the value of the word "QUIZ"?</p>
                <input type="radio" id="q3a" name="question3" value="68" required>
                <label for="q3a">68</label><br>
                <input type="radio" id="q3b" name="question3" value="79">
                <label for="q3b">79</label><br>
                <input type="radio" id="q3c" name="question3" value="84">
                <label for="q3c">84</label><br>
                <input type="radio" id="q3d" name="question3" value="90">
                <label for="q3d">90</label>
            </div>    

            <div class="buttons">
                <button type="submit">Submit</button>
                <a href="vacancies.php" class="back-button">Back</a>
            </div>
        </form>

        <?php if (isset($msg)): ?>
            <p class="message"><?php echo $msg; ?></p>
        <?php endif; ?>
    </div>
</body>
</html>