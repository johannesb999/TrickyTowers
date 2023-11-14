import {
  GestureRecognizer,
  FilesetResolver,
  DrawingUtils,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3";

const demosSection = document.getElementById("demos");
let gestureRecognizer;
let runningMode = "IMAGE";
let enableWebcamButton;
let webcamRunning = false;

let currentMovement = "none"; // Mögliche Werte: 'left', 'right', 'none'
let currentGestureName = "none"; // Startwert auf 'none' gesetzt

const videoHeight = "480px";
const videoWidth = "640px";

// Before we can use HandLandmarker class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
const createGestureRecognizer = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: runningMode,
  });
  demosSection.classList.remove("invisible");
};
createGestureRecognizer();

/********************************************************************
  // Demo 1: Detect hand gestures in images
  ********************************************************************/

const imageContainers = document.getElementsByClassName("detectOnClick");

for (let i = 0; i < imageContainers.length; i++) {
  imageContainers[i].children[0].addEventListener("click", handleClick);
}

async function handleClick(event) {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }

  if (runningMode === "VIDEO") {
    runningMode = "IMAGE";
    await gestureRecognizer.setOptions({ runningMode: "IMAGE" });
  }
  // Remove all previous landmarks
  const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
  for (var i = allCanvas.length - 1; i >= 0; i--) {
    const n = allCanvas[i];
    n.parentNode.removeChild(n);
  }

  const results = gestureRecognizer.recognize(event.target);
  console.log(results);

  if (results.gestures.length > 0) {
    const p = event.target.parentNode.childNodes[3];
    p.setAttribute("class", "info");

    const categoryName = results.gestures[0][0].categoryName; //Geste!!!!!!!!!!!!!!
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;

    p.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore}%\n Handedness: ${handedness}`;
    p.style =
      "left: 0px;" +
      "top: " +
      event.target.height +
      "px; " +
      "width: " +
      (event.target.width - 10) +
      "px;";

    const canvas = document.createElement("canvas");
    canvas.setAttribute("class", "canvas");
    canvas.setAttribute("width", event.target.naturalWidth + "px");
    canvas.setAttribute("height", event.target.naturalHeight + "px");
    canvas.style =
      "left: 0px;" +
      "top: 0px;" +
      "width: " +
      event.target.width +
      "px;" +
      "height: " +
      event.target.height +
      "px;";

    event.target.parentNode.appendChild(canvas);
    const canvasCtx = canvas.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);
    for (const landmarks of results.landmarks) {
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#00FF00",
          lineWidth: 3,
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#FF0000",
        lineWidth: 1,
      });
    }
  } else {
  }
}

/********************************************************************
  // Demo 2: Continuously grab image from webcam stream and detect it.
  ********************************************************************/

const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");
const gestureOutput = document.getElementById("gesture_output");

// Check if webcam access is supported.
function hasGetUserMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
  enableWebcamButton = document.getElementById("webcamButton");
  enableWebcamButton.addEventListener("click", enableCam);
} else {
  console.warn("getUserMedia() is not supported by your browser");
}

// Enable the live webcam view and start detection.
function enableCam(event) {
  if (!gestureRecognizer) {
    alert("Please wait for gestureRecognizer to load");
    return;
  }

  if (webcamRunning === true) {
    webcamRunning = false;
    enableWebcamButton.innerText = "ENABLE PREDICTIONS";
  } else {
    webcamRunning = true;
    enableWebcamButton.innerText = "DISABLE PREDICTIONS";
  }

  // getUsermedia parameters.
  const constraints = {
    video: true,
  };

  // Activate the webcam stream.
  navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
    video.srcObject = stream;
    video.addEventListener("loadeddata", predictWebcam);
  });
}

let lastVideoTime = -1;
let results = undefined;
let lastAverageX = 0;
const threshold = 0.0; // Schwellenwert für Bewegungserkennung
async function predictWebcam() {
  const webcamElement = document.getElementById("webcam");
  // Now let's start detecting the stream.
  if (runningMode === "IMAGE") {
    runningMode = "VIDEO";
    await gestureRecognizer.setOptions({ runningMode: "VIDEO" });
  }
  let nowInMs = Date.now();
  if (video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    // Warten auf das Ergebnis der Handgestenerkennung
    results = await gestureRecognizer.recognizeForVideo(video, nowInMs);
  }

  canvasCtx.save();
  canvasCtx.scale(-1, 1); // Horizontal spiegeln
  canvasCtx.translate(-canvasElement.width, 0);
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  const drawingUtils = new DrawingUtils(canvasCtx);

  canvasElement.style.height = videoHeight;
  webcamElement.style.height = videoHeight;
  canvasElement.style.width = videoWidth;
  webcamElement.style.width = videoWidth;

  if (results.landmarks) {
    results.landmarks.forEach((landmarks) => {
      interpretGesture(landmarks);
      drawingUtils.drawConnectors(
        landmarks,
        GestureRecognizer.HAND_CONNECTIONS,
        {
          color: "#2ECCFA",
          lineWidth: 2,
        }
      );
      drawingUtils.drawLandmarks(landmarks, {
        color: "#0431B4",
        lineWidth: 1,
      });
    });
  }

  canvasCtx.restore();
  if (results.gestures.length > 0) {
    gestureOutput.style.display = "block";
    gestureOutput.style.width = videoWidth;
    const categoryName = results.gestures[0][0].categoryName;
    const categoryScore = parseFloat(
      results.gestures[0][0].score * 100
    ).toFixed(2);
    const handedness = results.handednesses[0][0].displayName;
    gestureOutput.innerText = `GestureRecognizer: ${categoryName}\n Confidence: ${categoryScore} %\n Handedness: ${handedness}`;
    currentGestureName = results.gestures[0][0].categoryName.toLowerCase();
    // console.log("Erkannte Geste:", currentGestureName);
  } else {
    gestureOutput.style.display = "none";
    currentGestureName = "none";
  }
  // Call this function again to keep predicting when the browser is ready.
  if (webcamRunning === true) {
    window.requestAnimationFrame(predictWebcam);
  }

  //////////////////// Interpretation ////////////////////////

  function interpretGesture(landmarks) {
    const sumX = landmarks.reduce((sum, landmark) => sum + landmark.x, 0);
    const averageX = sumX / landmarks.length;

    if (Math.abs(averageX - lastAverageX) > threshold) {
      if (averageX > lastAverageX) {
        currentMovement = "left";
      } else {
        currentMovement = "right";
      }
    } else {
      currentMovement = "none";
    }

    lastAverageX = averageX;
    console.log("Aktuelle Bewegung: ", currentMovement); // Zum Debuggen
  }
  handleGameLogic();
}
function handleGameLogic() {
  // Überprüfen der aktuellen Geste und Durchführen der entsprechenden Aktion
  switch (currentGestureName) {
    case "open_palm":
      openPalmAction();
      break;
    case "fist":
      fistAction();
      break;
    case "victory":
      victoryAction();
      break;
    // Weitere Gesten können hier hinzugefügt werden
    default:
      // Aktion für nicht erkannte oder keine Geste
      noGestureAction();
  }

  // Bewegungen handhaben
  if (currentMovement === "right") {
    moveBlockRight();
  } else if (currentMovement === "left") {
    moveBlockLeft();
  }
}

/* G  */

function openPalmAction() {
  // console.log("Open Palm Geste erkannt");
  // Fügen Sie hier Ihre Open Palm spezifische Logik ein
}

function fistAction() {
  // console.log("Fist Geste erkannt");
  // Fügen Sie hier Ihre Fist spezifische Logik ein
}

function victoryAction() {
  // console.log("Victory Geste erkannt");
  // Fügen Sie hier Ihre Victory spezifische Logik ein
}

function noGestureAction() {
  // console.log("Keine Geste erkannt");
  // Fügen Sie hier Ihre Logik für keine oder nicht spezifische Geste ein
}

/* Bewegungen  */

function moveBlockRight() {
  // console.log("Bewegt Block nach rechts");
  // Fügen Sie hier Ihre Logik ein, um den Block nach rechts zu bewegen
}

function moveBlockLeft() {
  // console.log("Bewegt Block nach links");
  // Fügen Sie hier Ihre Logik ein, um den Block nach links zu bewegen
}
