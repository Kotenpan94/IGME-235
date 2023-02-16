//Using strict to prevent errors easily
"use strict";
//App height might be adjusted later on
const app = new PIXI.Application({
    width: 600,
    height: 600,
    backgroundColor: 0xade8f4,


});

document.body.querySelector('#pixi').appendChild(app.view);


//Appending the window to the page
document.body.appendChild(app.view);
// constants for width and height
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
//Loader
app.loader.
    add([
        "images/PixelGround6.png",
        "images/PlayerCharacter6.png",
        "images/Tulip6.png",
        "images/AltTulip2.png",
        "images/Vines6.png",
        "images/TitleScreen.png"
    ]);
app.loader.onComplete.add(setUp);
app.loader.load();
// aliases
let stage;

// game variables
//states
let titleScene, titleText, vines;
let gameScene, lifeLabel, timerLabel, player, gameMusic, hitSound;
let ground = [];
const keys = {};
let playerSheet = {};
let findKey;
let gameOverScene;
let totalSeconds = 0;


let paused = true;
//Game stats(?) - Subject to Change
let life = 3;
let bullets = [];
let checkJump = false;
let checkHorizontal = false;
let moveDirection = 0;
let speed = 1;
let jumpCycle = 0;
let horizontalCycle = 0;
let randomBullet = 0;
let counter = 0;
const maxJump = 200;

