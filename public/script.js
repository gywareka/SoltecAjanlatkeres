console.log("This is logged from the public folder");

const form = document.querySelector("form");
const lastNameInput = document.getElementById("lastname");
const firstNameInput = document.getElementById("firstname");
const emailInput = document.getElementById("email");

let firstName = "";
let lastName = "";
let email = "";

const handleSubmitNameAndEmail = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  console.log(formData);
};

const handleSubmitForm = (event) => {
  event.preventDefault();

  // Collect data from the form
  const formData = new FormData(event.target);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Send data to the backend
  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((response) => {
      //TODO Handle the response from the server
      //TODO Let the user know that the from has been successfully sent, etc.
      console.info(response);
    })
    .catch((error) => {
      console.error("Hiba a beküldésben: ", error);
    });
};

form.addEventListener("submit", handleSubmitNameAndEmail);
