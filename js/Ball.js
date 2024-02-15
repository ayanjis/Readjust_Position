const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let w = window.innerWidth
let h = window.innerHeight

export let invisibleBalls = []
export let invisibleBall_radius = 20
export let circularArea = 100
export let circleCenterX = w / 2
export let circleCenterY = h / 2
export let invisibleBall_speed = 0.02
export let invisibleBall_opacity = 0

canvas.width = w
canvas.height = h

export function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min
}

export class invisibleBall {
  constructor() {
    this.x = circleCenterX
    this.y = circleCenterY
    this.size = invisibleBall_radius
    this.angle = Math.random() * 360
    this.radian = 0
    this.speed = invisibleBall_speed
    this.opacity = invisibleBall_opacity
  }
  draw() {
    ctx.fillStyle = `hsla(0, 100%, 100%, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }
  cicularMovement() {
    this.radian += this.speed
    this.x = circleCenterX + Math.cos(this.radian) * circularArea
    this.y = circleCenterY + Math.sin(this.radian) * (circularArea * 2)
    return this.ballPosition = {
      ballPX: this.x,
      ballPY: this.y,
    }
  }
  snakeMovement() {
    this.speed = 1
    this.MaxMinAngle = 1
    this.angle += getRandomInt(-this.MaxMinAngle, this.MaxMinAngle)
    this.radian = (Math.PI / 180) * this.angle
    this.x += this.speed * Math.sin(this.radian)
    this.y += this.speed * Math.cos(this.radian)
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.angle += 90
    }
    return this.ballPosition = {
      ballPX: this.x,
      ballPY: this.y,
    }
  }
  update() {
    this.draw()
    this.cicularMovement()
  }
}
invisibleBalls.push(new invisibleBall())

function animationLoop() {
  ctx.clearRect(0, 0, w, h)
  for (let i = 0; i < invisibleBalls.length; i++) {
    invisibleBalls[i].update()
    //  console.log(invisibleBalls[i].cicularMovement().x)
  }
  requestAnimationFrame(animationLoop)
}

animationLoop()