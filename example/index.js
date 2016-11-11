
var h = require('hyperscript')

document.head.appendChild(h('style', '.hypertabs--selected { background: yellow }'))
document.head.appendChild(h('style', '.hypertabs--notify { border: 1px solid red; }'))
document.head.appendChild(h('style', '.hypertabs__content { display: flex; flex-direction: row; }'))
document.head.appendChild(h('style', '.hypertabs__content > * { padding: 50px; margin: auto; border: 1px solid black;}'))

var tabs = TABS = require('../')()

var logEvents = {
  onfocus: function (ev) {
    console.log('focus', ev)
  },
  onblur: function (ev) {
    console.log('blur', ev)
  }
}

document.body.appendChild(tabs)

tabs.add(h('h1', logEvents, 'foo bar baz'))
tabs.add(
  h('ul',
    logEvents,
    h('li', 'foo'),
    h('li', 'bar'),
    h('li', 'baz')
  )
)

tabs.add(
  h('form',
    logEvents,
    h('input', {value: 'foo bar baz'}),
    h('submit')
  )
)

function FocusClock () {
  var clock
  var blurStart = Date.now()
  var focusStart, focused = false
  var focusTime, blurTime

  function update () {
    var t = 'focus('+(focused ? 'focused' : 'blurred')+')'
    if(clock.title != t) clock.title = t

    if(Date.now() - blurStart > 1000 && !focused && !clock.classList.contains('hypertabs--notify')) {
      clock.classList.add('hypertabs--notify')
    }

    if(!focused) return
    clock.innerHTML = ''
    clock.appendChild(
      h('div',
        h('p', 'current focus:'+(Date.now() - focusStart)),
        h('p', 'blur time:'+blurTime),
        h('p', 'prev focus:'+focusTime)
      )
    )

  }
  setInterval(update, 100)

  return clock = h('div',
    {
      onfocus: function () {
        focusStart = Date.now()
        focused = true
        blurTime = Date.now() - blurStart
        update()
        clock.classList.remove('hypertabs--notify')
      },
      onblur: function () {
        blurStart = Date.now()
        focusTime = Date.now() - focusStart
        focused = false
      }
    }
  )

}


tabs.add(FocusClock(), false)

window.onkeydown = function (ev) {
  console.log(ev.keyCode, tabs.isFullscreen())
  if(ev.keyCode === 70) {
      tabs.fullscreen(!tabs.isFullscreen())
  }
}

