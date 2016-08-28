
exports.each = function each(list, iter) {
  for(var i = 0; i < list.length; i++)
    iter(list[i], i, list)
}

exports.find = function find(list, test) {
  for(var i = 0; i < list.length; i++)
    if(test(list[i], i, list)) return i

  return -1
}

