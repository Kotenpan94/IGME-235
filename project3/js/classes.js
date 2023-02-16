//Class for taking care of the ground tiles sprite
class Ground extends PIXI.Sprite {
    //Constructor - I'll need a width and height to know how big the ground is, and where to put it with x and y
    constructor(width = 0, height = 0, x = 0, y = 0) {
        super(app.loader.resources["images/PixelGround6.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(.1);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;

    }
}
//Class for the Player sprite and its actions that it needs
class Player extends PIXI.Sprite {
    //Constructor, I'll need location and size of sprite as a must
    constructor(width = 0, height = 0, x = 0, y = 0, speed = 1) {
        //I've yet to pull in my player character, will leave as blank for time being
        super(app.loader.resources["images/PlayerCharacter6.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.speed = speed;




    }
}
//Class that takes care of Bullet sprite, loads one of two randomly(50/50)
class Bullet extends PIXI.Sprite {
    constructor(width = 0, height = 0, x = 0, y = 0, speed = 5) {
        let rng = Math.random();
        if (rng < .5){
            //Right to Left side
            super(app.loader.resources["images/Tulip6.png"].texture);
            this.direction = -1;
            this.x = x;
        }
        else{
            //Left to Right side
            super(app.loader.resources["images/AltTulip2.png"].texture);
            this.direction = 1;
            this.x = 0;
        }
        this.anchor.set(.5, .5);
        this.scale.set(.1);
        //Location
        this.y = y;
        this.width = width;
        this.height = height;
        //Speed
        this.speed = speed;
        this.active = true;
        //Determining where to spawn from
        // this.side = "rightside";


    }
    move(dt = 1 / 60) {

        this.x = lerp(this.x, this.x + (this.speed * dt), 10 * dt);


    }
}
//Class for title screen and game over screen art
class TitleVines extends PIXI.Sprite{
    constructor(width = 0, height = 0, x = 0, y = 0) {
        super(app.loader.resources["images/Vines6.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(.1);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}
//Class for taking care of the Title Pixel art
class Title extends PIXI.Sprite{
    constructor(width = 0, height = 0, x = 0, y = 0) {
        super(app.loader.resources["images/TitleScreen.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(.1);
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }
}
