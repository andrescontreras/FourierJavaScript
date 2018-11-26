	var constSum = {
        canvasWidth: 600, // In pixels.
        canvasHeight: 600, // In pixels.
        leftArrow: 37,
        upArrow: 38,
        rightArrow: 39,
        downArrow: 40,
        xMin: 0, // These four max/min values define a square on the xy-plane that the surface will be plotted over.
        xMax: 8,
        yMin: -1,
        yMax: 1, 
        xDelta: 0.01, // Make smaller for more surface points. 
        yDelta: 0.05, // Make smaller for more surface points. 
        colorMap: ["#060", "#090", "#0C0", "#0F0", "#9F0", "#9C0", "#990", "#960", "#930", "#900", "#C00"], // There are eleven possible "vertical" color values for the surface, based on the last row of http://www.cs.siena.edu/~lederman/truck/AdvanceDesignTrucks/html_color_chart.gif
        pointWidth: 2, // The size of a rendered surface point (i.e., rectangle width and height) in pixels.
        dTheta: 0.1, // The angle delta, in radians, by which to rotate the surface per key press.
        surfaceScale: 43 // An empirically derived constant that makes the surface a good size for the given canvas size.
      };
      
      // These are constants too but I've removed them from the above constants literal to ease typing and improve clarity.
      var X = 0;
      var Y = 1;
      var Z = 2;
  	  var controlKeyPressed = false; // Shared between processKeyDown() and processKeyUp().
      var superficie = new S(); // A set of points (in vector format) representing the surface.
	 function S()
      /*
        A surface is a list of (x, y, z) points, in 3 x 1 vector format. This is a constructor function.
      */
      {
        this.p = []; // An array of surface points in vector format. That is, each element of this array is a 3 x 1 array, as in [ [x1, y1, z1], [x2, y2, z2], [x3, y3, z3], ... ]
		    
      }
	S.prototype.color = function()
      /*
        The color of a surface point is a function of its z-coordinate height.
      */
      {
        var z; // The z-coordinate for a given surface point (x, y, z).
        
        this.zMin = this.zMax = this.p[0][Z]; // A starting value. Note that zMin and zMax are custom properties that could possibly be useful if this code is extended later.
        for (var i = 0; i < this.p.length; i++)
        {            
          z = this.p[i][Z];
          if (z < this.zMin) { this.zMin = z; }
          if (z > this.zMax) { this.zMax = z; }
        }   
              
        var zDelta = Math.abs(this.zMax - this.zMin) / constSum.colorMap.length; 
        
        for (var i = 0; i < this.p.length; i++)
        {
          this.p[i].color = constSum.colorMap[ Math.floor( (this.p[i][Z]-this.zMin)/zDelta ) ];
          
        }
      }
	S.prototype.sortByZIndex1 = function(A, B) 
      {
        return A[Z] - B[Z]; // Determines if point A is behind, in front of, or at the same level as point B (with respect to the z-axis).
      }
	S.prototype.draw1 = function()
      {
        var myCanvas = document.getElementById("suma"); // Required for Firefox.
        var ctx = myCanvas.getContext("2d");
		  
        this.p = superficie.p.sort(superficie.sortByZIndex1); // Sort the set of points based on relative z-axis position. If the points are visibly small, you can sort of get away with removing this step.

        for (var i = 0; i < this.p.length; i++)
        {
          ctx.fillStyle = this.p[i].color; 
          ctx.fillRect(this.p[i][X] * constants.surfaceScale, this.p[i][Y] * constants.surfaceScale, constSum.pointWidth, constSum.pointWidth);  
        }    
      }
	function appendCanvasElement1()
      /*
        Creates and then appends the "myCanvas" canvas element to the DOM.
      */
      {
        var canvasElement = document.getElementById('suma');
        
        //canvasElement.width = constants.canvasWidth;
        //canvasElement.height = constants.canvasHeight;
        //canvasElement.id = "myCanvas";

        canvasElement.getContext('2d').translate(constSum.canvasWidth/2, constSum.canvasHeight/2); // Translate the surface's origin to the center of the canvas.
        
        //document.body.appendChild(canvasElement); // Make the canvas element a child of the body element.
		
		
      }
 S.prototype.multi1 = function(R)
      /*
        Assumes that R is a 3 x 3 matrix and that this.points (i.e., P) is a 3 x n matrix. This method performs P = R * P.
      */
      {
        var Px = 0, Py = 0, Pz = 0; // Variables to hold temporary results.
        var P = this.p; // P is a pointer to the set of surface points (i.e., the set of 3 x 1 vectors).
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

      S.prototype.erase1 = function()
      {
        var myCanvas = document.getElementById("suma"); // Required for Firefox.
        var ctx = myCanvas.getContext("2d");

        ctx.clearRect(-constSum.canvasWidth/2, -constSum.canvasHeight/2, myCanvas.width, myCanvas.height);
      }

      // -----------------------------------------------------------------------------------------------------

      S.prototype.xRotate1 = function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */
      {
        var Rx = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Rx[0][0] = 1;
        Rx[0][1] = 0; // Redundant but helps with clarity.
        Rx[0][2] = 0; 
        Rx[1][0] = 0; 
        Rx[1][1] = Math.cos( sign*constSum.dTheta );
        Rx[1][2] = -Math.sin( sign*constSum.dTheta );
        Rx[2][0] = 0; 
        Rx[2][1] = Math.sin( sign*constSum.dTheta );
        Rx[2][2] = Math.cos( sign*constSum.dTheta );
        
        this.multi1(Rx); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase1(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw1();
      }
         
      // -----------------------------------------------------------------------------------------------------
         
      S.prototype.yRotate1 = function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */      
      {
        var Ry = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Ry[0][0] = Math.cos( sign*constSum.dTheta );
        Ry[0][1] = 0; // Redundant but helps with clarity.
        Ry[0][2] = Math.sin( sign*constSum.dTheta );
        Ry[1][0] = 0; 
        Ry[1][1] = 1;
        Ry[1][2] = 0; 
        Ry[2][0] = -Math.sin( sign*constSum.dTheta );
        Ry[2][1] = 0; 
        Ry[2][2] = Math.cos( sign*constSum.dTheta );
        
        this.multi1(Ry); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase1(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw1();
      }
 
      // -----------------------------------------------------------------------------------------------------
         
      S.prototype.zRotate1 = function(sign)
      /*
        Assumes "sign" is either 1 or -1, which is used to rotate the surface "clockwise" or "counterclockwise".
      */      
      {
        var Rz = [ [0, 0, 0],
                   [0, 0, 0],
                   [0, 0, 0] ]; // Create an initialized 3 x 3 rotation matrix.
                           
        Rz[0][0] = Math.cos( sign*constSum.dTheta );
        Rz[0][1] = -Math.sin( sign*constSum.dTheta );        
        Rz[0][2] = 0; // Redundant but helps with clarity.
        Rz[1][0] = Math.sin( sign*constSum.dTheta );
        Rz[1][1] = Math.cos( sign*constSum.dTheta );
        Rz[1][2] = 0;
        Rz[2][0] = 0
        Rz[2][1] = 0;
        Rz[2][2] = 1;
        
        this.multi1(Rz); // If P is the set of surface points, then this method performs the matrix multiplcation: Rx * P
        this.erase1(); // Note that one could use two canvases to speed things up, which also eliminates the need to erase.
        this.draw1();
      }
     
      // -----------------------------------------------------------------------------------------------------

      function processKeyDown1(evt)
      {                    
        if (evt.ctrlKey)
        {
          switch (evt.keyCode)
          {
            case constSum.upArrow: 
              // No operation other than preventing the default behavior of the arrow key.
              evt.preventDefault(); // This prevents the default behavior of the arrow keys, which is to scroll the browser window when scroll bars are present. The user can still scroll the window with the mouse.              
              break;
            case constSum.downArrow:
              // No operation other than preventing the default behavior of the arrow key.
              evt.preventDefault();
              break;
            case constSum.leftArrow:
              // console.log("ctrl+leftArrow");
              superficie.zRotate1(-1); // The sign determines if the surface rotates "clockwise" or "counterclockwise". 
              evt.preventDefault(); 
              break;
            case constSum.rightArrow:
              // console.log("ctrl+rightArrow");
              superficie.zRotate1(1);
              evt.preventDefault(); 
              break;
          }
          return; // When the control key is pressed, only the left and right arrows have meaning, no need to process any other key strokes (i.e., bail now).
        }
        
        // Assert: The control key is not pressed.

        switch (evt.keyCode)
        {
          case constSum.upArrow:
            // console.log("upArrow");
            superficie.xRotate1(1);
            evt.preventDefault(); 
            break;
          case constSum.downArrow:
            // console.log("downArrow");
            superficie.xRotate1(-1); 
            evt.preventDefault(); 
            break;
          case constSum.leftArrow:
            // console.log("leftArrow");
            surface.yRotate1(-1);  
            evt.preventDefault(); 
            break;
          case constSum.rightArrow:
            // console.log("rightArrow");
            superficie.yRotate1(1);   
            evt.preventDefault(); 
            break;
        }
      }
function onloadInit1()
      {
		
        appendCanvasElement1(); // Create and append the canvas element to the DOM.
        superficie.draw1(); // Draw the surface on the canvas.
        document.addEventListener('keydown', processKeyDown, false); // Used to detect if the control key has been pressed.*/
      }	
function ampliary(puntos)
{
	var superf = [];
	var i =0;
	var j =0;
	for(var x = constSum.xMin; x <= constSum.xMax ;x+=constSum.xDelta)
		{
			for(var y = constSum.yMin; y <= constSum.yMax ;y+=constSum.yDelta)
				{
					//console.log(point(x,y,puntos[j][Z]));
					superf[i]=point(x-4,y,(puntos[j][Z]));
					i++;
				}
			j++;
				
		}
	return superf;
}
function iniciarSuma(puntos)
{
	
	superficie.p = ampliary(puntos);
	superficie.color();
	window.addEventListener('load', onloadInit, false);
  onloadInit1();
  arriba();
  arriba();
  arriba();
  arriba();
  arriba();
  arriba();
  arriba();
  arriba();
  arriba();
  
}
function limpiarSum()
{
    superficie.erase1();
}
function arriba()
{
	superficie.xRotate1(1);
}
function abajo()
{
	superficie.xRotate1(-1);
	
}
function izquierda()
{
	superficie.yRotate1(-1);
	
}
function derecha()
{
	superficie.yRotate1(1);
	
}