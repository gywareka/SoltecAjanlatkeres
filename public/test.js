function timedText() {
  let x = document.getElementById("text");
  setTimeout(() => {
    x.innerHTML = "Dimensioning inverter";
  }, 10000);
  setTimeout(() => {
    x.innerHTML = "Calculating preliminary offer";
  }, 20000);
  setTimeout(() => {
    x.innerHTML = "Köszönjük, hogy a Soltec Ajánlatkérő oldalát választotta!";
  }, 30000);
}
