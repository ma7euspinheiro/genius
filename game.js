var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var gameStarted = false;
var level = 0;
var gameModeSelected;
var acceptingUserInput = false;

function gameStart() {
  if (!gameStarted && gameModeSelected != null) {
    gameStarted = true;
    nextSequence();
  }
}

$(document).on("touchstart", function (evento) {
  event.preventDefault();
  gameStart();
}); //mobile
$(document).on("keydown", gameStart); //desktop

$(".game-modes").one("click", async function () {
  await wait(200);

  if (!gameStarted) {
    $("#level-title").text(`Level ${level}`);
    $(".colors-container").toggle();
    $(".gm-container").toggle();
    $("#main-menu-button").toggle();
    gameModeSelected = this.id;
    gameStart();
  }
});

$("#main-menu-button").click(async function () {
  await wait(200);

  startOver();
  gameModeSelected = null;
  $("#main-menu-button").toggle();
  $(".colors-container").toggle();
  $(".gm-container").toggle();

  $("#level-title").text("SELECIONE UM MODO DE JOGO");
});

$(".btn").on("click", function () {
  if (!acceptingUserInput || level < 1) return;

  var userChosenColor = $(this).attr("id");
  userClickedPattern.push(userChosenColor);

  animatePress(userChosenColor);
  playSound(userChosenColor);

  checkAnswer(userClickedPattern.length - 1);
});

function playSound(name) {
  var buttonSound = new Audio(`sounds/${name}.mp3`);
  buttonSound.currentTime = 0;
  buttonSound.play();
}

function animatePress(currentColor) {
  $(`#${currentColor}`).addClass("pressed");

  setTimeout(function () {
    $(`#${currentColor}`).removeClass("pressed");
  }, 100);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function nextSequence() {
  userClickedPattern = [];
  acceptingUserInput = false;

  level += 1;
  $("#level-title").text(`NIVEL ${level}`);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];

  gamePattern.push(randomChosenColor);

  if (gameModeSelected === "game-mode2") {
    acceptingUserInput = false;

    $(`#${randomChosenColor}`).fadeTo(100, 0.3, function () {
      $(this).fadeTo(500, 1.0);
    });

    playSound(randomChosenColor);

    acceptingUserInput = true;
  } else {
    for (let index = 0; index < gamePattern.length; index++) {
      $(`#${gamePattern[index]}`).fadeTo(100, 0.3, function () {
        $(this).fadeTo(500, 1.0);
      });
      playSound(gamePattern[index]);

      await wait(700);
    }

    acceptingUserInput = true;
  }
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 2000);
    }
  } else {
    var wrongSound = new Audio("sounds/wrong.mp3");
    wrongSound.play();
    $("body").addClass("game-over");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    $("#level-title").text(
      "GAME OVER, APERTE QUALQUER TECLA OU TOQUE NA TELA PARA REINICIAR"
    );
    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  gameStarted = false;
}
