//Global Variables
var language = "UNASSIGNED"; //"English" or "Spanish"
var recording = 0; //0: waiting, 1: recording, 2: submitting
var submitted = false;
var loggedIn = false;
var questionCounter = 0;
var questionTitle = "Question Title";
var questionURL = "http://www.youtube.com/embed/fgxuM8DH6k8";
var emergencyURL = "http://www.youtube.com/embed/DDY346OQCDo";

//Initialization
document.getElementById("content-prompt-english").style.display = "none";

//after user first logs in, show next prompt
function beginInterview(userLang) {
	loggedIn = true;
	language = userLang;
	var userName = document.getElementById("inputName").value;
	var userID = document.getElementById("inputID").value;
	console.log("name: " + userName);
	console.log("ID: " + userID);

	if ((userName !== "") && (userID !== "")) {
		document.getElementById("content-welcome").style.display = "none";
		document.getElementById("content-prompt-english").style.display = "block";

		nextVideo();
	}
}

//toggles the record/success button
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

//change button after user accepts/denies permission to use microphone
function recordButton(userChoice) {
	if (userChoice == "allow") {
		document.getElementById("recording-icon").className = "glyphicon glyphicon-record blink";
	} else {
		document.getElementById("recording-icon").className = "glyphicon glyphicon-exclamation-sign";
	}
}

//reset buttons and play next video prompt
function nextVideo() {
	//submit data if user didn't yet
	if (submitted == false) {
		submitData();
	}

	//reset notes box
	document.getElementById("notes-box").value = "";

	//reset buttons
	recording = 0;
	document.getElementById("recording-button").className = "btn btn-lg btn-default col-md-offset-3";
	document.getElementById("recording-icon").className = "glyphicon glyphicon-record";
	document.getElementById("next-button").className = "btn btn-lg btn-default col-md-offset-3";

	//display next video
	getNextQuestion();
	if (questionURL !== undefined) {
		document.getElementById("question-title").innerHTML = questionCounter + ". " + questionTitle;
		document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';
	} else { //display goodbye screen
		loggedIn = false;
		document.getElementById("video-frame").src = "";
		document.getElementById("content-prompt-english").style.display = "none";
		document.getElementById("content-goodbye").style.display = "block";
	}
}

//upload files to database
function submitData() {
	submitted = true;

	//send text, audio, transcript
}

//get next question details from databse
function getNextQuestion() {
	//send <questionCounter> to database
	//database returns:
		//next question number
		//next question title
		//next question URL

	//SIMULATION OF DATABASE:
	var titles = ["Introduction", "How are you?", "What happened?"];
	var URLs = ["http://www.youtube.com/embed/fgxuM8DH6k8", "http://www.youtube.com/embed/fgxuM8DH6k8", "http://www.youtube.com/embed/fgxuM8DH6k8"];

	questionTitle = titles[questionCounter];
	questionURL = URLs[questionCounter];
	questionCounter = questionCounter + 1;
}

// function emergency() {

// }

//switch to emergency video and disable user inputs
$("#emergency").click(function() {
	if (loggedIn == true) {
		document.getElementById("video-frame").src = emergencyURL + '?rel=0&autoplay=1';
		document.getElementById("userButtons").style.display = "none";
		document.getElementById("userNotes").style.display = "none";
		document.getElementById("emergencyButtons").style.display = "block";
	} else {
		alert("Please sign in to use this feature.");
	}
});

//return to previous video and enable user inputs
$("#emergencyResume").click(function() {
	document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';
	document.getElementById("userButtons").style.display = "block";
	document.getElementById("userNotes").style.display = "block";
	document.getElementById("emergencyButtons").style.display = "none";
});
