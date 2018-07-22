var renderer,
	scene,
	camera,
	light,
	light2;

//var fruit ;
var angx;

var angle_grabber = 0; // grabber_base current angle at the moment
var angx_backup = 0;
var orange_counter = 0;
var apple_counter = 0;

var once = false;
var free_fall = false;
var step_1_check = false;
var step_2_check = false;
var step_3_check = false;
var orange_check = false;
var apple_check = false;
var translation_part = false;

///RENDERER
renderer = new THREE.WebGLRenderer({canvas: myCanvas, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );
///SCENE
scene = new THREE.Scene();
///CAMERA
camera = new THREE.PerspectiveCamera( 55, window.innerWidth/window.innerHeight, 0.1, 3000 );
var controls = new THREE.OrbitControls( camera );
camera.position.set( 2000, 1200, 1400 );
controls.update();
///LIGHTS
light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//GIANT - CUBE //
var earth_geometry = new THREE.CubeGeometry(5000,0,5000);
var earth_material= new THREE.MeshBasicMaterial({ color: 0xb32d00 });
var earth = new THREE.Mesh(earth_geometry,earth_material);
scene.add(earth);
// END-OF-GIANT-CUBE//

//TREEE
var tree = new THREE.Tree({
    generations : 3,        // # for branch' hierarchy
    length      : 200,      // length of root branch
    uvLength    : 600.0,     // uv.v ratio against geometry length (recommended is generations * length)
    radius      : 20,      // radius of root branch
    radiusSegments : 16,     // # of radius segments for each branch geometry
    heightSegments : 32      // # of height segments for each branch geometry
});

var geometryt = THREE.TreeGeometry.build(tree);

var trex_1 = new THREE.Mesh( geometryt, new THREE.MeshPhongMaterial({ color: 0x8B4513 })); // set any material
trex_1.position.set(500, earth.getWorldPosition().y, -500)

var trex_3 = new THREE.Mesh( geometryt, new THREE.MeshPhongMaterial({color: 0x8B4513})); // set any material
trex_3.position.set(-500, earth.getWorldPosition().y, -500)

var trex_4 = new THREE.Mesh( geometryt, new THREE.MeshPhongMaterial({color: 0x8B4513})); // set any material
trex_4.position.set(0, earth.getWorldPosition().y, -500)

scene.add(trex_1, trex_3, trex_4);

/// LEAF
var distance_y = [700, 400, 700, 500, 700, 400, 700, 500, 500];
var distance_z = [-300, -100, 300, 100, -200, 200, 0, 300, -200];

var distance_y = [700, 700, 700, 400, 400, 700, 500, 500, 500];
var distance_z = [-300, 300, -200, 200, -100, 0, 300, -200, 100];
var leaf_geometry = new THREE.SphereGeometry(100,100,100);
leaf_geometry.scale(3, 1.5, 1.5)
var leaf_material_1 = new THREE.MeshBasicMaterial({ color: 0x00CC33 });
var leaf_material_2 = new THREE.MeshBasicMaterial({ color: 0x33CC00  });

var change_leaf = true;
var leaf_1 = new THREE.Mesh( leaf_geometry, leaf_material_1 );
var leaf_2 = new THREE.Mesh( leaf_geometry, leaf_material_2 );
var leaf_group = new THREE.Object3D();
for (var j = 2; j < 5; j++){
	for ( var i = 0; i < 9; i ++ ) { // create 8 set of leafs
			if (change_leaf) {
				var leaf_instance = leaf_1.clone(); // clone the leaf
				change_leaf = !change_leaf;}
			else {
				var leaf_instance = leaf_2.clone();
				change_leaf = !change_leaf;}

			leaf_group.add(leaf_instance);
			//for (var j = 0; j < 5; j++){
			if (j==2) trex_1.add(leaf_instance); // add to 1st tree truck
			//else if (j==2) trex_2.add(leaf_instance); // add to 2nd tree truck
			else if (j==3) trex_3.add(leaf_instance); // add to 3rd tree truck
			else if (j==4) trex_4.add(leaf_instance); // add to 4th tree truck
			leaf_instance.position.set(0, distance_y[i] , distance_z[i]);
	}
}
scene.add(leaf_group);
/////////// END OF TREE ///////////////

/////////// BASKET ///////////////////
var basket_geometry = new THREE.CylinderGeometry(100,50,50);
basket_geometry.scale(1, 3, 1)
basket_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,75,0));
var basket_texture = new THREE.TextureLoader().load("basket_texture.jpg");
var basket_material = new THREE.MeshPhongMaterial({ map: basket_texture });
basket_texture.wrapS = THREE.RepeatWrapping;
basket_texture.wrapT = THREE.RepeatWrapping;
basket_texture.repeat.set( 5, 5);

