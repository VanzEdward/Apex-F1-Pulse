// Helper function to convert raw API date/time strings into readable local time
const formatSessionTime = (dateStr, timeStr) => {
  if (!dateStr) return "TBD";
  // If the API provides a time, combine them into a ISO string, otherwise parse date only
  const dateObj = timeStr
    ? new Date(`${dateStr}T${timeStr}`)
    : new Date(dateStr);

  // Format options: "Fri, May 22 • 3:30 PM"
  return dateObj.toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const startCountdown = async () => {
  try {
    const response = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/next.json",
    );
    const data = await response.json();

    const nextRace = data.MRData.RaceTable.Races[0];

    // 1. Inject Race Name
    document.querySelector(".race-title").innerText = nextRace.raceName;

    // 2. NEW: Inject Circuit Name and Location
    const circuitName = nextRace.Circuit.circuitName;
    const locality = nextRace.Circuit.Location.locality;
    const country = nextRace.Circuit.Location.country;
    document.getElementById("circuit-info").innerText =
      `${circuitName} — ${locality}, ${country}`;

    // 3. Setup Main Race Target Countdown Time
    const raceDate = new Date(`${nextRace.date}T${nextRace.time}`).getTime();

    // 4. NEW: Format and display session times with local time conversion
    const scheduleBox = document.getElementById("weekend-schedule");

    const fp1 = formatSessionTime(
      nextRace.FirstPractice?.date,
      nextRace.FirstPractice?.time,
    );
    const quali = formatSessionTime(
      nextRace.Qualifying?.date,
      nextRace.Qualifying?.time,
    );

    if (nextRace.Sprint) {
      const sprintQuali = formatSessionTime(
        nextRace.SprintQualifying?.date || nextRace.SecondPractice?.date,
        nextRace.SprintQualifying?.time || nextRace.SecondPractice?.time,
      );
      const sprint = formatSessionTime(
        nextRace.Sprint?.date,
        nextRace.Sprint?.time,
      );

      scheduleBox.innerHTML = `
            <div class="session"><span>FP1</span> <span>${fp1}</span></div>
            <div class="session"><span>Sprint Quali</span> <span>${sprintQuali}</span></div>
            <div class="session"><span>Sprint Race</span> <span>${sprint}</span></div>
            <div class="session"><span>Qualifying</span> <span>${quali}</span></div>
        `;
    } else {
      const fp2 = formatSessionTime(
        nextRace.SecondPractice?.date,
        nextRace.SecondPractice?.time,
      );
      const fp3 = formatSessionTime(
        nextRace.ThirdPractice?.date,
        nextRace.ThirdPractice?.time,
      );

      scheduleBox.innerHTML = `
            <div class="session"><span>FP1</span> <span>${fp1}</span></div>
            <div class="session"><span>FP2</span> <span>${fp2}</span></div>
            <div class="session"><span>FP3</span> <span>${fp3}</span></div>
            <div class="session"><span>Qualifying</span> <span>${quali}</span></div>
        `;
    }

    // 5. Live Countdown Interval Timer Loop
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
