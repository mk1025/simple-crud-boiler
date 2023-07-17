<?php

include_once "config.php";

session_start();

if (isset($_POST['login'])) {
    $receivedData = json_decode($_POST['login']);

    $convertedData = array(
        "emailORusername" => strtolower($receivedData->emailORusername),
        "password" => $receivedData->password
    );

    if (empty($convertedData['emailORusername']) || empty($convertedData['password'])) {
        http_response_code(400);
        echo createResponse(400, "Login Failed", "Email/Username or Password is empty", "");
        exit();
    }

    if (verifyPassword($convertedData['emailORusername'], $convertedData['password'])) {
        $_SESSION['token'] = $convertedData['emailORusername'];

        $hashedToken = array(
            "token" => hash("sha256", $convertedData['emailORusername']),
        );

        http_response_code(200);
        echo createResponse(200, "Login Successful", "You are logged in", $hashedToken);
        exit();
    }

    http_response_code(400);
    echo createResponse(400, "Login Failed", "Incorrect Password", "");
    exit();

}

if (isset($_POST['session'])) {

    $receivedData = json_decode($_POST['session']);

    if (!isset($_SESSION['token'])) {
        http_response_code(403);
        echo createResponse(403, "Token Expired", "You are not logged in", "");
        exit();
    }
    if (empty($receivedData)) {
        http_response_code(403);
        echo createResponse(403, "Token Empty", "You are not logged in", "");
        exit();
    }
    if (hash("sha256", $_SESSION['token']) !== $receivedData->token) {
        http_response_code(403);
        echo createResponse(403, "Token Invalid", "You are not logged in", "");
        exit();
    }

    http_response_code(200);
    echo createResponse(200, "Token Valid", "You are logged in", "");
    exit();
}


/**
 * Verifies a password by checking if it matches the password stored in the database for a given email or username.
 *
 * @param string $input The email or username to search for in the database.
 * @param string $password The password to verify.
 * @return bool Returns true if the password is verified, false otherwise.
 */
function verifyPassword($input, $password)
{
    global $connection;

    // Prepare the query to select the password from the users table using the provided email or username
    $query = "SELECT password FROM " . TBL_USERS . " WHERE email = ? OR username = ?";
    $queryStatement = $connection->prepare($query);

    // Bind the input parameter twice to account for the email and username placeholders in the query
    $queryStatement->bind_param("ss", $input, $input);

    // Execute the query
    $queryStatement->execute();

    // Get the result of the query
    $result = $queryStatement->get_result();

    // If there is a result and at least one row returned, verify the password
    if ($result && $result->num_rows > 0) {
        // Fetch the row as an associative array
        $row = $result->fetch_assoc();

        // Close the query statement
        $queryStatement->close();

        // Verify the password using password_verify() function and return the result
        return password_verify($password, $row['password']);
    }

    // Return false if no result or no rows returned
    return false;
}