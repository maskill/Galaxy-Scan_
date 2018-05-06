//approaches
/*1)
write code that generates a list of each RGB value(0-255) and how many pixels have that specific value. E.I. 0=200, 1=1000, 2=3000, 100= 10,000, etc...
with this info an A.I. can determine what values are galaxies or just background noise.*/

/*2)
start by removing the background noise from the image so that the only things left would be the galaxies. From there the focus will be to find an A.I. that can process images and count the "bright spots"(Galaxies) and return the total.
*/

/*3)
Count the galaxies in order of colours like Blues, Reds, Greens, Orange purple, etc.
As each item is counted it will be removed from the image and the algorithem can loop over to find the next set.

*/

var c;
var ctx;
var img;

var staticPixels = [];
var foundPixels = [];

var baseRGB = 110;

//var stepper = 0;
var counter = 0;
var val = 0;

var w = 0; // change to "width" and "height" when packaging up the code
var h = 0;

window.onload = function(){
	c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	img = document.getElementById("galaxies");
	w = c.width;
	h = c.height;
	//console.log(ctx);
	//console.log(img);
	
	ctx.drawImage(img, 0, 0);
	findStars(ctx);
}


function findStars(){
	//get the pixel data
	var starData = ctx.getImageData(0, 0, w, h);
	var newMap = ctx.getImageData(0, 0, w, h);
	var loopArr = [];
	
	//log the data for inspection
	//console.log(starData);
	//console.log(starData.data);
	
	//change a few pixel values for a visual of the process:::
	
	//goal: input data into the storage array.
	//2) After every "'w'idth" loops switch to the next row in the storage array.

	
	for(var i=0; i<starData.data.length; i+=4){
		
  	if(starData.data[i+0] >= baseRGB || starData.data[i+1] >= baseRGB || starData.data[i+2] >= baseRGB){
			newMap.data[i+0]=255; //R value
			newMap.data[i+1]=0;	//G
			newMap.data[i+2]=0;	//B
			//newMap.data[i+3]=255;
			
			staticPixels.push([starData.data[i], starData.data[i+1], starData.data[i+2]]);
			loopArr[counter] = 1;
			//console.log("light spot found:" + i + "in loopArr[" + loopArr[counter] + "]");
  	}
  	else{
  		loopArr[counter] = 0;
  	}
  	
  	if(counter >= (w-1) ){
				counter = 0;
				foundPixels.push(loopArr);
			}
			else{
				counter++;
			}
  	
  	
  }
	ctx.putImageData(newMap, 0, 0);
	console.log("data length: " + starData.data.length);
	console.log("found pixels: " + foundPixels.length);
}

function copy(){
	var imgData = ctx.getImageData(0,0,350,350);
	//ctx.putImageData(imgData,10,70);
}


function RGB_sorter(){
	var vals = {};
	var map = ctx.getImageData(0, 0, w, h);
	
	for(var v=0; v<256; v++){
		//vals.push(v.toString() )
		/*if(vals[v.toString()] != null){
			vals[v.toString()] += 1;
		}
		else{
			vals[v.toString()] = 1;
		}*/
		
		vals[v.toString()] = 0;
	}
	
	/*for(var i=0; i<foundPixels.length; i++){
		for(var k=0; k<foundPixels[i].length; k++){
			vals = 
		}
	}*/
	
	//staticPixels
	
	console.log(vals);
}






/*possible solution: 
	get the x and y position of each found pixel and redraws a new image with them
	(black and white only; the contrast of the "on/off" colour scheme will make it easier for an A.I. to pick out clusters... or a regular I:)
	
*/
