function Gollum() {
    state = 0
}
var counter = 0;

var messages = [
                "Keep up the good work!",
                "Those are the parts I'm looking for! Get me some more!",
                "The robot will be functioning in no time at all!",
                "A few more tools like this, and robot will be ready to go!",
                "More progress!!",
                "That wasn't so bad now, was it? Keep it going!",
                ];

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


Gollum.prototype.sendmsg = function(event, command, needsHelp) {
    if(event){
        event.preventDefault();
    }
    showdown.setFlavor('github');

    var chatinput = document.getElementById("btn-input");
    var data = chatinput.value;
    if(command){
        data = command;
    }
    if(!needsHelp){
        this.addText(data);
    }
    chatinput.value = "";
    if (data === "help") {
        if (state == 0) {
            this.addText("Click the radar screen to activate the robot arm!");
            state++;
        } else if (state == 1) {
            this.addText("Click and drag the arm in the radar screen to move the robot's arm!")
            state++;
        } else if (state == 2) {
            this.addText("Help the robot reach the parts. Move the arm on the input screen so that his arm can pick up the pieces.")
            state++;
        } else if (state == 3) {
            this.addText("Double click the radar screen to collect the part.")
            state = 0;
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
    var scroller = document.getElementById("chat-panel");
    scroller.scrollTop = scroller.scrollHeight;
};

Gollum.prototype.addRandMessage = function(){
    var ind = Math.floor(Math.random() * messages.length);
    this.addText(messages[ind]);
};


module.exports = Gollum;
