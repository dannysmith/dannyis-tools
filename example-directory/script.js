const output = document.querySelector("output");
let count = 0;

function setCount(value) {
  count = value;
  output.textContent = count;
}

for (const button of document.querySelectorAll("[data-step]")) {
  button.addEventListener("click", () => setCount(count + Number(button.dataset.step)));
}

document.querySelector("[data-reset]").addEventListener("click", () => setCount(0));
