var scene 		= null;
var renderer	= null;
var camera 		= null;
var ambientLight = null;
var day 		= 0.0;
var year		= 0.0;
var month		= 0.0;

function init() {

	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera();
	camera.fov 			= 60.0;
	camera.aspect 		= 1.0;
	camera.near 		= 1.5;
	camera.far			= 3.0;
	camera.position.x 	= 1.0;
	camera.position.y 	= 1.0;
	camera.position.z 	= 1.5;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	
	scene.add( camera );
	
	buildScene();
	
	ambientLight = new THREE.AmbientLight(new THREE.Color(0.2, 0.2, 0.2));
	scene.add(ambientLight);
		
	initGUI();
	renderer.clear();
	render();
};

function buildScene() {
		
	// Grupo do Sol
	var gSun = new THREE.Object3D();
	gSun.name = "grpSun";
	
	// Eixo do Sol
	var globalAxis = new THREE.AxisHelper(1.2);
	gSun.add( globalAxis );
	// Sol	
	var sphereGeometry = new THREE.SphereGeometry(1.0, 20, 20);                 
	var sphereMat = new THREE.MeshLambertMaterial({color: 0xffff00});
	sun = new THREE.Mesh( sphereGeometry, sphereMat );
	sun.MatrixAutoUpdate = false;
	sun.name = "objSun";
	gSun.add( sun );	
	
	// Grupo da Terra
	var gEarth = new THREE.Object3D();
	gEarth.name = "grpEarth";
	
	//Eixo da Terra
	var globalAxis = new THREE.AxisHelper(1.1);
	gEarth.add( globalAxis );
	// Terra
	sphereMat = new THREE.MeshLambertMaterial({color: 0x0000ff});
	var earth = new THREE.Mesh( sphereGeometry, sphereMat );
	earth.MatrixAutoUpdate = false;
	earth.name = "objEarth";
	gEarth.add( earth );	
		
	// Grupo da Lua
	var gMoon = new THREE.Object3D();
	gMoon.name = "grpMoon";
	
	// Eixo da Lua
	var globalAxis = new THREE.AxisHelper(1.1);
	gMoon.add(globalAxis);
	// Lua
	sphereMat = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
	var moon = new THREE.Mesh( sphereGeometry, sphereMat );
	moon.MatrixAutoUpdate = false;
	moon.name = "objMoon";
	gMoon.add(moon);	
	
	// Montando a cena final
	gEarth.add(gMoon);	
	gSun.add(gEarth);	
	scene.add(gSun);	
}

function initGUI() {

	controls = new function () {
		this.lightColor		= ambientLight.color;
		}

	var gui = new dat.GUI();

	gui.addColor(controls, 'lightColor').onChange(function (value) {
		ambientLight.color = new THREE.Color(controls.lightColor);
		});
	
};

function render() {
	updateObjects();
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function updateObjects() {
	var m 	= new THREE.Matrix4();
	
	day 	+= 0.07;
	year 	+= 0.01;
	month 	+= 0.04;
	
	var obj=null;
	
	obj = scene.getObjectByName("grpSun");
	m.identity();
	obj.matrix.copy(m);
	m.makeRotationY(year);
	obj.applyMatrix(m);
	m.makeScale(0.4, 0.4, 0.4);
	obj.applyMatrix(m);
	obj.updateMatrix();
	
	obj = scene.getObjectByName("objSun");
	m.identity();
	obj.matrix.copy(m);
	obj.applyMatrix(m);
	m.makeRotationX(month);
	obj.applyMatrix(m);
	obj.updateMatrix();

	obj = scene.getObjectByName("grpEarth");
	m.identity();
	obj.matrix.copy(m);	
	m.makeRotationY(day);
	obj.applyMatrix(m);
	m.makeTranslation(9.0, 0.0, 0.0);
	obj.applyMatrix(m);
	m.makeRotationY(year);
	obj.applyMatrix(m);
	m.makeScale(0.2, 0.2, 0.2);
	obj.applyMatrix(m);
	obj.updateMatrix();

	obj = scene.getObjectByName("grpMoon");
	m.identity();
	obj.matrix.copy(m);
	
	m.makeTranslation(15.0, 0.0, 0.0);
	obj.applyMatrix(m);
	m.makeRotationY(month);
	obj.applyMatrix(m);
	m.makeScale(0.1, 0.1, 0.1);
	obj.applyMatrix(m);
	obj.updateMatrix();	
}