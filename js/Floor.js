function Floor()
{
	this.initWater = function()
	{
		var maxSize = 9999.0;
		var y = -0.02;

	    var geo = new THREE.Geometry();
	    geo.vertices.push(new THREE.Vector3( -maxSize, y, -maxSize ));
	    geo.vertices.push(new THREE.Vector3( maxSize, y, -maxSize ));
	    geo.vertices.push(new THREE.Vector3( maxSize, y, maxSize ));
	    geo.vertices.push(new THREE.Vector3( -maxSize, y, maxSize ));

	    geo.faces.push( new THREE.Face3(0, 2, 1));
	    geo.faces.push( new THREE.Face3(0, 3, 2));

	    var mesh = new THREE.Mesh(
	        geo,
	        new THREE.MeshBasicMaterial({
	            color:              0x6DC3AE,
	            wireframe:          false,
	            wireframeLinewidth: 3
	        })
	    );
	    mesh.doubleSided = true;
	    mesh.overdraw = true;
	    g_scene.add(mesh);
	}

	this.initPts= function()
	{
		var segments = 32;
		var maxHeight = 0.3;
		var maxRadius = 3.8;

		var deltaAngle = 2.0 * Math.PI / segments;

		noise.seed(0);

		// generate points
		this.pts = new Array();
		for ( var i = 0; i < segments; i ++ ) 
		{
			var radius = maxRadius + noise.simplex2(1.0, i+1.0) * maxRadius * 0.3;
			var angle = i * deltaAngle;

			var x = radius * Math.cos(angle);
			var y = (noise.simplex2(1.0, i+100.0) * 0.5 + 0.5  ) * maxHeight; 
			var z = radius * Math.sin(angle);

			this.pts.push( new THREE.Vector3( x,y,z ) );
		}
	}

	this.initFlatland = function()
	{
		var colorFloor = 0x79A836;
		var colorFloorSide = 0x4D7C39;

		/// generate geometry
		var geo = new THREE.Geometry();
		var center = new THREE.Vector3( 0,0,0 );

		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			var pt_0 = this.pts[i];
			var pt_1 = this.pts[(i+1)%this.pts.length];

			var pt_0_ground = pt_0.clone();
			var pt_1_ground = pt_1.clone();
			pt_0_ground.y = 0.0;
			pt_1_ground.y = 0.0;

			geo.vertices.push(center);
			geo.vertices.push( pt_1 );
			geo.vertices.push( pt_0 );

			var face = new THREE.Face3(geo.vertices.length-3, geo.vertices.length-2, geo.vertices.length-1);
			face.color.setHex( colorFloor );
			geo.faces.push( face );

			geo.vertices.push( pt_0 );
			geo.vertices.push( pt_1 );
			geo.vertices.push( pt_1_ground );

			var face = new THREE.Face3(geo.vertices.length-3, geo.vertices.length-2, geo.vertices.length-1);
			face.color.setHex( colorFloorSide );
			geo.faces.push( face );

			geo.vertices.push( pt_0 );
			geo.vertices.push( pt_1_ground );
			geo.vertices.push( pt_0_ground );
			
			var face = new THREE.Face3(geo.vertices.length-3, geo.vertices.length-2, geo.vertices.length-1);
			face.color.setHex( colorFloorSide );
			geo.faces.push( face );

		}

		var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );
		var colorMaterial = new THREE.MeshBasicMaterial({

	            color:              0X6FA139,
	            wireframe:          true,
	            wireframeLinewidth: 3
	        });

	    var mesh = new THREE.Mesh(
	        geo,
	        vertexColorMaterial
	    );
	    mesh.doubleSided = false;
	    mesh.overdraw = false;
	    g_scene.add(mesh);
	}

	this.initRipple = function()
	{
		/// generate geometry
		var geo = new THREE.Geometry();

		var colorRipple = 0x86DEC8;
		var rippleDist = 0.15;

		for ( var i = 0; i < this.pts.length; i ++ ) 
		{
			var pt_0 = this.pts[i].clone();
			var pt_1 = this.pts[(i+1)%this.pts.length].clone();
			pt_0.y = 0.02;
			pt_1.y = 0.02;

			var pt_0_ext = pt_0.clone();
			var pt_1_ext = pt_1.clone();
			pt_0_ext.normalize().multiplyScalar( rippleDist );
			pt_1_ext.normalize().multiplyScalar( rippleDist );
			pt_0_ext.add( pt_0 )
			pt_1_ext.add( pt_1 )

			geo.vertices.push( pt_0 );
			geo.vertices.push( pt_1 );
			geo.vertices.push( pt_1_ext );
			geo.vertices.push( pt_0_ext );

			var face_0 = new THREE.Face3(geo.vertices.length-4, geo.vertices.length-3, geo.vertices.length-2);
			var face_1 = new THREE.Face3(geo.vertices.length-4, geo.vertices.length-2, geo.vertices.length-1);
			face_0.color.setHex( colorRipple );
			face_1.color.setHex( colorRipple );
			geo.faces.push( face_0 );
			geo.faces.push( face_1 );
		}

		var vertexColorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

		var colorMaterial = new THREE.MeshBasicMaterial(
		{
            color:              colorRipple,
            wireframe:          false,
            wireframeLinewidth: 3
        });

	    this.meshRipple = new THREE.Mesh(geo, colorMaterial );
	    this.meshRipple.doubleSided = true;
	    this.meshRipple.overdraw = true;

	    g_scene.add(this.meshRipple);
	}

	this.init = function()
	{
		this.initWater();
		this.initPts();
		this.initFlatland();
		this.initRipple();
	}

	this.draw = function()
	{

	}

	this.update = function()
	{
		return;

		var time = Date.now() * 0.003;

		var color_0 = new THREE.Color( 0x86DEC8 );
		var color_1 = new THREE.Color( 0xffffff );
		color_0.lerp( color_1, Math.sin(time)*0.5+0.5 );

		this.meshRipple.material.color = color_0;
	}
}