


const canvas = document.getElementById("mercuryGame");
const ctx = canvas.getContext("2d");

const missionIntro =
    document.getElementById("missionIntro");

const introMessage =
    document.getElementById("introMessage");

const restartMission =
    document.getElementById("restartMission");

const backGalaxy =
    document.getElementById("backGalaxy");

const signalStatus =
    document.getElementById("signalStatus");

const healthDisplay =
    document.getElementById("health");

const returnGalaxy =
    document.getElementById("returnGalaxy");

const missionComplete =
    document.getElementById("missionComplete");


function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);


const novaSuitImages = {

    1: "assets/nova-default.png",
    2: "assets/nova-mercury.png",
    3: "assets/nova-venus.png",
    4: "assets/nova-mars.png",
    5: "assets/nova-unknown.png"

};


const defaultNovaImage =
    "assets/nova-default.png";

let equippedSuit =
    Number(
        localStorage.getItem("equippedSuit")
    ) || 1;


if (
    equippedSuit < 1 ||
    equippedSuit > 5
) {

    equippedSuit = 1;
}



const novaSprite =
    new Image();

let spriteLoaded = false;



const selectedNovaImage =
    novaSuitImages[equippedSuit] ||
    defaultNovaImage;



novaSprite.onload = () => {

    spriteLoaded = true;
};

novaSprite.onerror = () => {


    if (
        novaSprite.src.endsWith(
            defaultNovaImage
        )
    ) {

        console.error(
            "Nova default image could not be loaded:",
            defaultNovaImage
        );

        return;
    }

    console.warn(
        "Selected Nova suit could not be loaded. Falling back to nova-default.png."
    );

    spriteLoaded = false;

    novaSprite.src =
        defaultNovaImage;
};

novaSprite.src =
    selectedNovaImage;


const nova = {

    x: 100,
    y: 300,

   
    width: 48,
    height: 112,

    
    spriteWidth: 88,
    spriteHeight: 132,

    velocityX: 0,
    velocityY: 0,

    speed: 4,

    
    jumpPower: 12,

    grounded: false,

    health: 3,

    facing: 1,



    walking: false,

    walkFrame: 0,

    walkTimer: 0,

    walkSpeed: 6

};


const world = {

    width: 3200,

    ground: 430

};

let cameraX = 0;



const keys = {};


window.addEventListener(
    "keydown",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = true;

        if (
            event.code === "Space"
        ) {

            keys.space = true;

            event.preventDefault();
        }

    }
);


window.addEventListener(
    "keyup",
    (event) => {

        keys[
            event.key.toLowerCase()
        ] = false;

        if (
            event.code === "Space"
        ) {

            keys.space = false;
        }

    }
);



const signal = {

    x: 2550,

    y: 370,

    width: 35,

    height: 60,

    collected: false

};



const extraction = {

    x: 2950,

    y: 330,

    width: 100,

    height: 100

};



const hazards = [

    {
        x: 700,
        y: 400,
        width: 55,
        height: 30
    },

    {
        x: 1250,
        y: 390,
        width: 80,
        height: 40
    },

    {
        x: 1850,
        y: 400,
        width: 60,
        height: 30
    },

    {
        x: 2200,
        y: 380,
        width: 90,
        height: 50
    }

];



const messages = [

    "Nova... if you can hear me, your transmission system is still working.",

    "The surface ahead is unstable. Watch your footing.",

    "I hope you find the thing you're looking for... no matter what, I will help you through your journey."

];

let messageIndex = 0;

let contextFinished = false;



let missionCompleted = false;


if (introMessage) {

    introMessage.textContent =
        messages[messageIndex];

}



if (missionIntro) {

    missionIntro.addEventListener(
        "click",
        () => {

            messageIndex++;

           

            if (
                messageIndex <
                messages.length
            ) {

                introMessage.textContent =
                    messages[messageIndex];

                return;
            }


            contextFinished =
                true;

            missionIntro.style.opacity =
                "0";

            setTimeout(
                () => {

                    missionIntro.style.display =
                        "none";

                    const gameSection =
                        document.getElementById(
                            "gameSection"
                        );

                    if (gameSection) {

                        gameSection.classList.add(
                            "active"
                        );
                    }

                },
                600
            );

        }
    );

}



function collision(a, b) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}



function updateHealth() {

    if (!healthDisplay) {
        return;
    }

    healthDisplay.textContent =

        "♥".repeat(
            nova.health
        )

        +

        "♡".repeat(
            3 - nova.health
        );

}


