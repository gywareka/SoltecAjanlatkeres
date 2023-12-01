console.log("This is logged from the public folder");

const form = document.getElementById("priceForm");
const submitter = document.querySelector("button[value=Beküldés]");
const output = document.getElementById("output");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");

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

form.addEventListener("submit", handleSubmitForm);
