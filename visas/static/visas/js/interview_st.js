//Global Variables
var language = "UNASSIGNED"; //"English" or "Spanish"
var recording = 0; //0: waiting, 1: recording, 2: submitting
var submitted = false;
var loggedIn = false;

var questionCounter = 0;
var questionTitle = "Question Title";
var questionURL = "http://www.youtube.com/embed/fgxuM8DH6k8";
var questionLogic = false; //true when question requires YES/NO answer

var emergencyURL = "http://www.youtube.com/embed/DDY346OQCDo";

//Initialization
document.getElementById("content-prompt-english").style.display = "none";

//login
//$(document).ready(function() {

//$("#login").on("click", function() {
function login() { 
   console.log("logging in");
    var username = document.getElementById("inputName").value;
	var password  = document.getElementById("inputID").value;
    $.ajax({
        type: 'POST',
        url: 'login',
        data: {'username': username, 'password': password},
        success: function(response){alert('yay');} 
    });
}
//});
//});
//after user first logs in, show next prompt
function beginInterview(userLang) {
	loggedIn = true;
	language = userLang;
	var userName = document.getElementById("inputName").value;
	var userID = document.getElementById("inputID").value;
	// console.log("name: " + userName);
	// console.log("ID: " + userID);

	if ((userName !== "") && (userID !== "")) { //required info was provided
		//submit NAME/ID to database
		//get back question number; store as questionCounter (GLOBAL)

		//switch to video display screen
		document.getElementById("content-welcome").style.display = "none";
		document.getElementById("content-prompt-english").style.display = "block";

		//display next video
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
	resetVideoControls();

	//display next video
	var videoLoaded = loadVideo(getNextQuestion(questionCounter));
//	getNextQuestion();

	displayButtons();

	if (videoLoaded == true) {
		document.getElementById("question-title").innerHTML = questionCounter + ". " + questionTitle;
		document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';
	} else { //no more videos; display Goodbye screen
		loggedIn = false;
		document.getElementById("video-frame").src = "";
		document.getElementById("content-prompt-english").style.display = "none";
		document.getElementById("content-goodbye").style.display = "block";
	}
}

function resetVideoControls() {
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
}

function displayButtons() {
	if (questionLogic == true) {
		document.getElementById("userButtons").style.display = "none";
		document.getElementById("userNotes").style.display = "none";
		document.getElementById("logicButtons").style.display = "block";
	} else {
		document.getElementById("userButtons").style.display = "block";
		document.getElementById("userNotes").style.display = "block";
		document.getElementById("logicButtons").style.display = "none";
	}
}

// function prevVideo() {
// 	if (questionCounter > 1) {
// 		resetVideoControls();
// 		questionCounter = questionCounter - 1; //this is silly. change the functions to not be next-biased.
// 		getNextQuestion();
// 		questionCounter = questionCounter - 1;
// 		document.getElementById("question-title").innerHTML = questionCounter + ". " + questionTitle;
// 		document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';
// 	}
// }

//upload files to database
function submitData() {
	submitted = true;

	//send text, audio, transcript
}

//================================================================================
// EMERGENCY VIDEO
//================================================================================

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

//================================================================================
//LOGIC CONTROLS
//================================================================================

var userAnswers = []; //user replies, indexed by question number

//only include questions which require a logical branch (yes/no answer)
var questionTree = { //logic branches, keyed by question number
	0:{
		"next":1,
	},
	1:{
		"yes":2,
		"no":3,
	},
	2:{
		"next":4,
	},
	3:{
		"next":4,
	},
	4:{
		"next":-1, //-1 signals end of questions
	},
};

//returns question number of next question in logic tree
function getNextQuestion(currentQuestion) {
	var currentAnswer = userAnswers[currentQuestion];
	if (currentAnswer == undefined) {
		if (questionTree[currentQuestion]["next"] !== undefined) { //question did not care about user answer
			return (questionTree[currentQuestion]["next"]);
		} else {
		alert("Error: User did not answer this question.");
		}
	} else {
		if (questionTree[currentQuestion][currentAnswer] == undefined) {
			alert("Error: User gave an unacceptable answer to this question.");
		} else {
			return questionTree[currentQuestion][currentAnswer];
		}
	}
}

//stores yes/no answer and moves onto next video
function answerLogic(currentAnswer) {
	userAnswers[questionCounter] = currentAnswer;
	nextVideo();
}

//??? what about PREVIOUS question button?
//??? what about SECURITY of DATABASE

//================================================================================
//VIDEO DATA
//================================================================================

var videoData = { //keyed by question number
	0:{
		"title":"Introduction",
		"url":"http://www.youtube.com/embed/fgxuM8DH6k8",
		"logic":false,
	},
	1:{
		"title":"1",
		"url":"http://www.youtube.com/embed/fgxuM8DH6k8",
		"logic":true,
	},
	2:{
		"title":"2",
		"url":"http://www.youtube.com/embed/fgxuM8DH6k8",
		"logic":false,
	},
	3:{
		"title":"3",
		"url":"http://www.youtube.com/embed/fgxuM8DH6k8",
		"logic":false,
	},
};

//sets global variables for displaying video/title
//returns false if there are no more videos to display
function loadVideo(questionNumber) {
	if (videoData[questionNumber] == undefined) {
		return(false);
	} else {
		questionTitle = videoData[questionNumber]["title"];
		questionURL = videoData[questionNumber]["url"];
		questionLogic = videoData[questionNumber]["logic"];
		questionCounter = questionNumber;
		return(true);
	}
}

$(document).ready(function() {
    console.log("i'm here");
    $.ajax({
        type: 'POST',
        url: 'visas/login',
        data: {'username': 'username', 'password': 'password'},
        success: function(response){alert('yay');} 
    });
});