function resetPlayer() {

    nova.x = 100;

    nova.y = 300;

    nova.velocityX = 0;

    nova.velocityY = 0;

    nova.health = 3;

    nova.grounded = false;

    nova.facing = 1;

    nova.walkFrame = 0;

    nova.walkTimer = 0;

    nova.walking = false;

    updateHealth();

}



function updateWalkingAnimation() {

    const moving =
        nova.velocityX !== 0 &&
        nova.grounded;

    nova.walking =
        moving;

   
    if (!moving) {

        nova.walkFrame = 0;

        nova.walkTimer = 0;

        return;
    }

    nova.walkTimer++;

    if (
        nova.walkTimer >=
        nova.walkSpeed
    ) {

        nova.walkTimer = 0;

        nova.walkFrame++;

        if (
            nova.walkFrame > 3
        ) {

            nova.walkFrame = 0;
        }
    }

}



function updatePlayer() {

   

    if (!contextFinished) {

        return;
    }


    nova.velocityX = 0;


    if (
        keys["a"] ||
        keys["arrowleft"]
    ) {

        nova.velocityX =
            -nova.speed;

        nova.facing = -1;
    }

    

    if (
        keys["d"] ||
        keys["arrowright"]
    ) {

        nova.velocityX =
            nova.speed;

        nova.facing = 1;
    }


    if (
        keys.space &&
        nova.grounded
    ) {

        nova.velocityY =
            -nova.jumpPower;

        nova.grounded =
            false;
    }



    nova.velocityY +=
        0.55;

   

    nova.x +=
        nova.velocityX;

    nova.y +=
        nova.velocityY;


    if (
        nova.y +
        nova.height >=
        world.ground
    ) {

        nova.y =
            world.ground -
            nova.height;

        nova.velocityY = 0;

        nova.grounded =
            true;
    }



    if (
        nova.x < 0
    ) {

        nova.x = 0;
    }

    if (
        nova.x >
        world.width -
        nova.width
    ) {

        nova.x =
            world.width -
            nova.width;
    }

   

    updateWalkingAnimation();

    

    for (
        const hazard of hazards
    ) {

        if (
            collision(
                nova,
                hazard
            )
        ) {

            nova.health--;

            nova.x -=
                nova.facing * 50;

            updateHealth();

            if (
                nova.health <= 0
            ) {

                resetPlayer();
            }
        }
    }

 

    if (
        !signal.collected &&
        collision(
            nova,
            signal
        )
    ) {

        signal.collected =
            true;

        if (signalStatus) {

            signalStatus.textContent =
                "RECOVERED";

            signalStatus.style.color =
                "#22c55e";
        }

        const signalMessage =
            document.getElementById(
                "transmissionText"
            );

        if (signalMessage) {

            signalMessage.textContent =
                "Nova... you found it. But this signal isn't coming from Mercury.";
        }
    }


    if (
        signal.collected &&
        collision(
            nova,
            extraction
        )
    ) {

        completeMission();
    }


    cameraX =
        nova.x -
        canvas.width / 2;

    cameraX =
        Math.max(
            0,
            Math.min(
                cameraX,
                world.width -
                canvas.width
            )
        );

}



function drawBackground() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(
        0,
        "#090414"
    );

    gradient.addColorStop(
        0.55,
        "#21101a"
    );

    gradient.addColorStop(
        1,
        "#451a0b"
    );

    ctx.fillStyle =
        gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    for (
        let x =
            -cameraX % 90;

        x <
        canvas.width;

        x += 90
    ) {

        for (
            let y = 30;

            y < 300;

            y += 70
        ) {

            ctx.fillStyle =
                "rgba(255,255,255,.45)";

            ctx.fillRect(
                x,
                y,
                2,
                2
            );
        }
    }

   

    ctx.fillStyle =
        "#24121a";

    ctx.beginPath();

    ctx.moveTo(
        0,
        380
    );

    for (
        let x = 0;

        x <= canvas.width;

        x += 120
    ) {

        const height =
            40 +
            Math.sin(
                (x + cameraX) *
                0.008
            ) * 35;

        ctx.lineTo(
            x,
            380 - height
        );
    }

    ctx.lineTo(
        canvas.width,
        430
    );

    ctx.lineTo(
        0,
        430
    );

    ctx.fill();

}



