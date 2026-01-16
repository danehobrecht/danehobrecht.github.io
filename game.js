var level = 0;
var timeoutID;
var started = false;
var gamePattern = [];
var isGameOver = false;
var lastActionTime = 0;
var soundPlaying = false;
var userClickedPattern = [];
var buttons = ["btn-bttm-left", "btn-bttm-right", "btn-top-right", "btn-top-left"];

// Play a sound
function playSound(button) {
	if (soundPlaying) return;
	soundPlaying = true;
	var audio = new Audio("assets/sounds/" + button + ".mp3");
	audio.play().finally(() => soundPlaying = false);
}

// Get a random button
function getRandomButton() { return buttons[Math.floor(Math.random() * buttons.length)]; }

// Show the pattern to the user
function showPattern() {
	if (isGameOver) return;
	let index = 0;
	$(".btn").prop("disabled", true);
	function showNext() {
		if (index < gamePattern.length) {
			var button = gamePattern[index];
			$("#" + button).fadeIn(100).fadeOut(100).fadeIn(100);
			playSound(button);
			timeoutID = setTimeout(showNext, 1000);
			index++;
		} else {
			$(".btn").prop("disabled", false);
		}
	}

	showNext();
}

// Handle user button press
function handleUserClick(button) {
	if (isGameOver || !started) return;
	userClickedPattern.push(button);
	playSound(button);
	animatePress(button);
	checkAnswer(userClickedPattern.length - 1);
}

// Check the user's answer
function checkAnswer(index) {
	if (isGameOver) return;
	if (gamePattern[index] === userClickedPattern[index]) {
		if (userClickedPattern.length === gamePattern.length) { setTimeout(nextSequence, 1000); }
	} else { gameOver(); }
}

// Animate button press
function animatePress(button) {
	$("#" + button).addClass("pressed");
	setTimeout(() => $("#" + button).removeClass("pressed"), 150);
}

// Start a new game sequence
function nextSequence() {
	if (isGameOver) return;
	userClickedPattern = [];
	level++;
	$("#score").text(level);
	gamePattern.push(getRandomButton());
	showPattern();
}

// Handle game over
function gameOver() {
	if (isGameOver) return;
	isGameOver = true;
	$(".btn").prop("disabled", true);
	clearTimeout(timeoutID);
	var index = 0;
	function playNextSound() {
		if (index < buttons.length) {
			var button = buttons[index];
			$("#" + button).fadeIn(100).fadeOut(100).fadeIn(100);
			playSound(button);
			index++;
			setTimeout(playNextSound, 300);
		} else {
			$("#score").text("0").addClass("game-over").delay(1000).queue(function(next) {
				$("#score").removeClass("game-over");
				startOver();
				next();
			});
		}
	}

	playNextSound();
}

// Reset the game
function startOver() {
	level = 0;
	started = false;
	gamePattern = [];
	userClickedPattern = [];
	isGameOver = false;
	$(".btn").prop("disabled", false);
	lastActionTime = 0;
}

// Event listener for button clicks
$(".btn").click(function() {
	var clickedButton = $(this).attr("id");
	var currentTime = Date.now();
	if (isGameOver || (currentTime - lastActionTime < 100)) return;
	lastActionTime = currentTime;
	if (!started) {
		startOver();
		$("#score").text(level);
		nextSequence();
		started = true;
	} else {
		handleUserClick(clickedButton);
	}
});