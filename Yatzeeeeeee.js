

let dice = {face: 1, locked: false, pic: "Alea_1.png"};
let dice2 = {face: 2, locked: false, pic: "Alea_2.png"};
let dice3= {face: 3, locked: false, pic: "Alea_3.png"};
let dice4 = {face: 4, locked: false, pic: "Alea_4.png"};
let dice5 = {face: 5, locked: false, pic: "Alea_5.png"};
const diceCup = [dice, dice2, dice3, dice4, dice5];
let diePic = ["Alea_1.png","Alea_2.png","Alea_3.png","Alea_4.png","Alea_5.png","Alea_6.png"];
let turn = 0;
let score = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];


function rollDice(diceCup){
    for(let die of diceCup){
        if(die.locked === false){
            die.face = Math.floor(Math.random() * 6 + 1);
            // console.log(die.face);

            /**
             * Alternativt kunne man have lavet:
             * die.pic = diePic[die.face - 1];
             * Men vi har ikke meget erfaring med switch og case og vi ville gerne øve os
             */
            switch (die.face) {
                case 1:
                    die.pic = diePic[0];
                    break;
                case 2:
                    die.pic = diePic[1];
                    break;
                case 3:
                    die.pic = diePic[2];
                    break;
                case 4:
                    die.pic = diePic[3];
                    break;
                case 5:
                    die.pic = diePic[4];
                    break;
                case 6:
                    die.pic = diePic[5];
                    break;
            }
        }
    }
}

function updateGame() {
    if (turn < 3) {

        rollDice(diceCup);
        turn++;
        let dices = document.body.querySelectorAll("td");
        let t = document.getElementById("turn");
        t.innerText = "Turn "+ turn;
        for (let i = 0; i < dices.length; i++) {
            document.body.querySelector("#dice" + (i + 1)).firstChild.src = diceCup[i].pic;
        }
    }else{

    }
    updateScoreBoard();
    updateSums();
}

function updateScoreBoard(){

    /**
     * Funktion der returnerer frekvensen af terningsværdierne hvor index er hovedet på terningen
     * @returns {Array}
     */
    function frequency(){
        let array = [0,0,0,0,0,0,0];
        for (let e of diceCup){
            array[e.face]++;
        }
        return array;
    }

    function sameValuePoints(value){
        return frequency()[value]*value;
    }

    function onePair(){
        let arr = frequency();
        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 2){
                return 2*i;
            }
        }
        return 0;
    }

    function twoPairs() {
        let pair = 0;
        let arr = frequency();
        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 2 && pair === 0){
                pair = 2*i;
            }else if(arr[i] >= 2){
                return pair+2 *i;
            }
        }
        return 0;
    }

    function threeSame() {
        let arr = frequency();
        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 3){
                return 3*i;
            }
        }
        return 0;
    }

    function fourSame() {
        let arr = frequency();
        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 4){
                return 4*i;
            }
        }
        return 0;
    }
    
    function fullHouse() {
        let pair = 0;
        let three = 0;
        let arr = frequency();

        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 3 && three === 0){
                three = 3*i;
            }else if(arr[i] >= 2 && pair === 0){
                 pair = 2 *i;
            }
        }
        if(three !== 0 && pair !== 0){
            return pair+three;
        }
        return 0;
    }

    function smallStraight() {
        let arr = frequency();
        for (let i = 1; i < 6; i++) {
            if (arr[i] !== 1){
                return 0;
            }
        }
        return 15;
    }

    function largeStraight() {
        let arr = frequency();
        for (let i = 2; i < 7; i++) {
            if (arr[i] !== 1){
                return 0;
            }
        }
        return 20;
    }

    function chance() {
        let points = 0;

        for (let e of diceCup){
            points += e.face;
        }

        return points;
    }

    function yatzy() {
        let arr = frequency();
        for (let i = 6; i > 0 ; i--) {
            if(arr[i] >= 5){
                return 50;
            }
        }
        return 0;
    }

    for (let i = 0; i < 6 ; i++) {
        score[i] = sameValuePoints(i+1);
    }
    score[8] = onePair();
    score[9] = twoPairs();
    score[10] = threeSame();
    score[11] = fourSame();
    score[12] = fullHouse();
    score[13] = smallStraight();
    score[14] = largeStraight();
    score[15] = chance();
    score[16] = yatzy();


    for (let i = 0; i < scorePad.length ; i++) {
        if(!scorePad[i].disabled) {
            scorePad[i].value = score[i];
        }
    }
}

function updateSums(){
    let sum = 0;
    for (let i = 0; i < 6 ; i++) {
        if(scorePad[i].disabled) {
            sum += parseInt(scorePad[i].value);
        }
    }
    scorePad[6].value = sum;

    if(sum >= 53){
        scorePad[7].value = 50;
    }

    let totalSum = 0;
    for (let i = 8; i < scorePad.length-1; i++) {
        if(scorePad[i].disabled) {
            totalSum += parseInt(scorePad[i].value)
        }
    }

    scorePad[17].value = (sum + parseInt(scorePad[7].value + totalSum))
}


let scorePad = [];
let checkPad = [];

onload = () => {
  let knap = document.querySelector("button");
  knap.onclick = updateGame;
    let inputs = document.body.querySelectorAll("input");
    inputs.forEach(e => scorePad.push(e));
    for (let i = 0; i < 5 ; i++) {
        scorePad.shift();
        checkPad.push(inputs[i]);
    }
    for (let i = 0; i <checkPad.length ; i++) {
        checkPad[i].onclick = () =>{diceCup[i].locked = true;
        checkPad[i].disabled = true};
    }

    for (let i = 0; i < scorePad.length; i++) {
        scorePad[i].onclick = () => {
            scorePad[i].disabled = true;
            turn = 0;
            let t = document.getElementById("turn");
            t.innerText = "Turn "+ turn;
            for (let e of checkPad){
                e.disabled = false;
                e.checked = false;
            }
            for(let e of diceCup){
                e.locked = false;
            }
            updateSums();
        }
    }

    console.log(scorePad);
    console.log(checkPad);

};