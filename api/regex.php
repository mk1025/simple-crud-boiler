<?php

/*
    REGULAR EXPRESSIONS
    - This part below is to define Regular Expressions.
    - They are used to check if the data or input is valid or not.

*/

// Regular Expression for validating Email Input
define("REGEX_EMAIL", "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/");

/*
    Regular Expression for validating Username Input

    Explanation of the Regular Expression below:
    - First character must not be a number
    - Minimum length of 7 characters
    - Maximum length of 20 characters
    - Only letters, numbers and underscores are allowed
*/
define("REGEX_USERNAME", '/^(?=[a-zA-Z_])[a-zA-Z0-9_]{7,20}$/');

/*
    Regular Expression for validating Password Input

    Explanation of the Regular Expression below:
    - Minimum length of 8 characters
    - Maximum length of 64 characters
    - Only letters, numbers and special characters are allowed
    - Must contain at least one number
    - Must contain at least one special character
    - Must contain at least one uppercase letter
    - Must contain at least one lowercase letter
*/
define("REGEX_PASSWORD", "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/"); // Minimum 8 characters, Maximum 64 characters for Password