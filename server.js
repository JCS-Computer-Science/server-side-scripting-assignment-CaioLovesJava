const express = require("express");
const uuid = require("uuid")
const server = express();
server.use(express.json())
server.use(express.static('public'))
const fetch = require("node-fetch")


//All your code goes here
let activeSessions={}

async function randomWordGen() {
    let response = await fetch('https://api.datamuse.com/words?sp=?????&max=1000')
    
    let result = await response.json()

    let randNum = Math.floor(Math.random() * result.length)

    return result[randNum].word
    
}

server.get('/newgame',async (req, res) =>{
    if(req.query.answer && req.query.answer.length == 5){
        wordleAns = req.query.answer.toLowerCase()
    }
    else{
        wordleAns = await randomWordGen()
    }
    
    let newID = uuid.v4()
    let answer = req.query.wordleAns
    let newGame = {
        wordToGuess: wordleAns,
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
    let sessionID = req.query.sessionID
    if(activeSessions[sessionID]){
        res.status(200)
        res.send({gameState:activeSessions[sessionID]})
    }else if(!sessionID)
        res.status(400).send({error: "No sessionID provided"})
    else{
        res.status(404)
        res.send({error: "Session ID does not match any active session"})
    }

    
})


server.post('/guess', (req, res) => {
    let guess = req.body.guess.split("")
    let sessionID = req.body.sessionID
    let game = activeSessions[sessionID]
    let answer = game.wordToGuess.split("")
    var hasNumber = /\d/;
    var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if(hasNumber.test(req.body.guess)){
        res.status(400)
        res.send({error: "Guess should not include numbers"})
    }
    else if(req.body.guess.match(format)){
        res.status(400)
        res.send({error: "Guess should not include special characters"})
    }
    else if(guess.length > 5 || guess.length < 5){
        res.status(400)
        res.send({error: "Guess should be 5 letters"})
    }
    else if(game.wordToGuess == req.body.guess){
        game.gameOver = true
    }
    else if(guess.length == 5){
        for(i = 0; i < 5; i++){
            if(guess[i] == answer[i]){
                game.rightLetters.push(answer[i])
            }
            else if(answer.includes(guess[i])){
                game.closeLetters.push(guess[i])
            }
            else {
                game.wrongLetters.push(guess[i])
            }
        }
        res.send({gameState : game})
    }

})

server.delete('/reset', (req, res) => {
    let sessionID = req.query.sessionID
    
    if(sessionID){

    }

    else if(!sessionID){
        res.status(400).send({error: "No sessionID provided"})
    }else{
        res.status(404).send({error:"Session ID does not match any active session"})
    }
})

server.delete('/delete', (req, res) => {
    let sessionID = req.query.sessionID
    if(!sessionID){
        res.status(400).send({error: "No sessionID provided"})
    }else{
        res.status(404).send({error:"Session ID does not match any active session"})
    }
})

//Do not remove this line. This allows the test suite to start
//multiple instances of your server on different ports
module.exports = server;