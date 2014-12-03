function FacePoints(starSize, w, h){
	this.starSize = starSize;
	// this.parentSketch = sf;
	this.W = w;
	this.H = h;
	this.xPoints = [];
	this.yPoints = [];
	this.state = "";
}

StarFaceObj.prototype.fpSetup = function(){};


StarFaceObj.prototype.fpKeyPressed = function(){

	if(xPoints.size() > 0){
		String lines[] = new String[xPoints.size()]; 
		for (int i = 0; i < xPoints.size(); i++){
			lines[i] = ""+ xPoints.get(i) +";"+ yPoints.get(i) +";0"; 
		}
		saveStrings(outputFile, lines);
		println("yo! ");
		confirm = true;
		cam.stop();
		this.setSketchState("1a");
		startingAt = millis();//store the current time
	}
};

StarFaceObj.prototype.setSketchState = function(state){
	this.state = state;
}

StarFaceObj.prototype.fpDraw = function() {
	if (cam.available() == true) {
		cam.read();
	}
	pushMatrix(); 
	translate(width,0);
	scale(-1,1); 
	image(cam, 0, 0);
	filter(GRAY);
	popMatrix(); 

	for (int i = 0; i < xPoints.size(); i++){
		fill(255); noStroke();
		ellipse(xPoints.get(i), yPoints.get(i), pointSize, pointSize); 
		stroke(strColor); noFill();
		ellipse(xPoints.get(i), yPoints.get(i), pointSize+6, pointSize+6); 
	}

	if(confirm == true){
		FPconfirmation();
		confirm = false;
	}
};

StarFaceObj.prototype.fpFade = function() {
	if( (millis() - startingAt) < transitionDuration){
		fill(transitionColor);
		rect(0,0, width, height);
		fill(255);
		for (int i = 0; i < xPoints.size(); i++){
			ellipse(xPoints.get(i), yPoints.get(i), pointSize, pointSize); 
		}
	}
	else parentSketch.sketchState = "2";
};

StarFaceObj.prototype.fpConfirmation = function(){

	int startingAt = millis();//store the current time
	int wait = 500;

	fill(255);
	rect(10,10, width-20,height-20);
	
	fill(0);
	PFont font = createFont("Source Code Pro", 50);
    textAlign(CENTER, CENTER);
    textFont(font);

    // delay
	while(millis() - startingAt <= wait){
		// wait
	}
};