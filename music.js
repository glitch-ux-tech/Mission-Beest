// =========================================================
// MISSION BEEST
// CONTINUOUS MAIN MUSIC SYSTEM
// =========================================================
//
// Controls ONLY:
//
// main1.html
// briefing.html
// galaxymap.html
// achievements.html
//
// Music:
// new-worlds.mp3
//
// Intro music is NOT controlled here.
//
// The current music position is saved in sessionStorage
// and restored when moving between the main game pages.
// =========================================================


// =========================================================
// SETTINGS
// =========================================================

const MUSIC_KEY = "beestMusicTime";
const MUSIC_VOLUME = 0.28;


// =========================================================
// MUSIC ELEMENT
// =========================================================

const music =
    document.getElementById("pageMusic");


// =========================================================
// SAFETY CHECK
// =========================================================

if (!music) {

    console.log(
        "BEEST MUSIC: #pageMusic not found on this page."
    );

} else {

    console.log(
        "BEEST MUSIC SYSTEM INITIALIZED."
    );


    // =====================================================
    // BASIC SETTINGS
    // =====================================================

    music.volume =
        MUSIC_VOLUME;

    music.loop =
        true;


    // =====================================================
    // RESTORE MUSIC POSITION
    // =====================================================

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


        // ---------------------------------------------
        // IMPORTANT
        // Wait until audio metadata is loaded.
        // ---------------------------------------------

        if (
            !Number.isFinite(
                music.duration
            ) ||
            music.duration <= 0
        ) {

            return;

        }


        // Don't seek beyond the song.
        // A tiny margin prevents an invalid position.

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


    // =====================================================
    // WAIT FOR AUDIO TO LOAD
    // =====================================================

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


    // =====================================================
    // SAVE MUSIC POSITION
    // =====================================================

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


    // =====================================================
    // START MUSIC
    // =====================================================

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


    // =====================================================
    // REMOVE FALLBACK LISTENERS
    // =====================================================

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


    // =====================================================
    // TRY AUTOPLAY
    // =====================================================

    playMusic();


    // =====================================================
    // BROWSER AUTOPLAY FALLBACK
    // =====================================================

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


    // =====================================================
    // SAVE EVERY 500ms
    // =====================================================

    setInterval(
        saveMusicPosition,
        500
    );


    // =====================================================
    // SAVE BEFORE LEAVING
    // =====================================================

    window.addEventListener(
        "beforeunload",
        saveMusicPosition
    );


    // =====================================================
    // SAVE WHEN PAGE BECOMES HIDDEN
    // =====================================================

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