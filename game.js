var level = 0;
var started = false;
var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ["red", "blue", "green", "yellow"];

// Play corresponding sound
function playSound(name) { new Audio(name + ".mp3").play(); }

// Init
function nextSequence() {
	userClickedPattern = [];
	level++;
	$("#level-title").text(level); // Update score
	var randomChosenColour = buttonColours[Math.floor(Math.random() * 4)];
	gamePattern.push(randomChosenColour);
	function showNextColor(index = 0) {
		if (index < gamePattern.length) {
			var color = gamePattern[index];
			$("#" + color).fadeIn(100).fadeOut(100).fadeIn(100);
			playSound(color);
			setTimeout(() => showNextColor(index + 1), 1000);
		}
	}
	showNextColor();
}

// Animate pressed button
function animatePress(currentColour) {
	$("#" + currentColour).addClass("pressed");
	setTimeout(() => $("#" + currentColour).removeClass("pressed"), 150);
}

// Check user's answer
function checkAnswer(currentLevel) {
	if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
		if (userClickedPattern.length === gamePattern.length) {
			setTimeout(nextSequence, 1000);
		}
	} else {
		playSound("wrong");
		$("body").addClass("game-over").delay(200).queue(function(next) {
			$("body").removeClass("game-over");
			$("#level-title").text("Game Over. Press any key to Restart.");
			startOver();
			next();
		});
	}
}

// Start over
function startOver() {
	level = 0;
	gamePattern = [];
	started = false;
}

// Event listeners for user interactions
$(".btn").click(function() {
	var userChosenColour = $(this).attr("id");
	userClickedPattern.push(userChosenColour);
	playSound(userChosenColour);
	animatePress(userChosenColour);
	checkAnswer(userClickedPattern.length - 1);
});

$(document).keypress(function() {
	if (!started) {
		$("#level-title").text(level);
		nextSequence();
		started = true;
	}
});