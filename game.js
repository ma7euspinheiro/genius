var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var gameStarted = false;
var level = 0;
var gameModeSelected;

$(document).on("keydown", function () {
  if (!gameStarted && gameModeSelected != null) {
    $("h1").text(`Level ${level}`);
    nextSequence();
    gameStarted = true;
  }
});

$(".game-modes").click(function () {
  if (!gameStarted) {
    $("h1").text(`Level ${level}`);
    gameStarted = true;
    $(".colors-container").addClass("active");
    $(".gm-container").removeClass("active");
    gameModeSelected = this.id;
    nextSequence();
  }
});

$(".btn").on("click", function () {
  if (level >= 1) {
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);

    animatePress(userChosenColor);
    playSound(userChosenColor);

    checkAnswer(userClickedPattern.length - 1);
  }
});

function playSound(name) {
  var buttonSound = new Audio(`./sounds/${name}.mp3`);
  buttonSound.play();
}

function animatePress(currentColor) {
  $(`#${currentColor}`).addClass("pressed");

  setTimeout(function () {
    $(`#${currentColor}`).removeClass("pressed");
  }, 100);
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function nextSequence() {
  userClickedPattern = [];

  level += 1;
  $("h1").text(`Nível ${level}`);

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];

  gamePattern.push(randomChosenColor);

  if (gameModeSelected === "game-mode2") {
    $(`#${randomChosenColor}`).fadeTo(100, 0.3, function () {
      $(this).fadeTo(500, 1.0);
    });

    playSound(randomChosenColor);
  } else {
      for (let index = 0; index < gamePattern.length; index++) {
        $(`#${gamePattern[index]}`).fadeTo(100, 0.3, function () {
          $(this).fadeTo(500, 1.0);
        });  
        playSound(gamePattern[index]);  

        await wait(700);
      }
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

    $("#level-title").text("Game Over, Aperte Qualquer Tecla para Reiniciar");
    startOver();
  }
}

function startOver() {
  level = 0;
  gamePattern = [];
  gameStarted = false;
}
