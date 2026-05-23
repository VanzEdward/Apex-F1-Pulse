// Import the timer from our new file
import { startCountdown } from "./timer.js";
import { fetchDrivers, setupSearch } from "./ui.js";

// --- 4. START THE APP ---
startCountdown();
fetchDrivers();
setupSearch();
