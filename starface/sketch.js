var capture;
var sketchState = "1";
var canvasW = 1200;
var canvasH = 680;
var starSize = 6;
var fp, sf;
var isStaged = false;	// are we ready to display stars?
var dataFile = "data/nearest15K.csv";
var data;
var inputPoints = [];

function preload(){
	data = loadStrings(dataFile);
}

function setup() {
	createCanvas(displayWidth, displayHeight);
	capture = createCapture(VIDEO);
	capture.size(displayWidth, displayHeight);
	fp = new FacePoints(starSize, displayWidth,displayHeight);
	sf = new StarFaceObj(starSize, displayWidth,displayHeight);
	sf.sfSetup(data);
}

function draw() {
	if(!isStaged) fp.fpDraw();
	else{
		if(sketchState == "1a"){
			fp.fpFade();
			sf.sfSetup();
			sketchState = "3";
		} 
		else{
			sf.sfDraw();
		}
	}
}

function mouseClicked() {
	if(isStaged){
		sf.sfMouseClicked();
	}
	else{
		// send mouse position
		inputPoints.push({
			x: mouseX,
			y: mouseY
		});
	}
}


function keyPressed(){
	if(keyCode == 32 && isStaged){ // spacebar
		sf.sfKeyPressed();
	}
	else if(keyCode == 13){  // return key
		if(inputPoints.length > 0){ // if there is input
			isStaged = true;
			sketchState = "1a";
			capture.hide(); // stop camera
		}
	}
}

function mouseWheel(evt){
	if(isStaged) sf.SFmouseWheel(evt.detail);
}
