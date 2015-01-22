$(document).ready(function() {

$("#login").on("click", function() {
    var userName = document.getElementById("inputName").value;

    $.ajax({
        type: 'POST',
        url: 'lookup/',
        data: {'username': userName},

        success: function(data, textStatus, request){
            console.log(data);
        }
    });
});
});
