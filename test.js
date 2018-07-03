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
var joint_1_geometry = new THREE.CylinderGeometry(20,20,300);
var joint_1_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_1 = new THREE.Mesh(joint_1_geometry,joint_1_material);
joint_1.position.y = robot_base.position.y +robot_base.geometry.parameters.height /2 + joint_1.geometry.parameters.height /2;
//joint_1.position.y = 100;
robot_base.add(joint_1);

//JOINT-2
var joint_2_geometry = new THREE.CylinderGeometry(20,20,150);
var joint_2_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_2 = new THREE.Mesh(joint_2_geometry,joint_2_material);
//joint_2.position.y = 200;
joint_1.add(joint_2);

//JOINT-3
var joint_3_geometry = new THREE.CylinderGeometry(20,20,150);
var joint_3_material = new THREE.MeshBasicMaterial({ color: 0xFF8C00 });
var joint_3 = new THREE.Mesh(joint_3_geometry,joint_3_material);
joint_2.add(joint_3);
scene.add(robot_base);

console.log(robot_base.position);
console.log(joint_1.position);
console.log(joint_2.position);
console.log(joint_3.position);

//////Animation////////
var animate = function () {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};
animate();

/////END//////////////