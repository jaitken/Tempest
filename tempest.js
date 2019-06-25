
function start(){


	// set the scene size
	var WIDTH = 1200;
	var HEIGHT = 600;
	var score = 0; 
	var boost = false;
	var boostTimer = 0;

	var moveLeft = false;
	var moveRight = false; 
	var moveDown = false; 
	var moveUp= false; 
	var vel = .2;
	var velz = 0;
	var started = false; //camera is not moving forward

	// create a WebGL renderer, camera and a scene
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	scene = new THREE.Scene();
	
	// attach the render-supplied DOM element (the gameCanvas)
	var canvas = document.getElementById("gameCanvas");
	canvas.appendChild(renderer.domElement);

	
	//create camera
	camera = new THREE.PerspectiveCamera(
	    75, //fov
	    WIDTH/HEIGHT, //aspect ratio
	    .1,   //near
	    1000);//far
		
	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	camera.position.z = 50; 
	camera.position.y = 5;

	//ring
	var geometry = new THREE.RingGeometry( 2, 3, 32 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ffff, side: THREE.DoubleSide } );
	var ring = new THREE.Mesh( geometry, material );
	scene.add( ring );

	ring.position.y = 5;
	
	//ground 
	var geometry = new THREE.PlaneGeometry( 30, 4200, 10 );
	var material = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe:true} );
	var ground = new THREE.Mesh( geometry, material );
	scene.add( ground );
	ground.rotation.x = 4.7126; 

	//leftWall
	var geometry = new THREE.PlaneGeometry( 4200, 15, 300 );
	var material = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe:true} );
	var leftWall = new THREE.Mesh( geometry, material );
	scene.add( leftWall );
	leftWall.rotation.y= 4.7126; 
	leftWall.position.x = -15;
	leftWall.position.y = 8;

	//right wall
	var geometry = new THREE.PlaneGeometry( 4200, 15, 300 );
	var material = new THREE.MeshBasicMaterial( {color: 0x0000ff, side: THREE.DoubleSide, wireframe:true} );
	var rightWall = new THREE.Mesh( geometry, material );
	scene.add( rightWall );
	rightWall.rotation.y= 4.7126; 
	rightWall.position.x = 15;
	rightWall.position.y = 8;

	//roof 
	
	var geometry = new THREE.PlaneGeometry( 30, 4200, 10 );
	var material = new THREE.MeshBasicMaterial( {color:0x0000ff, side: THREE.DoubleSide, wireframe:true} );
	var roof = new THREE.Mesh( geometry, material );
	scene.add( roof );
	roof.rotation.x = 4.7126; 
	roof.position.y = 15.5;

	//Movement
	window.addEventListener("keydown", move, false);
	window.addEventListener("keyup", stop, false);
	

	function move(key){
		if(key.keyCode == '65'){
			moveLeft = true;
		}
		if(key.keyCode == '83'){
			moveDown = true;
		}
		if(key.keyCode == '87'){
			moveUp = true;
		}
		if(key.keyCode == '68'){
			moveRight = true;
		}

		//Space bar starts the camera and resets the game at the end
		if(key.keyCode == '32'){
			velz = .5;
			started = true;

			if(camera.position.z < -2075){
				camera.position.z = 0;
				velz = 0;
				score = 0;
				document.getElementById("scores").innerHTML = score;
				started = false;
			}
		}
	}

	
	function stop(key){
		
		if(key.keyCode == '65'){
			moveLeft = false;
		}

		if(key.keyCode == '83'){
			moveDown = false;
		}
		if(key.keyCode == '87'){
			moveUp = false;
		}
		if(key.keyCode == '68'){
			moveRight = false;
		}

	}
	

	//collision detection done here, boost activated and score increase 
	function collision(){
		var box = new THREE.Box3().setFromObject(ring);
		var a = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z);

		if(box.containsPoint(a)){
			score++; 
			document.getElementById("scores").innerHTML = score;
			boost = true;
			boostTimer = 0;
		}
		booster();
	}


	function booster(){
		//boost is active, change colors and increase speed
		if(boost){
			//ring.material.color.setHex( 0xffff00 );
			ground.material.color.setHex(0xffff00 );
			rightWall.material.color.setHex( 0xffff00 );
			leftWall.material.color.setHex(0xffff00 );
			roof.material.color.setHex(0xffff00 );
			vel = .6;
			velz = 1;
		}else{//boost is off, set colors back
			//ring.material.color.setHex(0x00ffff);
			ground.material.color.setHex(0x0000ff);
			rightWall.material.color.setHex( 0x0000ff );
			leftWall.material.color.setHex(0x0000ff );
			roof.material.color.setHex(0x0000ff );
			vel = .2;
			
			//leave camera velz at 0 until spacebar is hit
			if(started){
				velz = .5;
			}
		}
		
		//controls how long boost is active
		boostTimer++;
		if(boostTimer > 50){
			boost = false;
		}

	}
	
	function moveRing(){
		
		//end of the map, place ring back to the beginning 
		if(camera.position.z < -2070){
			ring.position.z = 25;
		}

		//mid game everytime you pass the rings position it moves its to a random position
		else if(camera.position.z < ring.position.z){
			var y = Math.round(Math.random()*8 +5);
			var x = Math.round(Math.random()*25 - 12);
			
			ring.position.x = x; 
			ring.position.y = y; 
			ring.position.z -= 40;
			
			


		}


		
	}

	//where the camera and rings are updated 
	function update()
	{
		//edge of map stop moving
		if(camera.position.z < -2075){
			velz = 0;
		}
		camera.position.z -= velz;
		
		moveRing();

		//player movement
		if(moveUp == true){
			camera.position.y +=vel;
		}
		if(moveDown == true){
			camera.position.y -=vel;
		}
		if(moveLeft== true){
			camera.position.x -=vel;
		}
		if(moveRight == true){
			camera.position.x +=vel;
		}

		//cap the camera
		if(camera.position.y > 14){
			camera.position.y = 14;
		}
		if(camera.position.y < 1){
			camera.position.y = 1;
		}

		if(camera.position.x < -14){
			camera.position.x = -14;
		}

		if(camera.position.x > 14){
			camera.position.x = 14;
		}

				
	};

	//renders the scene
	function render()
	{
	  renderer.render(scene, camera);

	};

	//Main game loop, 
	function loop(){
		requestAnimationFrame(loop);
		update(); 
		collision();
		render();
	};

	loop();


}