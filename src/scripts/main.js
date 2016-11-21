var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);


camera.position.x = 200;
camera.position.y = 80;
camera.position.z = 200;


///

var camera // camera
var cameraPos0 // initial camera position
var cameraUp0 // initial camera up
var cameraZoom // camera zoom
var iniQ // initial quaternion
var endQ // target quaternion
var curQ // temp quaternion during slerp
var vec3 // generic vector object
var tweenValue // tweenable value 

// init camera
function setup() {
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000)
	camera.position = new THREE.Vector3(0, 0, 80)
	cameraPos0 = camera.position.clone()
	cameraUp0 = camera.up.clone()
	cameraZoom = camera.position.z
}

// set a new target for the camera
function moveCamera(euler, zoom) {
	// reset everything
	endQ = new THREE.Quaternion()
	iniQ = new THREE.Quaternion().copy(camera.quaternion)
	curQ = new THREE.Quaternion()
	vec3 = new THREE.Vector3()
	tweenValue = 0

	endQ.setFromEuler(euler)
	TweenMax.to(this, 5, { tweenValue: 1, cameraZoom: zoom, onUpdate: onSlerpUpdate })
}

var nnn = 0;
// on every update of the tween
function onSlerpUpdate(e) {
	console.log(e);
	nnn -= 0.0005;
	// interpolate quaternions with the current tween value
	THREE.Quaternion.slerp(iniQ, endQ, curQ, nnn)

	// apply new quaternion to camera position
	vec3.x = cameraPos0.x
	vec3.y = cameraPos0.y
	vec3.z = cameraZoom
	vec3.applyQuaternion(curQ)
	camera.position.copy(vec3)

	// apply new quaternion to camera up
	vec3 = cameraUp0.clone()
	vec3.applyQuaternion(curQ)
	camera.up.copy(vec3)
}



// var cameraHelper = new THREE.CameraHelper(camera);
// scene.add(cameraHelper);

// var axisHelper = new THREE.AxisHelper(20);
// scene.add(axisHelper);


var galaxy = new THREE.Mesh(
	new THREE.SphereGeometry(500, segments, segments),
	new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture('assets/images/galaxy.png'), //eso_dark.jpg
		side: THREE.BackSide
	})
);
scene.add(galaxy);


var PI2 = Math.PI * 2;
var moon_obj_deg = 0;
var speed_base = 1;
var segments = 64;


var config = {
	mercury: { revolution: speed_base * PI2 / 8.8 / 60, rotation: PI2 / 1416 / 60, distance: 25, size: 1, deg: rand(1, 6) },
	venus: { revolution: speed_base * PI2 / 22.5 / 60, rotation: PI2 / 5832 / 60, distance: 30, size: 1, deg: rand(1, 6) },
	earth: { revolution: speed_base * PI2 / 36.5 / 60, rotation: PI2 / 24 / 60, distance: 38, size: 1, deg: rand(1, 6) },
	mars: { revolution: speed_base * PI2 / 68.7 / 60, rotation: PI2 / 25 / 60, distance: 46, size: 1, deg: rand(1, 6) },
	jupiter: { revolution: speed_base * PI2 / 432.9 / 60, rotation: PI2 / 10 / 60, distance: 54, size: 4, deg: rand(1, 6) },
	saturn: { revolution: speed_base * PI2 / 1075.3 / 60, rotation: PI2 / 11 / 60, distance: 64, size: 3, deg: rand(1, 6) },
	uranus: { revolution: speed_base * PI2 / 3066.4 / 60, rotation: PI2 / 17 / 60, distance: 72, size: 2, deg: rand(1, 6) },
	neptune: { revolution: speed_base * PI2 / 6015.9 / 60, rotation: PI2 / 16 / 60, distance: 79, size: 2, deg: rand(1, 6) },
	moon: { revolution: speed_base * PI2 / 36.5 / 60, rotation: PI2 / 8.8 / 60, distance: 80, size: .4, deg: rand(1, 6) }
};

var camera_deg = config['earth'].deg - 1.35;

// SUN
var texture = THREE.ImageUtils.loadTexture('assets/images/sun.jpg', {}, function() { renderer.render(scene, camera); });
var materials = [new THREE.MeshBasicMaterial({ map: texture })];
var geometry = new THREE.SphereGeometry(14, segments, segments);
var material = new THREE.MeshFaceMaterial(materials);
var sun = new THREE.Mesh(geometry, material);
scene.add(sun);


var mesh = [];
for (var x in config) {
	var texture = THREE.ImageUtils.loadTexture('assets/images/' + x + '.jpg', {}, function() { renderer.render(scene, camera); });
	var materials = [new THREE.MeshBasicMaterial({ map: texture })];
	var geometry = new THREE.SphereGeometry(config[x].size, segments, segments);
	var material = new THREE.MeshFaceMaterial(materials);
	mesh[x] = new THREE.Mesh(geometry, material);
	scene.add(mesh[x]);

	if (x == 'moon') continue;
	var material = new THREE.LineBasicMaterial({ color: 0x333333 });
	var geometry = new THREE.CircleGeometry(config[x].distance, segments);
	geometry.vertices.shift();
	var line = new THREE.Line(geometry, material);
	line.rotation.x = Math.PI / 2;
	scene.add(line);
}

var moon_obj = new THREE.Object3D();
moon_obj.position.x = config['earth'].distance;
mesh['moon'].position.x = 3;
moon_obj.add(mesh['moon']);
scene.add(moon_obj);

// mesh['earth'].add(camera);


var earth_tap = false;

$('body').tap(function() {
	earth_tap = !earth_tap;
	if (!earth_tap) {
		camera.position.x = 200;
		camera.position.y = 80;
		camera.position.z = 200;
	}
	// setup();
	// moveCamera(new THREE.Euler(1, 1, 1), 200);
});

function render() {
	requestAnimationFrame(render);
	controls.update();

	for (var x in config) {
		mesh[x].rotation.y += config[x].rotation;
		if (x == 'moon') continue;

		config[x].deg = config[x].deg + config[x].revolution >= PI2 ? 0 : config[x].deg + config[x].revolution;
		mesh[x].position.set(config[x].distance * Math.sin(config[x].deg), 0, config[x].distance * Math.cos(config[x].deg));
	}

	moon_obj.rotation.y += 0.1;
	moon_obj_deg = config['earth'].deg + 0.006 >= PI2 ? 0 : config['earth'].deg + 0.006;
	moon_obj.position.set(config['earth'].distance * Math.sin(moon_obj_deg), 0, config['earth'].distance * Math.cos(moon_obj_deg));

	sun.rotation.y += 0.01;

	camera_deg = camera_deg + (speed_base * PI2 / 36.5 / 60) >= PI2 ? 0 : camera_deg + (speed_base * PI2 / 36.5 / 60);

	if (earth_tap) {
		camera.position.set(170 * Math.sin(camera_deg), 25, 170 * Math.cos(camera_deg));
		camera.lookAt(mesh['earth'].position);
	} else {
		// var timer = Date.now() * 0.0005;
		// camera.position.x = Math.cos(timer) * 10;
		// camera.position.z = Math.sin(timer) * 10;
		// camera.lookAt(scene.position);
	}

	renderer.render(scene, camera);
}
render();



var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onDocumentMouseDown(event) {

	event.preventDefault();

	mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
	mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

	raycaster.setFromCamera(mouse, camera);

	var intersects = raycaster.intersectObjects(objects);

	console.log(intersects);

	if (intersects.length > 0) {

		intersects[0].object.callback();

	}

}