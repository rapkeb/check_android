const text_area = document.querySelector('#text_area');

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();

function runSpeechRecognition() {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.addEventListener("end", () => {
        alert("2");
        recognition.start();
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