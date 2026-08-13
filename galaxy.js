
const backToMain =
    document.getElementById("backToMain");


if (backToMain) {

    backToMain.addEventListener(
        "click",
        () => {

           

            window.location.href =
                "main1.html?skipIntro=true";

        }
    );

}




const mercuryCard =
    document.getElementById("mercuryCard");


if (mercuryCard) {

    mercuryCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "mercury.html";

        }
    );

}