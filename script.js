const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

const xScoreEl = document.querySelector('#xScore')
const oScoreEl = document.querySelector('#oScore')
const drawScoreEl = document.querySelector('#drawScore')

let Player = 'X'
let isPauseGame = false
let isGameStart = false
let gameMode = null
let xScore = 0
let oScore = 0
let drawScore = 0

const inputCells = Array(9).fill('')

const winConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
]

function selectMode(mode) {
  gameMode = mode
  restartGame()
  titleHeader.textContent = 'Choose'
}

function choosePlayer(selectedPlayer) {
  if (!gameMode) {
    alert("Please select mode first!")
    return
  }
  if (!isGameStart) {
    Player = selectedPlayer
    highlightPlayer()
    isGameStart = true

    if (gameMode === 'computer' && Player === 'O') {
      computerMove()
    }
  }
}

function highlightPlayer() {
  if (Player === 'X') {
    xPlayerDisplay.classList.add('player-active')
    oPlayerDisplay.classList.remove('player-active')
  } else {
    oPlayerDisplay.classList.add('player-active')
    xPlayerDisplay.classList.remove('player-active')
  }
}

cells.forEach((cell, index) => {
  cell.addEventListener('click', () => {
    if (cell.textContent === '' && !isPauseGame) {
      updateCell(cell, index)
      if (!checkWinner()) {
        changePlayer()
        if (gameMode === 'computer' && Player === 'O') {
          computerMove()
        }
      }
    }
  })
})

function updateCell(cell, index) {
  cell.textContent = Player
  cell.style.color = (Player === 'X') ? '#1892EA' : '#A737FF'
  inputCells[index] = Player
}

function changePlayer() {
  Player = (Player === 'X') ? 'O' : 'X'
  highlightPlayer()
}

function computerMove() {
  isPauseGame = true
  setTimeout(() => {
    const emptyIndices = inputCells.map((v,i)=>v===''?i:null).filter(v=>v!==null)
    if (emptyIndices.length === 0) return
    const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)]
    updateCell(cells[randomIndex], randomIndex)
    if (!checkWinner()) {
      changePlayer()
      isPauseGame = false
    }
  }, 500)
}

function checkWinner() {
  for (const [a,b,c] of winConditions) {
    if (inputCells[a] === Player && inputCells[b] === Player && inputCells[c] === Player) {
      declareWinner([a,b,c])
      return true
    }
  }
  if (inputCells.every(v => v !== '')) {
    declareDraw()
    return true
  }
  return false
}

function declareWinner(winningIndices) {
  titleHeader.textContent = `${Player} Wins!`
  isPauseGame = true
  winningIndices.forEach(i => cells[i].style.background = '#2A2343')
  restartBtn.style.visibility = 'visible'

  if (Player === 'X') {
    xScore++
    xScoreEl.textContent = xScore
  } else {
    oScore++
    oScoreEl.textContent = oScore
  }

  fireCracker()
}

function declareDraw() {
  titleHeader.textContent = 'Draw!'
  isPauseGame = true
  restartBtn.style.visibility = 'visible'
  drawScore++
  drawScoreEl.textContent = drawScore
}

restartBtn.addEventListener('click', restartGame)

function restartGame() {
  inputCells.fill('')
  cells.forEach(cell => {
    cell.textContent = ''
    cell.style.background = '#17122A'
  })
  titleHeader.textContent = 'Choose'
  isPauseGame = false
  isGameStart = false
  restartBtn.style.visibility = 'hidden'
  Player = 'X'
  xPlayerDisplay.classList.remove('player-active')
  oPlayerDisplay.classList.remove('player-active')
}

const canvas = document.getElementById('fireCanvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

function fireCracker() {
  let particles = []
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      speed: Math.random() * 5 + 2,
      angle: Math.random() * 2 * Math.PI,
      radius: Math.random() * 2 + 1,
      color: `hsl(${Math.random()*360},100%,50%)`,
      alpha: 1
    })
  }

  let animation = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += Math.cos(p.angle) * p.speed
      p.y += Math.sin(p.angle) * p.speed
      p.alpha -= 0.02
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI)
      ctx.fill()
    })
    particles = particles.filter(p => p.alpha > 0)
    if (particles.length === 0) {
      clearInterval(animation)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
    }
  }, 30)
}
