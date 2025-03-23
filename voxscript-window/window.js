const recordBtn = document.querySelector(".record"),
  result = document.querySelector(".result"),
  downloadBtn = document.querySelector(".download"),
  inputLanguage = document.querySelector("#language"),
  clearBtn = document.querySelector(".clear"),
  infoButton = document.querySelector("#infoButton");

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
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recognition = new SpeechRecognition();
        recognition.lang = inputLanguage.value;
        recognition.interimResults = true;
        recordBtn.classList.add("recording");
        recordBtn.querySelector("p").innerHTML = "Listening...";
        recognition.start();

        recognition.onresult = (event) => {
          const speechResult = event.results[0][0].transcript;
          if (event.results[0].isFinal) {
            result.innerHTML += " " + speechResult;
            result.querySelector("p").remove();
          } else {
            if (!document.querySelector(".interim")) {
              const interim = document.createElement("p");
              interim.classList.add("interim");
              result.appendChild(interim);
            }
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
        recording = false;
        stopRecording();
        console.error("마이크 접근 오류:", error);
        if (error.name === "NotAllowedError") {
          alert("마이크 접근 권한이 거부되었습니다. 권한을 허용해주세요.");
        } else if (error.name === "NotFoundError") {
          alert("마이크를 찾을 수 없습니다. 연결을 확인해주세요.");
        } else {
          alert("마이크 접근 중 오류가 발생했습니다.");
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