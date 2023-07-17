<?php

include_once "env.php"; // Import the database information from env.php

$connection = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME); // Connect to the database

include_once "models.php"; // Import the database table information from models.php
include_once "functions.php"; // Import functions from functions.php
include_once "regex.php"; // Import regular expressions from regex.php

if ($connection->connect_errno) {
    http_response_code(500); // 500 is for "Internal Server Error"
    echo createResponse(500, "Internal Server Error", "Could not connect to the database.", "");
    $connection->close(); // Closing the database
    exit(); // Closes or exit the php script/file before proceeding to the next line
}



/*
    This part below is to check if the table exists in the database.
    
    If it does not, it will create the table.

    This is useful to make sure no errors appear regarding
    about missing tables in your database.

    You can change the table columns in the SQL statements
    to your preference if you want.

*/
$query = "SHOW TABLES LIKE '" . TBL_USERS . "'";
$result = $connection->query($query);

if (!$result->num_rows > 0) {
    $createMissingTableQuery = "CREATE TABLE " . TBL_USERS . " (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";

    if (!$connection->query($createMissingTableQuery)) {
        http_response_code(500);
        echo createResponse(500, "Internal Server Error", "Could not create the table", "");
        $connection->close();
        exit();
    }
}

$query = "SHOW TABLES LIKE '" . TBL_NOTES . "'";
$result = $connection->query($query);

if (!$result->num_rows > 0) {
    $createMissingTableQuery = "CREATE TABLE " . TBL_NOTES . " (
        id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT(6) UNSIGNED NOT NULL,
        title VARCHAR(255),
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES " . TBL_USERS . " (id)
    )";

    if (!$connection->query($createMissingTableQuery)) {
        http_response_code(500);
        echo createResponse(500, "Internal Server Error", "Could not create the table", "");
        $connection->close();
        exit();
    }
}