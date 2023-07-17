"use strict"; // This is to enable strict mode in JavaScript

import * as Routes from "../../scripts/routes.js"; // Importing the variables from scripts/routes.js

const RegisterButton = document.getElementById("RegisterButton");

const emailInput = document.getElementById("email");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

RegisterButton.addEventListener("click", function () {
  if (validateInputs()) {
    sendData();
  }
});

function validateInputs() {
  const minOneUppercase = /[A-Z]/;
  const minOneLowercase = /[a-z]/;
  const minOneNumber = /[0-9]/;
  const minOneSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  const noSpaces = /[ ]/;
  const noSpecialCharExceptUnderScore = /[!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/;
  const noDigitFirstChar = /^[0-9]/;

  const verifyEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const verifyUsername = /^(?=[a-zA-Z_])[a-zA-Z0-9_]{7,20}$/;
  const verifyPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

  // EMAIL VALIDATION TEST
  if (!verifyEmail.test(emailInput.value)) {
    createAlert("Please enter a valid email address", "danger");
    return false;
  }

  //   USERNAME VALIDATION TEST
  if (usernameInput.value.length < 8) {
    createAlert("Username must be at least 8 characters", "danger");
    return false;
  }
  if (usernameInput.value.length > 20) {
    createAlert("Username must be at most 20 characters", "danger");
    return false;
  }
  if (noSpecialCharExceptUnderScore.test(usernameInput.value)) {
    createAlert(
      "Username must not contain special characters except the underscore",
      "danger",
    );
    return false;
  }
  if (noDigitFirstChar.test(usernameInput.value)) {
    createAlert("Username must not start with a number", "danger");
    return false;
  }

  // PASSWORD VALIDATION TEST
  if (passwordInput.value.length < 8) {
    createAlert("Password must be at least 8 characters", "danger");
    return false;
  }
  if (passwordInput.value.length > 64) {
    createAlert("Password must be at most 64 characters", "danger");
    return false;
  }
  if (!minOneUppercase.test(passwordInput.value)) {
    createAlert(
      "Password must contain at least one uppercase letter",
      "danger",
    );
    return false;
  }
  if (!minOneNumber.test(passwordInput.value)) {
    createAlert("Password must contain at least one number", "danger");
    return false;
  }
  if (!minOneLowercase.test(passwordInput.value)) {
    createAlert(
      "Password must contain at least one lowercase letter",
      "danger",
    );
    return false;
  }
  if (!minOneSpecialChar.test(passwordInput.value)) {
    createAlert(
      "Password must contain at least one special character",
      "danger",
    );
    return false;
  }
  if (noSpaces.test(passwordInput.value)) {
    createAlert("Password must not contain spaces", "danger");
    return false;
  }

  // CONFIRM PASSWORD VALIDATION TEST
  if (confirmPasswordInput.value !== passwordInput.value) {
    createAlert("Passwords do not match", "danger");
    return false;
  }

  // VERIFY COMPLETELY THE EMAIL
  if (!verifyEmail.test(emailInput.value)) {
    createAlert("Please enter a valid email address", "danger");
    return false;
  }

  // VERIFY COMPLETELY THE USERNAME
  if (!verifyUsername.test(usernameInput.value)) {
    createAlert("Please enter a valid username", "danger");
    return false;
  }

  // VERIFY COMPLETELY THE PASSWORD
  if (!verifyPassword.test(passwordInput.value)) {
    createAlert("Please enter a valid password", "danger");
    return false;
  }

  // ALL VALIDATION TESTS PASSED
  return true;
}

// This function sends data to the server using AJAX.
function sendData() {
  // Create a data object with the values from the input fields.
  let data = {
    email: emailInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
    confirm_password: confirmPasswordInput.value,
  };

  // Make an AJAX POST request to the registration API.
  $.ajax({
    type: "POST",
    url: Routes.REGISTRATION_API,
    data: "register=" + JSON.stringify(data),
    success: function (response) {
      // Log the successful response and handle the data.
      console.log("Successful Response: ", response);
      handleResponseData(JSON.parse(response));
    },
    error: function (xhr, status, error) {
      // Log the error information and handle the error response.
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);

      // Check if the error status is 400 and handle the error response.
      if (JSON.parse(xhr.responseText).status === 400) {
        handleResponseData(JSON.parse(xhr.responseText));
      }
    },
  });
}

function handleResponseData(response) {
  // Check if the response status is 200
  if (response.status === 200) {
    // Call a function to create an alert with the response message and success color
    createAlert(response.message, "success");
  }

  // Check if the response status is 201 and the title is "Registration Successful"
  if (response.status === 201 && response.title === "Registration Successful") {
    // Call a function to create an alert with the response message and success color
    createAlert(response.message, "success");
  }

  // Check if the response status is 400
  if (response.status === 400) {
    // Call a function to create an alert with the response message and danger color
    createAlert(response.message, "danger");
  }
}

function createAlert(message, type) {
  const alertContainer = document.getElementById("AlertsContainer"); // Get the container element where the alerts will be appended

  const alert = document.createElement("div"); // Create a new div element for the alert
  alert.classList.add("alert", `alert-${type}`, "alert-dismissible"); // Add classes to the alert div for styling and functionality
  alert.setAttribute("role", "alert"); // Set the role attribute for accessibility

  const alertMessage = document.createElement("div"); // Create a new div element for the alert message
  alertMessage.innerText = message; // Set the text content of the alert message

  const alertButton = document.createElement("button"); // Create a new button element for closing the alert
  alertButton.classList.add("btn-close"); // Add classes to the button for styling and functionality
  alertButton.setAttribute("type", "button"); // Set the type attribute of the button
  alertButton.setAttribute("data-bs-dismiss", "alert"); // Set the data-bs-dismiss attribute for dismissing the alert
  alertButton.setAttribute("aria-label", "Close"); // Set the aria-label attribute for accessibility

  // Append the alert message and button to the alert div
  alert.appendChild(alertMessage);
  alert.appendChild(alertButton);

  // Append the alert div to the alert container
  alertContainer.appendChild(alert);
}
