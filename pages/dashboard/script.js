"use strict";

import * as Routes from "../../scripts/routes.js";

const NewNoteButton = document.getElementById("NewNoteButton");
const LogoutButton = document.getElementById("LogoutButton");

const ModalTitle = document.getElementById("ModalTitle");
const ModalButton = document.getElementById("ModalButton");
const NoteTitleInput = document.getElementById("NoteTitleInput");
const NoteContentInput = document.getElementById("NoteContentInput");

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
      getNotes();
    },
    error: function (xhr, status, error) {
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);
      if (JSON.parse(xhr.responseText).status === 403) {
        window.location.href = Routes.LOGIN_PAGE;
      }
    },
  });
});

LogoutButton.addEventListener("click", logout);

NewNoteButton.addEventListener("click", () => {
  ModalTitle.innerText = "New Note";

  NoteTitleInput.value = "";
  NoteContentInput.value = "";

  ModalButton.removeEventListener("click", addNote);
  ModalButton.addEventListener("click", addNote);
});

/**
 * Edit a note with the given ID, title, and content.
 * @param {string} id - The ID of the note to edit.
 * @param {string} title - The new title of the note.
 * @param {string} content - The new content of the note.
 */
function editNote(id, title, content) {
  // Log the ID being edited
  console.log("Edit ID: ", id);

  // Set the title of the modal to "Edit Note"
  ModalTitle.innerText = "Edit Note";

  // Add a click event listener to the ModalButton that calls the updateNote function with the given ID
  ModalButton.addEventListener("click", () => {
    updateNote(id);
  });

  // Set the value of the NoteTitleInput to the new title
  NoteTitleInput.value = title;

  // Set the value of the NoteContentInput to the new content
  NoteContentInput.value = content;
}

function addNote() {
  // Get the title and content of the note from the input fields
  let data = {
    title: NoteTitleInput.value,
    content: NoteContentInput.value,
  };

  // Send a POST request to the DASHBOARD_API with the note data as JSON
  $.ajax({
    type: "POST",
    url: Routes.DASHBOARD_API,
    data: "add=" + JSON.stringify(data),
    success: function (response) {
      // Log the success response
      console.log("Success: ", response);

      // Create an alert to indicate that the note was added successfully
      createAlert("Note Added Successfully", "", "success");

      // Get the updated list of notes
      getNotes();
    },
    error: function (xhr, status, error) {
      // Log the error details
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);

      // Create an alert to indicate that the note failed to add
      createAlert("Note Failed to Add", "modal", "danger");

      // Handle the error response
      handleResponse(JSON.parse(xhr.responseText));
    },
  });
}

// Refactored function to update a note
function updateNote(id) {
  // Create an object with the updated note data
  let data = {
    id: id,
    title: NoteTitleInput.value,
    content: NoteContentInput.value,
  };

  // Send a POST request to the server to update the note
  $.ajax({
    type: "POST",
    url: Routes.DASHBOARD_API,
    data: "update=" + JSON.stringify(data),
    success: function (response) {
      // On success, log the response, display a success message, and fetch the updated notes
      console.log("Success: ", response);
      createAlert("Updated Successfully", "", "success");
      getNotes();
    },
    error: function (xhr, status, error) {
      // On error, log the error details, display an error message, and handle the response
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);
      createAlert("Update Failed", "modal", "danger");
      handleResponse(JSON.parse(xhr.responseText));
    },
  });
}

function deleteNote(id) {
  // Create an object with the id property
  let data = {
    id: id,
  };

  // Send an AJAX POST request to the DASHBOARD_API endpoint
  $.ajax({
    type: "POST",
    url: Routes.DASHBOARD_API,
    data: "delete=" + JSON.stringify(data),
    success: function (response) {
      // Log the success response
      console.log("Success: ", response);

      // Create an alert to notify that the note has been deleted
      createAlert("Note Deleted", "", "warning");

      // Call the getNotes() function to update the notes list
      getNotes();
    },
    error: function (xhr, status, error) {
      // Log error information
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);

      // Create an alert to notify that the delete operation failed
      createAlert("Delete Failed", "modal", "danger");

      // Handle the error response
      handleResponse(JSON.parse(xhr.responseText));
    },
  });
}

// Define a function named "getNotes"
function getNotes() {
  // Create an object named "data" with a property "token" that gets the value from sessionStorage
  const data = {
    token: sessionStorage.getItem("token"),
  };

  // Send an AJAX POST request to the specified URL with the data as a query parameter
  // If the request is successful, log the response and call the "displayNotes" function with the parsed response data
  // If there is an error, log the error details and call the "handleResponse" function with the parsed error response
  $.ajax({
    type: "POST",
    url: Routes.DASHBOARD_API,
    data: "getNotes=" + JSON.stringify(data),
    success: function (response) {
      console.log("Success: ", response);
      displayNotes(JSON.parse(response).data);
    },
    error: function (xhr, status, error) {
      console.error("(Error) Status: ", status);
      console.error("(Error) XHR Request: ", xhr);
      console.error("(Error) XHR Response: ", xhr.responseText);
      console.error("Error: ", error);
      handleResponse(JSON.parse(xhr.responseText));
    },
  });
}

