const $at = document.getElementById('at')
const $d = document.getElementById('d')
const $h = document.getElementById('h')
const $m = document.getElementById('m')
const $s = document.getElementById('s')

document.fonts.ready.then(function () {
  document.documentElement.classList.remove('loading')

  fetch('up.json')
    .then(function (response) { return response.json() })
    .then(function (data) {
      const atDate = new Date(data.at)
      const at = atDate.toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })
      const atFull = atDate.toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'full' })
      const up = Math.round(atDate.getTime() / 1000) - data.boot

      update(up)
      $at.textContent = at
      $at.dateTime = data.at
      $at.title = atFull

      const estimation = Math.max(Math.round(Date.now() / 1000) - data.boot, up)
      const elapsed = estimation - up

      const minRate = 50
      const multiplier = .5
      const rate = minRate + (elapsed * multiplier)
      const duration = elapsed / rate * 1000

      const start = performance.now()

      if (duration > 0) {
        requestAnimationFrame(frame)
      } else {
        update(estimation)
        live()
      }

      function frame(timestamp) {
        const progress = Math.min((timestamp - start) / duration, 1)
        const current = Math.round(up + (elapsed * progress))
        update(current)

        if (progress < 1) {
          requestAnimationFrame(frame)
        } else {
          live()
        }
      }

      function live() {
        const liveStart = new Date()

        setInterval(function () {
          const liveElapsed = Math.round((new Date() - liveStart) / 1000)
          update(estimation + liveElapsed)
        }, 1000)
      }
    })
})

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

  document.title = 'uptime: ' + new Intl.DurationFormat(undefined, { style: 'narrow' }).format({ days, hours, minutes })
  $d.textContent = new Intl.DurationFormat().format({ days }) || '\u00A0'
  $h.textContent = String(hours).padStart(2, '0')
  $m.textContent = String(minutes).padStart(2, '0')
  $s.textContent = String(seconds).padStart(2, '0')
}

function update(seconds) {
  format(toHMS(seconds))
}
