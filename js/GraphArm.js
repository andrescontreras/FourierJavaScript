
var constants = {
  canvasWidth: 600, // In pixels.
  canvasHeight: 600, // In pixels.
  leftArrow: 37,
  upArrow: 38,
  rightArrow: 39,
  downArrow: 40,
  xMin: 0, // These four max/min values define a square on the xy-plane that the surface will be plotted over.
  xMax: 8,
  yMin: -4,
  yMax: 4,
  xDelta: 0.01, // Make smaller for more surface points. 
  yDelta: 2, // Make smaller for more surface points. 
  colorMap: ["#e4e825", "#1ecbea", "#ea281d", "#1dea57", "#ea1d5a", "#1d23ea", "#ce1dea", "#ea911d", "#1deaac", "#a91dea", "#79ea1d"], // There are eleven possible "vertical" color values for the surface, based on the last row of http://www.cs.siena.edu/~lederman/truck/AdvanceDesignTrucks/html_color_chart.gif
  pointWidth: 1.3, // The size of a rendered surface point (i.e., rectangle width and height) in pixels.
  dTheta: 0.1, // The angle delta, in radians, by which to rotate the surface per key press.
  surfaceScale: 55 // An empirically derived constant that makes the surface a good size for the given canvas size.
};

// These are constants too but I've removed them from the above constants literal to ease typing and improve clarity.
var X = 0;
var Y = 1;
var Z = 2;

// -----------------------------------------------------------------------------------------------------

var controlKeyPressed = false; // Shared between processKeyDown() and processKeyUp().
var surface = new Surface(); // A set of points (in vector format) representing the surface.

// -----------------------------------------------------------------------------------------------------

function point(x, y, z)
      /*
        Given a (x, y, z) surface point, returns the 3 x 1 vector form of the point.
      */ {
  return [x, y, z]; // Return a 3 x 1 vector representing a traditional (x, y, z) surface point. This vector form eases matrix multiplication.
}

// -----------------------------------------------------------------------------------------------------

