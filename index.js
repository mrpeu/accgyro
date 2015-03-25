
var time = 0,
	time_now = 0,
	time_delta = 0;

var windowHalfX = window.innerWidth / 2,
	windowHalfY = window.innerHeight / 2,

	camera, controls,
	scene, renderer,

	cube0, cube1,

	offsetAcc, offsetGyro,
	histAcc = {x:[],y:[],z:[]}, histGyro = {x:[],y:[],z:[]},

	graphContainer
;

/* TEST */
var spline = new THREE.SplineCurve((function(len){
	var r = [];
	for(var i=0;i<=len;i++){ r.push(new THREE.Vector2( i, Math.random() )); }
	return r;
})(50));
var cursor = 0;
var points = spline.getPoints( 500 );


setInterval(function(){
	
	cursor = ++cursor % (points.length);
	histAcc.x.push(points[cursor]);

	// histAcc.y.push(histAcc.y.length/10+.01);
	// histAcc.z.push(histAcc.z.length/10+.02);

	// histAcc.x.push(cube0.rotation.x);

	// histGyro.push(cube1.rotation.toArray());
}, 33);


function init() {

	var container = document.querySelector( "#Main" );

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

	scene.lights = [ lightP0, lightA ];


	/**********************
	 *     AxisHelper     *
	 **********************/

	var axis = new THREE.AxisHelper( 10 );
	scene.add( axis );



	/**********************
	 *   GraphContainer   *
	 **********************/

	graphContainer = new GraphContainer();


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

	if(graphContainer) graphContainer.update( histAcc, histGyro );

	render();
	time = time_now;
	requestAnimationFrame( update );
}

function render() {

	if(graphContainer) graphContainer.render();
	
	renderer.render( scene, camera );
}





/***********************
*        Event        *
**********************/

function onOrientation( e ) {

	if( !offsetGyro ) offsetGyro = new THREE.Vector3( e.beta, e.gamma, e.alpha );

	cube0.rotation.set(
		(Math.PI/180 * e.beta)*2  - offsetGyro.x,
		(Math.PI/180 * e.gamma)*2 - offsetGyro.y,
		(Math.PI/180 * e.alpha)*2 - offsetGyro.z
	);
}

function onMotion( e ) {

	if( !offsetAcc ) offsetAcc = new THREE.Vector3( e.acceleration.x, e.acceleration.y, e.acceleration.z );

	cube1.rotation.set(
		Math.PI/180 * e.acceleration.x - offsetAcc.x,
		Math.PI/180 * e.acceleration.y - offsetAcc.y,
		Math.PI/180 * e.acceleration.z - offsetAcc.z
	);
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}







init();
update();