var context;
var saved;
var source;
var gainNode;

try {
    context = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = context.createGain();
    gainNode.gain.value = 0; // setting it to 10%
    
}
catch (e) {
    console.log("Your browser doesn't support Web Audio API");
}



//loading sound into the created audio context
function loadSound(url) {
    //set the audio file's URL
    var audioURL = url;

    //creating a new request
    var request = new XMLHttpRequest();
    request.open('GET', audioURL, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        //take the audio from http request and decode it in an audio buffer
        context.decodeAudioData(request.response, function (buffer) {
            // save buffer, to not load again
            saved = buffer;
            // play sound
            playSound(buffer);
        });
    };
    request.send();
}

//playing the audio file
function playSound(buffer) {
    //creating source node
    source = context.createBufferSource();
    //passing in data
    source.buffer = buffer;
    source.loop = true
    //giving the source which sound to play
    source.connect(gainNode)
    gainNode.connect(context.destination);
    //start playing
    source.start(0);
}
function startSound(){
    playSound(saved)
}

function runSound(){
    if (saved) {
        playSound(saved);
    } else {
        //loadSound();
    }
}

function setVolume(value){
    gainNode.gain.value = value
}

let volumeSize = 0
function MuteAudio(isMute){
    if(isMute) volumeSize = gainNode.gain.value
    setVolume(isMute?0:volumeSize)
}