var basket = new THREE.Mesh(basket_geometry,basket_material);
basket.position.set(1100, earth.getWorldPosition().y, 100);
scene.add(basket)
///////////// END BASKET //////////////

//CONSTRUCT THE ROBOT//
//BASE
var base_geometry = new THREE.CylinderGeometry(50,50,25);
var base_material = new THREE.MeshBasicMaterial({ color: 0x31a6ff });
var robot_base = new THREE.Mesh(base_geometry,base_material);
robot_base.position.z = 0;
robot_base.position.y = earth.getWorldPosition().y + 50;

// WHEELS
var w_distance_x = [-30, 30, -30, 30];
var w_distance_z = [30, 30, -30, -30];

var wheel_geometry = new THREE.SphereGeometry(15, 15, 15);
var wheel_texture = new THREE.TextureLoader().load("strips.jpg");
var wheel_material = new THREE.MeshBasicMaterial({ map: wheel_texture });
wheel_texture.wrapS = THREE.RepeatWrapping;
wheel_texture.wrapT = THREE.RepeatWrapping;
wheel_texture.repeat.set( 4, 4);
//var wheel = new THREE.Mesh( wheel_geometry, wheel_material );
//var wheel_group = new THREE.Object3D();
for ( var i = 1; i < 5; i ++ )
{ // create 4 set of wheels
		var wheel = new THREE.Mesh( wheel_geometry, wheel_material );
		wheel.name = "wheel_" + i.toString();

		scene.add(wheel);

		robot_base.add(wheel);
		wheel.position.set(
			robot_base.position.x + w_distance_x[i-1],
			- robot_base.position.y * 0.5 ,
			robot_base.position.z + w_distance_z[i-1]);
}

//JOINT-1
var joint_1_geometry = new THREE.CylinderGeometry(10,10,250);
joint_1_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,125,0));
var joint_1_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_1 = new THREE.Mesh(joint_1_geometry,joint_1_material);
robot_base.add(joint_1);
joint_1.position.y = robot_base.geometry.parameters.height /2 ;

//JOINT-2
var joint_2_geometry = new THREE.CylinderGeometry(10,10,300);
joint_2_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,150,0));
var joint_2_material = new THREE.MeshBasicMaterial({ color: 0x9966cc });
var joint_2 = new THREE.Mesh(joint_2_geometry,joint_2_material);
joint_1.add(joint_2);
joint_2.position.y = joint_1.geometry.parameters.height;

//JOINT-3
var joint_3_geometry = new THREE.CylinderGeometry(10,10,250);
joint_3_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,125,0));
var joint_3_material = new THREE.MeshBasicMaterial({ color: 0xff6666 });
var joint_3 = new THREE.Mesh(joint_3_geometry,joint_3_material);
joint_3.position.y = joint_2.geometry.parameters.height;
joint_2.add(joint_3);

//GRABBER_BASE
var grabBase_geometry = new THREE.CubeGeometry(100,10,10);
var grabBase_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var grabber_base = new THREE.Mesh(grabBase_geometry, grabBase_material);
grabber_base.position.y = joint_3.geometry.parameters.height;
joint_3.add(grabber_base);

