let lettersElement = document.querySelector(".letters");
let wordSpan = document.querySelector(".word span");
let rightAnswer = document.querySelector(".rightAnswer");
let pieces = document.querySelector(".pieces");
let start = document.querySelector(".start");
let input = document.getElementById("user");
let submit = document.getElementById("submit");
let username = document.querySelector(".name");
let fieldRight = document.querySelector(".field");
const lettters = "qwertyuiopasdfghjklzxcvbnm";
let letterArray = lettters.toUpperCase().split("");
let letter = letterArray.forEach((e) => {
  let span = document.createElement("span");
  span.className = "letter-box";

  let letterTxt = document.createTextNode(e);
  span.appendChild(letterTxt);
  lettersElement.appendChild(span);
});
let letterBox = document.querySelectorAll(".letter-box");

window.onload = function () {
  if (window.localStorage.name) {
    start.style.display = "none";
    username.appendChild(
      document.createTextNode(`\*\*${window.localStorage.name}\*\*`)
    );
  } else {
    document.body.style.pointerEvents = "none";
    start.style.display = "block";
    // start.style.setProperty("pointer-events", "fill", "important");
    start.style.pointerEvents = "fill";
    input.oninput = function () {
      window.localStorage.name = input.value;
      submit.onclick = function () {
        start.style.display = "none";
        username.appendChild(
          document.createTextNode(`\*\*${window.localStorage.name}\*\*`)
        );
      };
    };
  }
};

async function getApi() {
  try {
    let jsonData = await fetch("./data.json");
    let data = await jsonData.json();
    let dataArray = Object.keys(data);
    let dataArrayValue = Object.values(data);

    let randomCatagoryNumber = Math.floor(Math.random() * dataArray.length);
    let randomCatagory = dataArray[randomCatagoryNumber];
    wordSpan.appendChild(document.createTextNode(` \*${randomCatagory}\*`));
    let randomCatagoryValue = dataArrayValue[randomCatagoryNumber];

    let randomGuessNumber = Math.floor(
      Math.random() * randomCatagoryValue.length
    );
    let randomGuess = randomCatagoryValue[randomGuessNumber];
    let guessArray = Array.from(randomGuess);
    let randomGuessLength = randomGuess.length;

    function endGame() {
      let popUp = document.createElement("div");
      popUp.className = "popUp";
      let popUpTxt = document.createTextNode(
        ` Ooops Game Over ${window.localStorage.name}, The Answer is ${randomGuess}`
      );
      let p = document.createElement("p");

      let playAgain = document.createElement("button");
      playAgain.className = "playAgain";
      playAgain.appendChild(document.createTextNode("Play Again"));
      p.appendChild(popUpTxt);
      popUp.appendChild(p);
      popUp.appendChild(playAgain);

      document.body.appendChild(popUp);

      playAgain.onclick = () => {
        history.go(0);
      };
    }
    function finishedGame() {
      let finishedPop = document.createElement("div");
      finishedPop.className = "popUp";
      let finishedPopTxt = document.createTextNode(
        `Exellent ${window.localStorage.name}`
      );
      let p = document.createElement("p");
      let playAgain = document.createElement("button");
      playAgain.className = "playAgain";
      playAgain.appendChild(document.createTextNode("Play Again"));

      p.appendChild(finishedPopTxt);
      finishedPop.appendChild(p);
      finishedPop.appendChild(playAgain);
      document.body.appendChild(finishedPop);

      playAgain.onclick = () => {
        history.go(0);
      };
    }

    for (let i = 0; i < randomGuessLength; i++) {
      if (randomGuess[i] === " ") {
        var field = document.createElement("span");
        field.classList.add("dash");
        field.appendChild(document.createTextNode("-"));
        rightAnswer.appendChild(field);
      } else {
        var field = document.createElement("span");
        field.className = "field";
        rightAnswer.appendChild(field);
        // rightAnswer.setAttribute("data-answer", randomGuess);
      }
    }
    let wrongAttempt = 0;
    document.addEventListener("click", (e) => {
      let status = false;
      if (e.target.className === "letter-box") {
        e.target.classList.add("clickedLetter");

        let theClickedLetter = e.target.innerHTML.toLowerCase();

        guessArray.forEach((e, index) => {
          if (e === theClickedLetter) {
            status = true;
            let rightField = document.querySelectorAll(".rightAnswer span");
            rightField.forEach((ele, ind) => {
              if (ind === index) {
                ele.innerHTML = theClickedLetter;
                ele.classList.add("full");
              }
            });
            let rightFieldFull =
              document.querySelectorAll(".rightAnswer .full");
            let spaceF = document.querySelectorAll(".rightAnswer .dash");
            if (rightFieldFull.length === randomGuessLength - spaceF.length) {
              document.getElementById("good").play();
              finishedGame();
              letterBox.forEach((e) => e.classList.add("finished"));
            }
          }
        });
        if (status !== true) {
          wrongAttempt++;
          pieces.classList.add(`wrong-${wrongAttempt}`);
          document.getElementById("fail").play();
          if (wrongAttempt === 8) {
            document.getElementById("gameOver").play();
            endGame();
            letterBox.forEach((e) => e.classList.add("finished"));
          }
        }
      }
    });
  } catch (err) {
    console.log(Error("No Data Found"));
  }
}

getApi();
