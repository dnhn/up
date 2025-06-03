const $at = document.getElementById('at')
const $d = document.getElementById('d')
const $h = document.getElementById('h')
const $m = document.getElementById('m')
const $s = document.getElementById('s')

document.fonts.ready.then(function () {
  fetch('up.json')
    .then(function (response) { return response.json() })
    .then(function (data) {
      const atDate = new Date(data.at)
      const at = atDate.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })
      const atFull = atDate.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'full' })

      format(data.up)
      $at.textContent = at
      $at.dateTime = data.at
      $at.title = atFull
      document.documentElement.classList.remove('loading')

      const up = toSeconds(data.up)
      const elapsed = Math.round((new Date() - atDate) / 1000)
      const estimation = up + elapsed

      const minRate = 50
      const multiplier = .5
      const rate = minRate + (elapsed * multiplier)
      const duration = (estimation - up) / rate * 1000

      const start = performance.now()

      function frame(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1)
        const current = Math.round(up + (estimation - up) * progress)
        update(current)

        if (progress < 1) {
          requestAnimationFrame(frame)
        } else {
          const liveStart = new Date()

          setInterval(function () {
            const liveElapsed = Math.round((new Date() - liveStart) / 1000)
            update(estimation + liveElapsed)
          }, 1000)
        }
      }

      requestAnimationFrame(frame)
    })
})

function toSeconds(hms) {
  const [s, m, h] = hms.split(':').map(Number).reverse()

  return s + (m * 60) + (h * 3600)
}

function toHMS(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60

  return `${h}:${m}:${s}`
}

function format(hms) {
  const [seconds, minutes, h] = hms.split(':').reverse()
  const days = Math.floor(h / 24)
  const hours = h % 24

  $d.textContent = new Intl.DurationFormat().format({ days })
  $h.textContent = String(hours).padStart(2, '0')
  $m.textContent = String(minutes).padStart(2, '0')
  $s.textContent = String(seconds).padStart(2, '0')
}

function update(seconds) {
  format(toHMS(seconds))
}
