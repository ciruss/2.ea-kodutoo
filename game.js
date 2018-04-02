/* TYPER */
const TYPER = function () {
  if (TYPER.instance_) {
    return TYPER.instance_
  }
  TYPER.instance_ = this

  this.WIDTH = window.innerWidth
  this.HEIGHT = window.innerHeight
  this.canvas = null
  this.ctx = null

  this.words = []
  this.word = null
  this.lengthOfWord = parseInt(document.getElementById('wordLength').value)
  this.guessedWords = 0
  this.score = 0
  this.minusScore = 0

  this.init()
}

window.TYPER = TYPER

TYPER.prototype = {
  init: function () {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.ctx = this.canvas.getContext('2d')

    this.canvas.style.width = this.WIDTH + 'px'
    this.canvas.style.height = (this.HEIGHT - 465) + 'px'

    this.canvas.width = this.WIDTH * 2
    this.canvas.height = this.HEIGHT * 1.3

    this.loadWords()
  },

  loadWords: function () {
    const xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && (xmlhttp.status === 200 || xmlhttp.status === 0)) {
        const response = xmlhttp.responseText
        const wordsFromFile = response.split('\n')

        typer.words = structureArrayByWordLength(wordsFromFile)
        typer.start()
      }
    }

    xmlhttp.open('GET', './lemmad2013.txt', true)
    xmlhttp.send()
  },

  start: function () {
    this.generateWord()
    this.word.Draw()

    window.addEventListener('keypress', this.keyPressed.bind(this))

    this.startTime = new Date().getTime()
    this.timer = window.setInterval(this.loop.bind(this), 1)
  },

  loop: function () {
    const currentTime = new Date().getTime()
    this.counter = currentTime - this.startTime
    this.word.Draw()
    this.stop()
  },

  user: function () {
    let players = JSON.parse(localStorage.getItem('players'))
    if (players === null) players = []
    let user = prompt(`Your score is ${this.score}\nif you want do save your score enter your name!`)
    if (user !== null && user !== '') {
      let player = {
        'player': user,
        'score': this.score - this.minusScore
      }
      localStorage.setItem('player', JSON.stringify(player))
      players.push(player)
      localStorage.setItem('players', JSON.stringify(players))
    }
  },

  stop: function () {
    const time = document.getElementById('time').value

    if (this.counter >= parseInt(time + '000')) {
      clearInterval(this.timer)
      this.user()
      this.canvas.remove()
      this.new()
    }
  },

  new: function () {
    this.canvas.remove()
    clearInterval(this.timer)
    document.getElementById('newGame').style.visibility = 'visible'
  },

  generateWord: function () {
    const generatedWordLength = this.lengthOfWord + parseInt(this.guessedWords / 5)
    const randomIndex = (Math.random() * (this.words[generatedWordLength].length - 1)).toFixed()
    const wordFromArray = this.words[generatedWordLength][randomIndex]

    this.word = new Word(wordFromArray, this.canvas, this.ctx)
  },

  keyPressed: function (event) {
    const letter = String.fromCharCode(event.which)

    if (letter !== this.word.left.charAt(0)) {
      this.minusScore += 1
    }

    if (letter === this.word.left.charAt(0)) {
      this.word.removeFirstLetter()

      if (this.word.left.length === 0) {
        this.guessedWords += 1
        this.score = (this.guessedWords * this.lengthOfWord) - this.minusScore
        this.generateWord()
      }

      this.word.Draw()
    }

    document.addEventListener('keydown', event => {
      if (event.which === 27) {
        this.new()
      }
    })
  }
}

/* WORD */
const Word = function (word, canvas, ctx) {
  this.word = word
  this.left = this.word
  this.canvas = canvas
  this.ctx = ctx
}

Word.prototype = {
  Draw: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.textAlign = 'center'
    this.ctx.font = '140px Courier'
    this.ctx.fillText(this.left, this.canvas.width / 2, this.canvas.height / 2)
  },

  removeFirstLetter: function () {
    this.left = this.left.slice(1)
  }
}

/* HELPERS */
function structureArrayByWordLength (words) {
  let tempArray = []

  for (let i = 0; i < words.length; i++) {
    const wordLength = words[i].length
    if (tempArray[wordLength] === undefined)tempArray[wordLength] = []

    tempArray[wordLength].push(words[i])
  }

  return tempArray
}

const begin = function () {
  document.getElementById('timer').style.display = 'none'
  const typer = new TYPER()
  window.typer = typer
}
