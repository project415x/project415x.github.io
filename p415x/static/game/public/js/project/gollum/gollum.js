function Gollum(){

}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                $('#chatbar').append("<div class='messages_sent'>"+converter.makeHtml(allText)+"</div>")
                //alert(allText);
            }
        }
    }
    rawFile.send(null);
}

Gollum.prototype.sendmsg = function(event){
  event.preventDefault();
  showdown.setFlavor('github');
  var converter = new showdown.Converter();
  console.log("done");
  var chatinput = document.getElementById("btn-input");
  var data = chatinput.value;
  chatinput.value = "";
  if (data==="help"){
    readTextFile("/guide/"+level);
  }
  else if (data==="clear"){
    document.getElementById('chatbar').innerHTML = "";
  }
};



module.exports = Gollum;
