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

// function that automatically corrects user name case
let titleCase = ((str) => {
  return str.toLowerCase().split(' ').map((word) => {
    return (word.charAt(0).toUpperCase() + word.slice(1));
  }).join(' ');
});

// global variables
const database = firebase.database();

let timestamp = firebase.database.ServerValue.TIMESTAMP;

let playerOne;

let playerTwo;

let playerOneChoice;

let playerTwoChoice;

let playerOneImg;

let playerTwoImg;

let currentPlayers = [];

let playerChoice = [];

let choiceMade = 0;

let currentImg = [];

let winnerIndex;

let loserIndex;

let playerOneWins = 0;

let playerOneLosses = 0;

let playerTwoWins = 0;

let playerTwoLosses = 0;

let chatName;

let chatId = 0;

// resets remote & local variables and updates DOM
const reset = (() => {
  database.ref().child('playerOne').set('');
  database.ref().child('playerTwo').set('');
  database.ref().child('playerOneChoice').set('');
  database.ref().child('playerTwoChoice').set('');
  database.ref().child('playerOneImg').set('');
  database.ref().child('playerTwoImg').set('');
  currentPlayers = [];
  playerChoice = [];
  choiceMade = 0;
  currentImg = [];
  winnerIndex = undefined;
  loserIndex = undefined;
  $('#player-one').empty();
  $('#player-two').empty();
  $('#add-name').css('visibility', 'visible');
});

// database call that updates when any values are present or changed
database.ref().on('value', (snapshot) => {
  $('#reset-btn').css('visibility', 'hidden');
  $('#chat-status').text('waiting for players');
  $('#chat-status').css('color', '#FFF306');
  $('#chat-form').css('visibility', 'hidden');
  $('.stats').empty();
  $('#chat-display').empty();
  $('#winner-img').attr('src', '');
  $('#loser-img').attr('src', '');
  playerOne = snapshot.val().playerOne;
  currentPlayers[0] = playerOne;
  $('#player-one').text(playerOne);
  currentImg[0] = snapshot.val().playerOneImg;
  playerTwo = snapshot.val().playerTwo;
  currentPlayers[1] = playerTwo;
  $('#player-two').text(playerTwo);
  currentImg[1] = snapshot.val().playerTwoImg;
  playerOneChoice = snapshot.val().playerOneChoice;
  playerChoice[0] = playerOneChoice;
  playerTwoChoice = snapshot.val().playerTwoChoice;
  playerChoice[1] = playerTwoChoice;
  currentStats = snapshot.val().stats;
  currentChat = snapshot.val().chat;
  chatId = snapshot.val().chatId;

  // reads chat messages from server and displays them on the page
  Object.keys(currentChat).forEach((item) => {
    let p = $("<p>").text(`${currentChat[item].sender}: ${currentChat[item].message}`);
    $('#chat-display').prepend(p);
  })

  // updates DOM dynamically on all connected browsers
  if (playerOne === '') {
    $('#p-one-list').css('visibility', 'hidden');
    $('#status').text('Player One, enter your name');
    $('#add-name').css('visibility', 'visible');
  } else if (playerOne != '') {
    $('#status').text('Player Two, enter your name');
    
    // if player does not exist in thee database, they are created with 0 wins & losses
    if (!snapshot.child(`stats/${playerOne}`).exists()) {
      database.ref(`stats/${playerOne}/`).set({
        wins: 0,
        losses: 0
      });
    }
    playerOneWins = snapshot.val().stats[`${playerOne}`].wins;
    playerOneLosses = snapshot.val().stats[`${playerOne}`].losses;
    $('#player-one-stats').text(`Wins: ${playerOneWins} - Losses: ${playerOneLosses}`);

  }
  if (playerTwo != '') {
    $('#p-one-list').css('visibility', 'visible');
    $('#status').text(`${playerOne}, choose your weapon!`);

    // if player does not exist in thee database, they are created with 0 wins & losses
    if (!snapshot.child(`stats/${playerTwo}`).exists()) {
      database.ref(`stats/${playerTwo}/`).set({
        wins: 0,
        losses: 0
      });
    }
    playerTwoWins = snapshot.val().stats[`${playerTwo}`].wins;
    playerTwoLosses = snapshot.val().stats[`${playerTwo}`].losses;
    $('#player-two-stats').text(`Wins: ${playerTwoWins} - Losses: ${playerTwoLosses}`);
    $('#add-name').css('visibility', 'hidden');
    $('#chat-form').css('visibility', 'visible');
    $('#chat-status').text('connected');
    $('#chat-status').css('color', '#53F377');
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
    $('#winner-img').attr('src', currentImg[0]);
    $('#loser-img').attr('src', currentImg[1]);
    $('li').attr('id', '"');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Paper')) {
    winnerIndex = playerChoice.indexOf('Paper');
    loserIndex = playerChoice.indexOf('Rock');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#winner-img').attr('src', currentImg[winnerIndex]);
    $('#loser-img').attr('src', currentImg[loserIndex]);
    $('#loser-img').text(playerTwoChoice);
    $('li').attr('id', '"');
  } else if (playerChoice.includes('Rock') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Rock');
    loserIndex = playerChoice.indexOf('Scissors');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#winner-img').attr('src', currentImg[winnerIndex]);
    $('#loser-img').attr('src', currentImg[loserIndex]);
    $('li').attr('id', '"');
  } else if (playerChoice.includes('Paper') && playerChoice.includes('Scissors')) {
    winnerIndex = playerChoice.indexOf('Scissors');
    loserIndex = playerChoice.indexOf('Paper');
    $('#reset-btn').css('visibility', 'visible');
    $('#status').text(currentPlayers[winnerIndex] + ' wins!');
    $('#winner-img').attr('src', currentImg[winnerIndex]);
    $('#loser-img').attr('src', currentImg[loserIndex]);
    $('li').attr('id', '"');
  }
}, (errorObject) => {
  console.log(errorObject.code);
});

// allows players to enter their names and rejects any empty submissions
$('#name-btn').on('click', (e) => {
  e.preventDefault();
  inputVal = $('#player-name').val().trim();
  if (inputVal === '') {
    $('#player-name').attr('placeholder', 'Enter your name');
    return false;
  } else if (playerOne === '') {
    // titleCase(inputVal);
    playerOne = titleCase(inputVal);
    database.ref().child('playerOne').set(playerOne);
    chatName = playerOne;
    $('#add-name').attr('visibility', 'hidden');
    $('#player-name').val('');
  } else if (playerTwo === '') {
    playerTwo = titleCase(inputVal);
    database.ref().child('playerTwo').set(playerTwo);
    chatName = playerTwo;
    $('#p-one-list').css('visibility', 'hidden');
    $('#add-name').attr('visibility', 'hidden');
    $('#player-name').val('');
  }
});

  // allows players to make their selection, updates their stats, & prevents player one from choosing 2x
  $('li').on('click', function() {
    if (playerOneChoice === '') {
      playerOneChoice = $(this).attr('value');
      database.ref().child('playerOneChoice').set(playerOneChoice);
      playerOneImg = $(this).attr('img');
      database.ref().child('playerOneImg').set(playerOneImg);
      $(this).attr('id', 'selected');
      $('#p-two-list').css('visibility', 'hidden');
      choiceMade = 1;
      console.log(choiceMade);
    } else if (choiceMade < 1) {
      playerTwoChoice = $(this).attr('value');
      database.ref().child('playerTwoChoice').set(playerTwoChoice);
      playerTwoImg = $(this).attr('img');
      database.ref().child('playerTwoImg').set(playerTwoImg);
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

// adds messages to the chat
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