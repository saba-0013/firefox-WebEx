const main = function () {
  // use fetchAPI to fetch html
  // https://developer.mozilla.org/ja/docs/Web/API/Fetch_API
  fetch('https://help.unext.jp/channels/history/program').then(
    async response => {
      const t_ = await response.text()

      const div_ = document.createElement('div')
      div_.style.display = 'none'
      div_.innerHTML = t_

      const programs = Array.from(div_.querySelectorAll("[class^='ProgramTable__Content-sc-']"))
      const currentPg = programs.find(isCurrentPg)
      const [title, episode] = getTitleAndEpisode(currentPg)

      document.getElementById('pgTitle').innerText = title
      document.getElementById('pgEpisode').innerText = episode
      // const now_ = new Date().toLocaleString('ja-JP')
      // document.getElementById('crTime').innerText = `now: ${now_}`
    })
}

const isCurrentPg = function (pg) {
  // Return boolean if pg is current or not

  const now_ = new Date()
  const [pgStart, pgEnd] = _pgTimes(pg)

  return (pgStart <= now_ & now_ < pgEnd)
}

const _pgTimes = function (pg) {
  // Get program's START and END time with Date type.

  const timesArr = _timesInfo(pg)

  const now_ = new Date()
  const year_ = now_.getFullYear()
  const [month_, date_] = _monthAndDate(timesArr[0])
  const [start_, end_] = timesArr[1].split('〜')

  const startTime = new Date(
    year_, month_, date_,
    start_.split(':')[0], // hh
    start_.split(':')[1] // mm
  )

  // endtime's date is adjusted by end_ is '0:00' or not.
  const endTime = (end_ === '0:00')
    ? new Date(
        year_, month_, (date_ + 1),
        end_.split(':')[0],
        end_.split(':')[1]
      )
    : new Date(
      year_, month_, date_,
      end_.split(':')[0],
      end_.split(':')[1]
    )

  return [startTime, endTime]
}

const _timesInfo = function (el) {
  // Extract program's timeArray from element.
  // textContent ex. "2月1日 0:00~1:26" -> ["2月1日", "0:00~1:26"]

  const timesArr = el.querySelector("[class^='ProgramTable__StartTime-sc-']").textContent.split(' ')
  return timesArr
}

const _monthAndDate = function (tukihi) {
  // Extract month and date from ja-tukihi format string.
  // ex. "2月1日" -> [2, 1]
  const month_ = parseInt(tukihi.split('月')[0]) - 1
  const date_ = parseInt(tukihi.split('月')[1].split('日')[0])

  return [month_, date_]
}

const getTitleAndEpisode = function (el) {
  const title = el.querySelector("[class^='ProgramTable__TitleName-sc-']").textContent.replace('\n', '')
  const episode = el.querySelector("[class^='ProgramTable__EpisodeName-sc-']").textContent.replace('\n', '')

  return [title, episode]
}

main()
