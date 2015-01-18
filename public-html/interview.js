//Global Variables
var language = "UNASSIGNED";
var recording = 0;
var submitted = false;

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
	if (recording ==1) { //capturing --> begin sending
		recording = 2;
		document.getElementById("recording-icon").className = "glyphicon glyphicon-ok";
		document.getElementById("recording-button").className = "btn btn-lg btn-success col-md-offset-3";
		document.getElementById("next-button").className = "btn btn-lg btn-primary col-md-offset-3";
		submitData();
	}
	else { //waiting or sent --> begin capturing
		submitted = false;
		recording = 1;
		document.getElementById("recording-button").className = "btn btn-lg btn-danger col-md-offset-3";
		document.getElementById("recording-icon").className = "glyphicon glyphicon-record";
	}
}

function recordButton(userChoice) {
	if (userChoice == "allow") {
		document.getElementById("recording-icon").className = "glyphicon glyphicon-record blink";
	} else {
		document.getElementById("recording-icon").className = "glyphicon glyphicon-exclamation-sign";
	}
}

//when a new video prompt needs to be inserted and played
function nextVideo() {
	//submit data if user didn't yet
	if (submitted == false) {
		submitData();
	}

	//reset notes box
	document.getElementById("notes-box").value = "";

	//display next video
	document.getElementById("video-frame").src = 'http://www.youtube.com/embed/fgxuM8DH6k8' + '?rel=0&autoplay=1';

	//reset buttons
	recording = 0;
	document.getElementById("recording-button").className = "btn btn-lg btn-default col-md-offset-3";
	document.getElementById("recording-icon").className = "glyphicon glyphicon-record";
	document.getElementById("next-button").className = "btn btn-lg btn-default col-md-offset-3";
}

//upload files to database
function submitData() {
	submitted = true;

	//send text, audio, transcript



}