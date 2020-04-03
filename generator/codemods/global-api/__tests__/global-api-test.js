jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'basic')
defineTest(__dirname, 'index', null, 'custom-root-option')
// defineTest(__dirname, 'index', null, 'el')
// defineTest(__dirname, 'index', null, 'vuex-basic')
// defineTest(__dirname, 'index', null, 'vuex-basic-2')
// defineTest(__dirname, 'index', null, 'vuex-store')
