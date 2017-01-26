
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

  //store scroll position in data-attribute
  el.dataset.scrollTop = el.scrollTop

  el.style.visibility = 'hidden'
  el.style.position = 'absolute'
}

function setVisible(el) {
  el.style.visibility = 'visible'
  el.style.position = 'inherit'

  // restore scroll position from data-attribute
  el.scrollTop = el.dataset.scrollTop 
}

