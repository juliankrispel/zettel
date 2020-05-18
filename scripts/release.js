const parse = require('changelog-parser')
const core = require('@actions/core')
const github = require('@actions/github');
const fs = require('fs')
const path = require('path')
const packages = process.env.PACKAGES.split(',').map(package => package.trim())

async function run() {
  const log = await parse('./CHANGELOG.md')

  const version = log.versions.find(version => version.version != null)
  core.setOutput('title', version.title)
  core.setOutput('version', version.version)
  core.setOutput('description', version.body)

  packages.forEach(package => {
    const packageJson = JSON.parse(fs.readFileSync(path.join('./', package, 'package.json')).toString())
    if (packageJson.version !== version.version) {
      core.setFailed(`Release failed because version in changelog: ${version.version} isn't the same as version in ${packageJson.name} which is ${packageJson.version}`)
    }
  })
}
