var audioPath = "../public/audio/";

function Balrog(){
	//console.log("initializing audio");
	this.loading = 3;
	this.reloadItems = new Audio(audioPath+'reloaditems.wav');
	this.reloadItems.addEventListener("canplaythrough", function () {
		//console.log("loaded: "+'reloaditems.wav');
		self.loaded--;
	});
	this.matChange = new Audio(audioPath+'matrixchange.wav');
	this.matChange.addEventListener("canplaythrough", function () {
		//console.log("loaded: "+'matrixchange.wav');
		self.loaded--;
	});
	this.pickup = new Audio(audioPath+'pickup2.wav');
	this.pickup.addEventListener("canplaythrough", function () {
		//console.log("loaded: "+'pickup2.wav');
		self.loaded--;
	});

	//this.synth = new Tone.MonoSynth().toMaster();
};

//assuming markovMat is 7x7 
Balrog.prototype.generateFromMatrix = function(markovMat, smooth) {
	//todo generate music from markov matrix

	//setTimeout(function(){
	//}, 500)
	//synth.triggerAttack(oldfreq);
	//synth.frequency.rampTo(freq, 0.05);		
	//synth.setNote(freq);
	//synth.volume.rampTo(vol, 0.07);
};

Balrog.prototype.stopSynth = function(){
	//this.synth.triggerRelease();
};

module.exports = Balrog;