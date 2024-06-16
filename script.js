let gameFinishBoolean = false;
let playerWon = false;
let totalSpotsLeft = 9;
let spotMark = selectSpotMark();
let playerIndex = getPlayerIndex();
let restartTimeLeft = 10;
let gameTimingWonInterval;

let player1Spots = [];
let player2Spots = [];
let playerSpotsMap = new Map();
playerSpotsMap.set(1, player1Spots);
playerSpotsMap.set(2, player2Spots);

function selectSpotMark() {
  return totalSpotsLeft % 2 == 0 ? "O" : "X";
}

function getPlayerIndex() {
  return totalSpotsLeft % 2 == 0 ? 2 : 1;
}

function selectSpot(e) {
  spotMark = selectSpotMark();
  totalSpotsLeft--;
  let targetEle = e.target;
  let coOrdObj = {};
  if (targetEle && targetEle.innerText == "") {
    targetEle.innerText = spotMark;
    coOrdObj.x = targetEle.dataset.x;
    coOrdObj.y = targetEle.dataset.y;
    if (playerIndex == 1) {
      player1Spots.push(coOrdObj);
    } else {
      player2Spots.push(coOrdObj);
    }
  }

  if (checkIfPlayerWon() || totalSpotsLeft <= 0) {
    gameFinishBoolean = true;
  }

  if (gameFinishBoolean) {
    if (playerWon) {
      document.getElementById(
        "statusDiv"
      ).innerHTML = `Congratulations! Player <span id="playerIndex">${playerIndex}</span> has won the game! Restarting game in <span id="timeRemainingSpan">${restartTimeLeft}</span> seconds`;
    } else {
      document.getElementById(
        "statusDiv"
      ).innerHTML = `It's a tie! Restarting game in <span id="timeRemainingSpan">${restartTimeLeft}</span> seconds`;
    }
    gameEnd();
  } else {
    playerIndex = getPlayerIndex();
    document.getElementById(
      "statusDiv"
    ).innerHTML = `It's turn for Player <span id="playerIndex">${playerIndex}</span>`;
  }
}

function checkIfPlayerWon() {
  let result = false;
  playerSpotsMap.forEach(function (val, key) {
    let col1Count = 0,
      col2Count = 0,
      col3Count = 0,
      row1Count = 0,
      row2Count = 0,
      row3Count = 0,
      equalXYSpotCount = 0;
    let obj02 = false,
      obj11 = false,
      obj20 = false;
    for (let obj of val) {
      if (obj.x == "0") {
        row1Count++;
      } else if (obj.x == "1") {
        row2Count++;
      } else {
        row3Count++;
      }

      if (obj.y == "0") {
        col1Count++;
      } else if (obj.y == "1") {
        col2Count++;
      } else {
        col3Count++;
      }

      if (obj.x == obj.y) {
        equalXYSpotCount++;
      }

      if (obj.x == "0" && obj.y == "2") {
        obj02 = true;
      } else if (obj.x == "1" && obj.y == "1") {
        obj11 = true;
      } else if (obj.x == "2" && obj.y == "0") {
        obj20 = true;
      }
    }
    if (
      row1Count > 2 ||
      row2Count > 2 ||
      row3Count > 2 ||
      col1Count > 2 ||
      col2Count > 2 ||
      col3Count > 2 ||
      equalXYSpotCount > 2 ||
      (obj02 && obj11 && obj20)
    ) {
      playerWon = true;
      result = true;
    }
  });

  return result;
}

function restartGame() {
  totalSpotsLeft = 9;
  restartTimeLeft = 10;
  clearInterval(gameTimingWonInterval);
  gameTimingWonInterval = undefined;
  spotMark = selectSpotMark();
  playerIndex = getPlayerIndex();
  document.querySelectorAll(".boardBox").forEach(function (val) {
    val.innerText = "";
  });
  document.getElementById(
    "statusDiv"
  ).innerHTML = `It's turn for Player <span id="playerIndex">${playerIndex}</span>`;
  gameFinishBoolean = false;
  playerWon = false;
  player1Spots = [];
  player2Spots = [];
  playerSpotsMap.set(1, player1Spots);
  playerSpotsMap.set(2, player2Spots);
}

document.querySelectorAll(".boardBox").forEach(function (val) {
  val.addEventListener("click", (e) => {
    selectSpot(e);
  });
});

function gameEnd() {
  gameTimingWonInterval = setInterval(() => {
    if (restartTimeLeft > 1) {
      restartTimeLeft--;
      document.getElementById("timeRemainingSpan").innerText = restartTimeLeft;
      //console.log("restartTimeLeft : ", restartTimeLeft);
    } else {
      clearInterval(gameTimingWonInterval);
      restartGame();
    }
  }, 1000);
}
