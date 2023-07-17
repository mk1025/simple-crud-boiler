"use strict";

import * as Routes from "../../scripts/routes.js";

const LoginButton = document.getElementById("LoginButton");

const emailORusernameInput = document.getElementById("emailORusername");
const passwordInput = document.getElementById("password");

LoginButton.addEventListener("click", function () {
  if (validateInputs()) {
    sendData();
  }
});

// Function to validate inputs
function validateInputs() {
  // Check if the length of email or username input is greater than 0
  if (!emailORusernameInput.value.length > 0) {
    // If not, create an alert with the message "Please fill in the Email or Username Field"
    createAlert("Please fill in the Email or Username Field");
    // Return false to indicate validation failure
    return false;
  }

  // Check if the length of password input is greater than 0
  if (!passwordInput.value.length > 0) {
    // If not, create an alert with the message "Please fill in the Password Field"
    createAlert("Please fill in the Password Field");
    // Return false to indicate validation failure
    return false;
  }

  // If all inputs are valid, return true to indicate validation success
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  let token = sessionStorage.getItem("token") ?? "";

  const data = {
    token: token,
  };

  $.ajax({
    type: "POST",
    url: Routes.LOGIN_API,
    data: "session=" + JSON.stringify(data),
    success: function (response) {
      console.log("Success: ", response);
      window.location.href = Routes.DASHBOARD_PAGE;
    },
    error: function (xhr, status, error) {
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);
    },
  });
});

function sendData() {
  // Create an object with email/username and password
  let data = {
    emailORusername: emailORusernameInput.value,
    password: passwordInput.value,
  };

  // Send a POST request to the LOGIN_API URL with the data
  $.ajax({
    type: "POST",
    url: Routes.LOGIN_API,
    data: "login=" + JSON.stringify(data),
    success: function (response) {
      // Log the successful response
      console.log("Successful Response: ", response);

      // Parse the response as JSON
      let responseJSON = JSON.parse(response);

      // Store the token in session storage
      sessionStorage.setItem("token", responseJSON.data.token);

      // Redirect to the DASHBOARD_PAGE
      window.location.href = Routes.DASHBOARD_PAGE;
    },
    error: function (xhr, status, error) {
      // Log the error details
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);

      // Handle the error response data
      handleResponseData(JSON.parse(xhr.responseText));
    },
  });
}

function handleResponseData(response) {
  // Check if the response status is 400
  if (response.status === 400) {
    // Call the createAlert function with the response message and "danger" as parameters
    createAlert(response.message, "danger");
  }
}

function createAlert(message, type) {
  // Get the container element where the alerts will be appended
  const alertContainer = document.getElementById("AlertsContainer");

  // Create a new div element for the alert
  const alert = document.createElement("div");

  // Add classes to the alert div for styling and functionality
  // The type parameter is used to dynamically set the class name of the alert
  alert.classList.add("alert", `alert-${type}`, "alert-dismissible");

  // Set the role attribute for accessibility
  alert.setAttribute("role", "alert");

  // Create a new div element for the alert message
  const alertMessage = document.createElement("div");

  // Set the text content of the alert message
  alertMessage.innerText = message;

  // Create a new button element for closing the alert
  const alertButton = document.createElement("button");

  // Add classes to the button for styling and functionality
  alertButton.classList.add("btn-close");

  // Set the type attribute of the button
  alertButton.setAttribute("type", "button");

  // Set the data-bs-dismiss attribute for dismissing the alert
  alertButton.setAttribute("data-bs-dismiss", "alert");

  // Set the aria-label attribute for accessibility
  alertButton.setAttribute("aria-label", "Close");

  // Append the alert message and button to the alert div
  alert.appendChild(alertMessage);
  alert.appendChild(alertButton);

  // Append the alert div to the alert container
  // Prepend the alert div so that it appears at the top of the container
  alertContainer.prepend(alert);
}
