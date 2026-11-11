// Audio synthesis using Web Audio API (zero external assets needed)
let audioCtx = null

function getAudioContext() {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume()
  }
  return audioCtx
}

/**
 * Play a resonant metallic copper/brass bell chime
 */
export function playCopperChime() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime

    // Fundamental tone + overtones
    const freqs = [880, 1760, 2640, 3520]
    const gains = [0.25, 0.12, 0.06, 0.02]

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(freq, now)

      gain.gain.setValueAtTime(gains[idx], now)
      // Exponential decay to mimic metal bell ring
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 1.8)
    })
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

/**
 * Play a tactile stamp/placement sound
 */
export function playStampSound() {
  try {
    const ctx = getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = "triangle"
    osc.frequency.setValueAtTime(140, now)
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.12)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  } catch {
    // Ignore audio errors
  }
}

/**
 * Lightweight pure Canvas confetti particle explosion
 */
export function triggerConfetti(originX = window.innerWidth / 2, originY = window.innerHeight / 2) {
  if (typeof window === "undefined") return

  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.top = "0"
  canvas.style.left = "0"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "99999"
  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")
  const width = (canvas.width = window.innerWidth)
  const height = (canvas.height = window.innerHeight)

  const colors = ["#A96C4B", "#D48B60", "#F4EAE3", "#22C55E", "#EAB308", "#6366F1", "#EC4899"]
  const particles = []
  const count = 70

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 9 + 4
    particles.push({
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 12,
      opacity: 1,
      shape: Math.random() > 0.4 ? "rect" : "circle",
    })
  }

  let startTime = null

  function render(time) {
    if (!startTime) startTime = time
    const elapsed = time - startTime

    ctx.clearRect(0, 0, width, height)

    let alive = false
    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.28 // gravity
      p.vx *= 0.98 // air resistance
      p.rotation += p.vRot
      p.opacity = Math.max(0, 1 - elapsed / 2200)

      if (p.opacity > 0.01) {
        alive = true
        ctx.save()
        ctx.globalAlpha = p.opacity
        ctx.fillStyle = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
    }

    if (alive && elapsed < 2500) {
      requestAnimationFrame(render)
    } else {
      canvas.remove()
    }
  }

  requestAnimationFrame(render)
}

