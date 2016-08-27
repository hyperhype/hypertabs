var h = require('hyperscript')

function displayable (el) {
  return el.style.display !== 'none'
}

function toggle_focus(el) {
  if(el.style.display !== 'flex')
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

function each(list, iter) {
  for(var i = 0; i < list.length; i++)
    iter(list[i], i, list)
}

module.exports = function (list) {
  var menu = h('ul')

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
    }}, el.title || el.tagName)
    var rm = h('a', {href: '#', onclick: function (ev) {
      el.parentNode.removeChild(el)
      menu.removeChild(wrap)
    }}, 'x')

    var wrap = h('li', link, rm)

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
        link.innerText = el.title || el.tagName
      isSelected()
    }).observe(el, {attributes: true, attributeFilter: ['title', 'style', 'class']})

    isSelected()
    wrap.follows = el
    return wrap
  }

  new MutationObserver(function (changes) {
    changes.forEach(function (ch) {
      if(ch.addedNodes.length) {
        for(var i = 0; i < ch.addedNodes.length; i++)
          menu.appendChild(tab_button(ch.addedNodes[i], onclick))
      }
    })
    //iterate over the list, and check that menu is in same order,
    //add any which do not exist, remove any which no longer exist.

    //check if a tab represented by a menu item has been removed.
    each(menu.children, function (btn) {
      if(btn.follows.parentNode != list) menu.removeChild(btn)
    })

  }).observe(list, {childList: true})

  return menu
}

