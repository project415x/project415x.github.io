/**
 * Input Canvas
 * @description: This is where the input vector is being accepted into the system, manipulated by the matrix input, and then passed on to the output canvas
 */

/**
* Grid
* @description: Set up grid system (See grid.js). It'll always be 10 units away from the origin in each direction.
*/
drawGridLines(20, 20, paper.view.bounds);

/**
* Local Variables
* @description: Initalize them here
*/
var vectorItem, end;
// Override for arrowHead
var arrowVector, arrowVectorTemp;

/**
* Origin
* @description: Set origin at (250, 250)
*/
var vectorOrigin = {
  x: 0.5 * paper.view.bounds.width,
  y: 0.5 * paper.view.bounds.height
}

/**
* drawVector
* @description: raws the vector based on the proccessed data
* @override: Override existing drawVector
*/
function drawVector(event) {

  // Delete vector, and set items array to empty
  if (vectorItem) {
    vectorItem.remove();
  }

  // The vector starts at vectorOrigin and ends at event.point
  end = event.point;
  arrowVectorTemp =  end - vectorOrigin;
  arrowVector = arrowVectorTemp.normalize(10);

  // Draw the shaft and arrow tip of the vector
  vectorItem = new Group([
    new Path([vectorOrigin, end]),
    // This is for the arrow
    new Path([
      end + arrowVector.rotate(135),
      end,
      end + arrowVector.rotate(-135)
    ])
  ]);
  vectorItem.strokeWidth = 5;
  vectorItem.strokeColor = '#e4141b';
  
	  /**
	* Export
	* @description: Exports the data from this canvas to the middle-man
	*/
  // Set inputs for the ouputCanvas
  input.x0 = vectorOrigin.x
  input.y0 = vectorOrigin.y
  tempVector = end - vectorOrigin;
  input.x = tempVector.x;
  input.y = tempVector.y;

  // console.log(values);
}

/**
* onMouseDown
* @description: On mousedown trigger event, anchor the starting point of the vector which should be the origin (0, 0) -> (250, 250)
* @param: Mouse event
*/
function onMouseDown(event) {


    // Debug
    // console.log("even.point: " + event.point);
    // console.log("xy-origin: { x: " + xOrigin + ", y: " + yOrigin + " }");

  drawVector(event);
}

/**
* onMouseDrag
* @description: On mousedrag trigger event, draw and render the vector from the origin to wherever the mouse points in the grid (event.point)
* @param: Mouse event
*/
function onMouseDrag(event) {
  drawVector(event);
}

/**
* onMouseDrag
* @description: On mouseup trigger event, stop rendering the vector and pass data to the next functions
* @param: Mouse event
*/
function onMouseUp(event) {
  drawVector(event);
}