function setUp() {
    stage = app.stage;
    //Creating title scene/state
    titleScene = new PIXI.Container();
    stage.addChild(titleScene);
    //Creating game scene/state
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    //Creating gameover scene/state
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    //Sprite code adding it to scene
    player = new Player(40, 40, sceneWidth / 2, 545, 5);
    gameScene.addChild(player);




    //Calling the function that creates the buttons
    createLabelsAndButtons();
    findKey = document.querySelector("#keys");
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    //Loading in the music: https://freemusicarchive.org/genre/Chiptune
    gameMusic = new Howl({
        src: ['audio/Gigakoops.mp3']
    });
    hitSound = new Howl({
        src: ['audio/hit.wav']
    });
    //Creating a temporary function here to just be able to move thru out states. I plan on creating the right fonts in photoshop later and then importing them in.
    function createLabelsAndButtons() {
        let buttonStyle = new PIXI.TextStyle({
            fill: 0xFF0000,
            fontSize: 48,
            fontFamily: "Sans"
        })


        //Making start scene button
        let startButton = new PIXI.Text("Start!");
        startButton.style = buttonStyle;
        startButton.x = 250;
        startButton.y = 280;
        startButton.interactive = true;
        startButton.buttonMode = true;
        startButton.on("pointerup", startGame, keyDown, keyUp);
        startButton.on('pointerover', e => e.target.alpha = 0.7);
        startButton.on('pointerout', e => currentTarget.alpha = 1.0);
        titleScene.addChild(startButton);
        //Play again button code, location, clickable, etc...
        let playAgainButton = new PIXI.Text("Play again?");
        playAgainButton.style = buttonStyle;
        playAgainButton.x = 220;
        playAgainButton.y = 280;
        playAgainButton.interactive = true;
        playAgainButton.buttonMode = true;
        playAgainButton.on("pointerup", startGame, keyDown, keyUp);
        playAgainButton.on('pointerover', e => e.target.alpha = 0.7);
        playAgainButton.on('pointerout', e => currentTarget.alpha = 1.0);
        gameOverScene.addChild(playAgainButton);
        //Defining title text
        let titleText = new Title(300, 300, 290, 140);
        titleScene.addChild(titleText);
        //Title screen decorating with vines asset I made
        let vines = new TitleVines(600, 600, 300, 300);
        titleScene.addChild(vines);
        //Game over screen decorating with vines asset I made
        let vinesEnd = new TitleVines(600, 600, 300, 300);
        gameOverScene.addChild(vinesEnd);
        let textStyle = new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: 18,
            fontFamily: "Futura",
            stroke: 0xFF0000,
            strokeThickness: 4
        });
        //Life Label
        lifeLabel = new PIXI.Text();
        lifeLabel.style = textStyle;
        lifeLabel.x = 5;
        lifeLabel.y = 26;
        gameScene.addChild(lifeLabel);
        decreaseLifeBy(0);

        timerLabel = new PIXI.Text();
        timerLabel.style = textStyle;
        timerLabel.x = 5;
        timerLabel.y = 46;
        gameScene.addChild(timerLabel);
    }
    //Starts game
    function startGame() {
        //Rearranges the states, makes game the only visible one
        titleScene.visible = false;

        gameOverScene.visible = false;
        gameScene.visible = true;
        //Intializes life
        life = 10;
        bullets = [];
        totalSeconds = 0;
        timerLabel.text = `Time Lasted:    ${totalSeconds}`;


        //Decreases life by 0 at start
        decreaseLifeBy(0);
        //Loads in the ground
        for (let i = 0; i < 15; i++) {
            ground[i] = new Ground(150, 150, 50 * i, 600)
            gameScene.addChild(ground[i]);
        }
        //Ensuring gameloop will only be added once to prevent speed up 
        if (counter == 0) {
            app.ticker.add(gameLoop);
            //Starts game music 
            gameMusic.play();
            counter++;
        }




    }

    //Decreases the life by value when an attack is registered
    function decreaseLifeBy(value) {
        //Decreases life
        life -= value;
        life = parseInt(life);
        lifeLabel.text = `Lives Remaining:    ${life}`;
    }
    setInterval(setTime, 1000);

    function setTime() {
        ++totalSeconds;
        timerLabel.text = `Time Lasted:    ${totalSeconds}`;

    }
    //Game loop, goes off every frame
    function gameLoop() {
        //Movement code
        let dt = 1 / app.ticker.FPS;
        if (dt > 1 / 12) dt = 1 / 12;
        //W
        if (keys["87"]) {
            //Checks for if the jump was triggered or not and defines the state
            if (checkJump == false) {
                checkJump = true;
            }

        }
        //A - Left
        if (keys["65"]) {
            //Checks for move direction compared to speed
            if (moveDirection < speed) {
                moveDirection = -speed;
                checkHorizontal = true;
            }
            else if (moveDirection == speed) {
                moveDirection = 0;
                checkHorizontal = false;
                horizontalCycle = 0;
            }


        }

        //D
        if (keys["68"]) {
            if (moveDirection > -speed) {
                moveDirection = speed;
                checkHorizontal = true;
            }
            else if (moveDirection == -speed) {
                moveDirection = 0;
                checkHorizontal = false;
                horizontalCycle = 0;
            }
        }
        movePlayer();
        randomBullet = Math.random();
        if (randomBullet < .042) {
            createBullet();

        }
        //Calls the movement bullet function
        moveBullets();
        //Game Over criteria
        if (life <= 0) {
            end();
            return;
        }
    }
    //A function that takes care of moving the player. Movement is done via frames, so different amount of cycles are counted each time it is run
    function movePlayer() {
        if (checkJump == true) {
            jumpCycle += 1;
            if (jumpCycle > 0 && jumpCycle < maxJump / 2) {
                player.y -= speed;
            }
            else if (jumpCycle > maxJump / 2 && jumpCycle < maxJump) {
                player.y += speed;
            }
            else if (jumpCycle == maxJump) {
                jumpCycle = 0;
                checkJump = false;
            }

        }
        if (checkHorizontal == true) {
            horizontalCycle += 1;
            if (horizontalCycle > 0 && horizontalCycle < 50) {
                player.x += moveDirection;
            }

            else if (horizontalCycle == 50) {
                horizontalCycle = 0;
                checkHorizontal = false;
            }
        }
        if (player.x > sceneWidth) {
            player.x = sceneWidth;
        }
        else if (player.x <= 0) {
            player.x = 0;

        }


    }
    //Function for moving the bullets
    function moveBullets() {
        bullets.forEach(moveBullet);

    }
    //Function that takes care of moving each individual bullet
    function moveBullet(bullet) {
        bullet.x = bullet.x + bullet.direction;
        //Collisions
        for (let b of bullets) {
            //Collision detection
            if (b.active && rectsIntersect(player, b)) {
                //Makes the bullets inactive
                b.active = false;
                //Decreases life
                decreaseLifeBy(1);
                //Plays hit sound
                hitSound.play();
                //Removes the collided bullet from the scene
                gameScene.removeChild(b);


            }
        }
    }
    //Filters the active bullets
    bullets = bullets.filter(b => b.active);
    function end() {
        //paused = true;
        //Removes all bullets 
        bullets.forEach(b => gameScene.removeChild(b));
        bullets = [];
        //Brings screen to gameover
        gameOverScene.visible = true;
        gameScene.visible = false;
        

    }
    //Functions that check for if a key is down or not
    function keyDown(e) {
        keys[e.keyCode] = true;
    }
    function keyUp(e) {
        keys[e.keyCode] = false;

    }
    
    //Function for creating the bullets, the class itself takes care of which side to spawn said bullets on
    function createBullet() {
        //Calculates a random height to put the bullet at, within reason
        let randomHeight = sceneHeight - Math.random(300, sceneHeight - 300) * sceneHeight * .75 + 150;
        let bullet = new Bullet(30, 30, sceneWidth, randomHeight);
        //Randomy decides the bullets speed and adds it to the scene
        let rand = Math.floor((Math.random() * 500) + 150);
        bullet.speed = rand;
        bullets.push(bullet);
        gameScene.addChild(bullet);

    }




}


