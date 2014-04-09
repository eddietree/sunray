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

	this.init = function()
	{
		this.initWater();

		var segments = 32;
		var maxHeight = 0.3;
		var maxRadius = 3.8;

		var deltaAngle = 2.0 * Math.PI / segments;

		noise.seed(0);

		// generate points
		var pts = new Array();
		for ( var i = 0; i < segments; i ++ ) 
		{
			var radius = maxRadius + noise.simplex2(1.0, i+1.0) * maxRadius * 0.3;
			var angle = i * deltaAngle;

			var x = radius * Math.cos(angle);
			var y = (noise.simplex2(1.0, i+100.0) * 0.5 + 0.5  ) * maxHeight; 
			var z = radius * Math.sin(angle);

			pts.push( new THREE.Vector3( x,y,z ) );
		}

		var colorFloor = 0x79A836;
		var colorFloorSide = 0x4D7C39;

		/// generate geometry
		var geo = new THREE.Geometry();
		var center = new THREE.Vector3( 0,0,0 );

		for ( var i = 0; i < segments; i ++ ) 
		{
			var pt_0 = pts[i];
			var pt_1 = pts[(i+1)%pts.length];

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

	this.draw = function()
	{

	}

	this.update = function()
	{
	}
}