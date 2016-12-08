var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var controls = new THREE.OrbitControls(camera, renderer.domElement);


camera.position.x = 200;
camera.position.y = 80;
camera.position.z = 200;


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
var look_star_name;

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

// SUN
var texture = THREE.ImageUtils.loadTexture('assets/images/sun.jpg', {}, function() { renderer.render(scene, camera); });
var materials = [new THREE.MeshBasicMaterial({ map: texture })];
var geometry = new THREE.SphereGeometry(14, segments, segments);
var material = new THREE.MeshFaceMaterial(materials);
var sun = new THREE.Mesh(geometry, material);
sun.name = 'sun';
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

	mesh[x].name = x;
	config[x].camera_deg = config[x].deg - 1.35;
}

var moon_obj = new THREE.Object3D();
moon_obj.position.x = config['earth'].distance;
mesh['moon'].position.x = 3;
moon_obj.add(mesh['moon']);
scene.add(moon_obj);

var earth_tap = false;
var start_move_cam = false;
var camera_look_at = { x: 0, y: 0, z: 0 };
var camera_move_time = 600;

function star_tap() {
	new TWEEN.Tween(camera.position)
		.to({
			x: 170 * Math.sin(config[look_star_name].camera_deg),
			y: 25,
			z: 170 * Math.cos(config[look_star_name].camera_deg),
		}, camera_move_time)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onUpdate(function() {})
		.onComplete(function() {
			earth_tap = !earth_tap;
		})
		.start();

	start_move_cam = true;
	new TWEEN.Tween(camera_look_at)
		.to({ x: mesh[look_star_name].position.x, y: mesh[look_star_name].position.y, z: mesh[look_star_name].position.z }, camera_move_time)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		.onUpdate(function() {
			camera_look_at = this;
		})
		.onComplete(function() {
			start_move_cam = false;
		})
		.start();
}

function render() {
	TWEEN.update();

	requestAnimationFrame(render);
	controls.update();

	for (var x in config) {
		mesh[x].rotation.y += config[x].rotation;
		if (x == 'moon') continue;

		config[x].deg = config[x].deg + config[x].revolution >= PI2 ? 0 : config[x].deg + config[x].revolution;
		config[x].camera_deg = config[x].camera_deg + config[x].revolution >= PI2 ? 0 : config[x].camera_deg + config[x].revolution;
		mesh[x].position.set(config[x].distance * Math.sin(config[x].deg), 0, config[x].distance * Math.cos(config[x].deg));
	}

	moon_obj.rotation.y += 0.1;
	moon_obj_deg = config['earth'].deg + 0.006 >= PI2 ? 0 : config['earth'].deg + 0.006;
	moon_obj.position.set(config['earth'].distance * Math.sin(moon_obj_deg), 0, config['earth'].distance * Math.cos(moon_obj_deg));

	sun.rotation.y += 0.01;


	if (start_move_cam) {
		camera.lookAt(new THREE.Vector3(camera_look_at.x, camera_look_at.y, camera_look_at.z));
	}

	if (earth_tap) {
		camera.position.set(170 * Math.sin(config[look_star_name].camera_deg), 25, 170 * Math.cos(config[look_star_name].camera_deg));
		camera.lookAt(mesh[look_star_name].position);
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

	var intersects = raycaster.intersectObjects(scene.children);

	if (intersects.length > 0) {
		look_star_name = intersects[0].object.name;
		if (look_star_name) star_tap();
	}
}

function onDocumentTouchStart(event) {
	event.preventDefault();

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onDocumentMouseDown(event);
}

document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('touchstart', onDocumentTouchStart, false);