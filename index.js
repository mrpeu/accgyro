
var time = 0,
	time_now = 0,
	time_delta = 0;

var windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera, controls,
	scene, renderer,

	cube0, cube1;

init();
update();

function init() {

	var container;

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 20, 20, 45 );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xbbbbbb, 0.002 );

	renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera );
	controls.damping = 0.2;
	controls.addEventListener( 'change', render );



	/**********************
	 *        Plane       *
	 **********************/

	 var plane = new THREE.Mesh(
	 	new THREE.PlaneBufferGeometry( 500, 500 ),
	 	new THREE.MeshBasicMaterial({
	 		color: 0xeeeeee
	 	})
	);
	plane.rotateX( -Math.PI/2 );
	plane.translateZ( -10 );
	scene.add( plane );



	/**********************
	 *        Cube       *
	 **********************/

	cube0 = new THREE.Mesh(
		new THREE.BoxGeometry( 1, 1, 1 ),
		new THREE.MeshPhongMaterial({ color: 0xf0ad4e })
	);
	cube0.scale.set( 10, 10, 10 );

	scene.add( cube0 );


	cube1 = new THREE.Mesh(
		new THREE.BoxGeometry( 1, 1, 1 ),
		new THREE.MeshPhongMaterial({ color: 0x5bc0de, wireframe: true })
	);
	cube1.scale.set( 13, 13, 13 );

	scene.add( cube1 );



	/**********************
	 *        Light       *
	 **********************/

	var lightP0 = new THREE.PointLight( 0xffffff, 1.5, 0 );
	lightP0.position.set( 150, 180, 200 );
	lightP0.lookAt( 0, 0, 0 );
	scene.add( lightP0 );

	var lightA = new THREE.AmbientLight( 0x202020 );
	scene.add( lightA );

	scene.add( new THREE.PointLightHelper( lightP0, 20 ) );
// 	scene.add( new THREE.PointLightHelper( lightA, 20 ) );



	var axis = new THREE.AxisHelper( 10 );
	scene.add( axis );

	//

	window.addEventListener("devicemotion", onMotion, true);

	window.addEventListener( "deviceorientation", onOrientation, true);

	window.addEventListener( "resize", onWindowResize, false );

}




/**********************
*        Loop        *
**********************/


function update() {

	var time_now = Date.now(),
		time_delta = time_now - time;




	render();
	time = time_now;
	requestAnimationFrame( update );
}

function render() {

	
	renderer.render( scene, camera );
}





/***********************
*        Event        *
**********************/

function onMotion( e ) {

	cube1.rotation.set(
		Math.PI/180 * e.acceleration.x||0,
		Math.PI/180 * e.acceleration.y||0,
		Math.PI/180 * e.acceleration.z||0
	);
}

function onOrientation( e ) {

	cube0.rotation.set(
		Math.PI/180 * e.beta||0,
		Math.PI/180 * e.gamma||0,
		Math.PI/180 * e.alpha||0
	);
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}
