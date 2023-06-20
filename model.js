const text_area = document.querySelector('#text_area');

var SpeechRecognition = SpeechRecognition;
//|| webkitSpeechRecognition
var recognition = new SpeechRecognition();

function runSpeechRecognition() {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.addEventListener("end", () => {
        alert("end");
        recognition.start();
    });

    recognition.addEventListener("audioend", () => {
        alert("Audio capturing ended");
      });

      recognition.addEventListener("error", (event) => {
        alert(`Speech recognition error detected: ${event.error}`);
      });

      recognition.addEventListener("nomatch", () => {
        alert("Speech not recognized");
      });

      recognition.addEventListener("soundend", (event) => {
        alert("Sound has stopped being received");
      });

      recognition.addEventListener("speechend", () => {
        alert("Speech has stopped being detected");
      });

    // This runs when the speech recognition service returns result
    recognition.onresult = function (event) {
        let result = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            result += event.results[i][0].transcript;
        }
        text_area.innerHTML = result;
      };

    // start recognition
    recognition.start();
}

runSpeechRecognition();