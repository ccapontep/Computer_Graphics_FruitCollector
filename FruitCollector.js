"use strict";

var canvas;
var gl;
var program;


var projectionMatrix;
var modelViewMatrix;

var instanceMatrix;

var modelViewMatrixLoc;

var button =  false;
var angle_3 = 0;

var ee_x;
var ee_y;

var point_x;
var point_y;

var ang;
var temp_x, temp_y ; 

var vertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var baseId = 0;
var joint1Id  = 1;
var joint2Id = 2;
var joint3Id = 3;

var baseHeight = 1.0;
var baseWidth = 3.0;
var joint1Height = 4.5;
var joint1Width = 0.25;
var joint2Height  = 4.5;
var joint2Width  = 0.25;
var joint3Height  = 4.5;
var joint3Width  = 0.25;

var square = 1;

var numNodes = 4;
var numAngles = 4;
var angle = 0;

var theta = [0, 0, 0, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var pointsArray = [];

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------


function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

function initNodes(Id) 
{

    var m = mat4();

    switch(Id) {

    case baseId:
    m = rotate(theta[baseId], 0, 1, 0 );
    m = mult(translate(0, -8, 0), m);
    figure[baseId] = createNode( m, base, null, joint1Id );
    break;

    case joint1Id:

    m = translate(0.0, baseHeight, 0.0);
	m = mult(m, rotate(theta[joint1Id], 1, 0, 0));
    figure[joint1Id] = createNode( m, joint1, null, joint2Id);
    break;

    case joint2Id:

    m = translate(0.0, joint1Height, 0.0);
	m = mult(m, rotate(theta[joint2Id], 1, 0, 0));
    figure[joint2Id] = createNode( m, joint2, null, joint3Id );
    break;

    case joint3Id:

    m = translate(0.0,joint2Height, 0.0);
	m = mult(m, rotate(theta[joint3Id], 0, 0, 1));
    figure[joint3Id] = createNode( m, joint3, null, null );
    break; 

}}

function traverse(Id) 
{

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

function base() 
{

    instanceMatrix = mult(modelViewMatrix, translate(0, 0.5*baseHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( baseWidth, baseHeight, baseWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function joint1() 
{

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * joint1Height, 0.0 ));
	instanceMatrix = mult(instanceMatrix, scale4(joint1Width, joint1Height, joint1Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

function joint2() 
{

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * joint2Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(joint2Width, joint2Height, joint2Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}
function joint3() 
{

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * joint3Height, 0.0) );
	instanceMatrix = mult(instanceMatrix, scale4(joint3Width, joint3Height, joint3Width) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    ee_x = instanceMatrix [0][3];
    ee_y = instanceMatrix [1][3];
}
function point() 
{

    instanceMatrix = mult(modelViewMatrix, translate(-3.0, 0.5 * square, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4(square, square, square) );
    instanceMatrix = mult(instanceMatrix, rotate(theta[4], 1, 0, 0 ) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
    point_x = instanceMatrix [0][3];
    point_y = instanceMatrix [1][3];
}
function quad(a, b, c, d) 
{
     pointsArray.push(vertices[a]);
     pointsArray.push(vertices[b]);
     pointsArray.push(vertices[c]);
     pointsArray.push(vertices[d]);
}


function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() 
{

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.0, 0.0, 0.0, 0.0);




    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");


    cube();

    vBuffer = gl.createBuffer();

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    for(i=0; i<numNodes; i++) initNodes(i);

    document.getElementById("Button1").onclick = function()
    {  button =  !button; };


    render();
}


var render = function() 
{

        gl.clear( gl.COLOR_BUFFER_BIT );
        temp_x = point_x - ee_x ;
        temp_y = point_y - ee_y ;
        ang = Math.atan2(temp_y, temp_x)* 180 / Math.PI;;
        if (button)
        {
            if (theta[3] > ang)
                angle_3++;
            theta[3] = angle_3;
        
        }
        for(i=0; i<numNodes; i++) initNodes(i);
        traverse(baseId);
        point();
        requestAnimFrame(render);

        
}
