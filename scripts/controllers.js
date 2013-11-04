var snapGameApp = angular.module('snapGameApp', []);

snapGameApp.controller('SnapGameCtrl', function SnapGameCtrl($scope, $http, $timeout) {
    $scope.appTitle = "Snapy App";
    var timerIdForComputerSnap;

    $scope.startGame = function () {
        $scope.played = []; // keep track of what cards have already been played
        $scope.timeForComputerToPlayCard = 1000; // inital computer move timeout value
        $scope.timeForComputerToSnap = 6000; // inital computer move timeout value
        timerIdForComputerSnap = 0;
        $scope.initFirstPlayer();
        $scope.shuffle();
        $scope.playCardIfComputerIsFirstPlayer();
    };

    // load data source
    $http.get('cards.json').success(function (data) {
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

        console.log("Computer deck is " + $scope.deckComputer);
        console.log("Player deck is " + $scope.deckPlayer);
    };

    $scope.initFirstPlayer = function () {
        var num = Math.floor((Math.random() * 2) + 1);

        if (num == 1)
            setNextPlayer("computer");
        else
            setNextPlayer("player");

    };

    $scope.playCardIfComputerIsFirstPlayer = function () {
        if (isPlayerTheNextPlayer() == false) {
            $timeout(playCardComputer, $scope.timeForComputerToPlayCard); // pop computer deck after timeout
        }
    };

    $scope.playCard = function () {
        $scope.stopComputerSnapTimer();
        if (isPlayerTheNextPlayer() == false) {
            console.log("User attempted to play out of turn");
            return;
        }

        var card = $scope.deckPlayer.pop();
        console.log("Player played card " + card.rank);

        $scope.played.push(card); // pop player deck
        finishTurn();

        $timeout(playCardComputer, $scope.timeForComputerToPlayCard); // pop computer deck after timeout
    };


    playCardComputer = function () {
        if (isPlayerTheNextPlayer() == true) {
            console.log("Computer attempted to play out of turn");
            return;
        }

        var card = $scope.deckComputer.pop();
        console.log("Computer played card " + card.rank);

        $scope.played.push(card);
        finishTurn();
    };

    $scope.snap = function (isPlayerWhoSnapped) {
        $scope.stopComputerSnapTimer();

        isSnap(isPlayerWhoSnapped);
    };

    isSnap = function(isPlayerWhoSnapped) {
        if ($scope.played.length < 2)
            return;

        isPlayerWhoSnapped = isPlayerWhoSnapped == true ? true : false;
        console.log("Snap made by player? " + isPlayerWhoSnapped);

        // check if last two cards match in rank
        var previous = $scope.played[$scope.played.length - 2];
        var current = $scope.played[$scope.played.length - 1];

        if (previous.rank == current.rank) {
            if (isPlayerWhoSnapped) {
                $scope.deckPlayer = $scope.deckPlayer.concat($scope.played);
                $scope.played = [];
            } else {
                $scope.deckComputer = $scope.deckComputer.concat($scope.played);
                $scope.played = [];
            }
            console.log("Snap!");
        } else {
            console.log("Cards aren't a match");
        }

        if ($scope.gameHasWinner()) {
            console.log("Winner is player?" + $scope.isPlayerWinner);
        }
    };

    setNextPlayer = function (playerName) {
        console.log("Setting next player to be " + playerName);
        $scope.nextPlayer = playerName;
    };

    isPlayerTheNextPlayer = function () {
        return $scope.nextPlayer == "player";
    };

    // toggles the next player
    finishTurn = function () {
        if ($scope.gameHasWinner()) {
            console.log("Winner is player?" + $scope.isPlayerWinner());
            return;
        }

        var previous = $scope.nextPlayer;
        $scope.nextPlayer = previous == "player" ? "computer" : "player";

        $scope.startComputerSnapTimer();
    };


    $scope.startComputerSnapTimer = function() {
        if (timerIdForComputerSnap != null)
            $scope.stopComputerSnapTimer();
        timerIdForComputerSnap = $timeout(isSnap, $scope.timeForComputerToSnap);
    };

    $scope.stopComputerSnapTimer = function() {
        $timeout.cancel(timerIdForComputerSnap);
    };

    $scope.gameHasWinner = function() {
        var hasWinner = $scope.deckComputer.length == 0 || $scope.deckPlayer.length == 0;
        if (hasWinner)
            $scope.winner = $scope.isPlayerWinner() ? "player" : "computer";
        return hasWinner;
    };

    $scope.isPlayerWinner = function() {
        return $scope.deckComputer.length == 0;
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