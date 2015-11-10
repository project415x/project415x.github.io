/**
 * Output Canvas
 * This is where the output vector is being generated and shown in the DOM
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


/**
 * Target
 */
// Default Mode
var score = 0;
var targetX;
var targetY;
var targetPath;


/**
 * Target bounds
 */
// 0, 0
var point00 = convertToMathCoords(0, 0);
var point00MatrixApplied = applyMatrix(point00[0], point00[1], matrix);
var point00ScreenCoords = convertToScreenCoords(point00MatrixApplied[0], point00MatrixApplied[1]);

console.log("point00: " + point00ScreenCoords);

// 0, 500
var point01 = convertToMathCoords(0, 500);
var point01MatrixApplied = applyMatrix(point01[0], point01[1], matrix);
var point01ScreenCoords = convertToScreenCoords(point01MatrixApplied[0], point01MatrixApplied[1]);

console.log("point01: " + point01ScreenCoords);

// 500, 0
var point10 = convertToMathCoords(0, 500);
var point10MatrixApplied = applyMatrix(point10[0], point10[1], matrix);
var point10ScreenCoords = convertToScreenCoords(point10MatrixApplied[0], point10MatrixApplied[1]);

console.log("point10: " + point10ScreenCoords);

// 500, 500
var point11 = convertToMathCoords(500, 500);
var point11MatrixApplied = applyMatrix(point11[0], point11[1], matrix);
var point11ScreenCoords = convertToScreenCoords(point11MatrixApplied[0], point11MatrixApplied[1]);

console.log("point11: " + point11ScreenCoords);

// Get max and min values
var xBounds = [point00ScreenCoords[0], point01ScreenCoords[0], point10ScreenCoords[0], point11ScreenCoords[0]];
var yBounds = [point00ScreenCoords[1], point01ScreenCoords[1], point10ScreenCoords[1], point11ScreenCoords[1]];
var minBoundX = (Math.min.apply(Math, xBounds) < 0) ? 0 : Math.min.apply(Math, xBounds);
var maxBoundX = (Math.max.apply(Math, xBounds) > 500) ? 500 : Math.max.apply(Math, xBounds);
var minBoundY = (Math.min.apply(Math, yBounds) < 0) ? 0 : Math.min.apply(Math, yBounds);
var maxBoundY = (Math.max.apply(Math, yBounds) > 500) ? 500 : Math.max.apply(Math, yBounds);

console.log("minBoundX : " + minBoundX);
console.log("maxBoundX: " + maxBoundX);
console.log("minBoundY: " + minBoundY);
console.log("maxBoundY: " + maxBoundY);

// Add padding
var minBoundX = minBoundX + 10;
var maxBoundX = maxBoundX - 10;
var minBoundY = minBoundY + 10;
var maxBoundY = maxBoundY - 10;

console.log("minBoundX : " + minBoundX);
console.log("maxBoundX: " + maxBoundX);
console.log("minBoundY: " + minBoundY);
console.log("maxBoundY: " + maxBoundY);



/**
 * Game Modes
 * 0 - Default
 * 1 - XY-Axes
 * 2 - Straight Line
 * 3 - Circle
 * 4 - Shooting Gallery
 */


// Default
if (gameMode == 0) {
  targetX = getRandomInt(minBoundX, maxBoundX);
  targetY = getRandomInt(minBoundY, maxBoundY);
  targetPath = new Path.Circle(new Point(targetX, targetY), 10);
  targetPath.fillColor = '#e5e5ff';
}

// XY-Axes
if (gameMode == 1) {
  var randomNumber = getRandomInt(1, 10);

  if (randomNumber >= 5) {
    targetX = getRandomInt(minBoundX, maxBoundX);
    targetY = 250;
  } else {
    targetX = 250;
    targetY = getRandomInt(minBoundY, maxBoundY);
  }

  targetPath = new Path.Circle(new Point(targetX, targetY), 10);
  targetPath.fillColor = '#e5e5ff';
}

