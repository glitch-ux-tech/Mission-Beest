

const backToMission = document.getElementById("backToMission");

if (backToMission) {
  backToMission.addEventListener("click", () => {
    window.location.href = "./index.html?skipIntro=true";
  });
}

const planetData = {
  earth: {
    sector: "PLANETARY DATABASE // HOME",
    title: "EARTH",
    status: "STATUS: SECURE",
    classification: "TERRESTRIAL // BASE",
    distance: "0 AU",
    signal: "STRONG",
    description: "Earth Base. Mission control and launch site for all BEEST operations."
  },
  mercury: {
    sector: "PLANETARY DATABASE // INNER SYSTEM",
    title: "MERCURY",
    status: "STATUS: SCANNED",
    classification: "TERRESTRIAL // SCORCHED",
    distance: "0.39 AU",
    signal: "WEAK",
    description: "Extreme temperature swings and no atmosphere. Requires thermal adaptation suit."
  },
  venus: {
    sector: "PLANETARY DATABASE // INNER SYSTEM",
    title: "VENUS",
    status: "STATUS: SCANNED",
    classification: "TERRESTRIAL // HOSTILE",
    distance: "0.72 AU",
    signal: "MODERATE",
    description: "Crushing atmospheric pressure and toxic clouds. Requires high-pressure survival suit."
  },
  mars: {
    sector: "PLANETARY DATABASE // OUTER FRONTIER",
    title: "MARS",
    status: "STATUS: SCANNED",
    classification: "TERRESTRIAL // ARID",
    distance: "1.52 AU",
    signal: "STRONG",
    description: "Thin atmosphere, frequent dust storms. Requires martian exploration suit."
  },
  unknown: {
    sector: "PLANETARY DATABASE // CLASSIFIED",
    title: "UNKNOWN",
    status: "STATUS: UNIDENTIFIED",
    classification: "UNKNOWN // ANOMALOUS",
    distance: "---",
    signal: "UNSTABLE",
    description: "Unidentified object detected. Origin and composition remain classified."
  }
};

const planetPopup = document.getElementById("planetPopup");
const closePlanetPopup = document.getElementById("closePlanetPopup");
const popupSector = document.getElementById("popupSector");
const popupTitle = document.getElementById("popupTitle");
const popupStatus = document.getElementById("popupStatus");
const popupClass = document.getElementById("popupClass");
const popupDistance = document.getElementById("popupDistance");
const popupSignal = document.getElementById("popupSignal");
const popupDescription = document.getElementById("popupDescription");
const holoPlanet = document.getElementById("holoPlanet");

document.querySelectorAll(".planet").forEach((planetButton) => {
  planetButton.addEventListener("click", () => {
    const key = planetButton.dataset.planet;
    const data = planetData[key];

    if (!data || !planetPopup) return;

    if (popupSector) popupSector.textContent = data.sector;
    if (popupTitle) popupTitle.textContent = data.title;
    if (popupStatus) popupStatus.textContent = data.status;
    if (popupClass) popupClass.textContent = data.classification;
    if (popupDistance) popupDistance.textContent = data.distance;
    if (popupSignal) popupSignal.textContent = data.signal;
    if (popupDescription) popupDescription.textContent = data.description;
    if (holoPlanet) holoPlanet.className = "holo-planet holo-" + key;

    planetPopup.classList.add("show");
  });
});

if (closePlanetPopup && planetPopup) {
  closePlanetPopup.addEventListener("click", () => {
    planetPopup.classList.remove("show");
  });
}

if (planetPopup) {
  planetPopup.addEventListener("click", (event) => {
    if (event.target === planetPopup) {
      planetPopup.classList.remove("show");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && planetPopup?.classList.contains("show")) {
    planetPopup.classList.remove("show");
  }
});
