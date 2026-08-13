

const MUSIC_KEY = "beestMusicTime";
const MUSIC_VOLUME = 0.28;




const music =
    document.getElementById("pageMusic");




if (!music) {

    console.log(
        "BEEST MUSIC: #pageMusic not found on this page."
    );

} else {

    console.log(
        "BEEST MUSIC SYSTEM INITIALIZED."
    );




    music.volume =
        MUSIC_VOLUME;

    music.loop =
        true;


    function restoreMusicPosition() {

        const savedTime =
            sessionStorage.getItem(
                MUSIC_KEY
            );


        if (
            savedTime === null
        ) {

            console.log(
                "BEEST MUSIC: No saved position."
            );

            return;

        }


        const time =
            Number(savedTime);


        if (
            !Number.isFinite(time) ||
            time < 0
        ) {

            return;

        }




        if (
            !Number.isFinite(
                music.duration
            ) ||
            music.duration <= 0
        ) {

            return;

        }


     
        const safeTime =
            Math.min(
                time,
                Math.max(
                    0,
                    music.duration - 0.1
                )
            );


        music.currentTime =
            safeTime;


        console.log(
            "BEEST MUSIC RESUMED FROM:",
            safeTime
        );

    }



    if (
        music.readyState >= 1
    ) {

        restoreMusicPosition();

    } else {

        music.addEventListener(
            "loadedmetadata",
            restoreMusicPosition,
            {
                once: true
            }
        );

    }


    function saveMusicPosition() {

        if (
            !music.paused &&
            !music.ended &&
            Number.isFinite(
                music.currentTime
            )
        ) {

            sessionStorage.setItem(
                MUSIC_KEY,
                music.currentTime.toString()
            );

        }

    }



    function playMusic() {

        music.play()
            .then(
                () => {

                    console.log(
                        "BEEST MUSIC PLAYING:",
                        music.currentTime
                    );


                    removeStartListeners();

                }
            )
            .catch(
                () => {

                    console.log(
                        "BEEST MUSIC: Waiting for user interaction..."
                    );

                }
            );

    }


    function removeStartListeners() {

        document.removeEventListener(
            "click",
            playMusic
        );

        document.removeEventListener(
            "pointerdown",
            playMusic
        );

        document.removeEventListener(
            "keydown",
            playMusic
        );

    }




    playMusic();


    

    document.addEventListener(
        "click",
        playMusic
    );

    document.addEventListener(
        "pointerdown",
        playMusic
    );

    document.addEventListener(
        "keydown",
        playMusic
    );



    setInterval(
        saveMusicPosition,
        500
    );




    window.addEventListener(
        "beforeunload",
        saveMusicPosition
    );



    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.visibilityState ===
                "hidden"
            ) {

                saveMusicPosition();

            }

        }
    );

}
