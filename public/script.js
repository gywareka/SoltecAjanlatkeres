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

  console.log("Form submitted");

  const container = document.getElementById("container");
  container.replaceChildren();
  const form = document.createElement("form");
  container.appendChild(form);

  // A második oldal cime
  const Secontitle = document.createElement("h1");
  form.appendChild(Secontitle);
  Secontitle.innerHTML = "Adjda meg a telepítési címet";

  // A mádosik oldal első inputja (irányitoszám)
  const locationInput1 = document.createElement("input");
  form.appendChild(locationInput1);
  locationInput1.placeholder = "Irányítószám";

  // A mádosik oldal második inputja (Város)
  const locationInput2 = document.createElement("input");
  form.appendChild(locationInput2);
  locationInput2.placeholder = "Város";

  // A mádosik oldal harmadik inputja (Utca)
  const locationInput3 = document.createElement("input");
  form.appendChild(locationInput3);
  locationInput3.placeholder = "Utca";

  // A mádosik oldal negyedik inputja (Hazszam)
  const locationInput4 = document.createElement("input");
  form.appendChild(locationInput4);
  locationInput4.placeholder = "Házszám";

// A második oldal tovább gombja
  const submitButton2 = document.createElement("input");
  submitButton2.type = "submit"
  submitButton2.value = "Tovább"
  form.appendChild(submitButton2);
  submitButton2.classList.add("submit")

  const handleSubmitLocation = (event) => {
    event.preventDefault();
    console.log("Form submitted")
  
    const container = document.getElementById("container");
    container.replaceChildren();
    const form = document.createElement("form");
    container.appendChild(form);
// A harmadik oldal cime
    const ThirdTitle = document.createElement("h1")
    form.appendChild(ThirdTitle)
    ThirdTitle.innerHTML = "Adja meg az átlag fogyasztását"

// A harmadik oldal div-je amibe vannak a gombok
    const ButtonDiv = document.createElement("div")
    form.appendChild(ButtonDiv)
    ButtonDiv.classList.add("ThirdPage")

// A harmadik oldal 1. gombja
    const ConsButton1 = document.createElement("button");
    ConsButton1.type = "button"
    ButtonDiv.appendChild(ConsButton1);
    ConsButton1.classList.add("button-75")
    ConsButton1.textContent = "2000 kWh"

// A harmadik oldal 2. gombja
    const ConsButton2 = document.createElement("button");
    ConsButton2.type = "button"
    ButtonDiv.appendChild(ConsButton2);
    ConsButton2.classList.add("button-75")
    ConsButton2.textContent = "3500 kWh"

// A harmadik oldal 3. gombja
    const ConsButton3 = document.createElement("button");
    ConsButton3.type = "button"
    ButtonDiv.appendChild(ConsButton3);
    ConsButton3.classList.add("button-75")
    ConsButton3.textContent = "5000 kWh"

// A harmadik oldal 4. gombja
    const ConsButton4 = document.createElement("button");
    ConsButton4.type = "button"
    ButtonDiv.appendChild(ConsButton4);
    ConsButton4.classList.add("button-75")
    ConsButton4.textContent = "7000 kWh"
    
// A harmadik oldal Tovább gombja
    const submitButton3 = document.createElement("input")
    submitButton3.type = "submit"
    submitButton3.value = "Tovább"
    form.appendChild(submitButton3)
    submitButton3.classList.add("submit");

  }

  form.addEventListener("submit", (event) => handleSubmitLocation(event))
};

const handleSubmitForm = (event) => {
  // Prevents the page from refreshing automatically after the form is submitted
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

form.addEventListener("submit", (event) => handleSubmitNameAndEmail(event));


