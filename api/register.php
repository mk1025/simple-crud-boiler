<?php

include_once 'config.php';

if (isset($_POST['register'])) {

    $receivedData = json_decode($_POST['register']);


    if (validateData($receivedData)) {
        createNewUser($receivedData);
    }

    exit();
}

function createNewUser($data)
{
    // Obtain the global database connection object
    global $connection;

    // Convert the email, username to lowercase and the password will be hashed
    $convertedData = array(
        "email" => strtolower($data->email),
        "username" => strtolower($data->username),
        "password" => password_hash($data->password, PASSWORD_DEFAULT),
    );

    // Check if the email already exists in the database
    if (checkEmailExist($convertedData['email'])) {
        // If the email exists, return an error response and exit the function
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Email already exists", "");
        $connection->close();
        exit();
    }

    // Check if the username already exists in the database
    if (checkUsernameExist($convertedData['username'])) {
        // If the username exists, return an error response and exit the function
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Username already exists", "");
        $connection->close();
        exit();
    }

    // Prepare the SQL query to insert a new user into the users table
    $query = "INSERT INTO " . TBL_USERS . " (
        email,
        username,
        password,
        created_at
    )
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)";

    // Prepare the query statement
    $queryStatement = $connection->prepare($query);

    // Bind the parameters to the query statement
    $queryStatement->bind_param("sss", $convertedData['email'], $convertedData['username'], $convertedData['password']);

    // Execute the query statement
    $queryStatement->execute();

    // Check if the query statement affected any rows (i.e., if the query was successful)
    if ($queryStatement->affected_rows > 0) {
        // If the query was successful, return a success response
        http_response_code(201);
        echo createResponse(201, "Registration Successful", "You may proceed to the Login Page to Sign In", "");
    } else {
        // If the query failed, return an error response
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Something went wrong", "");
    }

    // Close the database connection
    $connection->close();

    // Exit the function
    exit();
}


/**
 * Checks if the given email exists in the users table.
 *
 * @param string $email The email to check
 * @return bool True if the email exists, false otherwise
 */
function checkEmailExist($email)
{
    global $connection; // Access the global connection object

    // Construct the query to check if the email exists
    $query = "SELECT 1 FROM " . TBL_USERS . " WHERE email = ?";

    // Prepare the query statement
    $queryStatement = $connection->prepare($query);

    // Bind the email parameter to the query statement
    $queryStatement->bind_param("s", $email);

    // Execute the query
    $queryStatement->execute();

    // Get the result of the query
    $result = $queryStatement->get_result();

    // Close the query statement
    $queryStatement->close();

    // Check if any rows were returned
    if ($result->num_rows > 0) {
        return true; // The email exists
    }

    return false; // The email does not exist
}

/**
 * This function checks if a username exists in the database.
 *
 * @param string $username The username to check.
 * @return bool True if the username exists, false otherwise.
 */
function checkUsernameExist($username)
{
    global $connection;

    // Prepare the SQL query to check if the username exists
    $query = "SELECT 1 FROM " . TBL_USERS . " WHERE username = ?";
    $queryStatement = $connection->prepare($query);

    // Bind the username parameter to the query
    $queryStatement->bind_param("s", $username);

    // Execute the query
    $queryStatement->execute();

    // Get the result of the query
    $result = $queryStatement->get_result();

    // Close the query statement
    $queryStatement->close();

    // Check if the result has any rows
    if ($result->num_rows > 0) {
        return true;
    }

    // The username does not exist
    return false;
}

function validateData($data)
{
    // Initialize validation flag
    $validation = true;

    // Check if required data is missing
    if (empty($data) || empty($data->email) || empty($data->username) || empty($data->password)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "There is missing data", "");
        return false;
    }

    // Validate email format
    if (!filter_var($data->email, FILTER_VALIDATE_EMAIL) || !preg_match(REGEX_EMAIL, $data->email)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Email is not valid", "");
        $validation = false;
    }

    // Validate username format
    if (!preg_match(REGEX_USERNAME, $data->username)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Username is not valid", "");
        $validation = false;
    }

    // Validate password format
    if (!preg_match(REGEX_PASSWORD, $data->password)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Password is not valid", "");
        $validation = false;
    }

    // Validate confirm password format
    if (!preg_match(REGEX_PASSWORD, $data->confirm_password)) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Confirm Password is not valid", "");
        $validation = false;
    }

    // Check if password and confirm password match
    if ($data->password !== $data->confirm_password) {
        http_response_code(400);
        echo createResponse(400, "Registration Failed", "Passwords do not match", "");
        $validation = false;
    }

    // Return validation result
    return $validation;
}