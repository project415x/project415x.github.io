/**
 * Input Canvas
 * This is where the input vector is being accepted into the system, manipulated by the matrix input, and then passed on to the output canvas
 */

// Draw the grid. This function is in utils.js
drawGridLines(20, 20, paper.view.bounds);


// Origin
var xOrigin;
var yOrigin;
var vectorOrigin = {
  x: 250,
  y: 250
}

/* Vector */
var values = {
  fixLength: false,
  fixAngle: false,
  showCircle: false,
  showAngleLength: false,
  showCoordinates: false
};

var vectorStart, vector, vectorPrevious;
var vectorItem, items, dashedItems;

function processVector(event, drag) {

  // Gets vector relative to starting point
  // If vectorStart = vectorOrigin, the input vector doesn't draw
  vector = event.point - vectorStart;
  arrowVectorTemp =  event.point - vectorOrigin;

  // This is for connecting multiple vectors
  if (vectorPrevious) {
    if (values.fixLength && values.fixAngle) {
      vector = vectorPrevious;
    } else if (values.fixLength) {
      vector.length = vectorPrevious.length;
    } else if (values.fixAngle) {
      vector = vector.project(vectorPrevious);
    }
  }

  // Draw the vector
  drawVector(drag);
}

function drawVector(drag) {
  // Go through all of the vectors present, and then delete them
  if (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].remove();
    }
  }

  // Delete vector, and set items array to empty
  if (vectorItem)
    vectorItem.remove();
  items = [];

  var arrowVector = arrowVectorTemp.normalize(10);

  // Set inputs for the ouputCanvas
  input.x0 = vectorOrigin.x
  input.y0 = vectorOrigin.y

  // This is the endpoint of the vector
  // If vectorStart = vectorOrigin
  var end = vectorStart + vector;

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

  // Display:
  dashedItems = [];

  // Draw Circle
  if (values.showCircle) {
    dashedItems.push(new Path.Circle({
      center: vectorStart,
      radius: vector.length
    }));
  }

  // Draw angle labels
  if (values.showAngleLength) {
    drawAngle(vectorStart, vector, !drag);
    if (!drag)
      drawLength(vectorStart, end, vector.angle < 0 ? -1 : 1, true);
  }

  // Show coordinate labels
  var quadrant = vector.quadrant;
  if (values.showCoordinates && !drag) {
    drawLength(vectorStart, vectorStart + [vector.x, 0], [1, 3].indexOf(quadrant) != -1 ? -1 : 1, true, vector.x, 'x: ');
    drawLength(vectorStart, vectorStart + [0, vector.y], [1, 3].indexOf(quadrant) != -1 ? 1 : -1, true, vector.y, 'y: ');
  }

  // Create dashlines
  for (var i = 0, l = dashedItems.length; i < l; i++) {
    var item = dashedItems[i];
    item.strokeColor = 'black';
    item.dashArray = [1, 2];
    items.push(item);
  }

  // Update palette
  tempVector = vector + vectorStart - vectorOrigin;
  values.x = tempVector.x;
  values.y = tempVector.y;
  values.length = vector.length;
  values.angle = vector.angle;

  input.x = values.x;
  input.y = values.y;
  input.length = values.length / 10;
  input.angle = values.angle;

  //console.log("values: " + values);
}

// Stores a list of vectors that will be drawn in a dashed-line style.
var dashItem;

function onMouseDown(event) {
  // Endpoint for previous vector
  var end = vectorStart + vector;

  var create = false;
  // If shift key is entered, multiple vectors could be added
  if (event.modifiers.shift && vectorItem) {
    vectorStart = end;
    create = true;
  } else if (vector && (event.modifiers.option || end && end.getDistance(event.point) < 10)) {
    create = false;
  } else {
    // If vectorStart = vectorOrigin, the bug disappears but the vector isn't drawing
    vectorStart = event.point;

    // Debug
    //console.log("event.point: " + event.point);
    //console.log("xy-origin: { x: " + xOrigin + ", y: " + yOrigin + " }");
  }
  if (create) {
    dashItem = vectorItem;
    vectorItem = null;
  }

  processVector(event, true);
}

function onMouseDrag(event) {
  inputEvent = event;

  if (!event.modifiers.shift && values.fixLength && values.fixAngle)
    vectorStart = event.point;
  processVector(event, event.modifiers.shift);

  // From Joseph's attempt to have the input canvas call a function in the output canvas:
  // renderVector();

  // This causes everything to lock up:
  //var targetNode = document.getElementById("outputCanvas");
  //triggerMouseEvent(targetNode, "mousedown");
}

function onMouseUp(event) {
  processVector(event, false);

  if (dashItem) {
    dashItem.dashArray = [1, 2];
    dashItem = null;
  }

  vectorPrevious = vector;

  var targetNode = document.getElementById("outputCanvas");
  triggerMouseEvent(targetNode, "mousedown");
}

// Trigger Mouse Events
function triggerMouseEvent(node, eventType) {
  var clickEvent = document.createEvent('MouseEvents');
  clickEvent.initEvent(eventType, true, true);
  node.dispatchEvent(clickEvent);
}

// Export these variables to the global variables located in _includes/transformation.html
// Isn't this only called once, at initialization? How does this help?
input.x = values.x;
input.y = values.y;
input.length = values.length;
input.angle = values.angle;
