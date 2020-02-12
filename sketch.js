let cols, rows;
let scl = 50;
let z_values = [];
let z_values_right = [];
//This allows us to increment our y offset to give the perception we are moving over the terrain
let perceived_movement = 0.0;
let perceived_movement_right = 0.0;
let perceived_movement_grid = 0.0;


function setup() {
        createCanvas(windowWidth, windowHeight, WEBGL);
        //Have terrain take up half of screen
        //Alter these values to have mountains on the left and right side of the road 
        let w = (windowWidth/2)-150;
        let h = (windowHeight/3)+350;
        //Number of cols is width of grid, w, divided by the scale
        cols = w/scl;
        //Number of rows is height of grid, h, divided by the scale
        rows = h/scl;

        //Doing the same code but reflecting it to the other side by changing x cols
        let w2 = windowWidth/2;
        cols2 = w2/scl;
     
        //rows is the same        
}

function draw() {

 

  background(0,0,0);
  //With WEBGL, the origin point (0,0) is automatically set to the center
  stroke(0,0,255);
  fill(0,0,100);
  
  perlinNoise();
  //Have PerlinNoiseRight to change direction of right side to come towards screen
  perlinNoiseRight();

  Sun();
  Road();
  leftMountain();
  rightMountain();
  let obstacle = new Obstacles();
  let stars = new Stars();
  obstacle.display();
  obstacle.rotate();
  stars.display();
  

}


function perlinNoise(){
  //Sets speed of movement
  perceived_movement -= 0.08;
  /*Since perlin noise works best with smaller increments, we have to create our own values to offset the x and y in smaller increments rather
  than incrementing by 1 each time*/
  let yoff = perceived_movement; 
  //Setting up 2D array that holds all of our z values
  for(let y = 0; y<rows; y++){
    let xoff = 0.0;
    //creating a nested array, 2D Array
    z_values[y] = [];
    for(let x = 0; x<cols; x++){
      //use noise values to get random values that are dependent on the previous random value so we get a more mountanous terrain
        z_values[y][x] = map(noise(yoff,xoff),0,1,-150,400);
        xoff+=0.1;
    }
    //sets how high mountains will generate
    yoff+=0.1;
  }
}

function perlinNoiseRight(){
  //Sets speed of movement
  perceived_movement_right -= 0.08;
  /*Since perlin noise works best with smaller increments, we have to create our own values to offset the x and y in smaller increments rather
  than incrementing by 1 each time*/
  let yoff = perceived_movement_right; 
  //Setting up 2D array that holds all of our z values
  for(let y = 0; y<rows; y++){
    let xoff = 0.0;
    //creating a nested array, 2D Array
    z_values_right[y] = [];
    for(let x = 0; x<cols; x++){
      //use noise values to get random values that are dependent on the previous random value so we get a more mountanous terrain
        z_values_right[y][x] = map(noise(yoff,xoff),0,1,150,-400);
        xoff+=0.1;
    }
    //sets how high mountains will generate
    yoff+=0.1;
  }
}


function leftMountain(){
  
push();
  //Rotate the plane to be flat in 3D space
  rotateX(PI/2.0);
  rotateZ(PI/7);
  //Need to translate again so that the grid doesn't just draw from the center of the screen, need to offset it to cover left side as well
  translate(-windowWidth/2.4,0);

  //displays grid of rows h/scl times
  for(let y = 0; y < rows; y++){
    //Each row will be its own triangle strip
    beginShape(TRIANGLE_STRIP);
    //displays grid of columns w/scl times
    for(let x = 0; x < cols; x++){
      //To add 3D to the vertices, we need to change the Z value to change this from a 2D plane to a 3D plane
        vertex(x*scl, y*scl, -z_values[y][x]/2);
        //Have a vertex at same x position but y+1 to make a mesh of triangles
        vertex(x*scl, ((y+1)*scl),z_values[y][x+1]);
        //rect(x*scl,y*scl,scl,scl);
    }
    endShape();
  }
pop();
}

function rightMountain(){
  
 push(); 
  //Rotate the plane to be flat in 3D space
 
  rotateY(PI*1.1);
  
  rotateX(-PI/2.1);
  translate(-(windowWidth/2.4), 0);
  
  //rotateZ(PI/15);
  //Need to translate again so that the grid doesn't just draw from the center of the screen, need to offset it to cover left side as well
  //translate(-windowWidth/2.4,0);

  //displays grid of rows h/scl times
  for(let y = 0; y < rows; y++){
    //Each row will be its own triangle strip
    beginShape(TRIANGLE_STRIP);
    //displays grid of columns w/scl times
    for(let x = 0; x < cols; x++){
      //To add 3D to the vertices, we need to change the Z value to change this from a 2D plane to a 3D plane
      //The negative z value allows for mountains to appear more full by forcing the points to connect from below the road
        vertex(x*scl, y*scl, -z_values_right[y][x]/2);
        //Have a vertex at same x position but y+1 to make a mesh of triangles
        vertex(x*scl, ((y+1)*scl),z_values_right[y][x+1]);
        //rect(x*scl,y*scl,scl,scl);
    }
    endShape();
  }
  pop();
}


function Sun(){
  push();
    fill(249,166,2);
    noStroke();
    ellipse(0,-300,200,200);
    
    fill(0);
    //Cover the ellipse with rectangles same color as background to make segmented sun
    rect(-100,-375,200,35);
    rect(-100,-325,200,30);
    rect(-100,-275,200,25);
    rect(-100,-230,200,20);
  pop();
 

}

function Road(){
  //Have road move with mountains
  perceived_movement_grid += 0.2;
  //let yoff_grid = perceived_movement_grid; 
  push();
  //Rotate the plane to be flat in 3D space
  rotateX(PI/2.1);
  translate(-windowWidth/5,0);
  //displays grid of rows h/scl times
  for(let y = 0; y < rows*2; y++){
    //displays grid of columns w/scl times
    for(let x = 0; x < cols; x++){
        stroke(0,150,255);
        fill(0);
        rect(x*scl,y*scl+perceived_movement_grid,scl,scl);
    }
    //offset each row from the other
    //yoff_grid += 5.1;
  }
pop();

}

class Obstacles{
  constructor(){
    this.x = (200,205);
    this.y = random(5,10);
  }

display(){
  translate(0,-300);
//Make torus shapes that come out of the sun that look like rings around the sun
  stroke(0);
  fill(249,166,2);
  torus(this.x-100,this.y);
  fill(249,166,2, 80);
  torus(this.x-50,this.y);
  fill(249,166,2, 50);
  torus(this.x,this.y);
  
}

rotate(){
  let theta = PI;
  rotateY(theta);
  theta+=10;
}

}

class Stars{
  constructor(){
    this.numStars = 200;
  }

  display(){
    translate(0,-300);
    fill(255);
    noStroke(); 
    for(let i = 0; i<this.numStars; i++){
      ellipse(random(-1000,1000),random(0,300),1,5);
    }
  }
}

