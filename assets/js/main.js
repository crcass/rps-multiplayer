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

let winner;

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
  $('ul').css('visibility', 'hidden');
  $('#reset-btn').css('visibility', 'hidden');
  $('#player-name').removeAttr('disabled');
});

// database call that updates when any values are present or changed
database.ref().on('value', function(snapshot) {
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

  // main game loop
  if (playerChoice[0] === playerChoice[1] && playerChoice.includes('Rock' || 'Paper' || 'Scissors')) {
    console.log('DRAW!');
    $('#reset-btn').css('visibility', 'visible');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Paper')) {
    winner = playerChoice.indexOf('Paper');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winner] + ' wins!');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Scissors')) {
    winner = playerChoice.indexOf('Rock');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winner] + ' wins!');
  } else if (playerChoice.includes('Paper') && playerChoice.includes('Scissors')) {
    winner = playerChoice.indexOf('Scissors');
    $('#reset-btn').css('visibility', 'visible');
    console.log(currentPlayers[winner] + ' wins!');
  }
}, function(errorObject) {
  console.log(errorObject.code);
});

// allows players to enter their names
$('#name-btn').on('click', (e) => {
  e.preventDefault();
  if (playerOne === '') {
    playerOne = $('#player-name').val();
    database.ref().child('playerOne').set(playerOne);
    console.log(`Player One is ${playerOne}`);
    // $('#player-one').css('visibility', 'visible');
    $('#player-name').val('');
  } else if (playerTwo === '') {
    playerTwo = $('#player-name').val();
    database.ref().child('playerTwo').set(playerTwo);
    console.log(`Player Two is ${playerTwo}`);
    $('#player-name').attr('disabled', '');
    $('#p-one-list').css('visibility', 'visible');
    // $('#player-two').css('visibility', 'visible');
    $('#player-name').val('');
  }
});

// allows players to make their rock, paper, or scissors selection
$('li').on('click', function() {
  if (playerOneChoice === '') {
    playerOneChoice = $(this).text();
    database.ref().child('playerOneChoice').set(playerOneChoice);
    console.log(`${playerOne} chose ${playerOneChoice}`);
    $('#p-one-list').css('visibility', 'hidden');
    $('#p-two-list').css('visibility', 'visible');
  } else if (playerTwoChoice === '') {
    playerTwoChoice = $(this).text();
    database.ref().child('playerTwoChoice').set(playerTwoChoice);
    console.log(`${playerTwo} chose ${playerTwoChoice}`);
    $('#p-two-list').css('visibility', 'hidden');
  }
});

// calls the reset function to start a new game
$('#reset-btn').on('click', () => {
  reset();
});