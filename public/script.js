const form = document.querySelector("form");

let userData = {
  firstName: "",
  lastName: "",
  email: "",
  installationLocation: {
    zipCode: 0,
    city: "",
    street: "",
    houseNumber: 0,
  },
  consumption: 0,
};

// Ezzel könnyebb létrehozni új elementeket
const createElement = (tag, options) => {
  const element = document.createElement(tag);
  Object.assign(element, options);
  return element;
};

// Harmadik oldal submitelésekor lejátszódó event
// Végső event

function renderLoadingPage() {
  // az elemek létrehozása

  // Az harmadik oldal elementjeinek kitörlése
  const container = document.getElementById("container");
  container.replaceChildren();

  // A loadink oldal elementjeinek létrehozása
  const form = document.createElement("form");
  container.appendChild(form);

  //  Az Loading Page 1. divje
  const Loading1Div = document.createElement("div");
  Loading1Div.classList.add("text");
  form.appendChild(Loading1Div);

  //  A szöveg ami változik
  const LoadingPageText = createElement("h1", {
    innerHTML: "Generating roof allocation",
  });
  Loading1Div.appendChild(LoadingPageText);

  const Loading2Div = document.createElement("div");
  Loading2Div.classList.add("loading");
  form.appendChild(Loading2Div);

  const Loading3Div = document.createElement("div");
  Loading3Div.classList.add("line-box");
  Loading2Div.appendChild(Loading3Div);

  const Loading4Div = document.createElement("div");
  Loading4Div.classList.add("line");
  Loading3Div.appendChild(Loading4Div);

  let x = document.querySelector("h1");

  // Only changed while testing
  // First tiemout was 10000, second was 20000
  setTimeout(() => {
    x.innerHTML = "Dimensioning inverter";
  }, 5000);
  setTimeout(() => {
    x.innerHTML = "Calculating preliminary offer";
  }, 10000);
  setTimeout(() => {
    x.innerHTML = "Köszönjük, hogy minket választott!";

    // Fetch API hívás
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      // A szervertől kapott adatokat olvasható JSON-ná alakítja
      .then((response) => {
        if (!response.ok) {
          console.error(response.text);
          alert("Hiba az adatok feldolgozásával!");
        } else {
          console.log(response.text);
          alert(
            `Árajánlat sikeresen elküldve a(z) ${userData.email} email címre.`
          );
        }
      })
      // Ha akármi hiba lép fel a szerverrel való kommunikáció során,
      // itt fog kikötni a program
      .catch((error) => {
        console.error(error);
        alert("Hiba a kérdőiv elküldésével. Kérlük próbálja újra!");
      });
  }, 15000);
}

const handleSubmitConsumption = (event) => {
  event.preventDefault();

  console.log(`Fogyasztás: ${userData.consumption}`);

  renderLoadingPage();
};