// Refactored function to display notes
function displayNotes(collection) {
  // Get the element with id "NotesContainer"
  const NotesContainer = document.getElementById("NotesContainer");
  // Clear the innerHTML of the NotesContainer element
  NotesContainer.innerHTML = "";

  // Check if the collection has any notes
  if (collection.length) {
    // Loop through each note in the collection
    collection.forEach((note) => {
      // Create a card element using the createCard function
      const card = createCard(
        note.id,
        note.title,
        note.content,
        `Last Modified: ${note.updated_at}`,
      );
      // Append the card element to the NotesContainer
      NotesContainer.appendChild(card);
    });
  } else {
    // If the collection is empty, display a message
    NotesContainer.innerText = "You don't have any notes...";
  }
}

// Define a function named logout
function logout() {
  // Create an object 'data' with a 'token' property set to the value of the 'token' key in the sessionStorage
  const data = {
    token: sessionStorage.getItem("token"),
  };

  // Send an AJAX POST request to the DASHBOARD_API endpoint
  $.ajax({
    type: "POST",
    url: Routes.DASHBOARD_API,
    // Set the 'logout' parameter in the request data to the serialized JSON representation of the 'data' object
    data: "logout=" + JSON.stringify(data),
    // Handle the success response
    success: function (response) {
      // Log the success response to the console
      console.log("Success: ", response);
      // Redirect the user to the LOGIN_PAGE
      window.location.href = Routes.LOGIN_PAGE;
    },
    // Handle the error response
    error: function (xhr, status, error) {
      // Log the error status to the console
      console.error("(Error) Status: ", status);
      // Log the XHR request object to the console
      console.error("(Error) XHR Request: ", xhr);
      // Log the XHR response text to the console
      console.error("(Error) XHR Response: ", xhr.responseText);
      // Log the error to the console
      console.error("Error: ", error);
      // Parse the XHR response text and handle the response
      handleResponse(JSON.parse(xhr.responseText));
    },
  });
}

function handleResponse(response) {
  // Check if the response status is 200
  if (response.status === 200) {
    // Call the createAlert function with the response message and "danger" as parameters
    createAlert(response.message, "", "danger");
  }
  // Check if the response status is 403
  if (response.status === 403) {
    // Redirect the window to the login page
    window.location.href = Routes.LOGIN_PAGE;
  }
}

function createCard(id, title, content, timeModified) {
  // Create a new div element to represent the card
  const card = document.createElement("div");

  // Set the id and add the "card" class to the card element
  card.id = id;
  card.classList.add("card");

  // Create a new div element to represent the card header
  const cardHeader = document.createElement("div");
  // Add classes to the card header element
  cardHeader.classList.add(
    "card-header",
    "d-flex",
    "justify-content-end",
    "gap-2",
    "align-items-center",
  );

  // Create a new span element to display the time modified
  const cardTimeModified = document.createElement("span");
  // Set the text content of the span element to the passed timeModified value
  cardTimeModified.innerText = timeModified;

  // Create a new button element to represent the edit button
  const cardEditButton = document.createElement("button");
  // Add classes to the edit button element
  cardEditButton.classList.add("btn", "btn-info", "btn-sm");
  // Set the text content of the edit button element to "Edit"
  cardEditButton.innerText = "Edit";
  // Set the data-bs-toggle attribute of the edit button element to "modal"
  cardEditButton.setAttribute("data-bs-toggle", "modal");
  // Set the data-bs-target attribute of the edit button element to "#modal"
  cardEditButton.setAttribute("data-bs-target", "#modal");
  // Set the onclick event handler of the edit button element to call the editNote function with the passed id, title, and content values
  cardEditButton.onclick = () => {
    editNote(id, title, content);
  };

  // Create a new button element to represent the delete button
  const cardDeleteButton = document.createElement("button");
  // Add classes to the delete button element
  cardDeleteButton.classList.add("btn", "btn-danger", "btn-sm");
  // Set the text content of the delete button element to "Delete"
  cardDeleteButton.innerText = "Delete";
  // Set the onclick event handler of the delete button element to call the deleteNote function with the passed id value
  cardDeleteButton.onclick = () => {
    deleteNote(id);
  };

  // Create a new div element to represent the card body
  const cardBody = document.createElement("div");
  // Add the "card-body" class to the card body element
  cardBody.classList.add("card-body");

  // Create a new h5 element to display the card title
  const cardTitle = document.createElement("h5");
  // Add the "card-title" class to the card title element
  cardTitle.classList.add("card-title");
  // Set the text content of the card title element to the passed title value
  cardTitle.innerText = title;

  // Create a new p element to display the card content
  const cardContent = document.createElement("p");
  // Add the "card-text" class to the card content element
  cardContent.classList.add("card-text");
  // Set the text content of the card content element to the passed content value
  cardContent.innerText = content;

  // Append the cardTimeModified, cardEditButton, and cardDeleteButton elements to the cardHeader element
  cardHeader.appendChild(cardTimeModified);
  cardHeader.appendChild(cardEditButton);
  cardHeader.appendChild(cardDeleteButton);

  // Append the cardTitle and cardContent elements to the cardBody element
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardContent);

  // Append the cardHeader and cardBody elements to the card element
  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  // Return the created card element
  return card;
}

function createAlert(message, which, type) {
  let alertContainer;

  if (which === "modal") {
    alertContainer = document.getElementById("ModalAlertsContainer"); // Get the container element where the alerts will be appended
  } else {
    alertContainer = document.getElementById("AlertsContainer");
  }

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
  alertContainer.innerHTML = "";
  alertContainer.appendChild(alert);
}