function onMouseDown(event) {
  // Check proximity of target
  function isClose(radius) {
    if (Math.abs(targetX - screenCoords[0]) <= radius && Math.abs(targetY - screenCoords[1]) <= radius) {
      return 1;
    }
    return 0;
  }

  console.log(input);

  fro = new Point(250, 250);

  /* Same as input */
  // to = new Point(250 + input.x, 250 + input.y);

  /* New Formula  */
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
      /* Same as input */
      // x: 250 + input.x,
      // y: 250 + input.y

      /* New Formula */
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

  /* Proximity Sensor */
  // #e5e5ff, #ccccff, #b2b2ff, #9999ff, #7f7fff, #6666ff, #4c4cff, #3232ff, #1919ff, #0000ff
  if (isClose(500)) {
    console.log("Target proximity 500");
    targetPath.fillColor = '#e5e5ff';
  }

  if (isClose(450)) {
    console.log("Target proximity 450");
    targetPath.fillColor = '#ccccff';
  }

  if (isClose(400)) {
    console.log("Target proximity 400");
    targetPath.fillColor = '#b2b2ff';
  }

  if (isClose(350)) {
    console.log("Target proximity 350");
    targetPath.fillColor = '#9999ff';
  }

  if (isClose(300)) {
    console.log("Target proximity 300");
    targetPath.fillColor = '#7f7fff';
  }

  if (isClose(250)) {
    console.log("Target proximity 250");
    targetPath.fillColor = '#6666ff';
  }

  if (isClose(200)) {
    console.log("Target proximity 200");
    targetPath.fillColor = '#4c4cff';
  }

  if (isClose(150)) {
    console.log("Target proximity 150");
    targetPath.fillColor = '#3232ff';
  }

  if (isClose(100)) {
    console.log("Target proximity 100");
    targetPath.fillColor = '#1919ff';
  }

  if (isClose(50)) {
    console.log("Target proximity 50");
    targetPath.fillColor = '#0000ff';
  }

  /* If target is hit */
  if (isClose(10)) {
    // Hide the target that was hit
    targetPath.visible = false;
    console.log("Target was hit!");
    console.log("Target hit in gameMode " + gameMode);

    // Create the score circle
    scoreX = 460;
    scoreY = 40;
    var scorePath = new Path.Circle(new Point(scoreX, scoreY), 30);
    scorePath.fillColor = '#7CFC00';
    // scorePath.opacity = 0.75;

    // Change the score text
    score += 10;
    var text = new PointText(new Point(scoreX, scoreY + 7));
    text.justification = 'center';
    text.fillColor = 'black';
    text.content = score;
    text.fontSize = 20;

    // Create a new random target
    // targetX = getRandomInt(10, 460);
    // targetY = 250;
    // targetPath = new Path.Circle(new Point(targetX, targetY), 10);
    // targetPath.fillColor = '#e5e5ff';

    // Default
    if (gameMode == 0) {
      // Create a new random target
      targetX = getRandomInt(minBoundX, maxBoundX);
      targetY = getRandomInt(minBoundY, maxBoundY);
      targetPath = new Path.Circle(new Point(targetX, targetY), 10);
      targetPath.fillColor = '#e5e5ff';
      console.log("gameMode " + gameMode + " target has been created");
    }

    // XY-Axes
    if (gameMode == 1) {
      randomNumber = getRandomInt(1, 10);

      if (randomNumber >= 5) {
        targetX = getRandomInt(minBoundX, maxBoundX);
        targetY = 250;
      } else {
        targetX = 250;
        targetY = getRandomInt(minBoundY, maxBoundY);
      }

      targetPath = new Path.Circle(new Point(targetX, targetY), 10);
      targetPath.fillColor = '#e5e5ff';

      console.log("gameMode " + gameMode + " target has been created");
    }

    // Straight Line
    if (gameMode == 3) {
      var circleGuide = new Path.Circle(new Point(250, 250), 100);
      circleGuide.fillColor = 'red';
      circleGuide.opacity = 0.25;

      var targetPath0 = new Path.Circle(new Point(250, 250), 10);
      targetPath0.fillColor = '#e5e5ff';

      var targetPath1 = new Path.Circle(new Point(250, 150), 10);
      targetPath1.fillColor = '#e5e5ff';

      var targetPath2 = new Path.Circle(new Point(250, 350), 10);
      targetPath2.fillColor = '#e5e5ff';

      var targetPath3 = new Path.Circle(new Point(150, 250), 10);
      targetPath3.fillColor = '#e5e5ff';

      var targetPath4 = new Path.Circle(new Point(350, 250), 10);
      targetPath4.fillColor = '#e5e5ff';

      var targetPath5 = new Path.Circle(new Point(320, 320), 10);
      targetPath5.fillColor = '#e5e5ff';

      var targetPath6 = new Path.Circle(new Point(180, 180), 10);
      targetPath6.fillColor = '#e5e5ff';

      var targetPath7 = new Path.Circle(new Point(180, 320), 10);
      targetPath7.fillColor = '#e5e5ff';

      var targetPath8 = new Path.Circle(new Point(320, 180), 10);
      targetPath8.fillColor = '#e5e5ff';
      //
      // var targetPath9 = new Path.Circle(new Point(390, 390), 10);
      // targetPath9.fillColor = '#e5e5ff';
      //
      // var targetPath10 = new Path.Circle(new Point(430, 430), 10);
      // targetPath10.fillColor = '#e5e5ff';
      //
      // var targetPath11 = new Path.Circle(new Point(470, 470), 10);
      // targetPath11.fillColor = '#e5e5ff';

      console.log("gameMode " + gameMode + " target has been created");
    }

    // Straight Line
    if (gameMode == 2) {
      var targetPath0 = new Path.Circle(new Point(30, 30), 10);
      targetPath0.fillColor = '#e5e5ff';

      var targetPath1 = new Path.Circle(new Point(70, 70), 10);
      targetPath1.fillColor = '#e5e5ff';

      var targetPath2 = new Path.Circle(new Point(110, 110), 10);
      targetPath2.fillColor = '#e5e5ff';

      var targetPath3 = new Path.Circle(new Point(150, 150), 10);
      targetPath3.fillColor = '#e5e5ff';

      var targetPath4 = new Path.Circle(new Point(190, 190), 10);
      targetPath4.fillColor = '#e5e5ff';

      var targetPath5 = new Path.Circle(new Point(230, 230), 10);
      targetPath5.fillColor = '#e5e5ff';

      var targetPath6 = new Path.Circle(new Point(270, 270), 10);
      targetPath6.fillColor = '#e5e5ff';

      var targetPath7 = new Path.Circle(new Point(310, 310), 10);
      targetPath7.fillColor = '#e5e5ff';

      var targetPath8 = new Path.Circle(new Point(350, 350), 10);
      targetPath8.fillColor = '#e5e5ff';

      var targetPath9 = new Path.Circle(new Point(390, 390), 10);
      targetPath9.fillColor = '#e5e5ff';

      var targetPath10 = new Path.Circle(new Point(430, 430), 10);
      targetPath10.fillColor = '#e5e5ff';

      var targetPath11 = new Path.Circle(new Point(470, 470), 10);
      targetPath11.fillColor = '#e5e5ff';

      console.log("gameMode " + gameMode + " target has been created");
    }

    // Shooting Gallery
    if (gameMode == 4) {
      targetX = getRandomInt(10, 490);
      targetY = getRandomInt(10, 490);
      targetPath = new Path.Circle(new Point(targetX, targetY), 20);
      targetPath.fillColor = '#e5e5ff';

      // Change target text
      var targetText = new PointText(new Point(targetX, targetY + 5));
      targetText.justification = 'center';
      targetText.fillColor = 'white';
      targetText.content = '30';
      targetText.fontSize = 12;

      function startTimer(duration) {
        var timer = duration,
          minutes, seconds;
        setInterval(function() {
          minutes = parseInt(timer / 60, 10)
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          targetText.visible = seconds;
          targetText.content = seconds;

          console.log(seconds);

          // When the time comes... :)
          if (--timer < 0) {
            timer = duration;

            targetPath.visible = false;
            console.log("Target was gone! Uh oh!");

            targetX = getRandomInt(10, 490);
            targetY = getRandomInt(10, 490);
            targetPath = new Path.Circle(new Point(targetX, targetY), 20);
            targetPath.fillColor = '#e5e5ff';

            // Change the score text
            targetText = new PointText(new Point(targetX, targetY + 5));
            targetText.justification = 'center';
            targetText.fillColor = 'white';
            targetText.content = '30';
            targetText.fontSize = 12;
          }
        }, 1000);
      }

      startTimer(30);
    }
  }

  // Shooting Gallery
  // if(gameMode == 4) {
  //   targetX = getRandomInt(10, 490);
  //   targetY = getRandomInt(10, 490);
  //   targetPath = new Path.Circle(new Point(targetX, targetY), 10);
  //   // targetPath.fillColor = '#e5e5ff';
  //
  //   function removeTarget() {
  //     targetPath.visible = false;
  //     console.log("Target was removed!");
  //   }
  //
  //   setInterval(removeTarget(), 1000);
  //
  //   console.log("gameMode " + gameMode + " target has been created");
  // }

  console.log(straightLine);
}
