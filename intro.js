

const params = new URLSearchParams(window.location.search);
const skipIntro = params.get("skipIntro") === "true";

const introMission = document.getElementById("introMission");
const intro = document.getElementById("intro");
const website = document.getElementById("website");
const canvas = document.getElementById("warpCanvas");
const emberContainer = document.getElementById("ember");
const quote = document.getElementById("quote");

// Returning from the Galaxy Map skips the intro entirely.
if (skipIntro) {

  if (intro) {
    intro.style.display = "none";
    intro.style.opacity = "0";
    intro.style.visibility = "hidden";
  }

  if (website) {
    website.style.display = "block";
    website.style.opacity = "1";
    website.style.visibility = "visible";
  }

  window.addEventListener("load", () => {
    const openGalaxy = document.getElementById("openGalaxy");
    if (openGalaxy) {
      openGalaxy.style.display = "";
      openGalaxy.style.visibility = "visible";
      openGalaxy.style.opacity = "1";
    }
  });

} else {

  function createEmber() {
    if (!emberContainer) return;

    const ember = document.createElement("div");
    ember.className = "ember";

    const size = Math.random() * 3 + 1;
    ember.style.width = size + "px";
    ember.style.height = size + "px";
    ember.style.left = Math.random() * window.innerWidth + "px";

    const duration = Math.random() * 5 + 5;
    ember.style.animationDuration = duration + "s";

    emberContainer.appendChild(ember);
    setTimeout(() => ember.remove(), duration * 1000);
  }

  setInterval(createEmber, 120);

  if (canvas) {
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    const stars = [];
    for (let i = 0; i < 180; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 1.8 + Math.random() * 2.5,
        size: Math.random() * 2 + 1,
        length: 0
      });
    }

    let acceleration = 0.15;
    let warp = false;

    setTimeout(() => { warp = true; }, 2200);

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (warp) {
        acceleration = Math.min(acceleration + 0.04, 5);
      }

      stars.forEach(star => {
        star.y -= star.speed * acceleration;

        if (!warp) {
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          star.length = star.speed * acceleration * 5;
          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.lineWidth = star.size;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x, star.y + star.length);
          ctx.stroke();
        }

        if (star.y < -50) {
          star.y = canvas.height + Math.random() * 300;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    }

    setTimeout(animate, 800);
  }

  if (quote) {
    setTimeout(() => {
      quote.style.opacity = "1";
      quote.classList.add("floating");
    }, 5500);

    setTimeout(() => {
      quote.style.opacity = "0";
    }, 8500);
  }

  const glow = document.querySelector(".introGlow");
  if (glow) {
    setTimeout(() => glow.classList.add("breathing"), 6500);
  }

  if (introMission) {
    setTimeout(() => {
      introMission.classList.add("shake");
      setTimeout(() => introMission.classList.remove("shake"), 550);
    }, 6500);
  }

  // Wrap up the intro and reveal the site
  setTimeout(() => {
    if (intro) intro.style.opacity = "0";

    if (website) {
      website.style.transition = "opacity 2s ease";
      website.style.opacity = "1";
      website.style.display = "block";
      website.style.visibility = "visible";
    }

    setTimeout(() => {
      if (intro) intro.style.display = "none";
    }, 2000);

  }, 10000);
}