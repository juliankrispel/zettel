const parse = require('changelog-parser')
const core = require('@actions/core')
const github = require('@actions/github');
const fs = require('fs')
const path = require('path')
const packages = process.env.PACKAGES.split(',').map(package => package.trim())
const token = process.env.GITHUB_TOKEN

const octokit = new github.GitHub(token);


async function run() {
  const log = await parse('./CHANGELOG.md')


  const { data: releases } = await octokit.repos.listReleases({
    owner: 'juliankrispel',
    repo: 'zettel'
  })
  console.log({ releases })

  const version = log.versions.find(version => version.version != null)
  core.setOutput('title', version.title)
  core.setOutput('version', version.version)
  core.setOutput('description', version.body)
  core.setOutput('already_released', false)


  packages.forEach(package => {
    const packageJson = JSON.parse(fs.readFileSync(path.join('./', package, 'package.json')).toString())
    if (packageJson.version !== version.version) {
      core.setFailed(`Release failed because version in changelog: ${version.version} isn't the same as version in ${packageJson.name} which is ${packageJson.version}`)
    }
  })

  // check if already released on github
  releases.forEach(release => {
    if(release.tag_name.includes(version.version)) {
      core.setFailed(`Release failed because version in changelog: ${version.version} isn't the same as version in ${packageJson.name} which is ${packageJson.version}`)
      core.setOutput('already_released', true)
    }
  })
}

run()