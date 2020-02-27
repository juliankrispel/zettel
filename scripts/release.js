const parse = require('changelog-parser')
const core = require('@actions/core')

parse('./CHANGELOG.md')
.then(log => {
  const version = log.versions.find(version => version.version != null)
  console.log('huh?', core.setOutput('title', version.title))

  core.setOutput('version', version.version)
  core.setOutput('description', version.body)
  console.log('did this work?', version)
})