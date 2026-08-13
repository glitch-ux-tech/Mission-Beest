const startMission = document.getElementById("startMission");

startMission.addEventListener("click", () => {
    startMission.textContent = "MISSION LAUNCHING...";
    startMission.disabled = true;

    setTimeout(() => {
        window.location.href = "mercury-mission.html";
    }, 1200);
});

