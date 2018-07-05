var renderer,
	scene,
	camera,
	light,
	light2;

var angle_grabber = 0; // grabber_base current angle at the moment
var button1_check = false;
var button2_check = false;
///RENDERER
renderer = new THREE.WebGLRenderer({canvas: myCanvas, alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

///CAMERA
camera = new THREE.PerspectiveCamera( 35, window.innerWidth/window.innerHeight, 0.1, 3000 );
camera.position.z = 5;
///SCENE
scene = new THREE.Scene();

///LIGHTS
light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

light2 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light2);

//CONSTRUCT THE ROBOT//
//BASE
var base_geometry = new THREE.CylinderGeometry(50,50,50);
var base_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var robot_base = new THREE.Mesh(base_geometry,base_material);
robot_base.position.z = -1000;
robot_base.position.y = -300;
robot_base.position.x = 20;

//JOINT-1
var joint_1_geometry = new THREE.CylinderGeometry(10,10,150);
var joint_1_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_1 = new THREE.Mesh(joint_1_geometry,joint_1_material);
robot_base.add(joint_1);
joint_1.position.y = robot_base.geometry.parameters.height /2 + joint_1.geometry.parameters.height /2;

//JOINT-2
var joint_2_geometry = new THREE.CylinderGeometry(10,10,150);
var joint_2_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_2 = new THREE.Mesh(joint_2_geometry,joint_2_material);

joint_1.add(joint_2);
joint_2.position.y = joint_1.geometry.parameters.height /2 + joint_2.geometry.parameters.height /2;

//JOINT-3
var joint_3_geometry = new THREE.CylinderGeometry(10,10,150);
joint_3_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,75,0));
var joint_3_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_3 = new THREE.Mesh(joint_3_geometry,joint_3_material);
joint_3.position.y = joint_2.geometry.parameters.height /2 ;
joint_2.add(joint_3);

//GRABBER_BASE
var grabBase_geometry = new THREE.CubeGeometry(100,10,10);
var grabBase_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var grabber_base = new THREE.Mesh(grabBase_geometry, grabBase_material);
grabber_base.position.y = 150;
joint_3.add(grabber_base);

//GRABBER ARMS
//LEFT_ARM
var leftArm_geometry = new THREE.CubeGeometry(10,70,10);
leftArm_geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,35,0));
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

//FRUITS//
//ORANGE
var orange_geometry = new THREE.SphereGeometry(25,25,25);
var orange_texture = new THREE.TextureLoader().load("orange.jpg");
var orange_material = new THREE.MeshBasicMaterial({ map: orange_texture });
orange_texture.wrapS = THREE.RepeatWrapping;
orange_texture.wrapT = THREE.RepeatWrapping;
orange_texture.repeat.set( 1, 1);
var orange = new THREE.Mesh(orange_geometry, orange_material);
orange.position.z = -1000;
orange.position.x = -250;
orange.position.y = 50;
scene.add(orange);
//APPLE
var apple_geometry = new THREE.SphereGeometry(25,25,25);
var apple_texture = new THREE.TextureLoader().load("apple.jpg");
var apple_material = new THREE.MeshBasicMaterial({ map: apple_texture });
apple_texture.wrapS = THREE.RepeatWrapping;
apple_texture.wrapT = THREE.RepeatWrapping;
apple_texture.repeat.set( 1, 1);
var apple = new THREE.Mesh(apple_geometry, apple_material);
apple.position.z = -1000;
apple.position.x = 250;
apple.position.y = 50;
scene.add(apple);

document.getElementById("button1").onclick = function()
	{button1_check = !button1_check;};
document.getElementById("button2").onclick = function()
	{button2_check = !button2_check;};

//////Animation////////
var animate = function () {
	var temp_x = joint_3.position.x - orange.position.x;
	var temp_y = joint_3.position.y - orange.position.y;
	ang = Math.atan2(temp_y, temp_x)* 180 / Math.PI;
	console.log("ANGLE:", ang);
	console.log("joint abgle", joint_3.rotation.z );
	if (button2_check)
	{
		if (joint_3.rotation.z < radians(ang))
		{
			joint_3.rotation.z += radians(1.0)

		}
	}


if (button1_check)
{	//console.log("Angle of grabberbase", grabber_rightArm.rotation.z);
	if (grabber_rightArm.rotation.z < radians(60)){
		grabber_rightArm.rotation.z += 0.25;
		grabber_leftArm.rotation.z = -grabber_rightArm.rotation.z;
}

}	

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};
animate();
/////END//////////////