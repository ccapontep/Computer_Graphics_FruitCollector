var renderer,
	scene,
	camera,
	light,
	light2;

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
var joint_1_geometry = new THREE.CylinderGeometry(15,15,150);
var joint_1_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_1 = new THREE.Mesh(joint_1_geometry,joint_1_material);
robot_base.add(joint_1);
joint_1.position.y = robot_base.geometry.parameters.height /2 + joint_1.geometry.parameters.height /2;

//JOINT-2
var joint_2_geometry = new THREE.CylinderGeometry(15,15,150);
var joint_2_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_2 = new THREE.Mesh(joint_2_geometry,joint_2_material);

joint_1.add(joint_2);
joint_2.position.y = joint_1.geometry.parameters.height /2 + joint_2.geometry.parameters.height /2;

//JOINT-3
var joint_3_geometry = new THREE.CylinderGeometry(15,15,150);
var joint_3_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_3 = new THREE.Mesh(joint_3_geometry,joint_3_material);
joint_3.position.y = joint_2.geometry.parameters.height /2 + joint_3.geometry.parameters.height /2;
joint_2.add(joint_3);
scene.add(robot_base);

//FRUITS//
//ORANGE
var orange_geometry = new THREE.SphereGeometry(50,50,50);
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
var apple_geometry = new THREE.SphereGeometry(50,50,50);
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

//////Animation////////
var animate = function () {
	orange.rotation.x += 0.01;
	apple.rotation.y += 0.01;
	var temp_x = joint_3.position.x - orange.position.x;
	var temp_y = joint_3.position.y - orange.position.y;
	ang = Math.atan2(temp_y, temp_x)* 180 / Math.PI;
	console.log (ang);
	if (joint_1.rotation.z < ang )
		joint_1.rotation.z += 0.1;
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};
animate();
/////END//////////////