function drawGround() {

    ctx.fillStyle =
        "#321710";

    ctx.fillRect(
        0,
        world.ground,
        canvas.width,
        canvas.height -
        world.ground
    );



    for (
        let x =
            -cameraX % 45;

        x < canvas.width;

        x += 45
    ) {

        ctx.fillStyle =
            "#522315";

        ctx.fillRect(
            x,
            world.ground + 15,
            25,
            5
        );

        ctx.fillStyle =
            "#24100d";

        ctx.fillRect(
            x + 12,
            world.ground + 40,
            8,
            4
        );
    }

}




function drawNova() {

    if (!spriteLoaded) {
        return;
    }

    const drawX =
        nova.x -
        cameraX -
        20;

    const drawY =
        nova.y -
        10;

    const w =
        nova.spriteWidth;

    const h =
        nova.spriteHeight;

    ctx.save();

  
    if (
        nova.facing === -1
    ) {

        ctx.translate(
            drawX + w,
            0
        );

        ctx.scale(
            -1,
            1
        );

        ctx.translate(
            -drawX,
            0
        );
    }

 

    let leftLegAngle = 0;

    let rightLegAngle = 0;

    if (
        nova.walking
    ) {

        const legAngles = [

            -0.10,
             0.06,
             0.12,
            -0.06

        ];

        leftLegAngle =
            legAngles[
                nova.walkFrame
            ];

        rightLegAngle =
            -legAngles[
                nova.walkFrame
            ];
    }

  

    ctx.save();

    ctx.beginPath();

    ctx.rect(
        drawX,
        drawY,
        w,
        h * 0.62
    );

    ctx.clip();

    ctx.drawImage(
        novaSprite,
        0,
        0,
        novaSprite.naturalWidth,
        novaSprite.naturalHeight,
        drawX,
        drawY,
        w,
        h
    );

    ctx.restore();

 

    ctx.save();

    const leftHipX =
        drawX +
        w * 0.42;

    const leftHipY =
        drawY +
        h * 0.58;

    ctx.translate(
        leftHipX,
        leftHipY
    );

    ctx.rotate(
        leftLegAngle
    );

    ctx.translate(
        -leftHipX,
        -leftHipY
    );

    

    ctx.beginPath();

    ctx.moveTo(
        drawX + w * 0.15,
        drawY + h * 0.52
    );

    ctx.lineTo(
        drawX + w * 0.53,
        drawY + h * 0.52
    );

    ctx.lineTo(
        drawX + w * 0.52,
        drawY + h
    );

    ctx.lineTo(
        drawX + w * 0.12,
        drawY + h
    );

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(
        novaSprite,
        0,
        0,
        novaSprite.naturalWidth,
        novaSprite.naturalHeight,
        drawX,
        drawY,
        w,
        h
    );

    ctx.restore();


    ctx.save();

    const rightHipX =
        drawX +
        w * 0.62;

    const rightHipY =
        drawY +
        h * 0.58;

    ctx.translate(
        rightHipX,
        rightHipY
    );

    ctx.rotate(
        rightLegAngle
    );

    ctx.translate(
        -rightHipX,
        -rightHipY
    );

   

    ctx.beginPath();

    ctx.moveTo(
        drawX + w * 0.47,
        drawY + h * 0.52
    );

    ctx.lineTo(
        drawX + w * 0.88,
        drawY + h * 0.52
    );

    ctx.lineTo(
        drawX + w * 0.90,
        drawY + h
    );

    ctx.lineTo(
        drawX + w * 0.44,
        drawY + h
    );

    ctx.closePath();

    ctx.clip();

    ctx.drawImage(
        novaSprite,
        0,
        0,
        novaSprite.naturalWidth,
        novaSprite.naturalHeight,
        drawX,
        drawY,
        w,
        h
    );

    ctx.restore();

    ctx.restore();

}



function drawHazards() {

    for (
        const hazard of hazards
    ) {

        const x =
            hazard.x -
            cameraX;

        ctx.fillStyle =
            "#170b0a";

        ctx.fillRect(
            x,
            hazard.y,
            hazard.width,
            hazard.height
        );

        ctx.fillStyle =
            "#ff6b35";

        for (
            let i = 0;

            i < hazard.width;

            i += 12
        ) {

            ctx.fillRect(
                x + i,
                hazard.y - 5,
                7,
                5
            );
        }
    }

}


