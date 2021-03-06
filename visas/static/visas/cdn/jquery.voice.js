/*
 * jQuery Voice plugin 0.1
 * Copyright Subin Siby - http://subinsb.com
 * MIT licensed
 * -------------
 * A jQuery plugin to record, play & download microphone input sound from the user.
 * NEEDS recorder.js and recorderWorker.js to work - https://github.com/mattdiamond/Recorderjs
 *  
*/
(function($){
	$.extend({
		voice: {
			workerPath: "recorderWorker.js",
			initCalled: false,
			stream: false,
			init: function(){
				try {
					// Fix up for prefixing
					window.AudioContext = window.AudioContext||window.webkitAudioContext;
					navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
					window.URL = window.URL || window.webkitURL;
					if(navigator.getUserMedia === false){
						alert('getUserMedia() is not supported in your browser');
					}
					$.voice.context = new AudioContext();
				}
				catch(e) {
					alert('Web Audio API is not supported in this browser');
				}
			},
			record: function(output, callback){
				if($.voice.initCalled === false){
					this.init();
					$.voice.initCalled = true;
				}
				navigator.getUserMedia({audio: true}, function(stream){
					//Microphone input allowed!
					recordButton("allow"); //from interview.js
					var input = $.voice.context.createMediaStreamSource(stream);
					if(output === true){
						input.connect($.voice.context.destination);
					}
					$.voice.recorder = new Recorder(input, {
						workerPath : $.voice.workerPath
					});
					$.voice.stream = stream;
					$.voice.recorder.record();
					callback(stream);
				}, function() {
					alert('We could not access your microphone. Please check permissions.');
					recordButton("deny"); //from interview.js 
				});
			},
			stop: function(){
				$.voice.recorder.stop();
				$.voice.recorder.clear();
				$.voice.stream.stop();
				return $.voice;
			},
			export: function(callback, type){
				$.voice.recorder.exportWAV(function(blob) {
					if(type == "" || type == "blob"){
						callback(blob);
					}else if(type == "URL"){
						var url = URL.createObjectURL(blob);
						//oh hey, we have a Blob! Now might be a good time to send it to the server...?
						console.log("Storing BLOB for QUESTION #: " + questionCounter);
						blobArray[questionCounter] = blob;
						console.log("Blob type: " + blobArray[questionCounter].type);
						console.log("Blob size: " + blobArray[questionCounter].size);
						callback(url);
					}
				});
			}
		}
	});
})(jQuery);
