// Class for timers
class ResetableTimer {
  timeoutID: ReturnType<typeof setTimeout> | number;
  remind(func: Function) {
    func();
    this.timeoutID = undefined;
  }
  /* Start timer */
  setup(func, time) {
    if (typeof this.timeoutID === "number") {
      this.cancel();
    }
    this.timeoutID = setTimeout(
      function () {
        this.remind(func);
      }.bind(this),
      time
    );
  }
  /* Cancel timer */
  cancel() {
    clearTimeout(this.timeoutID);
  }
}

/* We need to keep track of the player */
let isPlayer: boolean = getIsPlayer();

/* We use react-mount as parent */
function getReactMountElement(): HTMLElement {
  return document.getElementById("react-mount");
}

/* We see if current child is player */
function getChildNodeName(): string {
  return getReactMountElement()?.children[0].className.toString();
}

/* If player exists, isPlayer = true */
function getIsPlayer(): boolean {
  return getChildNodeName().includes("Player");
}

/* Options for the observer (which mutations to observe) */
const reactMountConfig = { attributes: false, childList: true, subtree: false };
/* Callback function to execute when mutations are observed */
const reactMountCallback = function (mutationsList) {
  /* Check when leave player */
  for (const mutation of mutationsList) {
    const mutationClass = mutation["addedNodes"][0];
    if (mutationClass) {
      if (mutationClass.className.includes("Player")) {
        isPlayer = true;
        observeScene(true);
      } else {
        isPlayer = false;
        observeScene(false);
      }
    }
  }
};

/* Create an observer instance linked to the callback function */
const reactMountObserver = new MutationObserver(reactMountCallback);
/* Start observing the target node for configured mutations */
const reactMountElement = getReactMountElement();
reactMountObserver.observe(reactMountElement, reactMountConfig);

/* Options for the observer (which mutations to observe) */
const sceneConfig = { attributes: true, childList: false, subtree: false };
/* Callback function to execute when mutations are observed */
const sceneCallback = function (mutationsList) {
  /* Check when UI hides/is shown */
  for (const mutation of mutationsList) {
    const mutationClassName = mutation["target"]["className"];
    const sceneElement: HTMLElement = document.querySelector(".scene");
    if (mutationClassName === "scene hide") {
      /* If UI hides, we hide mouse */
      sceneElement.style.cursor = "none";
      continue;
    }
    /* If UI is shown, we show mouse */
    sceneElement.style.cursor = "auto";
  }
};

/* Create an observer instance linked to the callback function */
const sceneObserver = new MutationObserver(sceneCallback);
/* Start observing the target node for configured mutations */
if (isPlayer) {
  observeScene(true);
}

function observeScene(canObserve: boolean) {
  canObserve
    ? sceneObserver.observe(document.querySelector(".scene"), sceneConfig)
    : sceneObserver.disconnect();
}

/* Viaplay's player injects the controls as DOM elements when mouse moves so we need to trigger that */
const showUI = (): void => {
  document
    .querySelector(".scene")
    .dispatchEvent(new Event("mousemove", { bubbles: true }));
};

/* Event to open audio slider */
const showAudioSlider = (): void => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseover", { bubbles: true }));
};

/* Event to close audio slider */
const hideAudioSlider = (): void => {
  document
    .querySelector(".audio-control")
    .dispatchEvent(new Event("mouseout", { bubbles: true }));
};

/* Event to open subtitle selection */
const showSubtitles = (): void => {
  document
    .querySelector("button.language.subtitlesAvailable")
    .dispatchEvent(new Event("mouseover", { bubbles: true }));
};

/* Event to close subtitle selection */
const hideSubtitles = (): void => {
  document
    .querySelector("button.language.subtitlesAvailable")
    .dispatchEvent(new Event("mouseout", { bubbles: true }));
};

/* Listen to user double-clicking */
document.addEventListener("dblclick", function (event) {
  if (!isPlayer) return;
  showUI();
  /* We ignore double-clicks on player controls */
  const ignoreClickOnMeElement = document.querySelector(".playback-controls");
  const isClickInsideElement = ignoreClickOnMeElement.contains(
    event.target as Node
  );
  if (isClickInsideElement) return;
  /* We trigger the f (fullscreen) button */
  document.dispatchEvent(new KeyboardEvent("keyup", { key: "f" }));
});

/* Dynamic timer */
const volumeCycleTimer = new ResetableTimer();

