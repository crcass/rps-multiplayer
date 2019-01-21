// firebase config & init
const config = {
  apiKey: "AIzaSyBNvJTAaXwR-0xdIUfUstTqWdcch0qFqRk",
  authDomain: "rps-multiplayer-65491.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-65491.firebaseio.com",
  projectId: "rps-multiplayer-65491",
  storageBucket: "",
  messagingSenderId: "594319316545"
};
firebase.initializeApp(config);

// global variables
const database = firebase.database();

let playerOne;

let playerTwo;

let playerOneChoice;

let playerTwoChoice;

let currentPlayers = [];

let playerChoice = [];

let winnerIndex;

// reset function resets remote & local variables and updates DOM
const reset = (() => {
  database.ref().child('playerOneChoice').set('');
  database.ref().child('playerTwoChoice').set('');
  database.ref().child('playerOne').set('');
  database.ref().child('playerTwo').set('');
  currentPlayers = [];
  playerChoice = [];
  winner = undefined;
  $('#player-one').empty();
  $('#player-two').empty();
  $('#player-name').removeAttr('disabled');
});

// database call that updates when any values are present or changed
database.ref().on('value', function(snapshot) {
  $('#reset-btn').css('visibility', 'hidden');
  playerOne = snapshot.val().playerOne;
  currentPlayers[0] = playerOne;
  $('#player-one').text(playerOne);
  playerTwo = snapshot.val().playerTwo;
  currentPlayers[1] = playerTwo;
  $('#player-two').text(playerTwo);
  playerOneChoice = snapshot.val().playerOneChoice;
  playerChoice[0] = playerOneChoice;
  playerTwoChoice = snapshot.val().playerTwoChoice;
  playerChoice[1] = playerTwoChoice;

  // updates DOM dynamically on all connected browsers
  if (playerOne === '') {
    $('#p-one-list').css('visibility', 'hidden');
  }
  if (playerTwo != '') {
    $('#p-one-list').css('visibility', 'visible');
  }
  if (playerOneChoice != '') {
    $('#p-one-list').css('visibility', 'hidden');
    $('#p-two-list').css('visibility', 'visible');
  }
  if (playerOneChoice != '' && playerTwoChoice != '') {
    $('#p-two-list').css('visibility', 'hidden');
  }

  // main game loop
  if (playerOneChoice === playerTwoChoice && (playerChoice.includes('Rock') ||
    playerChoice.includes('Paper') || playerChoice.includes('Scissors'))) {
    console.log('DRAW!');
    $('#reset-btn').css('visibility', 'visible');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Paper')) {
    winnerIndex = playerChoice.indexOf('Paper');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winnerIndex] + ' wins!');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Rock');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winnerIndex] + ' wins!');
  } else if (playerChoice.includes('Paper') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Scissors');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winnerIndex] + ' wins!');
  }
}, function(errorObject) {
  console.log(errorObject.code);
});

// allows players to enter their names and rejects any empty submissions
$('#name-btn').on('click', (e) => {
  e.preventDefault();
  inputVal = $('#player-name').val().trim();
  if (inputVal === '') {
    $('#player-name').attr('placeholder', 'Please enter your name');
    return false;
  } else if (playerOne === '') {
    playerOne = inputVal;
    database.ref().child('playerOne').set(playerOne);
    console.log(`Player One is ${playerOne}`);
    $('#player-name').val('');
  } else if (playerTwo === '') {
    playerTwo = inputVal;
    database.ref().child('playerTwo').set(playerTwo);
    console.log(`Player Two is ${playerTwo}`);
    // $('#player-name').attr('disabled', '');
    $('#player-name').val('');
  }
});

// allows players to make their rock, paper, or scissors selection
$('li').on('click', function() {
  if (playerOneChoice === '') {
    playerOneChoice = $(this).text();
    database.ref().child('playerOneChoice').set(playerOneChoice);
    console.log(`${playerOne} chose ${playerOneChoice}`);
  } else if (playerTwoChoice === '') {
    playerTwoChoice = $(this).text();
    database.ref().child('playerTwoChoice').set(playerTwoChoice);
    console.log(`${playerTwo} chose ${playerTwoChoice}`);
  }
});

// $(document).on('click', '#name-btn', emptyTextBox);

// calls the reset function to start a new game
$('#reset-btn').on('click', () => {
  reset();
});