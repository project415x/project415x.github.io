function Gollum() {
    state = 0
}


function readTextFile(file) {
    var converter = new showdown.Converter();
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                $('#chatbar').append("<div class='messages_sent'>" + converter.makeHtml(allText) + "</div>")
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
}


Gollum.prototype.sendmsg = function(event) {
    event.preventDefault();
    showdown.setFlavor('github');

    var chatinput = document.getElementById("btn-input");
    var data = chatinput.value;
    chatinput.value = "";
    if (data === "help") {
        if (state == 0) {
            $('#chatbar').append("<div class='messages_sent'><p>Click the radar screen to activate the robot arm!</p></div>")
            state++;
        } else if (state == 1) {
            $('#chatbar').append("<div class='messages_sent'><p>Click and drag the arm in the radar screen to move the robot's arm!</p></div>")
            state++;
        } else if (state == 2) {
            $('#chatbar').append("<div class='messages_sent'><p>Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.</p></div>")
            state++;
        } else if (state == 3) {
            $('#chatbar').append("<div class='messages_sent'><p>Double click the radar screen to collect the part.</p></div>")
            state++;
        } else if (state == 4) {
            console.log("lol");
            readTextFile("/guide/" + level);
            state++;
        }
        var scroller = document.getElementById("chat-panel");
        scroller.scrollTop = scroller.scrollHeight;
    } else if (data === "clear") {
        document.getElementById('chatbar').innerHTML = "";
        state = 0;
    }
};

Gollum.prototype.addText = function(text){
    $('#chatbar').append("<div class='messages_sent'><p>"+text+"</p></div>")
    state++;
    var scroller = document.getElementById("chat-panel");
    scroller.scrollTop = scroller.scrollHeight;
};


module.exports = Gollum;
