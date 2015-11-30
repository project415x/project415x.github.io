// Unused functions.


/* Vector */
var values = {
  fixLength: false,
  fixAngle: false,
  showCircle: false,
  showAngleLength: false,
  showCoordinates: false
};

// Some variables that are initialized for these functions.
var vectorStart, vector, vectorPrevious;
var vectorItem, items, dashedItems;
var dashItem;

/* What does this function do? */
function processVectorOutput(event, drag) {
  vector = event.point - vectorStart;
  if (vectorPrevious) {
    if (values.fixLength && values.fixAngle) {
      vector = vectorPrevious;
    } else if (values.fixLength) {
      vector.length = vectorPrevious.length;
    } else if (values.fixAngle) {
      vector = vector.project(vectorPrevious);
    }
  }
  drawVectorOutput(drag);
}

/* Probably draws the vector? */
function drawVectorOutput(drag) {

  console.log(drag);

  if (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      items[i].remove();
    }
  }
  if (vectorItem)
    vectorItem.remove();
  items = [];
  var arrowVector = vector.normalize(10);
  var end = vectorStart + vector;
  vectorItem = new Group([
    new Path([vectorStart, end]),
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
  // Draw Labels
  if (values.showAngleLength) {
    drawAngleOutput(vectorStart, vector, !drag);
    if (!drag)
      drawLengthOutput(vectorStart, end, vector.angle < 0 ? -1 : 1, true);
  }
  var quadrant = vector.quadrant;
  if (values.showCoordinates && !drag) {
    drawLengthOutput(vectorStart, vectorStart + [vector.x, 0], [1, 3].indexOf(quadrant) != -1 ? -1 : 1, true, vector.x, 'x: ');
    drawLengthOutput(vectorStart, vectorStart + [0, vector.y], [1, 3].indexOf(quadrant) != -1 ? 1 : -1, true, vector.y, 'y: ');
  }
  for (var i = 0, l = dashedItems.length; i < l; i++) {
    var item = dashedItems[i];
    item.strokeColor = 'black';
    item.dashArray = [1, 2];
    items.push(item);
  }
  // Update palette
  values.x = vector.x;
  values.y = vector.y;
  values.length = vector.length;
  values.angle = vector.angle;
}

/* Does this draw little dashed lines in the x and y direction showing the length of the vector? */
function drawAngleOutput(center, vector, label) {
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

function drawLengthOutput(from, to, sign, label, value, prefix) {
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

// function onMouseDrag(inputEvent) {
//   if (!inputEvent.modifiers.shift && values.fixLength && values.fixAngle)
//     vectorStart = inputEvent.point;
//   processVectorOutput(inputEvent, inputEvent.modifiers.shift);
// }



// From Joseph's attempt to have the input canvas call a function in the output canvas:
/*
renderVector = function() {
  console.log(input);

  fro = new Point(250, 250);

  // Same as input
  // to = new Point(250 + input.x, 250 + input.y);

  var mathCoords = convertToMathCoords(250 + input.x, 250 + input.y);
  var matrixApplied = applyMatrix(mathCoords[0], mathCoords[1], matrix);
  var screenCoords = convertToScreenCoords(matrixApplied[0], matrixApplied[1]);
  to = new Point(screenCoords[0], screenCoords[1]);

  straightLine = to - fro;

  var arrowVector = straightLine.normalize(10);

  if (vectorItem)
    vectorItem.remove();

  // Draw New Vector
  vectorItem = new Group([
    new Path([{
      x: 250,
      y: 250
    }, {
      // Same as input
      // x: 250 + input.x,
      // y: 250 + input.y

      // New Formula
      x: screenCoords[0],
      y: screenCoords[1]
    }]),

    // Arrows
    new Path([
      to + arrowVector.rotate(135),
      to,
      to + arrowVector.rotate(-135)
    ])
  ]);

  vectorItem.strokeColor = 'red';
  vectorItem.strokeWidth = 5;

  // If target is hit
  if(Math.abs(targetX - screenCoords[0]) <= 10 && Math.abs(targetY - screenCoords[1]) <= 10) {
    targetPath.visible = false;
    console.log("Target was hit!");

    scoreX = 460;
    scoreY = 40;
    var scorePath = new Path.Circle(new Point(scoreX, scoreY), 30);
    scorePath.fillColor = '#7CFC00';
    // scorePath.opacity = 0.75;
    score += 10;

    var text = new PointText(new Point(scoreX, scoreY + 7));
    text.justification = 'center';
    text.fillColor = 'black';
    text.content = score;
    text.fontSize = 20;

    targetX = getRandomInt(10, 460);
    targetY = getRandomInt(10, 460);
    targetPath = new Path.Circle(new Point(targetX, targetY), 10);
    targetPath.fillColor = 'blue';
  }


  console.log(straightLine);
}
*/
