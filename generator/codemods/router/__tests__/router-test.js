jest.autoMockOff()

const { defineTest } = require('jscodeshift/dist/testUtils')

defineTest(__dirname, 'index', null, 'create-router')
defineTest(__dirname, 'index', null, 'create-history')