const renderThirdPage = () => {
  // Az második oldal elementjeinek kitörlése
  const container = document.getElementById("container");
  container.replaceChildren();

  // A harmadik oldal elementjeinek létrehozása
  const form = document.createElement("form");
  container.appendChild(form);

  // A harmadik oldal cime
  const ThirdTitle = createElement("h1", {
    innerHTML: "Adja meg az éves átlag fogyasztását",
  });
  form.appendChild(ThirdTitle);

  // A harmadik oldal gombokat tartalmazó divje
  const ButtonDiv = document.createElement("div");
  form.appendChild(ButtonDiv);
  ButtonDiv.classList.add("ThirdPage");

  // Eme lista alapján generálódnak a gombok
  const buttonValues = [
    {
      value: 3500,
      src: "./assets/twoperson.png",
    },
    {
      value: 5000,
      src: "./assets/family.png",
    },
    {
      value: 7000,
      src: "./assets/bigfamily.png",
    },
  ];

  // Végigmegy a buttonValues lista összes elemén, és létrehoz
  // egy elemet az adatok alapján
  for (const btn of buttonValues) {
    const button = createElement("button", {
      type: "radio",
      value: btn.value,
      id: btn.value,
    });
    button.classList.add("cons-btn");
    ButtonDiv.appendChild(button);

    button.addEventListener("click", (event) => {
      event.preventDefault();

      const prevSelected = document.querySelector(".selected");
      if (prevSelected) {
        prevSelected.classList.remove("selected");
      }

      document
        .querySelector(`label[for="${event.target.value}"]`)
        .classList.add("selected");

      userData.consumption = Number(event.target.value);
    });

    const label = createElement("label", {
      htmlFor: btn.value,
      textContent: `${btn.value} kWh`,
    });
    label.classList.add("cons-label");
    ButtonDiv.appendChild(label);

    const image = createElement("img", {
      src: btn.src,
    });
    image.classList.add("ThirdPageImg");
    label.appendChild(image);
  }

  // A harmadik oldal Tovább gombja
  const submitButton3 = createElement("input", {
    type: "submit",
    value: "Tovább",
  });
  submitButton3.classList.add("submit");
  form.appendChild(submitButton3);

  form.addEventListener("submit", (event) => handleSubmitConsumption(event));
};

// Második oldal submitelésekor lejátszódó event
const handleSubmitLocation = (event) => {
  event.preventDefault();

  // TODO Csak akkor álllítsa be a userData értékeit, ha korrektek az inputok
  // TODO zipCode és houseNumber szám, city és street string

  userData.installationLocation = {
    zipCode: Number(document.getElementById("zipCode").value),
    city: document.getElementById("city").value,
    street: document.getElementById("street").value,
    houseNumber: Number(document.getElementById("houseNumber").value),
  };

  //console.table(userData.installationLocation);

  renderThirdPage();
};

const renderSecondPage = () => {
  // Az első oldal elementjeinek kitörlése
  const container = document.getElementById("container");
  container.replaceChildren();

  // A második oldal elementjeinek létrehozása
  const form = createElement("form");
  container.appendChild(form);

  // A második oldal címe
  const title = createElement("h1", {
    innerHTML: "Adja meg a telepítési címet",
  });
  form.appendChild(title);

  // A második oldal első inputja (irányitószám)
  const zipCodeInput = createElement("input", {
    placeholder: "Irányítószám",
    id: "zipCode",
    required: true,
  });
  form.appendChild(zipCodeInput);

  // A másosódik oldal második inputja (Város)
  const cityInput = createElement("input", {
    placeholder: "Város",
    id: "city",
    required: true,
  });
  form.appendChild(cityInput);

  // A második oldal harmadik inputja (Utca)
  const streetInput = createElement("input", {
    placeholder: "Utca",
    id: "street",
    required: true,
  });
  form.appendChild(streetInput);

  // A második oldal negyedik inputja (Házszám)
  const houseNumberInput = createElement("input", {
    placeholder: "Házszám",
    id: "houseNumber",
    required: true,
  });
  form.appendChild(houseNumberInput);

  // A második oldal tovább gombja
  const submitButton2 = createElement("input", {
    type: "submit",
    value: "Tovább",
  });
  submitButton2.classList.add("submit");
  form.appendChild(submitButton2);

  form.addEventListener("submit", (event) => handleSubmitLocation(event));
};

// Első oldal submitelésekor lejátszódó event
const handleSubmitNameAndEmail = (event) => {
  event.preventDefault();

  userData.firstName = document.getElementById("firstname").value;
  userData.lastName = document.getElementById("lastname").value;
  userData.email = document.getElementById("email").value;

  //   console.log(`
  //     Vezetéknév: ${userData.lastName}
  //     Tulajdonnév: ${userData.firstName}
  //     Email: ${userData.email}
  //   `);

  renderSecondPage();
};

// Az első oldal formja megkapja az event listenert
// A többi oldal formjainak event listenerei a renderSecondPage és
// renderThirdPage-ben történnek
form.addEventListener("submit", (event) => handleSubmitNameAndEmail(event));
