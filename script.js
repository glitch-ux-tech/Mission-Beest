// Mission Beest — main1.html page logic
// Handles the authorize sequence, terminal boot text, mission briefing popup,
// navbar routing, and the Nova suit selector.

const button = document.querySelector(".mission-button");
const info = document.querySelector(".mission-info");
const encrypted = document.querySelector(".encrypted-terminal");
const terminal = document.querySelector(".terminal-current");
const bar = document.querySelector(".loading-bar");
const warning = document.getElementById("warning");
const galaxyButton = document.getElementById("openGalaxy");
const galaxyScreen = document.getElementById("galaxyScreen");
const galaxyMap = document.getElementById("galaxyMap");

const missionBriefing = document.getElementById("missionBriefing");
const navMission = document.getElementById("navlist1");
const navGalaxy = document.getElementById("navlist2");
const navAchievements = document.getElementById("navlist3");
const closeMissionBriefing = document.getElementById("closeMissionBriefing");
const closeBriefingButton = document.getElementById("closeBriefingButton");

// ----- Navbar routing -----
// The navbar's Galaxy Map link goes straight to galaxymap.html.
// This is separate from the OPEN GALAXY MAP button in the terminal below.

if (navGalaxy) {
  navGalaxy.addEventListener("click", () => {
    window.location.href = "./galaxymap.html";
  });
}

if (navAchievements) {
  navAchievements.addEventListener("click", () => {
    window.location.href = "./achievements.html";
  });
}

// ----- Warning text glitch -----

setInterval(() => {
  if (!warning) return;

  warning.style.transform = "translate(-2px,1px)";
  setTimeout(() => { warning.style.transform = "translate(2px,-1px)"; }, 40);
  setTimeout(() => { warning.style.transform = "translate(-1px,0px)"; }, 80);
  setTimeout(() => { warning.style.transform = "translate(0,0)"; }, 120);
}, 2500);

// ----- Terminal boot messages -----

const messages = [
  "Initializing Mission...",
  "Connecting to Earth Base...",
  "Navigation System........ONLINE ✓",
  "Life Support............ONLINE ✓",
  "Fuel Systems............ONLINE ✓",
  "Communications..........ONLINE ✓",
  "Mission Database........SYNCED ✓",
  "Launch Authorization....GRANTED ✓",
  "Preparing Launch..."
];

// ----- Initial state -----
// The OPEN GALAXY MAP button stays fully hidden (display, opacity, visibility,
// pointer-events) until the terminal sequence finishes.

if (info) {
  info.style.display = "none";
  info.style.opacity = "0";
}

if (galaxyButton) {
  galaxyButton.style.display = "none";
  galaxyButton.style.opacity = "0";
  galaxyButton.style.visibility = "hidden";
  galaxyButton.style.pointerEvents = "none";
}

if (galaxyScreen) {
  galaxyScreen.style.display = "none";
  galaxyScreen.classList.remove("show");
}

if (galaxyMap) {
  galaxyMap.style.display = "none";
}

// ----- Authorize mission -----

let missionStarted = false;

