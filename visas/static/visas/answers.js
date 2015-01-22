//lookup user answers
$(document).ready(function() {

$("#login").on("click", function() {
    var userName = document.getElementById("inputName").value;

    $.ajax({
        type: 'POST',
        url: 'lookup/',
        data: {'username': userName},

        success: function(data, textStatus, request){
            console.log(data);
            displayAnswers(userName, data);
        }
    });
});
});

function displayAnswers(userName, data) {
    //switch to answers screen
    document.getElementById("content-welcome").style.display = "none";
    document.getElementById("content-answers").style.display = "block";

    document.getElementById("subheading").innerHTML = "User: " + userName;

    var i = 0;
    var dest = document.getElementById("answerWrapper");

    while (data[i] !== undefined) {
        var newcontent = document.createElement('p');
        newcontent.innerHTML = "<b>Question " + i + ":</b> " + data[i];
        dest.appendChild(newcontent);
        i++;
    }
}