//GRABBER ARMS
//LEFT_ARM
var leftArm_geometry = new THREE.CubeGeometry(10,70,10);
leftArm_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(5,35,5));
var leftArm_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var grabber_leftArm = new THREE.Mesh(leftArm_geometry, leftArm_material);
grabber_leftArm.position.y = 5;
grabber_leftArm.position.x = -55;
//grabber_leftArm.rotation.z = 0.1;
grabber_base.add(grabber_leftArm);
//RIGHT_ARM
var rightArm_geometry = new THREE.CubeGeometry(10,70,10);
rightArm_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,35,0));
var rightArm_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var grabber_rightArm = new THREE.Mesh(rightArm_geometry, rightArm_material);
grabber_rightArm.position.y = 5;
grabber_rightArm.position.x = 55;
//grabber_rightArm.rotation.z = -0.1;
grabber_base.add(grabber_rightArm);
scene.add(robot_base);
/////// END-OF-ROBOT /////////////////////////////////////////////////////////////////////////////////////////////

//FRUITS//
//ORANGE
var orange_geometry = new THREE.SphereGeometry(25,25,25);
var orange_texture = new THREE.TextureLoader().load("orange.jpg");
var orange_material = new THREE.MeshBasicMaterial({ map: orange_texture });
orange_texture.wrapS = THREE.RepeatWrapping;
orange_texture.wrapT = THREE.RepeatWrapping;
orange_texture.repeat.set( 1, 1);

for ( var o =1; o < 6; o++)
{
	var orange = new THREE.Mesh(orange_geometry, orange_material);
	orange.name = "orange" + "_" + o.toString();
	console.log(orange.name);
	scene.add(orange);
}
var current_orange ;
current_orange = scene.getObjectByName("orange_1");
current_orange.position.set(100,550,-80);
current_orange = scene.getObjectByName("orange_2");
current_orange.position.set(300,750,-80);
current_orange = scene.getObjectByName("orange_3");
current_orange.position.set(300,350,-150);
current_orange = scene.getObjectByName("orange_4");
current_orange.position.set(-500,750,-60);
current_orange = scene.getObjectByName("orange_5");
current_orange.position.set(-500,350,-140);

//APPLE
var apple_geometry = new THREE.SphereGeometry(25,25,25);
var apple_texture = new THREE.TextureLoader().load("apple.jpg");
var apple_material = new THREE.MeshBasicMaterial({ map: apple_texture });
apple_texture.wrapS = THREE.RepeatWrapping;
apple_texture.wrapT = THREE.RepeatWrapping;
apple_texture.repeat.set( 1, 1);

for (var a = 1; a < 5; a++)
{
	var apple = new THREE.Mesh(apple_geometry, apple_material);
	apple.name = "apple" + "_" + a.toString();
	console.log(apple.name);
	scene.add(apple);
}
var current_apple ;
current_apple = scene.getObjectByName("apple_1");
current_apple.position.set(-50,750,-70);
current_apple = scene.getObjectByName("apple_2");
current_apple.position.set(-50,350,-100);
current_apple = scene.getObjectByName("apple_3");
current_apple.position.set(-300,550,-80);
current_apple = scene.getObjectByName("apple_4");
current_apple.position.set(450,550,-60);

/////////// END OF FRUITS /////////////////////////////////////////////////////////

//// Function calculates the angle between 3 points ////
var gp;
var j3;
var op;
var calculate_angle = function()
{
	gp = grabber_base.getWorldPosition();
	op = fruit.getWorldPosition();
	j3 = joint_3.getWorldPosition();

	// p1 should be origin point = joint 3 pivot
	var p1={x:j3.z,y:j3.y};
	var p2={x:gp.z,y:gp.y};
	var p3={x:op.z,y:op.y};
	var p12 = Math.sqrt(Math.pow((p1.x - p2.x),2) + Math.pow((p1.y - p2.y),2));
	var p13 = Math.sqrt(Math.pow((p1.x - p3.x),2) + Math.pow((p1.y - p3.y),2));
	var p23 = Math.sqrt(Math.pow((p2.x - p3.x),2) + Math.pow((p2.y - p3.y),2));
	//angle in radians
	var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));
	//angle in degrees
	var resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;
	resultDegree = Math.round(resultDegree);
	return resultDegree;
}
////////// END OF FUNCTION /////////////////

