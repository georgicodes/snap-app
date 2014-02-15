var snapGameApp = angular.module('snapGameApp', ['ui.bootstrap']);

snapGameApp.controller('SnapGameCtrl', function SnapGameCtrl($scope, $http, $timeout) {
    var PLAYER_NAME = "player";
    var COMPUTER_NAME = "computer";
    var timerIdForComputerSnap;
    var timerIdForComputerMove;
    $scope.appTitle = "Snappy App";
    $scope.levels = [
        { name: "Easy", value: 3000},
        { name: "Medium", value: 1500},
        { name: "Hard", value: 500}
    ];

    $scope.startGame = function () {
        timerIdForComputerMove = 0;
        timerIdForComputerSnap = 0;
        $scope.played = []; // keep track of what cards have already been played
        $scope.timeForComputerToPlayCard = 1000; // initial computer move timeout value
        $scope.initFirstPlayer();
        $scope.shuffle();
        $scope.playCardIfComputerIsFirstPlayer();
        $scope.gameHasWinner = false;
        $scope.difficulty = $scope.initDifficulty(); // initial computer move timeout value
    };

    // load data source
    $http.get('scripts/cards.json').success(function (data) {
        $scope.unshuffledDeck = data;
    });

    $scope.shuffle = function () {
        $scope.deck = []; // shuffled deck

        var randoms = getArrayOfRandomCardIndexs();

        for (var i = 0; i < randoms.length; i++) {
            $scope.deck.push($scope.unshuffledDeck[randoms[i]]);
        }

        $scope.deckComputer = $scope.deck.splice(0, 26);
        $scope.deckPlayer = $scope.deck.splice(0, 26);
    };

    // randomly assign first player
    $scope.initFirstPlayer = function () {
        var num = Math.floor((Math.random() * 2) + 1);

        if (num == 1)
            $scope.nextPlayer = COMPUTER_NAME;
        else
            $scope.nextPlayer = PLAYER_NAME;

    };

    $scope.playCardIfComputerIsFirstPlayer = function () {
        if (isPlayerTheNextPlayer() == false) {
            playCardComputer();
        }
    };

    $scope.playCardPlayer = function () {
        if (isPlayerTheNextPlayer() == false) {
            console.log("Player attempted to play out of turn");
            return;
        }
        $scope.stopComputerSnapTimer();
        placeCardOnPile($scope.deckPlayer);

        if (isLegalSnap())
            $scope.startComputerSnapTimer();
        else
            timerIdForComputerMove = $timeout(playCardComputer, $scope.timeForComputerToPlayCard); // pop computer deck after timeout
    };

    playCardComputer = function () {
        if (isPlayerTheNextPlayer() == true) {
            console.log("Computer attempted to play out of turn");
            return;
        }
        placeCardOnPile($scope.deckComputer);
    };

    placeCardOnPile = function(deck) {
        var card = deck.pop();
        console.log($scope.nextPlayer + " played card " + card.suit + " " + card.rank);

        $scope.played.push(card);
        finishTurn();
    }

    $scope.snapByPlayer = function () {
        $scope.stopComputerSnapTimer();
        performSnap(true);
    };

    performSnap = function(isPlayerWhoSnapped) {
        if (!isLegalSnap()) {
            console.log("Cards aren't a match");
        } else {
            isPlayerWhoSnapped = isPlayerWhoSnapped == true ? true : false;
            console.log("Snap attempt made by player? " + isPlayerWhoSnapped);

            // add card pile to beginning of array because we use pop()
            if (isPlayerWhoSnapped) {
                $scope.deckPlayer = $scope.played.concat($scope.deckPlayer);
            } else {
                $scope.deckComputer = $scope.played.concat($scope.deckComputer);
            }
            $scope.snapWinner = isPlayerWhoSnapped == true ? PLAYER_NAME : COMPUTER_NAME;
            $scope.played = []; // clear pile
            $scope.checkForGameWinner();
            if ($scope.nextPlayer == COMPUTER_NAME)
                playCardComputer();

            console.log("Snap!");
        }
    };

    isLegalSnap = function () {
        if ($scope.played.length < 2)
            return false;

        // check if last two cards match in rank
        var previous = $scope.played[$scope.played.length - 2];
        var current = $scope.played[$scope.played.length - 1];

        return previous.rank == current.rank;
    };

    isPlayerTheNextPlayer = function () {
        return $scope.nextPlayer == PLAYER_NAME;
    };

    finishTurn = function () {
        if ($scope.checkForGameWinner()) {
            return;
        }

        $scope.nextPlayer = $scope.nextPlayer == PLAYER_NAME ? COMPUTER_NAME : PLAYER_NAME;
        if (isLegalSnap())
            $scope.startComputerSnapTimer();
    };

    $scope.startComputerSnapTimer = function() {
        if (timerIdForComputerSnap != null)
            $scope.stopComputerSnapTimer();
        timerIdForComputerSnap = $timeout(performSnap, $scope.difficulty.value);
    };

    $scope.stopComputerSnapTimer = function() {
        $timeout.cancel(timerIdForComputerSnap);
    };

    $scope.stopComputerMoveTimer = function() {
        $timeout.cancel(timerIdForComputerMove);
    };

    $scope.checkForGameWinner = function() {
        $scope.gameHasWinner = $scope.deckComputer.length == 0 || $scope.deckPlayer.length == 0;
        if ($scope.gameHasWinner) {
            $scope.winner = $scope.deckComputer.length == 0 ? PLAYER_NAME : COMPUTER_NAME;
            console.log("Winner is: " + $scope.winner);
            $scope.stopComputerMoveTimer();
            $scope.stopComputerSnapTimer();
        }
        return $scope.gameHasWinner;
    };

    $scope.initDifficulty = function() {
        return {value: $scope.levels[1].value};
    };

    getArrayOfRandomCardIndexs = function () {
        // create an array of random number from 0->51
        // reference: http://stackoverflow.com/questions/13902365/generate-random-number-within-range-without-repeating-numbers-in-javascript
        var randoms = [];
        for (var i = 0; i < 52; i++) {
            randoms[i] = i;
        }
        randoms.sort(function () {
            return Math.random() - 0.5;
        });
        console.log(randoms);

        return randoms;
    };

});