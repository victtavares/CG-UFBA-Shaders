var scene 			= null;
var renderer		= null;
var camera 			= null;
var pointLight		= null;
var orbitControls	= null;
var day 			= 0.0;
var year			= 0.0;
var month			= 0.0;
var clock;

//Uniform Values
var ssb = 0.0;

function init() {

	clock = new THREE.Clock();
	
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));
	renderer.setSize(window.innerWidth*0.7, window.innerHeight*0.7);

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(60.0, 1.0, 0.1, 1000.0);
	
	// Controle de Camera Orbital
	orbitControls = new THREE.OrbitControls(camera);
	orbitControls.autoRotate = false;

	// Adiciona luz ambiente
	var ambientLight = new THREE.AmbientLight(new THREE.Color(1.0, 1.0, 1.0));
	scene.add(ambientLight);
	initGUI();
	loadMeshes();
	renderer.clear();
}

function loadMeshes() {
	// Load Mesh
	var loader = new THREE.OBJLoader();
	loader.load('../Models/Earth.obj', buildScene);		
}

function render() {
	var delta = clock.getDelta();
    orbitControls.update(delta);

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}


function initGUI() {

	controls = new function () {
		this.ssb 		= ssb;
		// this.intensity 		= directionalLight.intensity;
		// this.lightPosX      = directionalLight.position.x;
		// this.lightPosY 		= directionalLight.position.y;
		// this.lightPosZ 		= directionalLight.position.z;
		// this.lightColor		= directionalLight.color;
	}

	var gui = new dat.GUI();

	gui.add(controls, 'ssb', 0.0, 1.0).onChange(function (value) {
		ssb = controls.ssb;
		console.log(ssb);
		});
	// gui.add(controls, 'intensity', 0.0, 10.0).onChange(function (value) {
	// 	directionalLight.intensity = controls.intensity;
	// 	});
	// gui.addColor(controls, 'lightColor').onChange(function (value) {
	// 	directionalLight.color = new THREE.Color(controls.lightColor);
	// 	sphereLightMesh.material.color = new THREE.Color(value);
	// 	});
	
	// var fLightPos = gui.addFolder('LightPos');
	// fLightPos.add( controls, 'lightPosX', -1.0, 1.0).onChange(function (value) {
	// 	directionalLight.position.x = sphereLightMesh.position.x = controls.lightPosX;
	// 	});
	// fLightPos.add( controls, 'lightPosY', -1.0, 1.0).onChange(function (value) {
	// 	directionalLight.position.y = sphereLightMesh.position.y = controls.lightPosY;
	// 	});
	// fLightPos.add( controls, 'lightPosZ', -1.0, 1.0).onChange(function (value) {
	// 	directionalLight.position.z = sphereLightMesh.position.z = controls.lightPosZ;
	// 	});
	// fLightPos.close();
	
}

function buildScene(loadedMesh) {              

	// Bounding Box	
	var BBox = new THREE.BoundingBoxHelper(loadedMesh, 0xffffff);
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
	pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0));
	pointLight.distance = 0.0;
	pointLight.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(pointLight);
	
	// Fonte de luz 1 - representacao geometrica
	var sphereLight = new THREE.SphereGeometry(maxCoord*0.02);
	var sphereLightMaterial = new THREE.MeshBasicMaterial(new THREE.Color(1.0, 1.0, 1.0));
	var sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);

	sphereLightMesh.position.set(BBox.box.max.x*1.2, BBox.box.max.y*1.2, BBox.box.max.z*1.2);
	scene.add(sphereLightMesh);
	
	uniforms = {
		uCamPos	: 	{ type: "v3", value:camera.position},
		uLPos	:	{ type: "v3", value:pointLight.position} 
		};
	
	var matShader = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'phong-vs' ).textContent,
			fragmentShader: document.getElementById( 'phong-fs' ).textContent
			} );
	
	
	loadedMesh.traverse(function (child) {	
		if (child instanceof THREE.Mesh) {
			child.material = matShader;
			if ( (child.geometry.attributes.normal != undefined) && (child.geometry.attributes.normal.length == 0)) {
				console.log(child.geometry.attributes.normal.length);
				child.geometry.computeFaceNormals();
				child.geometry.computeVertexNormals();
				child.geometry.normalsNeedUpdate = true;
				}
			}
		});
	
	scene.add(loadedMesh);
	render();
}