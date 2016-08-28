var h = require('hyperscript')
var u = require('./util')
var each = u.each
var find = u.find

function displayable (el) {
  return el.style.display !== 'none'
}

function toggle_focus(el) {
  if(el.style.display === 'none')
    focus(el)
  else
    blur(el)
}

function focus(el) {
  if(el.style.display !== 'flex') {
    el.style.display = 'flex'
    el.dispatchEvent(new CustomEvent('focus', {target: el}))
  }
}

function blur (el) {
  if(el.style.display !== 'none') {
    el.style.display = 'none'
    el.dispatchEvent(new CustomEvent('blur', {target: el}))
  }
}

function moveTo(el, list, i) {
  if(!list.children.length || i >= list.children.length)
    list.appendChild(el)
  else
    list.insertBefore(el, list.children[i])
}

module.exports = function (list, onSelect) {
  var menu = h('div.row.hypertabs__tabs')
  var selection

  function tab_button (el, onclick) {
    var link = h('a', {href: '#', onclick: function (ev) {
      if(ev.shiftKey) toggle_focus(el)
      else {
        each(list.children, function (tab) {
          if(tab == el) focus(tab)
          else blur(tab)
        })
      }
      ev.preventDefault()
      ev.stopPropagation()
    }}, el.title || el.id || el.tagName)
    var rm = h('a', {href: '#', onclick: function (ev) {
      el.parentNode.removeChild(el)
      menu.removeChild(wrap)
    }}, 'x')

    var wrap = h('div.hypertabs__tab', link, rm)

    function isSelected () {
      if(displayable(el))
        link.classList.add('hypertabs--selected')
      else
        link.classList.remove('hypertabs--selected')

      if(el.classList.contains('hypertabs--notify')) {
        link.classList.add('hypertabs--notify')
      } else
        link.classList.remove('hypertabs--notify')
    }

    new MutationObserver(function (changes) {
      if(el.title !== link.innerText)
        link.innerText = el.title || el.id || el.tagName
      isSelected()
      onSelect && onSelect()
    }).observe(el, {attributes: true, attributeFilter: ['title', 'style', 'class']})

    isSelected()
    wrap.follows = el
    return wrap
  }

  new MutationObserver(function (changes) {
    //iterate over the list, and check that menu is in same order,
    //add any which do not exist, remove any which no longer exist.

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != list) menu.removeChild(btn)
    })

    //check if each thing in the list has a tab.
    each(list.children, function (tab, i) {
      var j
      if(menu.children[i] && menu.children[i].follows === tab) {
        //already set, and in correct place. do nothing
      } else if(~(j = find(menu, function (btn) { return btn.follows === tab }))) {
        moveTo(menu[j], list, i)
      } else {
        menu.appendChild(tab_button(tab))
      }
    })

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != list) menu.removeChild(btn)
    })

  }).observe(list, {childList: true})
  return menu
}

