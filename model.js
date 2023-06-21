const text_area = document.querySelector('#text_area');
const symbol = document.querySelector('#symbol');

const symbols_to_fas_of_home = ["fa-baby", "", "fa-clock", "fa-door-open", "fa-fire", "fa-wine-glass", "fa-cloud-rain", "fa-bed", "fa-snowplow", "fa-hard-drive"];
const symbols_home_animation = ["fa-bounce", "", "fa-shake", "fa-bounce", "fa-beat", "fa-shake", "", "", "fa-fade", "fa-spin-reverse"];

var SpeechRecognition = webkitSpeechRecognition;
//|| SpeechRecognition
//sdsd
var recognition = new SpeechRecognition();

var recognizer_home;

// the link to your model provided by Teachable Machine export panel
const URL_HOME = "https://teachablemachine.withgoogle.com/models/eNZBwWr8h/";

async function createModel(URL, audioSource) {
    const checkpointURL = URL + "model.json"; // model topology
    const metadataURL = URL + "metadata.json"; // model metadata
  
    const recognizer = speechCommands.create(
      "BROWSER_FFT", // fourier transform type, not useful to change
      undefined, // speech commands vocabulary feature, not useful for your models
      checkpointURL,
      metadataURL
    );
  
    // Set a custom audio source for the recognizer
    recognizer.audioContext = new AudioContext();
    recognizer.source = recognizer.audioContext.createMediaStreamSource(audioSource);
    alert("here2");
    // Check that model and metadata are loaded via HTTPS requests
    await recognizer.ensureModelLoaded();
  
    return recognizer;
  }

async function init(recognizer_home) {
    const classLabels_home = recognizer_home.wordLabels(); // get class labels
    alert(classLabels_home);
    // listen() takes two arguments:
    // 1. A callback function that is invoked anytime a word is recognized.
    // 2. A configuration object with adjustable fields
    recognizer_home.listen(result => {
        const scores = result.scores; // probability of prediction for each class
        // render the probability scores per class
        for (let i = 0; i < classLabels_home.length; i++) {
            if(scores[i].toFixed(2) > 0.97)
            {
                if(classLabels_home[i] != "Background Noise")
                {
                    document.getElementById("symbol").innerHTML = "  " + classLabels_home[i];
                }
                symbol.classList = "";
                symbol.classList.add("fa");
                if(symbols_to_fas_of_home[i] != "")
                {
                    symbol.classList.add(symbols_to_fas_of_home[i]);
                }
                if(symbols_home_animation[i] != "")
                {
                    symbol.classList.add(symbols_home_animation[i]);
                }
            }
        }
    }, {
        includeSpectrogram: true, // in case listen should return result.spectrogram
        probabilityThreshold: 0.9,
        invokeCallbackOnNoiseAndUnknown: false,
        overlapFactor: 0.50 // probably want between 0.5 and 0.75. More info in README
    });
}

function runSpeechRecognition() {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.addEventListener("end", () => {
        alert("end");
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

navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    alert("ffff");
    const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
    alert(audioInputDevices.length);
    if (audioInputDevices.length > 1) {
      const audioSourceRecognition = audioInputDevices[2].deviceId;
      const audioSourceRecognizerHome = audioInputDevices[1].deviceId;

      // Configure recognition with the first audio source
      recognition.mediaStream = { audio: { deviceId: audioSourceRecognition } };

      // Create the recognizer_home with the second audio source
      navigator.mediaDevices.getUserMedia({ audio: { deviceId: audioSourceRecognizerHome } })
        .then(audioStream => {
          createModel(URL_HOME, audioStream)
            .then(recognizer => {
                alert("yes");
              recognizer_home = recognizer;
              init(recognizer_home);
              runSpeechRecognition();
            })
            .catch(error => {
              console.error('Error creating model:', error);
            });
        })
        .catch(error => {
          console.error('Error accessing audio stream:', error);
        });
    } else {
      console.error('No suitable audio input devices found.');
    }
  })
  .catch(error => {
    console.error('Error accessing media devices:', error);
  });