var scene 			= null;
var renderer		= null;
var camera 			= null;
var orbitControls	= null;
var day 			= 0.0;
var year			= 0.0;
var month			= 0.0;
var clock;

function init() {

	clock = new THREE.Clock();
	
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60.0, 1.0, 0.1, 300.0);
	
	// Controle de Camera Orbital
	orbitControls = new THREE.OrbitControls(camera);
	orbitControls.autoRotate = false;

	// Adiciona luz ambiente
	var ambientLight = new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0));
	scene.add(ambientLight);

	loadMesh();
		
	renderer.clear();
}

function loadMesh() {
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('../../Assets/Models/mario.obj', buildScene);		
}

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function buildScene(loadedMesh) {
	var material = new THREE.MeshLambertMaterial({color: 0x4477ff});

	loadedMesh.children.forEach(function (child) {
		child.material = material;
		child.geometry.computeFaceNormals();
		child.geometry.computeVertexNormals();
 		child.geometry.normalsNeedUpdate = true;
		});

	mesh = loadedMesh;
	
	scene.add(loadedMesh);

	// Bounding Box	
	var BBox = new THREE.BoundingBoxHelper(mesh, 0xffffff);
	BBox.update();
	
	// Adjust Camera Position and LookAt	
	var maxCoord = Math.max(BBox.box.max.x,BBox.box.max.y,BBox.box.max.z);
	
	camera.position.x 	= 
	camera.position.y 	= 
	camera.position.z 	= maxCoord*1.5;
	camera.far 			= new THREE.Vector3(	maxCoord*2.5, 
												maxCoord*2.5, 
												maxCoord*2.5).length();

	camera.lookAt(new THREE.Vector3(	(BBox.box.max.x + BBox.box.min.x)/2.0,
										(BBox.box.max.y + BBox.box.min.y)/2.0,
										(BBox.box.max.z + BBox.box.min.z)/2.0));
	camera.updateProjectionMatrix();
	
	// Global Axis
	var globalAxis = new THREE.AxisHelper(maxCoord*1.3);
	scene.add( globalAxis );
	
	// Ground
	var groundGeom = new THREE.PlaneBufferGeometry(maxCoord*2.5, maxCoord*2.5, 50, 50);
	groundGeom.computeFaceNormals();
	groundGeom.computeVertexNormals();
	groundGeom.normalsNeedUpdate = true;
	var groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({color: 0x555555}));
	groundMesh.material.side 	= THREE.DoubleSide;
	groundMesh.material.shading	= THREE.SmoothShading;
	groundMesh.rotation.x = -Math.PI / 2;
	groundMesh.position.y = -0.1;
	scene.add(groundMesh);
	
	//Add point light Source
	var pointLight1 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight1.distance = 1000.0;
	pointLight1.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(pointLight1);
	
	// Fonte de luz 1 - representacao geometrica
	var sphereLight = new THREE.SphereGeometry(maxCoord*0.02);
	var sphereLightMaterial = new THREE.MeshBasicMaterial(new THREE.Color(1.0, 1.0, 1.0));
	var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

	sphereLightMesh.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(sphereLightMesh);

	//Add another point light Source
	var pointLight2 = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight2.distance = 1000.0;
	pointLight2.position.set(BBox.box.min.x*1.2, BBox.box.min.y*1.2, BBox.box.min.z*1.2);
	scene.add(pointLight2);

	// Fonte de luz 2 - representacao geometrica
	var sphereLight = new THREE.SphereGeometry(maxCoord*0.02);
	var sphereLightMaterial = new THREE.MeshBasicMaterial(new THREE.Color(1.0, 1.0, 1.0));
	var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

	sphereLightMesh.position.set(BBox.box.min.x*1.2, BBox.box.min.y*1.2, BBox.box.min.z*1.2);
	scene.add(sphereLightMesh);
	
	render();
}

