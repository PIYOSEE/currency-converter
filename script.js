const base_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdownS = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button"); 
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// 1. Populate currency dropdowns and set flags
for (let select of dropdownS) {
    for (let Currcode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = Currcode;
        newOption.value = Currcode;

        // default selections
        if (select.name === "from" && Currcode === "USD") {
            newOption.selected = true;
        } else if (select.name === "to" && Currcode === "INR") {
            newOption.selected = true;
        }

        select.appendChild(newOption);
    }

    // update flag when currency changes
    select.addEventListener("change", (evt) => {
        updFlag(evt.target);
    });
}

// 2. Flag update function
const updFlag = (element) => {
    let Currcode = element.value;
    let countryCode = countryList[Currcode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// 3. Fetch exchange rate and show result
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();

    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${base_URL}/${fromCurr.value.toLowerCase()}.json`;

    try {
        let response = await fetch(URL);
        let data = await response.json();

        let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];
        let total = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromCurr.value} = ${total} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Something went wrong. Try again!";
        console.error("Error fetching rate:", error);
    }
});
