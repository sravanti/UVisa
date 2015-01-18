//Global Variables
var language = "UNASSIGNED";
var recording = 0;

//Initialization
// document.getElementById("content-prompt").style.display = "none";

//after user first logs in, show next prompt
function beginInterview(userLang) {
	language = userLang;
	// alert(language);
	// document.getElementById("content-wrapper").innerHTML = '<p>You\'ve chosen: ' + language + '.</p>';
	// document.getElementById("content-wrapper").innerHTML = '<div class="embed-responsive embed-responsive-4by3"><iframe class="embed-responsive-item" src="http://www.youtube.com/embed/eGilvHv0_bE?rel=0&autoplay=1"></iframe></div>';

	document.getElementById("content-welcome").style.display = "none";
	document.getElementById("content-prompt-english").style.display = "block";
}

//when user presses record button
function toggleAudio() {
	if (recording == 0) { //waiting
		recording = 1; //capturing
		document.getElementById("recording-button").className = "btn btn-lg btn-danger col-md-offset-3";
		document.getElementById("recording-icon").className = "glyphicon glyphicon-record blink";
	} else {
		recording = 2; //sending
		document.getElementById("recording-icon").className = "glyphicon glyphicon-ok";
		document.getElementById("recording-button").className = "btn btn-lg btn-success col-md-offset-3";
		document.getElementById("next-button").className = "btn btn-lg btn-primary col-md-offset-3";
	}
}

//when a new video prompt needs to be inserted and played
function nextVideo() {
	//submit files to database
		//audio recording
		//text input
		//transcription

	//display next video
	document.getElementById("video-frame").src = 'http://www.youtube.com/embed/fgxuM8DH6k8' + '?rel=0&autoplay=1';

	//reset buttons
	recording = 0;
	document.getElementById("recording-button").className = "btn btn-lg btn-default col-md-offset-3";
	document.getElementById("recording-icon").className = "glyphicon glyphicon-record";
}
