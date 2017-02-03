
module.exports = {
  each: each,
  find: find,
  isVisible: isVisible,
  setVisible: setVisible,
  setInvisible: setInvisible
}

function each(list, iter) {
  for(var i = 0; i < list.length; i++)
    iter(list[i], i, list)
}

function find(list, test) {
  for(var i = 0; i < list.length; i++)
    if(test(list[i], i, list)) return i

  return -1
}

function isVisible(el) {
  return el.style.visibility !== 'hidden'
}

function setInvisible(el) {
  if (el.style.visibility === 'hidden') return

  scrollEl = el.firstChild
  //store scroll position in data-attribute
  scrollEl.dataset.scrollTop = scrollEl.scrollTop

  el.style.visibility = 'hidden'
  el.style.position = 'absolute'
}

function setVisible(el) {
  el.style.visibility = 'visible'
  el.style.position = 'inherit'

  scrollEl = el.firstChild
  // restore scroll position from data-attribute
  scrollEl.scrollTop = scrollEl.dataset.scrollTop
}

