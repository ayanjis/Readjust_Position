const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

import {
  invisibleBalls,
  invisibleBall_radius,
  circularArea,
  circleCenterX,
  circleCenterY,
  invisibleBall
} from './Ball.js'

let particals = []
let particalDistance = 35
let mouse = {
  x: undefined,
  y: undefined,
  radius: 50,
}
let opacity
let w = window.innerWidth
let h = window.innerHeight
let timeGap = 3
let windowSize = (h < 780)
let md_ts = (windowSize ? 'mousedown': 'touchstart');
let mm_tm = (windowSize ? 'mousemove': 'touchmove');
let mu_te = (windowSize ? 'mouseup': 'touchend');
let ballX = 0
let ballY = 0
let isTouched = false

function mouseOrTouchStart(e) {
  isTouched = false
  e.preventDefault()
}
function mouseOrTouchMove(e) {
  let page_x = e.pageX
  let page_y = e.pageY
  mouse.x = page_x
  mouse.y = page_y
}
function mouseOrTouchOut(x, y) {
  isTouched = true
  mouse.x = undefined
  mouse.y = undefined
  setTimeout(() => {
    mouse.x = x
    mouse.y = y
  }, (timeGap * 1000))
}

window.addEventListener('resize', resizeReset)
window.addEventListener('mousedown', mouseOrTouchStart)
window.addEventListener('mousemove', mouseOrTouchMove)
window.addEventListener('mouseup', mouseOrTouchOut)

class Partical {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.baseX = this.x
    this.baseY = this.y
    this.size = 4
    this.speed = (Math.random() * 25) + 5
  }
  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 1)"
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  update() {
    this.draw()

    let dX = mouse.x - this.x
    let dY = mouse.y - this.y
    let distance = Math.sqrt(dX * dX + dY * dY)
    let maxDistance = mouse.radius
    let force = (maxDistance - distance) / maxDistance
    let forceDirectionX = dX / distance
    let forceDirectionY = dY / distance
    let directionX = forceDirectionX * force * this.speed
    let directionY = forceDirectionY * force * this.speed

    if (distance < mouse.radius) {
      this.x -= directionX
      this.y -= directionY
    } else {
      if (this.x !== this.baseX) {
        let dX = this.x - this.baseX
        this.x -= dX / 10
      }
      if (this.y !== this.baseY) {
        let dY = this.y - this.baseY
        this.y -= dY / 10
      }
    }
  }
}

function resizeReset() {
  canvas.width = w
  canvas.height = h
  invisibleBalls.push(new invisibleBall())
  for (let y = (((h - particalDistance) % particalDistance) + particalDistance) / 2; y < h; y += particalDistance) {
    for (let x = (((w - particalDistance) % particalDistance) + particalDistance) / 2; x < w; x += particalDistance) {
      particals.push(new Partical(x, y))
    }
  }
}

function drawLine() {
  for (let a = 0; a < particals.length; a++) {
    for (let b = 0; b < particals.length; b++) {
      let dX = particals[a].x - particals[b].x
      let dY = particals[a].y - particals[b].y
      let distance = Math.sqrt(dX * dX + dY * dY)

      if (distance < particalDistance * 1.5) {
        opacity = 1 - (distance / (particalDistance * 1.5))
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(particals[a].x, particals[a].y)
        ctx.lineTo(particals[b].x, particals[b].y)
        ctx.stroke()
      }
    }
  }
}

function drawScene() {
  for (let i = 0; i < particals.length; i++) {
    particals[i].update()
  }
  drawLine()
}


function animationLoop() {
  ctx.clearRect(0, 0, w, h)
  drawScene()

  for (let i = 0; i < invisibleBalls.length; i++) {
    invisibleBalls[i].update()
    ballX = invisibleBalls[i].cicularMovement().ballPX
    ballY = invisibleBalls[i].cicularMovement().ballPY
    mouseOrTouchOut(ballX, ballY)
  }

  requestAnimationFrame(animationLoop)
}

function init() {
  resizeReset()
  animationLoop()
}

init()