jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'basic')
defineTest(__dirname, 'index', null, 'custom-root-prop')
// defineTest(__dirname, 'index', null, 'el')
defineTest(__dirname, 'index', null, 'vue-router')
defineTest(__dirname, 'index', null, 'vuex')
defineTest(__dirname, 'index', null, 'vue-use')
