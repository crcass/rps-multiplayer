const config = {
  apiKey: "AIzaSyBNvJTAaXwR-0xdIUfUstTqWdcch0qFqRk",
  authDomain: "rps-multiplayer-65491.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-65491.firebaseio.com",
  projectId: "rps-multiplayer-65491",
  storageBucket: "",
  messagingSenderId: "594319316545"
};
firebase.initializeApp(config);

const database = firebase.database();

let playerOne;

let playerTwo;

let currentPlayers = [];

let playerOneChoice;

let playerTwoChoice;

let playerChoice = [];

let winner;

const reset = (() => {
  playerOne = undefined;
  playerTwo = undefined;
  currentPlayers = [];
  playerOneChoice = undefined;
  playerTwoChoice = undefined;
  playerChoice = [];
  winner = undefined;
  $('#player-one').empty();
  $('#player-two').empty();
  $('ul').css('visibility', 'hidden');
  $('#reset-btn').css('visibility', 'hidden');
})

database.ref().on('value', function(snapshot) {

}, function(errorObject) {
  console.log(errorObject.code);
});

$(document).ready(() => {


  // check to see if there are 2 players ready for the game
  if (currentPlayers.length < 2) {

    // assigns players to the game and saves their info to the database
    $('#name-btn').on('click', (e) => {
      e.preventDefault();

      if (currentPlayers.length === 0) {
        playerOne = $('#player-name').val();
        currentPlayers.push(playerOne);
        $('#player-one').text(playerOne);
      } else if (currentPlayers.length === 1) {
        playerTwo = $('#player-name').val();
        currentPlayers.push(playerTwo);
        $('#player-two').text(playerTwo);
        $('ul').css('visibility', 'visible');
      }
      $('#player-name').val('');
    });
  }


  // check to see if the player has made a choice
  if (playerChoice.length < 2) {

    // saves the players choice to an array
    $('li').on('click', function() {

      if (playerChoice.length === 0) {
        playerOneChoice = $(this).text();
        playerChoice.push(playerOneChoice);
        console.log(`${playerOne} chose ${playerOneChoice}`);
      } else if (playerChoice.length === 1) {
        playerTwoChoice = $(this).text();
        playerChoice.push(playerTwoChoice);
        console.log(`${playerTwo} chose ${playerTwoChoice}`);

        if (playerChoice[0] === playerChoice[1]) {
          console.log('DRAW!');
        } else if (playerChoice.includes('Rock') && playerChoice.includes('Paper')) {
          winner = playerChoice.indexOf('Paper');
          console.log(currentPlayers[winner] + ' wins!');
        } else if (playerChoice.includes('Rock') && playerChoice.includes('Scissors')) {
          winner = playerChoice.indexOf('Rock');
          console.log(currentPlayers[winner] + ' wins!');
        } else if (playerChoice.includes('Paper') && playerChoice.includes('Scissors')) {
          winner = playerChoice.indexOf('Scissors');
          console.log(currentPlayers[winner] + ' wins!');
        }
        $('#reset-btn').css('visibility', 'visible');
      }
    })
  }
  // calls the reset function to start a new game
  $('#reset-btn').on('click', () => {
    reset();
  });
});