const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear");
const infoButton = document.querySelector("#infoButton");

let SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition,
  recognition,
  recording = false;

function populateLanguages() {
  languages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang.code;
    option.innerHTML = lang.name;
    inputLanguage.appendChild(option);
  });
}

populateLanguages();

function speechToText() {
  try {
    // getUserMedia를 호출하여 마이크 접근 권한 요청
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // 성공적으로 권한을 얻은 경우
        recognition = new SpeechRecognition();
        recognition.lang = inputLanguage.value;
        recognition.interimResults = true;
        recordBtn.classList.add("recording");
        recordBtn.querySelector("p").innerHTML = "Listening...";
        recognition.start();

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          //detect when intrim results
          if (event.results[0].isFinal) {
            result.innerHTML += " " + speechResult;
            result.querySelector("p").remove();
          } else {
            //creative p with class interim if not already there
            if (!document.querySelector(".interim")) {
              const interim = document.createElement("p");
              interim.classList.add("interim");
              result.appendChild(interim);
            }
            //update the interim p with the speech result
            document.querySelector(".interim").innerHTML = " " + speechResult;
          }
          downloadBtn.disabled = false;
        };

        recognition.onspeechend = () => {
          speechToText();
        };

        recognition.onerror = (event) => {
          stopRecording();
          if (event.error === "no-speech") {
            alert("No speech was detected. Stopping...");
          } else if (event.error === "audio-capture") {
            alert(
              "No microphone was found. Ensure that a microphone is installed."
            );
          } else if (event.error === "not-allowed") {
            alert("Permission to use microphone is blocked.");
          } else if (event.error === "aborted") {
            alert("Listening Stopped.");
          } else {
            alert("Error occurred in recognition: " + event.error);
          }
        };
      })
      .catch((error) => {
        // Microphone access denied or error
        recording = false;
        stopRecording();
        console.error("Microphone access error:", error);
        if (error.name === "NotAllowedError") {
          alert("Microphone access permission denied. Please allow permission.");
        } else if (error.name === "NotFoundError") {
          alert("Microphone not found. Please check connection.");
        } else {
          alert("Error occurred during microphone access.");
        }
      });
  } catch (error) {
    recording = false;

    console.log(error);
  }
}

recordBtn.addEventListener("click", () => {
  if (!recording) {
    speechToText();
    recording = true;
  } else {
    stopRecording();
  }
});

function stopRecording() {
  if (recognition) {
    recognition.stop();
  }
  recordBtn.querySelector("p").innerHTML = "Start Listening";
  recordBtn.classList.remove("recording");
  recording = false;
}

function download() {
  const text = result.innerText;
  const filename = "speech.txt";

  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

downloadBtn.addEventListener("click", download);

clearBtn.addEventListener("click", () => {
  result.innerHTML = "";
  downloadBtn.disabled = true;
});

if (infoButton) {
  infoButton.addEventListener("click", () => {
    alert(
      "Developer: Rootpye\nEmail: roootpi@gmail.com\nGithub: https://github.com/Rootpye"
    );
  });
}
