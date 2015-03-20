
var GraphContainer = function() {

    THREE.Group.call(this);
    var scope = this;

    scope.type = 'GraphContainer';
	scope.container = null;
	scope.camera = null;
	scope.controls = null;
	scope.scene = null;
	scope.renderer = null;
	scope.graphAccX = null;


	function init() {

		var windowHalfX = window.innerWidth / 2,
			windowHalfY = window.innerHeight / 2;

		scope.container = document.createElement( "div" );
		scope.container.id = "GraphContainer";
		document.body.appendChild( scope.container );

		var w = windowHalfX     *.1,
			h = windowHalfY*.25 *.2
		;

		scope.camera = new THREE.OrthographicCamera( -w, w, h, -h, -50, 50 );
		scope.camera.position.set( 0, 0, 1 );

		scope.scene = new THREE.Scene();
		scope.scene.fog = new THREE.FogExp2( 0xbbbbbb, 0.002 );

		scope.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		scope.renderer.setPixelRatio( window.devicePixelRatio );
		scope.renderer.setSize( window.innerWidth, window.innerHeight*.25 );
		scope.container.appendChild( scope.renderer.domElement );

		scope.controls = new THREE.OrbitControls( scope.camera );
		scope.controls.damping = 0.2;
		scope.controls.addEventListener( 'change', render );


		scope.graphAccX = new GraphContainer.Graph({color: 0x0000ff});

		scope.scene.add( scope.graphAccX );

		/**********************
		 *     AxisHelper     *
		 **********************/

		var axis = new THREE.AxisHelper( 10 );
		scope.scene.add( axis );
	}

	init();




	/**********************
	*        Loop        *
	**********************/


	scope.update = function( histAcc, histGyro ) {

		var time_now = Date.now(),
			time_delta = time_now - time;

		scope.graphAccX.update( histAcc.x );

		time = time_now;
	};

	function render() {	
		scope.renderer.render( scope.scene, scope.camera );
	};

	scope.render = render;



	return this;

};

GraphContainer.prototype = Object.create(THREE.Group.prototype);
GraphContainer.prototype.constructor = GraphContainer;


GraphContainer.Graph = function( o ){

    THREE.Group.call(this);
    var scope = this;
    o = o||{};

    scope.type = 'Graph';
    scope.mesh = null;
    scope.data = [];
    scope.color = o.color || 0xff000;
    scope.width = o.width || 100;
    scope.height = o.height || 10;
    scope.nbPoint = 27;
    scope.temp = 0;

	init = function(){
		var geo = new THREE.PlaneGeometry( 2, 2, 5, 1 );
		var mat = new THREE.MeshBasicMaterial({ color: scope.color });

		scope.mesh = new THREE.Mesh( geo, mat );

		scope.add( scope.mesh );
	};

	this.update = function( data ){
		// todo
		if( scope.temp == data.length ) return;

		scope.temp = data.length;

		var p = scope.mesh.geometry.vertices,
			len = p.length/2,
			wu = scope.width/len, // width unit
			hu = scope.height/len // height unit
		;

		for( var i=0; i<len; i++) {
			p[i].y = data[data.length-1-i]||1;
		}

		scope.mesh.geometry.verticesNeedUpdate = true;
	};

	init();

	return this;
}

GraphContainer.Graph.prototype = Object.create(THREE.Group.prototype);
GraphContainer.Graph.prototype.constructor = GraphContainer.Graph;