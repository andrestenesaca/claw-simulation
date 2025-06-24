const claw = document.getElementById("claw");
const toy = document.getElementById("toy");
const clock = document.getElementById("timer");
const startButton = document.getElementById("start-button");

let clawX = 50;
let clawY = -400;

let toyX = 300;
let toyY = 340;

let isDropping= false;
let isAnimating = false;
let isResetting = false;
let activeGame = true;
let timerOn = false;
let wonGame = false;



function startGame(){
    startButton.addEventListener("click", ()=>{
        timer();
    })
}


function animate(direction){
    if(isResetting) return;
    if(isDropping) return;
    if(!timerOn){
        timer();
        timerOn = true;
    }

    if (direction === "ArrowLeft"){
        if(clawX - 5 <= -5){ // makes sure the claw does not go out of bounds
            return;
        }
        clawX -= 5;
    }
    else if (direction === "ArrowRight"){
        if(clawX + 5 >= 475){ // makes sure the claw does not go out of bounds
            return;
        }
        clawX += 5;
    }
    else if (direction === " "){
        dropClaw();
        return;
    }
    claw.style.transform = `translate(${clawX}px,${clawY}px)`;
    if (isAnimating){
        requestAnimationFrame(()=>{
            animate(direction);
        });
    }
}

document.addEventListener("keydown", (event) => {
    if(!activeGame) return;

    switch (event.key){
        case "ArrowLeft":
            if (!isAnimating){
                isAnimating = true;
                animate("ArrowLeft");
            }
            break;
        case "ArrowRight":
            if (!isAnimating) {
                isAnimating = true;
                animate("ArrowRight");
            }
            break;
        case " ":
            if (!isAnimating) {
                isAnimating = true;
                animate(" ");
            }
            break;
    }
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        isAnimating = false; // stop animation when key released
    }
});

function dropClaw() {
    isDropping = true;
    isAnimating = false;

    const drop = () => {
        if (grabbedBall()) {
            moveToy(toy);
            reset();
            wonGame = true;
            return;
        }
        else if (clawY >= -160) {
            reset(claw);
            activeGame = false;
            return;
        }
        clawY += 8;
        claw.style.transform = `translate(${clawX}px, ${clawY}px)`;
        requestAnimationFrame(drop);
    };
    requestAnimationFrame(drop);
}

function reset() {
    const lift = () => {
        if (clawY <= -400) {
            requestAnimationFrame(moveLeft);
            return;
        }
        clawY -= 8;
        claw.style.transform = `translate(${clawX}px, ${clawY}px)`;
        requestAnimationFrame(lift);
    }

    const moveLeft = () => {
        if (clawX <= 70) {
            isResetting = false;
            isDropping = false;
            return;
        }
        clawX -= 5;
        claw.style.transform = `translate(${clawX}px, ${clawY}px)`;
        requestAnimationFrame(moveLeft)
    }
    requestAnimationFrame(lift)
}

function moveToy(){
    const lift = () => {
        if(toyY <= 130){
            requestAnimationFrame(moveLeft);
            return;
        }
        toyY -= 8;
        toy.style.transform = `translate(${toyX}px,${toyY}px)`
        requestAnimationFrame(lift);
    };

    const moveLeft = () => {
        if(toyX <= 70){
            requestAnimationFrame(pickupPrize);
            return;
        }
        toyX -= 5;
        toy.style.transform = `translate(${toyX}px,${toyY}px)`
        requestAnimationFrame(moveLeft);
    }

    const pickupPrize = () => {
        if(toyY >= 340){
            toy.style.display = "none";
            toyY += 165;
            toy.style.transform = `translate(${toyX}px,${toyY}px)`
            toy.style.display = "block";
            activeGame = false;
            return;
        }
        toyY += 5;
        toy.style.transform = `translate(${toyX}px,${toyY}px)`
        requestAnimationFrame(pickupPrize);
    }

    requestAnimationFrame(lift);
}

function grabbedBall(){
    const ball = toy.getBoundingClientRect();
    const claw_hand = claw.getBoundingClientRect();

    return !(
        ball.right < claw_hand.left ||
        ball.left > claw_hand.right ||
        ball.bottom < claw_hand.top ||
        ball.top > claw_hand.bottom
    );
}

function timer(){
    let seconds = 8;
    const countdown = setInterval(()=> {
        if(seconds <= 0 || !activeGame && !isDropping){
            clearInterval(countdown);
            clock.textContent = "0:00";
            clock.style.fontSize = "30px";
            reset();
            activeGame = false;
        }
        else if(wonGame){
            clearInterval(countdown);
            clock.textContent = "WINNER!";
            clock.style.fontSize = "18px";
        }
        else {
            clock.textContent = "0:0" + seconds.toString();
        }
        seconds--;
    },1000);
}