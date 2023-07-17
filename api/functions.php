<?php

/*
    This is where you define universal functions for your API.
*/

function createResponse($status, $title, $message, $data = array())
{
    $response = array(
        "status" => $status,
        "title" => $title,
        "message" => $message,
        "data" => $data
    );

    return json_encode($response, JSON_PRETTY_PRINT); // Returns a JSON response
}