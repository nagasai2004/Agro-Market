<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vacancies Page</title>
    <link rel="stylesheet" href="vacancies.css">
</head>
<body>
    <div class="container">
        <h1>Available Vacancies</h1>
        <table id="vacancies_table">
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Role</th>
                    <th>Package</th>
                    <th>Eligibility Criteria</th>
                    <th>Pre-requirements</th>
                </tr>
            </thead>
            <tbody>
                <?php include 'fetchvacancies.php'; ?>
            </tbody>
        </table>

        <a href="quiz.php" class="quiz-button">Take a Quiz</a>
    </div>
</body>
</html>