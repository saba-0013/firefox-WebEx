function showClock () {
  const now_ = new Date().toLocaleString('ja-JP')
  document.getElementById('crTime').innerText = now_
}

setInterval(showClock, 100)