var distance = joint_3.geometry.parameters.height;
distance = Math.round(distance);
var fruit = new THREE.Object3D();
var picked_fruit_generator = function()
{
	if (orange_check)
	{
		var name = "orange" + "_" + orange_counter.toString();
		orange = scene.getObjectByName(name);
		fruit = orange;
		orange_check = false;		
	}

	if (apple_check)
	{
		var name = "apple" + "_" + apple_counter.toString();
		apple = scene.getObjectByName(name);
		fruit = apple;
		apple_check = false;
	}
}

document.getElementById("button1").onclick = function()
	{
		orange_counter ++;
		orange_check =  true;
		step_3_check = false;
		step_1_check = true;
		translation_part = true;
	};
document.getElementById("button2").onclick = function()
	{
		apple_counter ++;
		apple_check = true;
		step_3_check = false;
		step_1_check = true;
		translation_part = true;
	};

//////Animation////////

var animate = function () 
{	
	picked_fruit_generator();
	/////// GET CLOSER TO FRUIT /////////////
	if (step_1_check)

		{   //////////  TRANSLATION PART /////////////
			
			if (translation_part)
			{
				if (robot_base.position.x < fruit.position.x) robot_base.position.x += 1.0;
				else robot_base.position.x -= 1.0;
				if (robot_base.position.z < fruit.position.z + distance) robot_base.position.z += 1.0;
				else robot_base.position.z -= 1.0;
				angx = calculate_angle();
				angx_backup = 0;
				scene.getObjectByName("wheel_1").rotation.z += 0.2;
				scene.getObjectByName("wheel_4").rotation.z += 0.2;
				scene.getObjectByName("wheel_2").rotation.z += 0.2;
				scene.getObjectByName("wheel_3").rotation.z += 0.2;
				
			}
				/////////// CHECK TRANSLATION  IS FINISHED /////////////////
			if ((robot_base.position.x == fruit.position.x) && (robot_base.position.z - distance == fruit.position.z))
				{translation_part = false; 
					console.log ("translation falseeeeee"); 
				}

				///////////// ROTATION PART ///////////////////////////
			if (translation_part == false)
			{
				if (angx > 0)
				{
					joint_3.rotation.x -= radians(1);
					angx -=1;
					angx_backup += 1;
				}	

				if(angx == 0)
				{
					step_2_check = true;
					step_1_check = false;
					var i = 0;
				}

			}
			
		}
 ////////////////// GRAB - GO TO BASKET //////////////////////
	////////////////// GRAB - GO TO BASKET //////////////////////
	if (step_2_check)

	{	

		if (grabber_rightArm.rotation.z < radians(30))
			{	
				grabber_rightArm.rotation.z += 0.25;
				grabber_leftArm.rotation.z = -grabber_rightArm.rotation.z;
			}
			
		if (i == 0)
		{
			grabber_base.add(fruit);
			fruit.position.set(0, 40, 0);
			i ++;			
		}



		if (grabber_base.getWorldPosition().x < basket.position.x)	robot_base.position.x += 1.0;
		else if (grabber_base.getWorldPosition().x > basket.position.x) robot_base.position.x -= 1.0;
		else {}

		if (grabber_base.getWorldPosition().z < basket.position.z)	robot_base.position.z += 1.0;
		else if (grabber_base.getWorldPosition().z > basket.position.z)robot_base.position.z -= 1.0;
		else {}	

		if ((grabber_base.getWorldPosition().x == basket.position.x) && (Math.round(grabber_base.getWorldPosition().z)  == basket.position.z))
			{
				free_fall = true;
				step_1_check = false;	
				step_2_check = false;
			}

		i = 0;
			
	}	

	if (free_fall)
	{	
			if (i == 0)
			{
				var fruit_tmp_x = fruit.getWorldPosition().x;
				var fruit_tmp_y = fruit.getWorldPosition().y;
				var fruit_tmp_z = fruit.getWorldPosition().z;
				grabber_base.remove(fruit);
				fruit.position.set(fruit_tmp_x, fruit_tmp_y, fruit_tmp_z);
				scene.add(fruit);
				i++;
			}
			if (fruit.getWorldPosition().y >= 0) 
			{
				fruit.position.y -= 1.0 ;
				fruit.rotation.x += 0.1 ;
			}

			else if (fruit.getWorldPosition().y < 0)
			{
				step_3_check = true;
				free_fall = false;
				i = 0 ;
			}
	}

	if (step_3_check)
	{	
			//////// RE-CONFIGURES ITSELF ////////////

				if (angx_backup > 0)
				{	
					
					joint_3.rotation.x += radians(1);
					angx_backup -=1;
				}

			////// RE-CONFIGURE GRABBER ///////
				if (grabber_rightArm.rotation.z != radians(0))
				{
					grabber_rightArm.rotation.z -= 0.25;
					grabber_leftArm.rotation.z = grabber_rightArm.rotation.z;
				}	
			///////////// END RECONFIGURE /////////////////
			///////////////////////////////////////////////

			////////// TRANSLATE TO 0,0,0 POINT ///////////

			if (robot_base.position.z > 0)
				robot_base.position.z -= 1.0 ;

			if (robot_base.position.x > 0)
				robot_base.position.x -= 1.0 ;

			scene.getObjectByName("wheel_1").rotation.z += 0.2;
			scene.getObjectByName("wheel_4").rotation.z += 0.2;
			scene.getObjectByName("wheel_2").rotation.z += 0.2;
			scene.getObjectByName("wheel_3").rotation.z += 0.2;

			console.log(robot_base.getWorldPosition());
			
	}

	requestAnimationFrame( animate );
	controls.update();
	renderer.render( scene, camera );
		
};
animate();
//var canvas = document.getElementById("myCanvas");
/* ///// MOUSE CLICK ////////////////////////////////////////////// 
document.addEventListener('click',function(event)
	{
	var orange_geometry = new THREE.SphereGeometry(100,100,100);
	var orange_texture = new THREE.TextureLoader().load("orange.jpg");
	var orange_material = new THREE.MeshBasicMaterial({ map: orange_texture });
	orange_texture.wrapS = THREE.RepeatWrapping;
	orange_texture.wrapT = THREE.RepeatWrapping;
	orange_texture.repeat.set( 1, 1);
	var orange_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
	var orange = new THREE.Mesh(orange_geometry, orange_material);
	//var mouse_x = ((event.clientX-canvasPosition.left) / window.innerWidth ) * 2 - 1;
	//var mouse_y = -( (event.clientY-canvasPosition.top) / window.innerHeight ) * 2 + 1;
	var mouse_x = event.clientX + document.body.scrollLeft +document.documentElement.scrollLeft;
	mouse_x  -= canvas.offsetLeft;
	var mouse_y = event.clientY + document.body.scrollTop +document.documentElement.scrollTop;
	mouse_y -= canvas.offsetTop;
	var vector = new THREE.Vector3( mouse_x, mouse_y, -1 ).unproject( camera );

	orange.position.set(mouse_x,mouse_y,-1);
	console.log(mouse_x,mouse_y);
	console.log(orange.getWorldPosition());
	console.log(orange.position.x);
	scene.add(orange);
	},false);
////////// END OF  MOUSE CLICK //////////////////////////////*/
///////////////////////////////////////////
/*var show_circle = function()
{
	//CIRCLESSS
	gp = grabber_base.getWorldPosition();
	j3 = joint_3.getWorldPosition();
	var geometry = new THREE.CircleGeometry( joint_3.geometry.parameters.height+grabber_leftArm.geometry.parameters.height, 32 );
	var material = new THREE.LineBasicMaterial( { color: 0x020202} );
	var circle = new THREE.Line( geometry, material );

	circle.position.z = 0;
	circle.position.x = j3.x;
	circle.position.y = j3.y;
	scene.add( circle );
}*/