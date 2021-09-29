//Create variables here

var dogImg, happyDogImg, dog, happyDog, sadDog_img;
var database, foodS, foodStock;
var bedroom_img, garden_img, washroom_img;
var changingGameState, readingGameState, lastFed;

function preload()
{
	//load images here
  dogImg = loadImage("images/Dog.png");
  happyDogImg = loadImage("images/happydog.png");
  bedroom_img = loadImage("images/Bed Room.png");
  garden_img = loadImage("images/Garden.png");
  washroom_img = loadImage("images/Wash Room.png");
  sadDog_img = loadImage("images/Lazy.png");
}

function setup() {
	createCanvas(1000, 400);

  dog = createSprite(800,250,10,10);
  dog.addImage("dog", dogImg);
  dog.scale=0.3;

  foodObj = new Food();
 
 
  feed = createButton('Feed the Dog');
  feed.position(700, 100);
  feed.mousePressed(feedDog);
  
  addFood = createButton('Add Food');
  addFood.position(800, 100);
  addFood.mousePressed(addFoods);

  database = firebase.database();

  readState = database.ref('gameState'); 
  readState.on("value",function(data){ 
  gameState=data.val(); });
  
  foodStock = database.ref('Food')
  foodStock.on("value",readStock)

  fedTime = database.ref('feedTime');
  fedTime.on('value', function(data){
  lastFed = data.val();
  })


}


function draw() {  

  background("lightgreen");

  //fedTime = database.ref('feedTime');
  //fedTime.on('value', function(data){
  //lastFed = data.val();
  //})

  currentTime=hour(); 
  
  if(currentTime==(lastFed+1)){ 
    update("Playing"); 
    foodObj.garden(); 
  }
  else if(currentTime==(lastFed+2)){ 
    update("Sleeping"); foodObj.bedroom(); 
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ 
    update("Bathing"); foodObj.washroom(); 
  }
  else{ 
    update("Hungry") 
    foodObj.display(); 
  } 
  if(gameState!="Hungry"){ 
    feed.hide(); 
    addFood.hide(); 
    //dog.remove();
    dog.addImage("dog", happyDogImg);
  }
  else{ 
    feed.show(); 
    addFood.show(); 
    dog.addImage("dog", sadDog_img); 
  }

  drawSprites();
  //add styles here
  


}

function readStock(data){
 foodS = data.val();
 foodObj.updateFoodStock(foodS);
}

function feedDog(){ 
  dog.addImage("dog",happyDogImg); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  console.log('foodObj')
  database.ref('/').update({ 
  Food:foodObj.getFoodStock(), feedTime:hour(), gameState:"Hungry" });
  console.log(foodObj.getFoodStock());
}
  

function addFoods(){ 
  foodS++; database.ref('/').update({ Food:foodS }) 
}

function update(state){ 
  database.ref('/').update({ gameState:state }) 
}