/* Listen to user pressing a button on the keyboard */
document.addEventListener("keyup", (event) => {
  event.preventDefault();
  if (!isPlayer) return;
  switch (event.key) {
    /* If it's m, we want to mute/unmute */
    case "m": {
      showUI();
      const muteButton: HTMLElement = document.querySelector(".audio-control");
      muteButton?.click();
      setTimeout(() => {
        const playButton: HTMLElement = document.querySelector(".play");
        playButton?.click();
      }, 10);
      break;
    }
    /* If it's f, we want to toggle fullscreen */
    case "f": {
      showUI();
      const toggleFullscreen: HTMLElement =
        document.querySelector(".fullscreen") ??
        document.querySelector(".no-fullscreen");
      toggleFullscreen?.click();
      setTimeout(() => {
        const playButton: HTMLElement = document.querySelector(".play");
        playButton?.click();
      }, 10);
      break;
    }
    /* If it's s, we want to skip intro/recap */
    case "s": {
      const skipPreliminariesButton: HTMLElement = document.querySelector(
        ".skip-preliminaries-button"
      );
      skipPreliminariesButton?.click();
      break;
    }
    /* If it's n, we want to start next episode */
    case "n": {
      const nextEpisodeButton: HTMLElement = document.querySelector(
        ".Buttons-primary-3n82B"
      );
      nextEpisodeButton?.click();
      break;
    }
    case "t":
      /* If button was not held */
      if (holdTimer <= 1) {
        /* Cycle subtitles */
        volumeCycleTimer.cancel();
        changeSubtitles(false);
        volumeCycleTimer.setup(hideSubtitles, 2000);
      }
      /* Reset hold timer */
      holdTimer = 0;
  }
});

/* Function to change volume */
function changeVolume(changeAmount: number): void {
  const videoElement: HTMLVideoElement = document.querySelector("video");
  try {
    volumeCycleTimer.cancel();
    showUI();
    showAudioSlider();
    /* Make sure audio stays within 0 and 1 */
    const newVolume = Math.min(
      Math.max(videoElement.volume + changeAmount, 0),
      1
    );
    /* We change the volume */
    videoElement.volume = newVolume;
    volumeCycleTimer.setup(hideAudioSlider, 2000);
  } catch (e) {
    console.error(e);
  }
}

/* Listen to user pressing/holding down a button on the keyboard */
document.addEventListener("keydown", (event) => {
  if (!isPlayer) return;
  switch (event.key) {
    case "ArrowUp":
      changeVolume(0.1);
      break;
    case "ArrowDown":
      changeVolume(-0.1);
      break;
    case "t":
      // When holdtimer was 2 seconds
      if (holdTimer == 2) {
        subtitleCycleTimer.cancel();
        changeSubtitles(true);
        subtitleCycleTimer.setup(hideSubtitles, 2000);
      }
      holdTimer++;
  }
});

/* Tracks time button held down */
let holdTimer = 0;
/* Tracks selected subtitle */
let currentSubtitle = 0;
/* Dynamic timer */
const subtitleCycleTimer = new ResetableTimer();

/* Cycle if toggle false */
function changeSubtitles(toggle) {
  showUI();
  showSubtitles();
  /* We find the subtitles */
  const subtitles: HTMLElement[] = Array.from(
    document.querySelector("div.subtitle-languages")?.children[1]
      ?.children as HTMLCollectionOf<HTMLElement>
  );
  const numberOfSubtitles = subtitles.length;
  if (numberOfSubtitles <= 1) return;
  if (currentSubtitle >= numberOfSubtitles) {
    subtitles[0].click();
    currentSubtitle = 0;
    return;
  }
  const subtitlesOn = !subtitles[numberOfSubtitles - 1].className;
  /* If subtitles off, go to previous */
  if (!subtitlesOn) {
    /* Turn on subtitles to previous */
    subtitles[currentSubtitle].click();
    return;
  }
  if (toggle) {
    /* Turn off subtitles */
    subtitles[numberOfSubtitles - 1].click();
    return;
  }
  /* Cycle to next subtitles */
  if (currentSubtitle < numberOfSubtitles - 2) {
    subtitles[currentSubtitle + 1].click();
    currentSubtitle++;
    return;
  }
  /* Reset subtitles cycle */
  subtitles[0].click();
  currentSubtitle = 0;
}
