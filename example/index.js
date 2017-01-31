//
// run : electro example/index.js
//
//

var h = require('hyperscript')
var fs = require('fs')
var microCss = require('micro-css')

var mcss = fs.readFileSync(__filename.replace('index.js', 'styles.mcss'), 'utf8')
var styles = h('style', microCss(mcss))
fs.writeFile(__filename.replace('index.js', 'styles.css'), microCss(mcss).toString())
document.head.appendChild(styles)


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

var opts = Object.assign({}, logEvents, { title: 'A trifle' })
tabs.add(h('h1', opts, 'foo bar baz'))

tabs.add(
  h('ul', logEvents, [
    h('li', 'foo'),
    h('li', 'bar'),
    h('li', 'baz')
  ])
)

tabs.add(
  h('form', logEvents, [
    h('input', {value: 'foo bar baz'}),
    h('submit')
  ])
)

function FocusClock () {
  var clock
  var blurStart = Date.now()
  var focusStart, focused = false
  var focusTime, blurTime

  function update () {
    var t = 'focus('+(focused ? 'focused' : 'blurred')+')'
    if(clock.title != t) clock.title = t

    if(Date.now() - blurStart > 1000 && !focused && !clock.classList.contains('-notify')) {
      clock.classList.add('-notify')
    }

    if(!focused) return
    clock.innerHTML = ''
    clock.appendChild(
      h('div', [
        h('p', 'current focus:'+(Date.now() - focusStart)),
        h('p', 'blur time:'+blurTime),
        h('p', 'prev focus:'+focusTime)
      ])
    )
  }

  setInterval(update, 100)

  return clock = h('div', {
    onfocus: function () {
      focusStart = Date.now()
      focused = true
      blurTime = Date.now() - blurStart
      update()
      clock.classList.remove('-notify')
    },
    onblur: function () {
      blurStart = Date.now()
      focusTime = Date.now() - focusStart
      focused = false
    }
  },
  'CLOCK'
  )
}


tabs.add(FocusClock(), false)

window.onkeydown = function (ev) {
  console.log(ev.keyCode, tabs.isFullscreen())
  if(ev.keyCode === 70) {
    tabs.fullscreen(!tabs.isFullscreen())
  }
}

