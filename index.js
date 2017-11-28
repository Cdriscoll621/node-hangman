
var inquirer = require('inquirer');
var isLetter = require('is-letter');

var Word = require('./wordConstruct.js');
var Game = require('./wordExport.js');

require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = {
    wordBank: Game.newWord.wordList,
    wordsWon: 0,
    guessesRemaining: 10,
    guessedLetters: [],
    currentWord: null,
    startGame: function() {
        var that = this;
        if(this.guessedLetters.length > 0){
            this.guessedLetters = [];
        }

        inquirer.prompt([{
            name: "play",
            type: "confirm",
            message: "*burp* Com'on Morty, Let's go on an adventure *gurgle* 2 minutes, *burp* in an out!"
        }]).then(function(answer) {
            if(answer.play){
                that.newGame();
            } else{
                console.log("Y-You've got to be joking Morty *burp/gurgle*");
            }
        })},
    newGame: function() {
        if(this.guessesRemaining === 10) {
            console.log('========================');
            console.log('|  WUBBA-LUBBA-DUB-DUB |');
            console.log('|           A          |');
            console.log('|      waaaaaayyy      |');
            console.log('|     we go! - Rick    |');
            console.log('========================');
            var randNumber = Math.floor(Math.random()*this.wordBank.length);
            this.currentWord = new Word(this.wordBank[randNumber]);
            this.currentWord.getLets();
            console.log(this.currentWord.wordRender());
            this.keepPromptingUser();
        } else{
            this.resetGuessesRemaining();
            this.newGame();
        }
    },
    resetGuessesRemaining: function() {
        this.guessesRemaining = 10;
    },
    keepPromptingUser : function(){
        var that = this;
        inquirer.prompt([{
            name: "chosenLtr",
            type: "input",
            message: "Choose a letter:",
            validate: function(value) {
                if(isLetter(value)){
                    return true;
                } else{
                    return false;
                }
            }
        }]).then(function(ltr) {


            var letterReturned = (ltr.chosenLtr).toUpperCase();

            var guessedAlready = false;
            this.guessedLetters=[];


            for(var i = 0; i<that.guessedLetters.length; i++){
                if(letterReturned === that.guessedLetters[i]){
                    guessedAlready = true;
                }
            }
            if(guessedAlready === false){
                that.guessedLetters.push(letterReturned);
                console.log('You Chose: ' + letterReturned);
                console.log('Guesses Remaining: ' + that.guessesRemaining)
                console.log('Letters Used: ' + that.guessedLetters)



            } else{
                console.log("You've guessed that letter already. Try again.")

                that.keepPromptingUser();
            }

            var found = that.currentWord.checkIfLetterFound(letterReturned);
            if(found === 0){
                console.log('Nope! You guessed wrong.');
                that.guessesRemaining--;
                console.log('Guesses remaining: ' + that.guessesRemaining);
                console.log(that.currentWord.wordRender());
            } else{
                console.log('Yes! You guessed right!');
                if(that.currentWord.didWeFindTheWord() === true){
                    console.log('Congratulations!');
                    that.startGame();
                } else{
                    console.log('Guesses remaining: ' + that.guessesRemaining);
                    console.log(that.currentWord.wordRender());
                }
            }
            if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) {
                that.keepPromptingUser();
            }else if(that.guessesRemaining === 0){
                console.log('Game over!');
                console.log('The word you were guessing was: ' + that.currentWord.word);
                that.startGame();
            } else{
                console.log(that.currentWord.wordRender());
            }
        });
    }
};

hangman.startGame();