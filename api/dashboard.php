<?php

include_once "config.php";

session_start();

if (isset($_POST['getNotes'])) {
    $receivedData = json_decode($_POST['getNotes']);

    if (!isset($_SESSION['token'])) {
        http_response_code(403);
        echo createResponse(403, "Token Expired", "You are not logged in", "");
        session_destroy();
        exit();
    }

    if (hash("sha256", $_SESSION['token']) !== $receivedData->token) {
        http_response_code(403);
        echo createResponse(403, "Token Invalid", "You are not logged in", "");
        session_destroy();
        exit();
    }

    $query = "SELECT id FROM " . TBL_USERS . " WHERE email = ? OR username = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ss", $_SESSION['token'], $_SESSION['token']);
    $queryStatement->execute();
    $result = $queryStatement->get_result();
    $row = $result->fetch_assoc();
    $queryStatement->close();
    $user_id = $row['id'];


    $query = "SELECT id, title, content, updated_at FROM " . TBL_NOTES . " WHERE user_id = ? ORDER BY updated_at DESC";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("i", $user_id);
    $queryStatement->execute();
    $result = $queryStatement->get_result();
    $notes = $result->fetch_all(MYSQLI_ASSOC);
    $queryStatement->close();

    http_response_code(200);
    echo createResponse(200, "Notes Retrieved", "Notes Retrieved", $notes);
    exit();

}

if (isset($_POST['add'])) {
    $receivedData = json_decode($_POST['add']);

    $query = "SELECT id FROM " . TBL_USERS . " WHERE email = ? OR username = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ss", $_SESSION['token'], $_SESSION['token']);
    $queryStatement->execute();
    $result = $queryStatement->get_result();
    $row = $result->fetch_assoc();
    $queryStatement->close();
    $user_id = $row['id'];

    $query = "INSERT INTO " . TBL_NOTES . " (title, content, user_id, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("sss", $receivedData->title, $receivedData->content, $user_id);
    $queryStatement->execute();
    $queryStatement->close();

    if ($queryStatement) {
        http_response_code(200);
        echo createResponse(200, "Note Added", "Note Added", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Note Add Failed", "Note Add Failed", "");
        exit();
    }

}

if (isset($_POST['update'])) {
    $receivedData = json_decode($_POST['update']);

    $query = "SELECT id FROM " . TBL_USERS . " WHERE email = ? OR username = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ss", $_SESSION['token'], $_SESSION['token']);
    $queryStatement->execute();
    $result = $queryStatement->get_result();
    $row = $result->fetch_assoc();
    $queryStatement->close();
    $user_id = $row['id'];

    $query = "UPDATE " . TBL_NOTES . " SET title = ?, content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ssss", $receivedData->title, $receivedData->content, $receivedData->id, $user_id);
    $queryStatement->execute();
    $queryStatement->close();

    if ($queryStatement) {
        http_response_code(200);
        echo createResponse(200, "Note Updated", "Note Updated", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Note Update Failed", "Note Update Failed", "");
        exit();
    }
}

if (isset($_POST['delete'])) {
    $receivedData = json_decode($_POST['delete']);

    $query = "SELECT id FROM " . TBL_USERS . " WHERE email = ? OR username = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ss", $_SESSION['token'], $_SESSION['token']);
    $queryStatement->execute();
    $result = $queryStatement->get_result();
    $row = $result->fetch_assoc();
    $queryStatement->close();
    $user_id = $row['id'];

    $query = "DELETE FROM " . TBL_NOTES . " WHERE id = ? AND user_id = ?";
    $queryStatement = $connection->prepare($query);
    $queryStatement->bind_param("ss", $receivedData->id, $user_id);
    $queryStatement->execute();
    $queryStatement->close();

    if ($queryStatement) {
        http_response_code(200);
        echo createResponse(200, "Note Deleted", "Note Deleted", "");
        exit();
    } else {
        http_response_code(400);
        echo createResponse(400, "Note Deletion Failed", "Note Deletion Failed", "");
        exit();
    }

}

if (isset($_POST['logout'])) {

    $receivedData = json_decode($_POST['logout']);

    if (!isset($_SESSION['token'])) {
        http_response_code(403);
        echo createResponse(403, "Token Expired", "You are not logged in", "");
        session_destroy();
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
        session_destroy();
        exit();
    }

    http_response_code(200);
    echo createResponse(200, "Token Valid", "Your are now logged out", "");
    session_destroy();
    exit();
}