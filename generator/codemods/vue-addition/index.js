module.exports = function(files, filename) {
  let content = files[filename]
  content = removeEventNative(content)
  content = addTransitionFrom(content)
  files[filename] = content
}

// template
// v-on:event.native => v-on:event
// @event.native => @event
function removeEventNative(content) {
  const reg = new RegExp(
    '(?<=<template>[\\s\\S]*?\\s(?:v-on:|@)\\w+).native(?==[\\s\\S]*?</template>)',
    'g'
  )
  return content.replace(reg, '')
}

// style
// .xxx-enter => .xxx-enter-from
// .xxx-leave => .xxx-leave-from
function addTransitionFrom(content) {
  const reg = new RegExp(
    '(?<=<style[\\s>][\\s\\S]*?\\s\\.[A-Za-z0-9_-]+-)(enter|leave)(?=[,{\\s][\\s\\S]*?</style>)',
    'g'
  )
  return content.replace(reg, '$1-from')
}
