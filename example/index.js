//
// Easy testing: 
// $ npm install electro -g
// $ electro example/index.js
//

var h = require('hyperscript')
var fs = require('fs')
var microCss = require('micro-css')
var tabs = TABS = require('../')()

// document.head.appendChild(build_style_tag('styles.mcss'))
document.head.appendChild(build_style_tag('styles.vertical.mcss'))

var article = fs.readFileSync(__filename.replace('index.js', 'article.txt'), 'utf8')

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

var opts2 = Object.assign({}, logEvents, { title: 'Hyperspace (science fiction)' })
tabs.add(
  h('div', opts2, [
    article.split('\n').map(para => h('p', para))
  ])
)

var clockPage = tabs.add(FocusClock(), false)
// clockPage.content === the clock we asked to be added

function FocusClock () {
  var blurStart = Date.now()
  var focusStart, focused = false
  var focusTime, blurTime

  var clock = h('div', {
    onfocus: function () {
      focusStart = Date.now()
      focused = true
      blurTime = Date.now() - blurStart
      update()
      clock.parentNode.classList.remove('-notify')
    },
    onblur: function () {
      blurStart = Date.now()
      focusTime = Date.now() - focusStart
      focused = false
    }
  },
  'CLOCK'
  )

  function update () {
    var page = clock.parentNode

    var t = focused
      ? 'focus(focused)'
      : 'focus(blurred)'
    if(page.title != t) page.title = t

    if(Date.now() - blurStart > 1000 && !focused && !page.classList.contains('-notify')) {
      page.classList.add('-notify')
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

  return clock
}


window.onkeydown = function (ev) {
  console.log(ev.keyCode, tabs.isFullscreen())
  if(ev.keyCode === 70) {
    tabs.fullscreen(!tabs.isFullscreen())
  }
}

function build_style_tag (filename) {
  var mcss = fs.readFileSync(__filename.replace('index.js', filename), 'utf8')
  var css = microCss(mcss)

  // side effect - write a css copy for friends!
  var cssFilename = filename.replace('mcss', 'css')
  fs.writeFile(__filename.replace('index.js', cssFilename), css)

  return h('style', css)
}

