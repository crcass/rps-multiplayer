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

let timestamp = firebase.database.ServerValue.TIMESTAMP;

let playerOne;

let playerTwo;

let playerOneChoice;

let playerTwoChoice;

let currentPlayers = [];

let playerChoice = [];

let winnerIndex;

let loserIndex;

let playerOneWins = 0;

let playerOneLosses = 0;

let playerTwoWins = 0;

let playerTwoLosses = 0;

let chatName;

let chatId = 0;

// reset function resets remote & local variables and updates DOM
const reset = (() => {
  database.ref().child('playerOne').set('');
  database.ref().child('playerTwo').set('');
  database.ref().child('playerOneChoice').set('');
  database.ref().child('playerTwoChoice').set('');
  currentPlayers = [];
  playerChoice = [];
  winnerIndex = undefined;
  loserIndex = undefined;
  $('#player-one').empty();
  $('#player-two').empty();
  $('#player-name').attr('visibility', 'hidden');
  $('#name-btn').attr('visibility', 'hidden');
  $('#chat-input').css('visibility', 'visible');
  $('#chat-btn').css('visibility', 'visible');
});

// database call that updates when any values are present or changed
database.ref().on('value', (snapshot) => {
  $('#reset-btn').css('visibility', 'hidden');
  $('#stats').empty();
  $('#chat-display').empty();
  $('#p-one-weapon').empty();
  $('#p-two-weapon').empty();
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
  currentStats = snapshot.val().stats;
  currentChat = snapshot.val().chat;
  chatId = snapshot.val().chatId;

  // reads stats from server and displays them on the page 
  Object.keys(currentStats).forEach((item) => {
    let row = $('<tr>');
    let statName = $('<td>').text(item);
    let statWins = $('<td>').text(currentStats[item].wins);
    let statLosses = $('<td>').text(currentStats[item].losses);
    statName.appendTo(row);
    statWins.appendTo(row);
    statLosses.appendTo(row);
    $('#stats').append(row);
  })

  // reads chat messages from server and displays them on the page
  Object.keys(currentChat).forEach((item) => {
    let p = $("<p>").text(`${currentChat[item].sender}: ${currentChat[item].message}`);
    $('#chat-display').prepend(p);
  })

  // updates DOM dynamically on all connected browsers
  if (playerOne === '') {
    $('#p-one-list').css('visibility', 'hidden');
    $('#status').text('Player One, enter your name');
  } else if (playerOne != '') {
    $('#status').text('Player Two, enter your name');

    // if player does not exist in thee database, they are created with 0 wins & losses
    if (!snapshot.child(`stats/${playerOne}`).exists()) {
      database.ref(`stats/${playerOne}/`).set({
        wins: 0,
        losses: 0
      });
    }
  }
  if (playerTwo != '') {
    $('#p-one-list').css('visibility', 'visible');
    $('#status').text(`${playerOne}, choose your weapon!`);
    $('#add-name').css('visibility', 'hidden');

    // if player does not exist in thee database, they are created with 0 wins & losses
    if (!snapshot.child(`stats/${playerTwo}`).exists()) {
      database.ref(`stats/${playerTwo}/`).set({
        wins: 0,
        losses: 0
      });
    }

    playerOneWins = snapshot.val().stats[`${playerOne}`].wins;
    playerOneLosses = snapshot.val().stats[`${playerOne}`].losses;
    playerTwoWins = snapshot.val().stats[`${playerTwo}`].wins;
    playerTwoLosses = snapshot.val().stats[`${playerTwo}`].losses;
  }
  if (playerOneChoice != '') {
    $('#p-one-list').css('visibility', 'hidden');
    $('#p-two-list').css('visibility', 'visible');
    $('#status').text(`${playerTwo}, choose your weapon!`);
  }
  if (playerOneChoice != '' && playerTwoChoice != '') {
    $('#p-two-list').css('visibility', 'hidden');
  }

  // this loop evaluated the players' input against each other
  if (playerOneChoice === playerTwoChoice && (playerChoice.includes('Rock') ||
      playerChoice.includes('Paper') || playerChoice.includes('Scissors'))) {
    $('#status').text('Tie game!');
    $('#reset-btn').css('visibility', 'visible');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Paper')) {
    winnerIndex = playerChoice.indexOf('Paper');
    loserIndex = playerChoice.indexOf('Rock');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#p-one-weapon').text(playerOneChoice);
    $('#p-two-weapon').text(playerTwoChoice);
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Rock');
    loserIndex = playerChoice.indexOf('Scissors');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#p-one-weapon').text(playerOneChoice);
    $('#p-two-weapon').text(playerTwoChoice);
  } else if (playerChoice.includes('Paper') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Scissors');
    loserIndex = playerChoice.indexOf('Paper');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#p-one-weapon').text(playerOneChoice);
    $('#p-two-weapon').text(playerTwoChoice);
  }
}, (errorObject) => {
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
    chatName = playerOne;
    $('#player-name').attr('visibility', 'hidden');
    $('#name-btn').attr('visibility', 'hidden');
    $('#chat-input').css('visibility', 'visible');
    $('#chat-btn').css('visibility', 'visible');
    $('#player-name').val('');
  } else if (playerTwo === '') {
    playerTwo = inputVal;
    database.ref().child('playerTwo').set(playerTwo);
    chatName = playerTwo;
    $('#chat-input').css('visibility', 'visible');
    $('#chat-btn').css('visibility', 'visible');
    $('#player-name').attr('visibility', 'hidden');
    $('#name-btn').attr('visibility', 'hidden');
    $('#player-name').val('');
  }
});

// allows players to make their rock, paper, or scissors selection and updates their stats
$('li').on('click', function() {
  if (playerOneChoice === '') {
    playerOneChoice = $(this).text();
    database.ref().child('playerOneChoice').set(playerOneChoice);
  } else if (playerTwoChoice === '') {
    playerTwoChoice = $(this).text();
    database.ref().child('playerTwoChoice').set(playerTwoChoice);
    if (currentPlayers[winnerIndex] === playerOne) {
      playerOneWins++;
      database.ref(`stats/${currentPlayers[winnerIndex]}`).child('wins').set(playerOneWins);
      playerTwoLosses++;
      database.ref(`stats/${currentPlayers[loserIndex]}`).child('losses').set(playerTwoLosses);
    } else if (currentPlayers[winnerIndex] === playerTwo) {
      playerTwoWins++;
      database.ref(`stats/${currentPlayers[winnerIndex]}`).child('wins').set(playerTwoWins);
      playerOneLosses++;
      database.ref(`stats/${currentPlayers[loserIndex]}`).child('losses').set(playerOneLosses);
    }
  }
});

// adds messages to the 
$('#chat-btn').on('click', (e) => {
  e.preventDefault();
  let chatMsg = $('#chat-input').val().trim();
  if (chatMsg === '') {
    $('#chat-input').attr('placeholder', 'Please enter a message');
    return false;
  } else {
    $('#chat-input').val('');
    chatId++;
    database.ref().child('chatId').set(`${chatId}`);
    database.ref().child(`chat/${chatId}`).set({
      sender: chatName,
      message: chatMsg,
      timestamp: timestamp
    });
  }
});

// calls the reset function to start a new game
$('#reset-btn').on('click', () => {
  reset();
});