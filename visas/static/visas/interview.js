/*
Outstanding concerns:
[ ] is the database secure? can people upload malicious files?
[ ] SSL would help us save ALLOW/DENY pref. for microphone
*/

//================================================================================
//GLOBAL VARIABLES
//================================================================================

//General
var language = "UNASSIGNED"; //"English" or "Spanish"
var recording = 0; //0: waiting, 1: recording, 2: submitting
var loggedIn = false;

//Current Question/Video Settings
var questionCounter = 0;
var questionTitle = "Question Title";
var questionURL = "http://www.youtube.com/embed/fgxuM8DH6k8";
var questionLogic = false; //true when question requires YES/NO answer
var questionBack = []; //index = this question, value = the previous question (how we got here)

var userName;
var userID;
var currentBlob;

//================================================================================
// MAIN
//================================================================================

//Initialization
document.getElementById("content-prompt-english").style.display = "none";

//login
$(document).ready(function() {

$("#login,#login-es").on("click", function() {
    var username = document.getElementById("inputName").value;
    var password  = document.getElementById("inputID").value;
    $.ajax({
         type: 'POST',
         url: 'login/',
         data: {'username': username, 'password': password},
         //success: function(data) {
         //   beginInterview('English');
         //   }
        success: function(data, textStatus, request){
        console.log("You've returned to Question #: " + data);
        beginInterview(); //initialize
        resumeInterview(data); //go to video
        }
    });
});
});

//initialize login settings
function beginInterview(userLang) {
	loggedIn = true;
	language = userLang;
	userName = document.getElementById("inputName").value;
	userID = document.getElementById("inputID").value;
	// console.log("name: " + userName);
	// console.log("ID: " + userID);

	// if ((userName !== "") && (userID !== "")) { //required info was provided
		//submit NAME/ID to database
		//get back question number; store as questionCounter (GLOBAL)

		//switch to video display screen
		// document.getElementById("content-welcome").style.display = "none";
		// document.getElementById("content-prompt-english").style.display = "block";

		// //display first video
		// goToQuestion(0, false); //first video
	// }
}

function resumeInterview(questionNumber) {
	document.getElementById("content-welcome").style.display = "none";
	document.getElementById("content-prompt-english").style.display = "block";
	goToQuestion(questionNumber, false);
}

//for playing a particular video based on known question number
function goToQuestion(num, fromPrev) {
		resetVideoControls();
		loadVideo(num, fromPrev);
		displayButtons();
		document.getElementById("question-title").innerHTML = questionCounter + ". " + questionTitle;
		document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';	
}

//toggles the record/success button
function toggleAudio() {
	if (recording ==1) { //capturing --> begin sending
		recording = 2;
		document.getElementById("recording-icon").className = "glyphicon glyphicon-ok";
		document.getElementById("recording-button").className = "btn btn-lg btn-success col-md-offset-3";
		document.getElementById("next-button").className = "btn btn-lg btn-primary col-md-offset-3";
		submitData('n/a');
	}
	else { //waiting or sent --> begin capturing
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
	var videoLoaded = loadVideo(getNextQuestion(questionCounter), false);

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
	submitData('n/a');

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
	setEndIcon();
}

function prevVideo() {
	goToQuestion(questionBack[questionCounter], true);
}

//upload files to database
function submitData(userLogic) {
	var dataNote = document.getElementById("notes-box").value;
    var formData = new FormData();
    formData.append('audio', currentBlob);
    formData.append('text', dataNote);
    formData.append('username', userName);
    formData.append('question', questionCounter);
    formData.append('logic', userLogic);
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open( 'POST', 'submit/', true );
    xhr.onreadystatechange = function ( response ) {};
    xhr.send( formData );

    e.preventDefault(); 
    /*
    $.ajax({
         type: 'POST',
         url: 'submit/',
         data: {'text': dataNote, 'username': userName, 'question': questionCounter, 'logic': userLogic, 'audio': currentBlob},
         proccessData: false,
         contentType: false,
         success: function(data, textStatus, request){
        // alert(data);
        }
    });
    */
	//send text, audio, transcript
}

function setEndIcon() {
	if (questionTree[questionCounter]["next"] == -1) {
		document.getElementById("next-button").innerHTML = "<span class='glyphicon glyphicon-share'></span>";
	} else {
		document.getElementById("next-button").innerHTML = "<span class='glyphicon glyphicon-chevron-right'></span>";
	}
}

//================================================================================
// EMERGENCY VIDEO
//================================================================================

var logicButtonsOn;
var userButtonsOn;

//switch to emergency video and disable user inputs
$("#emergency").click(function() {
	//detect current buttons
	if (document.getElementById("emergencyButtons").style.display == "none") { //not already in emergency mode
		if (document.getElementById("userButtons").style.display == "none") {
			userButtonsOn = false;
		} else {
			userButtonsOn = true;
		}
		if (document.getElementById("logicButtons").style.display == "none") {
			logicButtonsOn = false;
		} else {
			logicButtonsOn = true;
		}
	}

	if (loggedIn == true) {
		document.getElementById("video-frame").src = emergencyURL + '?rel=0&autoplay=1';
		document.getElementById("userButtons").style.display = "none";
		document.getElementById("userNotes").style.display = "none";
		document.getElementById("logicButtons").style.display = "none";
		document.getElementById("emergencyButtons").style.display = "block";
	} else {
		alert("Please sign in to use this feature.");
	}
});

//return to previous video and enable user inputs
$("#emergencyResume").click(function() {
	document.getElementById("video-frame").src = questionURL + '?rel=0&autoplay=1';
	document.getElementById("emergencyButtons").style.display = "none";
	if (userButtonsOn) {
		document.getElementById("userButtons").style.display = "block";
		document.getElementById("userNotes").style.display = "block";
	}
	if (logicButtonsOn) {
		document.getElementById("logicButtons").style.display = "block";
	}
});

//================================================================================
//LOGIC CONTROLS
//================================================================================

//required include: questionTree.js

var userAnswers = []; //user replies, indexed by question number

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
	submitData(currentAnswer);
	nextVideo();
}

//================================================================================
//VIDEO DATA
//================================================================================

//required include: videoData.js

//sets global variables for displaying video/title
//returns false if there are no more videos to display
function loadVideo(questionNumber, fromPrev) {
	if (videoData[questionNumber] == undefined) {
		return(false);
	} else {
		questionTitle = videoData[questionNumber]["title"];
		questionURL = videoData[questionNumber]["url"];
		questionLogic = videoData[questionNumber]["logic"];
		if (fromPrev == false) {
			questionBack[questionNumber] = questionCounter; //track how we got here
		}		questionCounter = questionNumber;
		return(true);
	}
}
