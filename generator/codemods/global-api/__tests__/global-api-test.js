jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'basic')
defineTest(__dirname, 'index', null, 'custom-root-option')
// defineTest(__dirname, 'index', null, 'el')
defineTest(__dirname, 'index', null, 'vue-router')
defineTest(__dirname, 'index', null, 'vuex')
