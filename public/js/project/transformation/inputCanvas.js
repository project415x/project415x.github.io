/**
 * Input Canvas
 * This is where the input vector is being accepted into the system, manipulated by the matrix input, and then passed on to the output canvas
 */

/* Grid */
var drawGridLines = function(num_rectangles_wide, num_rectangles_tall, boundingRect) {
  var width_per_rectangle = boundingRect.width / num_rectangles_wide;
  var height_per_rectangle = boundingRect.height / num_rectangles_tall;
  for (var i = 0; i <= num_rectangles_wide; i++) {
    var xPos = boundingRect.left + i * width_per_rectangle;
    var topPoint = new paper.Point(xPos, boundingRect.top);
    var bottomPoint = new paper.Point(xPos, boundingRect.bottom);
    var aLine = new paper.Path.Line(topPoint, bottomPoint);
    aLine.strokeColor = 'black';

    if (i == num_rectangles_wide / 2) {
      aLine.strokeWidth = 5;
    }
  }
  for (var i = 0; i <= num_rectangles_tall; i++) {
    var yPos = boundingRect.top + i * height_per_rectangle;
    var leftPoint = new paper.Point(boundingRect.left, yPos);
    var rightPoint = new paper.Point(boundingRect.right, yPos);
    var aLine = new paper.Path.Line(leftPoint, rightPoint);
    aLine.strokeColor = 'black';

    if (i == num_rectangles_tall / 2) {
      aLine.strokeWidth = 5;
    }
  }
}

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

  console.log("values: " + values);
}

function drawAngle(center, vector, label) {
  var radius = 25,
    threshold = 10;
  if (vector.length < radius + threshold || Math.abs(vector.angle) < 15)
    return;
  var from = new Point(radius, 0);
  var through = from.rotate(vector.angle / 2);
  var to = from.rotate(vector.angle);
  var end = center + to;
  dashedItems.push(new Path.Line(center,
    center + new Point(radius + threshold, 0)));
  dashedItems.push(new Path.Arc(center + from, center + through, end));
  var arrowVector = to.normalize(7.5).rotate(vector.angle < 0 ? -90 : 90);
  dashedItems.push(new Path([
    end + arrowVector.rotate(135),
    end,
    end + arrowVector.rotate(-135)
  ]));
  if (label) {
    // Angle Label
    var text = new PointText(center + through.normalize(radius + 10) + new Point(0, 3));
    text.content = Math.floor(vector.angle * 100) / 100 + '°';
    text.fillColor = 'black';
    items.push(text);
  }
}

function drawLength(from, to, sign, label, value, prefix) {
  var lengthSize = 5;
  if ((to - from).length < lengthSize * 4)
    return;
  var vector = to - from;
  var awayVector = vector.normalize(lengthSize).rotate(90 * sign);
  var upVector = vector.normalize(lengthSize).rotate(45 * sign);
  var downVector = upVector.rotate(-90 * sign);
  var lengthVector = vector.normalize(
    vector.length / 2 - lengthSize * Math.sqrt(2));
  var line = new Path();
  line.add(from + awayVector);
  line.lineBy(upVector);
  line.lineBy(lengthVector);
  line.lineBy(upVector);
  var middle = line.lastSegment.point;
  line.lineBy(downVector);
  line.lineBy(lengthVector);
  line.lineBy(downVector);
  dashedItems.push(line);
  if (label) {
    // Length Label
    var textAngle = Math.abs(vector.angle) > 90 ? textAngle = 180 + vector.angle : vector.angle;
    // Label needs to move away by different amounts based on the
    // vector's quadrant:
    var away = (sign >= 0 ? [1, 4] : [2, 3]).indexOf(vector.quadrant) != -1 ? 8 : 0;
    value = value || vector.length;
    var text = new PointText({
      point: middle + awayVector.normalize(away + lengthSize),
      content: (prefix || '') + Math.floor(value * 1000) / 1000,
      fillColor: 'black',
      justification: 'center'
    });
    text.rotate(textAngle);
    items.push(text);
  }
}

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
    console.log("even.point: " + event.point);
    console.log("xy-origin: { x: " + xOrigin + ", y: " + yOrigin + " }");
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

  renderVector();
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

/* Export */
input.x = values.x;
input.y = values.y;
input.length = values.length;
input.angle = values.angle;
