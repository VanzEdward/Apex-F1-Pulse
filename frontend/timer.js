// timer.js

export const startCountdown = async () => {
  try {
    // 1. Fetch the next upcoming race from the API
    const response = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/next.json",
    );
    const data = await response.json();

    // 2. Dig into the API layers to find the race details
    const nextRace = data.MRData.RaceTable.Races[0];
    const raceName = nextRace.raceName;

    // Combine the API's date and time strings into a format JavaScript understands
    const raceDate = new Date(`${nextRace.date}T${nextRace.time}`).getTime();

    // 3. Automatically update the HTML title on the screen
    document.querySelector(".race-title").innerText = raceName;

    // --- NEW, CRASH-PROOF LOGIC: THE WEEKEND SCHEDULE ---
    const scheduleBox = document.getElementById("weekend-schedule");

    // Safely grab dates that exist in every weekend format
    const fp1 = nextRace.FirstPractice?.date || "TBD";
    const quali = nextRace.Qualifying?.date || "TBD";

    // Check if the Sprint object exists
    if (nextRace.Sprint) {
      // It IS a Sprint Weekend
      // The API might use SprintQualifying, SprintShootout, or SecondPractice for this slot
      const sprintQuali =
        nextRace.SprintQualifying?.date ||
        nextRace.SecondPractice?.date ||
        "TBD";
      const sprint = nextRace.Sprint?.date || "TBD";

      scheduleBox.innerHTML = `
            <div class="session"><span>FP1:</span> ${fp1}</div>
            <div class="session"><span>Sprint Quali:</span> ${sprintQuali}</div>
            <div class="session"><span>Sprint:</span> ${sprint}</div>
            <div class="session"><span>Qualifying:</span> ${quali}</div>
        `;
    } else {
      // It is a STANDARD Weekend
      // Use optional chaining just in case the API hasn't loaded these yet
      const fp2 = nextRace.SecondPractice?.date || "TBD";
      const fp3 = nextRace.ThirdPractice?.date || "TBD";

      scheduleBox.innerHTML = `
            <div class="session"><span>FP1:</span> ${fp1}</div>
            <div class="session"><span>FP2:</span> ${fp2}</div>
            <div class="session"><span>FP3:</span> ${fp3}</div>
            <div class="session"><span>Qualifying:</span> ${quali}</div>
        `;
    }
    // 4. Start the ticking clock using the live date
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = raceDate - now;

      if (timeLeft < 0) {
        clearInterval(timerInterval);
        document.getElementById("countdown-clock").innerText = "IT'S RACE DAY!";
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById("countdown-clock").innerText =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  } catch (error) {
    console.error("Failed to load race schedule:", error);
    document.getElementById("countdown-clock").innerText = "Timer Error";
  }
};
