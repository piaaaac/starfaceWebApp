function StarFaceObj(starSize, w, h){

	this.starSize = starSize;
	this.canvasW = w;
	this.canvasH = h;
	this.starData = [][];
	
	// REAL BOUNDRIES nearest15K.csv
	this.minStarX = -75.7139;
	this.maxStarX =  75.5999;
	this.minStarY = -75.3572;
	this.maxStarY =  75.3197;
	this.minStarZ = -75.3176;
	this.maxStarZ =  75.4815;
	this.minStarAppMag =  -1.44;
	this.maxStarAppMag =  13.25;

	this.minCanvasZ = -500;
	this.maxCanvasZ = 500;

}


StarFaceObj.prototype.sfSetup = function(data){

	for(var i=0; i<data.length; i++){
		var tempVals = data[i].split(";");

		for(var j=0; j<tempVals.length; j++){
			//copy an array with all stars translated to canvas values
			if(j==0){
				starData[i][0] = map(tempVals[0], this.minStarX,this.maxStarX, 0-extraMargin,this.canvasW+extraMargin);
			}
			else if(j==1){
				starData[i][1] = map(tempVals[1], this.minStarY,this.maxStarY, 0-extraMargin,this.canvasH+extraMargin);
			}
			else if(j==2){
				starData[i][2] = map(tempVals[2], this.minStarZ,this.maxStarZ, minCanvasZ-extraMargin,maxCanvasZ+extraMargin);
			}
			else{
				starData[i][j] = tempVals[j];
			}
		}
	}
	
	// if(!dataFileInput2.equals("")) inputData2 = readCsv(dataFileInput2);
	
	indexes = [];

	// building array of chosen indexes
	for(var i=0; i<inputPoints.length; i++){
		console.log("---input point n "+i);
		var minimumValue = this.canvasW*this.canvasH;
		for(int j=0; j<starData.length; j++){
			tempVal = dist(inputPoints[i][0],inputPoints[i][1], starData[j][0],starData[j][1]);
			if(tempVal < minimumValue ){
				minimumValue = tempVal;
				indexes[i] = j;
				console.log("dist"+minimumValue + ", j=" + j);
			}
		}
	}

	//--- camera
	camera(width/2.0, height/2.0, (height/0.1) / tan(PI*30.0 / 180.0), width/2.0, height/2.0, 0, 0, 1, 0);
	
	//--- perspective
	//float cameraZ = (height/2.0) / tan(PI*30.0/360.0);
	//perspective(radians(10), width/height, cameraZ/15.0, cameraZ*15.0);

	//--- perspective
	ortho();

    textAlign(CENTER, TOP);
    font = createFont("Source Code Pro", 11);
    textFont(font);
    
    parentSketch.sketchState = "3";
}








StarFaceObj.prototype.sfDraw = function(){

	background(0);


	// // plot original input
	// fill(255,0,0);
	// for(int i=0; i<inputData.length; i++){
	// 	ellipse(parseFloat(inputData[i][0]),parseFloat(inputData[i][1]), 5, 5);
	// 	//println("X=" + parseFloat(inputData[i][0]) + ", Y=" + parseFloat(inputData[i][1]));
	// }

	fill(255);
	noFill();
	stroke(255, 120);

	// rotation
	translate(width/2, height/2);
	if(autorotation){ 
		rotateY(rotationAmount+=autorotationSpeed); 
		if( (rotationAmount % (PI*2))  < autorotationSpeed ){ 
			autorotation = false; 
			rotationAmount = 0;
		}
	}
	else{ rotateY(rotationAmount); }
	println(rotationAmount);
	translate(-width/2, -height/2);

	// plot all stars
	for(int i=0; i<starDataCanvas.length; i++){
		float thisStarSize = map(parseFloat(starData[i][6]), minStarAppMag,maxStarAppMag, minCanvasStarSize,maxCanvasStarSize);
		strokeWeight(thisStarSize);
		float thisStarAplha = map(parseFloat(starData[i][6]), minStarAppMag,maxStarAppMag, minCanvasStarAlpha,maxCanvasStarAlpha);
		stroke(255, 255, 0, thisStarAplha);
		point(starDataCanvas[i][0], starDataCanvas[i][1], starDataCanvas[i][2]);
	}
	
	// plot connections
	stroke(150);
	strokeWeight(1);
	if(!dataFileInput2.equals("")){
		for(int i=0; i<inputData2.length; i++){
			line(
				starDataCanvas[indexes[parseInt(inputData2[i][0])]][0],starDataCanvas[indexes[parseInt(inputData2[i][0])]][1],starDataCanvas[indexes[parseInt(inputData2[i][0])]][2],
				starDataCanvas[indexes[parseInt(inputData2[i][1])]][0],starDataCanvas[indexes[parseInt(inputData2[i][1])]][1],starDataCanvas[indexes[parseInt(inputData2[i][1])]][2]
				);
		}
	}

	// plot chosen stars
	stroke(255);
	strokeWeight(canvasChosenStarSize);
	for(int i=0; i<indexes.length; i++){
		float plotX = starDataCanvas[indexes[i]][0];
		float plotY = starDataCanvas[indexes[i]][1];
		float plotZ = starDataCanvas[indexes[i]][2];
		point(plotX,plotY,plotZ);
		//line(starDataCanvas[indexes[i]][0],starDataCanvas[indexes[i]][1], parseFloat(inputData[i][0]),parseFloat(inputData[i][1]));
        
		// plot star names
        if(showText==true){
        	String starName = starData[indexes[i]][17];
        	translate(plotX,plotY,plotZ);
        	rotateY(-rotationAmount);
        	text(starName, 0,0,0);
        	rotateY(rotationAmount);
        	translate(-plotX,-plotY,-plotZ);
        }
	}
};


StarFaceObj.prototype.sfMouseWheel = function(event) {
	float e = event.getCount();
	rotationAmount += e*scrollRotationSpeed;
	println(e);
};


StarFaceObj.prototype.sfMouseClicked = function() {
	//rotationAmount = 0;
	if(autorotation == true) autorotation = false;
	else autorotation = true;
};


StarFaceObj.prototype.sfkeyPressed = function(){
	showText = !showText;
};


String[][] readCsv(String source) {
	String cellSeparator = ";";
	String[] lines = loadStrings(source);
	String[] headers = lines[0].split(cellSeparator);
	String[][] results = new String[lines.length][headers.length];

	for (int i=0; i<lines.length; i++) {
		results[i] = lines[i].split(cellSeparator);
		//println(results[i][0]);
	}
	return results;
} 