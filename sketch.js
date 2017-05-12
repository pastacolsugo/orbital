var sun = new Planet();
var earth = new Planet();
var moon = new Planet();

var body = [sun, earth, moon];

var DT = 0.01;
// var G = 6.67408e-11;
var G = 1;


function setup() {
	createCanvas(1000, 1000);

	sun.x = 500;
	sun.y = 500;
	sun.radius = 10;
	sun.red = 255;
	sun.green = 255;
	sun.mass = 1000000;

	earth.x = 500;
	earth.y = 800;
	earth.radius = 2;
	earth.blue = 255;
	earth.mass = 1;
	var e_vel = orbitalSpeed (earth, sun);
	// console.log(e_vel);
	earth.velocity.set(400, 0);  // km/s

	moon.x = earth.x;
	moon.y = earth.y+5;
	moon.radius = 2;
	moon.red = 255;
	moon.green = 255;
	moon.blue = 255;
	moon.mass = 0.01;

	var m_vel = orbitalSpeed(moon, earth);
	console.log(m_vel);
	moon.velocity.set(e_vel+10);

	
}

function draw() {
	// console.log(earth.x);
	// console.log(earth.y);
	background(0);
	// line (10, 10, 50, 50);

	var q = 200;
	fill(255, 255, 255);
	rectMode(CENTER);
	rect(sun.x+q, sun.y, 10, 10);
	rect(sun.x-q, sun.y, 10, 10);
	rect(sun.x, sun.y+q, 10, 10);
	rect(sun.x, sun.y-q, 10, 10);

	for (var i=0; i<body.length; i++){
		body[i].draw();
		body[i].gravitationalAttraction = new p5.Vector(0, 0);
	}

	for (var i=0; i<body.length-1; i++){
		for (var j=i+1; j< body.length; j++){
			var force = calcAttraction(body[i], body[j]);
			console.log(force.x);
			body[i].forces.push (force);
			force.setMag(-force.mag());
			body[j].forces.push (force);
		}
	}

	for (var i=1; i<body.length; i++){
		body[i].update();
	}

}

function distance (p1, p2){
	return sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y));
}

function orbitalSpeed (p1, p2, dist){
	if (dist)
		return sqrt((G*(p1.mass + p2.mass))/dist);
	else
		return sqrt((G*(p1.mass + p2.mass))/distance(p1, p2));
}
	
function calcAttraction (p1, p2){
	var m1 = p1.mass,
		x1 = p1.x,
		y1 = p1.y,
		m2 = p2.mass,
		x2 = p2.x,
		y2 = p2.y;
	var distanceSq = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
	var modulus = (G*m1*m2)/distanceSq;
	var force = new p5.Vector(x2-x1, y2-y1);
	force.setMag(modulus);
	// console.log (modulus);
	return force;
}

function Planet(){
	this.x = 0;
	this.y = 0;
	this.mass = 0;
	this.red = 0;
	this.green = 0;
	this.blue = 0;
	this.radius = 0;
	this.forces = [];
	this.velocity = new p5.Vector(0, 0);
	this.draw = function(){
		fill(this.red, this.green, this.blue);
		noStroke();
		this.x = this.x + (this.velocity.x * DT);
		this.y = this.y + (this.velocity.y * DT);
		ellipse (this.x, this.y, this.radius*2, this.radius*2);
	}
	this.update = function (){
		var res = this.forces[0];
		for (var i=0; i<this.forces.length; i++){
			res = p5.Vector.add (res, this.forces[i]);
		}
		this.velocity.x += (res.x/this.mass)*DT;
		this.velocity.y += (res.y/this.mass)*DT;

		var len = this.forces.length;
		for (var i=0; i<len; i++){
			this.forces.pop();
		}
	}
	
}