const express = require("express");
const uuid = require("uuid")
const server = express();
server.use(express.json())
server.use(express.static('public'))


//All your code goes here
let activeSessions={}

server.get('/newgame',(req, res) =>{
    let newID = uuid.v4()
    let answer = req.query.answer
    let newGame = {
        wordToGuess: "apple",
        guesses:[],
        wrongLetters: [], 
        rightLetters: [],
        closeLetters:[],
        remainingGuesses : 6,
        gameOver: false
        
    }
    if(answer){
        newGame.wordToGuess = answer}
    activeSessions[newID] = newGame
    res.status(201)
    res.send({sessionID: newID})
})

server.get('/gamestate', (req, res) => {
    let gameState = activeSessions[req.query.sessionID]
    res.status(200)
    res.send({gameState: gameState})
    
})


server.post('/guess', (req, res) => {
    let guess = req.body.guess.split("")
    let sessionID = req.body.sessionID
    let game = activeSessions[sessionID]
    let answer = game.wordToGuess.split("")

    for(i = 0; i > 5; i++){
        
    }

})
//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;



if(guess[i] == answer[i]){

}else if(answer.includes(guess[i])){

}
else{}