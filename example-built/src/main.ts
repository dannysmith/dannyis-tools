import { formatTime } from "./time";

const output = document.querySelector("output")!;

function tick(): void {
  output.textContent = formatTime(new Date());
}

tick();
setInterval(tick, 1000);