function Surface()
      /*
        A surface is a list of (x, y, z) points, in 3 x 1 vector format. This is a constructor function.
      */ {
  this.points = []; // An array of surface points in vector format. That is, each element of this array is a 3 x 1 array, as in [ [x1, y1, z1], [x2, y2, z2], [x3, y3, z3], ... ]
  this.sum = [];
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.equation = function (x, armonico, f)
      /*
        Given the point (x, y), returns the associated z-coordinate based on the provided surface equation, of the form z = f(x, y).
      */ {
  //
  console.log(armonico, f);
  return armonico.Cn * (Math.sin(2 * Math.PI * armonico.numero * 1 / 7 * x + armonico.Theta)); // Return the z-coordinate for the point (x, y, z).

}
Surface.prototype.escala = function (nArm) {
  constants.yDelta = 8 / nArm;
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.generate = function (armonicos, f)
      /*
        Creates a list of (x, y, z) points (in 3 x 1 vector format) representing the surface.
      */ {
  for (var i = 0; i <= armonicos.length; i++) {

  }
  var i = 0;
  var suma = 0;
  var x1 = 0;
  var color = 1;
  constants.yMax = armonicos.length;
  for (var x = constants.xMin + 1; x <= constants.xMax + 1; x += constants.xDelta) {
    var narm = 1;
    color = 1;
    for (var y = constants.yMin; narm < armonicos.length; y += constants.yDelta) {
      console.log("Valor Y", y, narm);
      suma += (this.equation(x, armonicos[narm], f));

      //console.log(point(x, y, this.equation(x,y,armonicos[narm],f)),"nArm ",narm);

      this.points[i] = point(x - 5, y, this.equation(x, armonicos[narm], f)); // Store a surface point (in vector format) into the list of surface points.
      this.points[i].color = constants.colorMap[color % 10];
      ++i;
      narm++;
      color++;
    }
    this.sum[x1] = point(x - 5, 1, suma);
    x1++;
    suma = 0;
    console.log("TERMINO");
  }
  console.log("MATRIX");
  console.log(this.sum[0][X]);
  console.log(this.sum[0][Y]);
  console.log(this.sum[0][Z]);
}
/// suma

Surface.prototype.suma = function ()
      /*
        Creates a list of (x, y, z) points (in 3 x 1 vector format) representing the surface.
      */ {
  var i = 0;
  var j = 1;

  for (var x = constants.xMin; x <= constants.xMax; x += constants.xDelta) {
    j = 1;
    for (var y = -2; y <= 2; y += 0.1) {

      this.sum[i] = point(x, y, this.equation(x, y, j)); // Store a surface point (in vector format) into the list of surface points.

      ++i;
      j++;
    }
    console.log("Termino ciclo y");
    alert("jajajajaj");
  }

}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.color = function ()
      /*
        The color of a surface point is a function of its z-coordinate height.
      */ {
  var ejey = [];
  var n = 0;
  var encontro = false;
  for (var j = constants.yMin; j <= constants.yMax; j += constants.yDelta) {
    ejey[n] = j;
    n++;
  }
  //console.log("ES: ",ejey);
  //alert("Espere");
  for (var i = 0; i < this.points.length; i++) {
    encontro = false;
    for (var j = 0; j <= ejey.length && !encontro; j++) {
      console.log("V: ", this.points[i][Y], "__", ejey[j]);
      if (this.points[i][Y] == ejey[j]) {
        this.points[i].color = constants.colorMap[j % 10]
        //console.log("MOD",j%10);
        encontro = true;
      }
    }
  }
  //console.log("Salio");

}
// -----------------------------------------------------------------------------------------------------

function appendCanvasElement()
      /*
        Creates and then appends the "myCanvas" canvas element to the DOM.
      */ {
  var canvasElement = document.getElementById('armonicos');

  //canvasElement.width = constants.canvasWidth;
  //canvasElement.height = constants.canvasHeight;
  //canvasElement.id = "myCanvas";

  canvasElement.getContext('2d').translate(constants.canvasWidth / 2, constants.canvasHeight / 2); // Translate the surface's origin to the center of the canvas.

  //document.body.appendChild(canvasElement); // Make the canvas element a child of the body element.


}

//------------------------------------------------------------------------------------------------------

Surface.prototype.sortByZIndex = function (A, B) {
  return A[Z] - B[Z]; // Determines if point A is behind, in front of, or at the same level as point B (with respect to the z-axis).
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.draw = function () {
  var myCanvas = document.getElementById("armonicos"); // Required for Firefox.
  var ctx = myCanvas.getContext("2d");

  this.points = surface.points.sort(surface.sortByZIndex); // Sort the set of points based on relative z-axis position. If the points are visibly small, you can sort of get away with removing this step.

  for (var i = 0; i < this.points.length; i++) {
    ctx.fillStyle = this.points[i].color;
    ctx.fillRect(this.points[i][X] * constants.surfaceScale, this.points[i][Y] * constants.surfaceScale, constants.pointWidth, constants.pointWidth);

  }
}


// -----------------------------------------------------------------------------------------------------

Surface.prototype.multi = function (R)
      /*
        Assumes that R is a 3 x 3 matrix and that this.points (i.e., P) is a 3 x n matrix. This method performs P = R * P.
      */ {
  var Px = 0, Py = 0, Pz = 0; // Variables to hold temporary results.
  var P = this.points; // P is a pointer to the set of surface points (i.e., the set of 3 x 1 vectors).
  var sum; // The sum for each row/column matrix product.

  for (var V = 0; V < P.length; V++) // For all 3 x 1 vectors in the point list.
  {
    Px = P[V][X], Py = P[V][Y], Pz = P[V][Z];
    for (var Rrow = 0; Rrow < 3; Rrow++) // For each row in the R matrix.
    {
      sum = (R[Rrow][X] * Px) + (R[Rrow][Y] * Py) + (R[Rrow][Z] * Pz);
      P[V][Rrow] = sum;
    }
  }
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.erase = function () {
  var myCanvas = document.getElementById("armonicos"); // Required for Firefox.
  var ctx = myCanvas.getContext("2d");

  ctx.clearRect(-constants.canvasWidth / 2, -constants.canvasHeight / 2, myCanvas.width, myCanvas.height);
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.xRotate = function (sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */ {
  var Rx = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

  Rx[0][0] = 1;
  Rx[0][1] = 0; // Redundant but helps with clarity.
  Rx[0][2] = 0;
  Rx[1][0] = 0;
  Rx[1][1] = Math.cos(sign * constants.dTheta);
  Rx[1][2] = -Math.sin(sign * constants.dTheta);
  Rx[2][0] = 0;
  Rx[2][1] = Math.sin(sign * constants.dTheta);
  Rx[2][2] = Math.cos(sign * constants.dTheta);

  this.multi(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
  this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
  this.draw();
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.yRotate = function (sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */ {
  var Ry = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

  Ry[0][0] = Math.cos(sign * constants.dTheta);
  Ry[0][1] = 0; // Redundant but helps with clarity.
  Ry[0][2] = Math.sin(sign * constants.dTheta);
  Ry[1][0] = 0;
  Ry[1][1] = 1;
  Ry[1][2] = 0;
  Ry[2][0] = -Math.sin(sign * constants.dTheta);
  Ry[2][1] = 0;
  Ry[2][2] = Math.cos(sign * constants.dTheta);

  this.multi(Ry); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
  this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
  this.draw();
}

// -----------------------------------------------------------------------------------------------------

Surface.prototype.zRotate = function (sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */ {
  var Rz = [[0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]]; // Create an initialized 3 x 3 rotation matrix.

  Rz[0][0] = Math.cos(sign * constants.dTheta);
  Rz[0][1] = -Math.sin(sign * constants.dTheta);
  Rz[0][2] = 0; // Redundant but helps with clarity.
  Rz[1][0] = Math.sin(sign * constants.dTheta);
  Rz[1][1] = Math.cos(sign * constants.dTheta);
  Rz[1][2] = 0;
  Rz[2][0] = 0
  Rz[2][1] = 0;
  Rz[2][2] = 1;

  this.multi(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
  this.erase(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
  this.draw();
}

// -----------------------------------------------------------------------------------------------------

function processKeyDown(evt) {
  if (evt.ctrlKey) {
    switch (evt.keyCode) {
      case constants.upArrow:
        // No operation other than preventing the default behavior of the arrow key.
        evt.preventDefault(); // This prevents the default behavior of the arrow keys, which is to scroll the browser window when scroll bars are present. The user can still scroll the window with the mouse.
        break;
      case constants.downArrow:
        // No operation other than preventing the default behavior of the arrow key.
        evt.preventDefault();
        break;
      case constants.leftArrow:
        // console.log("ctrl+leftArrow");
        surface.zRotate(-1); // The sign determines if the surface rotates "clockwise" or "counterclockwise".
        evt.preventDefault();
        break;
      case constants.rightArrow:
        // console.log("ctrl+rightArrow");
        surface.zRotate(1);
        evt.preventDefault();
        break;
    }
    return; // When the control key is pressed, only the left and right arrows have meaning, no need to process any other key strokes (i.e., bail now).
  }

  // Assert: The control key is not pressed.

  switch (evt.keyCode) {
    case constants.upArrow:
      // console.log("upArrow");
      surface.xRotate(1);
      evt.preventDefault();
      break;
    case constants.downArrow:
      // console.log("downArrow");
      surface.xRotate(-1);
      evt.preventDefault();
      break;
    case constants.leftArrow:
      // console.log("leftArrow");
      surface.yRotate(-1);
      evt.preventDefault();
      break;
    case constants.rightArrow:
      // console.log("rightArrow");
      surface.yRotate(1);
      evt.preventDefault();
      break;
  }
}

// -----------------------------------------------------------------------------------------------------

function onloadInit() {

  appendCanvasElement(); // Create and append the canvas element to the DOM.
  surface.draw(); // Draw the surface on the canvas.
  document.addEventListener('keydown', processKeyDown, false); // Used to detect if the control key has been pressed.*/
}

// -----------------------------------------------------------------------------------------------------

function graficar(armonicos, f) {
  // armonicos es un arrglo de armonicos
  //alert("Funcion grafica, tamaño de los armonicos "+ armonicos.length) ;
  for (var i = 0; i < armonicos.length; i++) {
    console.log(armonicos[i]);
  }
  //alert("Despues del for") ;
  surface.escala(armonicos.length);
  surface.generate(armonicos, f); // Creates the set of points reprsenting the surface. Must be called before color().
  //surface.color(); // Based on the min and max z-coordinate values, chooses colors for each point based on the point's z-ccordinate value (i.e., height).
  window.addEventListener('load', onloadInit, false); // Perform processing that must occur after the page has fully loaded.// JavaScript Document
  onloadInit();
  //alert("armonicos");
  surface.xRotate(-1);
  surface.xRotate(-1);
  surface.xRotate(-1);
  surface.xRotate(-1);
  surface.xRotate(-1);
  iniciarSuma(surface.sum);

}

function prueba() {
  var armonicos = [];

  var arm1 = new Armonico();
  arm1.numero = 1;
  arm1.An = -0.225079079;
  arm1.Bn = 0.093230807;
  arm1.Cn = 0.24362384;
  arm1.Theta = 2.748893572;

  var arm2 = new Armonico();
  arm2.numero = 2;
  arm2.An = 0.159154943;
  arm2.Bn = -0.477464829;
  arm2.Cn = 0.503292121;
  arm2.Theta = -1.249045772;

  var arm3 = new Armonico();
  arm3.numero = 3;
  arm3.An = 0.07502636;
  arm3.Bn = -0.181129655;
  arm3.Cn = 0.196053326;
  arm3.Theta = -1.178097245;

  var arm4 = new Armonico();
  arm4.numero = 4;
  arm4.An = -0.159154943;
  arm4.Bn = -9.74942e-18;
  arm4.Cn = 0.159154943;
  arm4.Theta = -3.141592654;

  var arm5 = new Armonico();
  arm5.numero = 5;
  arm5.An = 0.045015816;
  arm5.Bn = 0.108677793;
  arm5.Cn = 0.117631996;
  arm5.Theta = 1.178097245;

  var arm6 = new Armonico();
  arm6.numero = 6;
  arm6.An = 0.053051648;
  arm6.Bn = 0.159154943;
  arm6.Cn = 0.16776404;
  arm6.Theta = 1.249045772;

  var arm7 = new Armonico();
  arm7.numero = 7;
  arm7.An = -0.032154154;
  arm7.Bn = -0.013318687;
  arm7.Cn = 0.034803406;
  arm7.Theta = -2.748893572;

  armonicos[0] = arm1;
  armonicos[1] = arm2;
  armonicos[2] = arm3;
  armonicos[3] = arm4;
  armonicos[4] = arm5;
  armonicos[5] = arm6;
  armonicos[6] = arm7;

  graficar(armonicos, 0.125);
}
function limpiar() {
  surface.erase();
  limpiarSum();
}