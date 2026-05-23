// --- 1. THE COUNTDOWN TIMER ---
export const startCountdown = () => {
  // Set the date of the next race
  const raceDate = new Date("May 24, 2026 15:00:00").getTime();

  // Update the clock every 1 second (1000 milliseconds)
  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const timeLeft = raceDate - now;

    // If the countdown reaches zero, stop the clock and show a message
    if (timeLeft < 0) {
      clearInterval(timerInterval);
      document.getElementById("countdown-clock").innerText = "IT'S RACE DAY!";
      return;
    }

    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Display the result in the HTML element
    document.getElementById("countdown-clock").innerText =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }, 1000);
};
