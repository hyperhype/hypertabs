var h = require('hyperscript')

/*
element classes are set with BEM convention.
https://css-tricks.com/bem-101/

B = block. module name, on the top level of the component.
E = element. a specific part of the component
M = modifier. something that changes an element (or block)
*/

var Menu = require('./menu')

module.exports = function (onSelect) {

  var names = []
  var tabs = h('div.row.hypertabs__tabs')
  var content = h('div.column.hypertabs__content')

  var d = h('div.hypertabs.column', Menu(content), content)

  d.add = function (name, tab, change) {
    tab.style.display = 'none'
    content.appendChild(tab)
    if(change !== false) d.select(name)
  }

  d.has = function (name) {
    return !!~names.indexOf(name)
  }

  d.select = function (name) {
    var prev = d.selectedTab
    d.selected = selected = name
    return
    var i = names.indexOf(name)
    if(!~i) return console.log('unknown tab:'+name + ' expected:' + JSON.stringify(names) + i)
    ;[].forEach.call(tabs.children, function (el) {
      el.classList.remove('hypertabs--selected')
    })
    tabs.children[i].classList.add('hypertabs--selected')
    ;[].forEach.call(content.children, function (tab) {
      tab.style.display = 'none'
    })
    var el = d.selectedTab = content.children[i]
    if(prev && prev != el)
      prev.dispatchEvent(new CustomEvent('blur', {target: el}))

    el.style.display = 'flex'
    el.dispatchEvent(new CustomEvent('focus', {target: el}))
    onSelect && onSelect(name, i)
  }

  d.selectRelative = function (n) {
    d.select(names[(names.indexOf(selected) + n + names.length) % names.length])
  }

  d.remove = function (name) {
    var i = names.indexOf(name)
    if(!~i) return
    names.splice(i, 1)
    tabs.removeChild(tabs.children[i])
    content.removeChild(content.children[i])
    if(selected === name)
      d.select(names[i] || names[0])
  }

  d.tabs = names

  return d
}