if (button) {
  button.addEventListener("click", () => {
    if (missionStarted) return;
    missionStarted = true;

    button.disabled = true;
    button.style.cursor = "not-allowed";
    button.style.opacity = "0.6";

    if (encrypted) {
      encrypted.style.opacity = "0";
    }

    setTimeout(() => {
      if (encrypted) {
        encrypted.style.display = "none";
      }

      if (info) {
        info.style.display = "flex";
        requestAnimationFrame(() => { info.style.opacity = "1"; });
        info.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      runTerminal();
    }, 300);
  });
}

// ----- Terminal typing sequence -----

function runTerminal() {
  if (!terminal || !bar) {
    return;
  }

  let current = 0;

  terminal.textContent = "";
  terminal.style.color = "#22D3EE";
  bar.style.width = "0%";

  if (galaxyButton) {
    galaxyButton.style.display = "none";
    galaxyButton.style.opacity = "0";
    galaxyButton.style.visibility = "hidden";
    galaxyButton.style.pointerEvents = "none";
  }

  function nextMessage() {
    if (current >= messages.length) {
      terminal.style.color = "#22C55E";
      terminal.textContent = "MISSION READY ✓";
      bar.style.width = "100%";

      if (galaxyButton) {
        galaxyButton.style.display = "inline-block";
        galaxyButton.style.visibility = "visible";
        galaxyButton.style.pointerEvents = "auto";
        galaxyButton.style.opacity = "0";

        requestAnimationFrame(() => { galaxyButton.style.opacity = "1"; });
      }

      return;
    }

    terminal.textContent = "";
    let i = 0;

    function type() {
      if (i < messages[current].length) {
        terminal.textContent += messages[current].charAt(i);
        i++;
        setTimeout(type, 25);
      } else {
        bar.style.width = ((current + 1) / messages.length) * 100 + "%";
        current++;
        setTimeout(nextMessage, 200);
      }
    }

    type();
  }

  nextMessage();
}

// ----- Open Galaxy Map button (terminal only, not the navbar) -----

if (galaxyButton) {
  galaxyButton.addEventListener("click", () => {
    window.location.href = "./galaxy.html";
  });
}

// ----- Mission briefing popup -----

if (navMission && missionBriefing) {
  navMission.addEventListener("click", () => {
    missionBriefing.classList.add("show");
  });
}

if (closeMissionBriefing && missionBriefing) {
  closeMissionBriefing.addEventListener("click", () => {
    missionBriefing.classList.remove("show");
  });
}

if (closeBriefingButton && missionBriefing) {
  closeBriefingButton.addEventListener("click", () => {
    missionBriefing.classList.remove("show");
  });
}

if (missionBriefing) {
  missionBriefing.addEventListener("click", (event) => {
    if (event.target === missionBriefing) {
      missionBriefing.classList.remove("show");
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && missionBriefing?.classList.contains("show")) {
    missionBriefing.classList.remove("show");
  }
});

// ----- Nova equipment bay -----

const novaSuits = [
  { id: 1, name: "EXPLORER", description: "STANDARD MISSION SUIT", image: "assets/nova-default.png", required: 0 },
  { id: 2, name: "MERCURY", description: "THERMAL ADAPTATION SUIT", image: "assets/nova-mercury.png", required: 1 },
  { id: 3, name: "VENUS", description: "HIGH-PRESSURE SURVIVAL SUIT", image: "assets/nova-venus.png", required: 2 },
  { id: 4, name: "MARS", description: "MARTIAN EXPLORATION SUIT", image: "assets/nova-mars.png", required: 3 },
  { id: 5, name: "UNKNOWN", description: "UNIDENTIFIED SIGNAL // CLASSIFIED", image: "assets/nova-unknown.png", required: 4 }
];

let currentSuit = 0;

const novaImage = document.getElementById("novaSuitImage");
const novaSuitNumber = document.getElementById("novaSuitNumber");
const novaSuitName = document.getElementById("novaSuitName");
const novaSuitDescription = document.getElementById("novaSuitDescription");
const suitLeft = document.getElementById("suitLeft");
const suitRight = document.getElementById("suitRight");
const selectSuit = document.getElementById("selectSuit");

function getCompletedMissions() {
  return Number(localStorage.getItem("completedMissions")) || 0;
}

function getEquippedSuit() {
  return Number(localStorage.getItem("equippedSuit")) || 1;
}

function updateNovaSuit() {
  if (!novaImage || !novaSuitNumber || !novaSuitName || !novaSuitDescription || !selectSuit) {
    return;
  }

  const suit = novaSuits[currentSuit];
  const completed = getCompletedMissions();
  const unlocked = completed >= suit.required;
  const equipped = getEquippedSuit() === suit.id;

  novaImage.src = suit.image;
  novaSuitNumber.textContent = `SUIT ${String(suit.id).padStart(2, "0")} / 05`;
  novaSuitName.textContent = suit.name;

  novaSuitDescription.textContent = unlocked
    ? suit.description
    : `LOCKED // COMPLETE ${suit.required} MISSION${suit.required === 1 ? "" : "S"}`;

  novaImage.classList.toggle("suit-locked", !unlocked);

  if (!unlocked) {
    selectSuit.textContent = "LOCKED";
    selectSuit.disabled = true;
    selectSuit.classList.add("disabled");
    selectSuit.classList.remove("equipped");
  } else if (equipped) {
    selectSuit.textContent = "EQUIPPED ✓";
    selectSuit.disabled = true;
    selectSuit.classList.add("equipped");
    selectSuit.classList.remove("disabled");
  } else {
    selectSuit.textContent = "EQUIP SUIT";
    selectSuit.disabled = false;
    selectSuit.classList.remove("disabled", "equipped");
  }
}

if (suitLeft) {
  suitLeft.addEventListener("click", () => {
    currentSuit = currentSuit <= 0 ? novaSuits.length - 1 : currentSuit - 1;
    updateNovaSuit();
  });
}

if (suitRight) {
  suitRight.addEventListener("click", () => {
    currentSuit = currentSuit >= novaSuits.length - 1 ? 0 : currentSuit + 1;
    updateNovaSuit();
  });
}

if (selectSuit) {
  selectSuit.addEventListener("click", () => {
    const suit = novaSuits[currentSuit];
    const unlocked = getCompletedMissions() >= suit.required;

    if (!unlocked) return;

    localStorage.setItem("equippedSuit", suit.id);
    updateNovaSuit();
  });
}

// ----- Load the previously equipped suit on page load -----

const savedSuitIndex = novaSuits.findIndex(suit => suit.id === getEquippedSuit());

if (savedSuitIndex !== -1) {
  currentSuit = savedSuitIndex;
}

if (novaImage && novaSuitNumber && novaSuitName && novaSuitDescription && selectSuit) {
  updateNovaSuit();
}