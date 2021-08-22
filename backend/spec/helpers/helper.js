var SpecReporter = require('jasmine-spec-reporter').SpecReporter
var DisplayProcessor = require('jasmine-spec-reporter').DisplayProcessor

function TimeProcessor(configuration, theme) {}

function getTime() {
  var now = new Date()
  return now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds()
}

TimeProcessor.prototype = new DisplayProcessor()

TimeProcessor.prototype.displaySuite = function (suite, log) {
  return getTime() + ' - ' + log
}

TimeProcessor.prototype.displaySuccessfulSpec = function (spec, log) {
  return getTime() + ' - ' + log
}

TimeProcessor.prototype.displayFailedSpec = function (spec, log) {
  return getTime() + ' - ' + log
}

TimeProcessor.prototype.displayPendingSpec = function (spec, log) {
  return getTime() + ' - ' + log
}

var reporter = new SpecReporter({
  customProcessors: [TimeProcessor],
})

jasmine.getEnv().addReporter(reporter)