

const achievementCards = document.querySelectorAll(".achievement-card");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const suitProgress = document.getElementById("suitProgress");
const backButton = document.getElementById("backToMission");

function getCompletedMissions() {
  return Number(localStorage.getItem("completedMissions")) || 0;
}

function unlockAchievement(card) {
  card.classList.remove("locked");
  card.classList.add("unlocked");

  const status = card.querySelector(".unlock-status");
  if (status) status.textContent = "✓ MISSION COMPLETE";
}

function lockAchievement(card) {
  card.classList.remove("unlocked");
  card.classList.add("locked");

  const status = card.querySelector(".unlock-status");
  if (status) status.textContent = "🔒 CLASSIFIED";
}

function updateAchievements() {
  const completed = Math.min(getCompletedMissions(), 4);

  if (progressText) progressText.textContent = `${completed} / 4`;
  if (progressFill) progressFill.style.width = `${(completed / 4) * 100}%`;

  // Explorer suit is unlocked by default; each completed mission adds one more.
  if (suitProgress) suitProgress.textContent = `${completed + 1} / 5`;

  achievementCards.forEach((card) => {
    const required = Number(card.dataset.required);
    completed >= required ? unlockAchievement(card) : lockAchievement(card);
  });
}

if (backButton) {
  backButton.addEventListener("click", () => {
    window.location.href = "./main1.html?skipIntro=true";
  });
}

updateAchievements();