function drawSignal() {

    if (
        signal.collected
    ) {

        return;
    }

    const x =
        signal.x -
        cameraX;

    const pulse =
        Math.sin(
            Date.now() *
            0.006
        ) * 5;

    ctx.save();

    ctx.shadowBlur =
        25;

    ctx.shadowColor =
        "#22d3ee";

    ctx.fillStyle =
        "#22d3ee";

    ctx.fillRect(
        x,
        signal.y - pulse,
        35,
        60
    );

    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        x + 8,
        signal.y +
        12 -
        pulse,
        19,
        4
    );

    ctx.fillRect(
        x + 8,
        signal.y +
        25 -
        pulse,
        19,
        4
    );

    ctx.restore();

}


function drawExtraction() {

    const x =
        extraction.x -
        cameraX;

    ctx.strokeStyle =
        "#22c55e";

    ctx.lineWidth =
        3;

    ctx.strokeRect(
        x,
        extraction.y,
        extraction.width,
        extraction.height
    );

    ctx.fillStyle =
        "rgba(34,197,94,.08)";

    ctx.fillRect(
        x,
        extraction.y,
        extraction.width,
        extraction.height
    );

    ctx.fillStyle =
        "#22c55e";

    ctx.font =
        "12px Share Tech Mono";

    ctx.textAlign =
        "center";

    ctx.fillText(
        "EXTRACT",
        x + 50,
        extraction.y + 55
    );

}


function draw() {

    drawBackground();

    drawGround();

    drawHazards();

    drawSignal();

    drawExtraction();

    drawNova();

}



function completeMission() {

    if (missionCompleted) {
        return;
    }

    missionCompleted = true;



    localStorage.setItem(
        "mercuryComplete",
        "true"
    );

    
    let completedTasks =
        Number(
            localStorage.getItem(
                "completedTasks"
            )
        ) || 0;

    if (
        localStorage.getItem(
            "mercuryTaskCounted"
        ) !== "true"
    ) {

        completedTasks++;

        localStorage.setItem(
            "mercuryTaskCounted",
            "true"
        );
    }

    localStorage.setItem(
        "completedTasks",
        completedTasks
    );

    

    let completedMissions =
        Number(
            localStorage.getItem(
                "completedMissions"
            )
        ) || 0;

   
    if (
        localStorage.getItem(
            "mercuryMissionCounted"
        ) !== "true"
    ) {

        completedMissions++;

  
        completedMissions =
            Math.min(
                completedMissions,
                4
            );

        localStorage.setItem(
            "mercuryMissionCounted",
            "true"
        );
    }

    localStorage.setItem(
        "completedMissions",
        completedMissions
    );

    

    console.log(
        "MERCURY MISSION COMPLETE"
    );

    console.log(
        `Completed Missions: ${completedMissions} / 4`
    );

    console.log(
        "Mercury Suit: UNLOCKED"
    );

  
    if (missionComplete) {

        missionComplete.classList.add(
            "show"
        );
    }
}



if (
    returnGalaxy
) {

    returnGalaxy.addEventListener(
        "click",
        () => {

            window.location.href =
                "galaxy.html";

        }
    );

}


if (
    restartMission
) {

    restartMission.addEventListener(
        "click",
        () => {

      

            nova.x = 100;

            nova.y = 300;

            nova.velocityX = 0;

            nova.velocityY = 0;

            nova.health = 3;

            nova.grounded =
                false;

            nova.facing = 1;

            nova.walkFrame = 0;

            nova.walkTimer = 0;

            nova.walking = false;


            signal.collected =
                false;

            

            missionCompleted =
                false;

         

            cameraX = 0;

   

            messageIndex = 0;

            contextFinished =
                false;

            if (
                introMessage
            ) {

                introMessage.textContent =
                    messages[0];
            }

     

            updateHealth();

            if (
                signalStatus
            ) {

                signalStatus.textContent =
                    "SEARCHING";

                signalStatus.style.color =
                    "";
            }


            if (
                missionComplete
            ) {

                missionComplete.classList.remove(
                    "show"
                );
            }


            if (
                missionIntro
            ) {

                missionIntro.style.display =
                    "flex";

                missionIntro.style.opacity =
                    "1";
            }

        }
    );

}



if (
    backGalaxy
) {

    backGalaxy.addEventListener(
        "click",
        () => {

            window.location.href =
                "galaxy.html";

        }
    );

}



updateHealth();



function gameLoop() {

    updatePlayer();

    draw();

    requestAnimationFrame(
        gameLoop
    );

}

gameLoop();