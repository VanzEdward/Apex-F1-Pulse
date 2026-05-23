// --- 2. DATA FETCHING AND RENDERING ---
let allDrivers = [];

export const fetchDrivers = async () => {
  try {
    // We are now fetching from our own Python backend!
    const response = await fetch("http://127.0.0.1:5000/api/drivers");

    if (!response.ok) {
      throw new Error(`HTTP Error Status: ${response.status}`);
    }
    const rawData = await response.json();

    // 2. Dig through the API's layers to find the actual list of drivers
    const liveDrivers =
      rawData.MRData.StandingsTable.StandingsLists[0].DriverStandings;

    // 3. Translate the API's format into our app's format
    allDrivers = liveDrivers.map((item) => {
      return {
        rank: item.position,
        name: item.Driver.givenName + " " + item.Driver.familyName,
        team: item.Constructors[0].name,
        points: item.points,
      };
    });

    // 4. Draw the table with the real data
    renderTable(allDrivers);
  } catch (error) {
    console.error("Failed to get API data:", error);
    document.getElementById("driver-rows").innerHTML =
      "<tr><td colspan='4'>Error loading live data.</td></tr>";
  }
};

// A dictionary to map team names to their official hex colors
const getTeamColor = (teamName) => {
  const colors = {
    Mercedes: "#00D2BE",
    Ferrari: "#DC0000",
    McLaren: "#FF8700",
    "Red Bull": "#0600EF",
    "Aston Martin": "#006F62",
    "Alpine F1 Team": "#0090FF",
    Williams: "#005AFF",
    Audi: "#F20000", // Audi Sport Red
    "RB F1 Team": "#6692FF", // Racing Bulls Blue
    "Haas F1 Team": "#FFFFFF", // Haas White/Silver
    "Cadillac F1 Team": "#CBA153", // Cadillac Racing Gold
  };
  // Return the team color, or a default grey if the team isn't listed
  return colors[teamName] || "#444444";
};

const renderTable = (driverList) => {
  const tableBody = document.getElementById("driver-rows");
  tableBody.innerHTML = "";

  driverList.forEach((driver) => {
    const row = document.createElement("tr");

    // Inject the dynamic color into the row's style
    row.style.borderLeft = `5px solid ${getTeamColor(driver.team)}`;

    row.innerHTML = `
            <td>${driver.rank}</td>
            <td><strong>${driver.name}</strong></td>
            <td>${driver.team}</td>
            <td>${driver.points}</td>
        `;
    tableBody.appendChild(row);
  });
};

// --- 3. THE SEARCH FILTER ---
export const setupSearch = () => {
  const searchInput = document.getElementById("search-bar");

  searchInput.addEventListener("keyup", (event) => {
    const typedWord = event.target.value.toLowerCase();

    const matchingDrivers = allDrivers.filter((driver) => {
      return (
        driver.name.toLowerCase().includes(typedWord) ||
        driver.team.toLowerCase().includes(typedWord)
      );
    });

    renderTable(matchingDrivers);
  });
};

export const fetchAndRenderTeams = async () => {
  try {
    const response = await fetch("http://127.0.0.1:5000/api/constructors");
    if (!response.ok) throw new Error("Failed to fetch team data");

    const rawData = await response.json();

    // Navigate structural layers of the response to access lists
    const standingsList =
      rawData.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
    const teamRowsContainer = document.getElementById("team-rows");
    teamRowsContainer.innerHTML = "";

    standingsList.forEach((item) => {
      const row = document.createElement("tr");

      // Use your existing color coding function based on team name
      row.style.borderLeft = `5px solid ${getTeamColor(item.Constructor.name)}`;

      row.innerHTML = `
        <td>${item.position}</td>
        <td><strong>${item.Constructor.name}</strong> <span style="font-size:0.8rem; color:#888;">(${item.Constructor.nationality})</span></td>
        <td>${item.points}</td>
      `;
      teamRowsContainer.appendChild(row);
    });
  } catch (error) {
    console.error("Error drawing constructor table:", error);
  }
};
