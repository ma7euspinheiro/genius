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

    ["red", "blue", "green", "yellow"].forEach((color) => {
      const audio = new Audio(`sounds/${color}.mp3`);
      audio.volume = 0;
      audio.play().catch(() => {});
    });

    nextSequence();
  }
}

var sounds = {
  red: new Audio("sounds/red.mp3"),
  blue: new Audio("sounds/blue.mp3"),
  green: new Audio("sounds/green.mp3"),
  yellow: new Audio("sounds/yellow.mp3"),
  wrong: new Audio("sounds/wrong.mp3"),
};

$(document).on("touchstart", function (evento) {
  event.preventDefault();
  gameStart();
}); //mobile
$(document).on("keydown", gameStart); //desktop

$(".game-modes").on("click", async function () {
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
  const sound = sounds[name];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  }
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
