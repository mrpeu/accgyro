
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

		scope.container = document.querySelector("#GraphContainer");

		var w = scope.container.clientWidth/2,
			h = scope.container.clientHeight/2
		;

		scope.camera = new THREE.OrthographicCamera( -w, w, h, -h, -1000, 1000 );

		scope.scene = new THREE.Scene();
		scope.scene.fog = new THREE.FogExp2( 0xbbbbbb, 0.002 );

		scope.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		scope.renderer.setPixelRatio( window.devicePixelRatio );
		scope.renderer.setSize( 2*w, 2*h );
// 		scope.renderer.setClearColor( 0xaa5555, .5 );
		scope.container.appendChild( scope.renderer.domElement );

		scope.controls = new THREE.OrbitControls( scope.camera, scope.renderer.domElement );
		scope.controls.damping = 0.2;
		scope.controls.addEventListener( 'change', render );
		scope.controls.pan( -w, 0 );
		scope.controls.update();

		scope.graphAccX = new GraphContainer.Graph({color: 0xededed});
		scope.graphAccX.translateX( w );
 		scope.graphAccX.translateY( -h/2 );
		scope.graphAccX.scale.set( w, h, 1 );
		scope.scene.add( scope.graphAccX );

		/**********************
		 *     AxisHelper     *
		 **********************/

		var axis = new THREE.AxisHelper( h );
		axis.translateZ(1);
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
    scope.color = o.color;
    scope.width = o.width;
    scope.temp = 0;

	init = function(){
		var geo = new THREE.PlaneGeometry( 2, 2, 50, 1 );
		var mat = new THREE.MeshBasicMaterial({
// 			color: scope.color,
 			vertexColors: THREE.VertexColors,
			transparent: true,
			opacity: .5
		});

		scope.mesh = new THREE.Mesh( geo, mat );

		scope.add( scope.mesh );
	};

	this.update = function( data ){

		if( scope.temp == data.length ) return;

		scope.temp = data.length;

		var p = scope.mesh.geometry.vertices,
			len = p.length
		;

		for( var j=0; j<len; j++) {
			var val = data[data.length-1-i] ? data[data.length-1-i].y : 1;
			var i = j;//Math.sign(val)?j:j*2;
			p[i].y = val;

			var face = scope.mesh.geometry.faces[i];
			if(face)
			face.vertexColors = [
				new THREE.Color(0x0000ee),
				new THREE.Color(0xeeeeee),
				new THREE.Color(0xee0000)
			];
		}

		scope.mesh.geometry.verticesNeedUpdate = true;
		scope.mesh.geometry.colorsNeedUpdate = true;
	};

	init();

	return this;
}

GraphContainer.Graph.prototype = Object.create(THREE.Group.prototype);
GraphContainer.Graph.prototype.constructor = GraphContainer.Graph;