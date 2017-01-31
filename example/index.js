//
// run : electro example/index.js
//
//

var h = require('hyperscript')

var styles = h('style', `
  div.Hypertabs {
    display: flex;
    flex-direction: column
  }

  div.Hypertabs > nav { 
    display: flex;
  }

  div.Hypertabs > nav > section.tabs { 
    flex-grow: 1;

    display: flex;
  }

  div.Hypertabs > nav > section.tabs > div.tab { 
    flex-grow: 1;

    display: flex;
    padding: 5px;
    border: 1px gainsboro solid;
  }
  div.Hypertabs > nav > section.tabs > div.tab.-selected {
    background-color: cyan;
  }
  div.Hypertabs > nav > section.tabs > div.tab.-notify {
    background-color: yellow;
  }

  div.Hypertabs > nav > section.tabs > div.tab > a.link {
    flex-grow: 1;
  }
  div.Hypertabs > nav > section.tabs > div.tab > a.close {}


  div.Hypertabs > section.content {
    display: flex;
  }
  div.Hypertabs > section.content > div.page {
    flex-grow: 1;

    padding: 1rem;
    border: 1px gainsboro solid;
  }
`)

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

tabs.add(h('h1', logEvents, 'foo bar baz'))

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
  })
}


tabs.add(FocusClock(), false)

window.onkeydown = function (ev) {
  console.log(ev.keyCode, tabs.isFullscreen())
  if(ev.keyCode === 70) {
    tabs.fullscreen(!tabs.isFullscreen())
  }
}

