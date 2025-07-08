<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>History Page</title>
    <link rel="stylesheet" href="style13.css">
</head>
<body>
    <div class="container">
        <h1>Company Information History</h1>
        <table id="company_table">
            <thead>
                <tr>
                    <th>Company Name</th>
                    <th>Roles</th>
                    <th>Packages</th>
                    <th>Eligibility Criteria</th>
                    <th>Pre-requirements</th>
                </tr>
            </thead>
            <tbody>
                <?php include 'fetchcom.php'; ?>
            </tbody>
        </table>
        <a href="company.html" class="back-button">Back</a>
    </div>
</body>
</html>