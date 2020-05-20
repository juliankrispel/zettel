const axios = require('axios').default
const core = require('@actions/core')

const version = process.env.PACKAGE_VERSION
const package = process.env.PACKAGE_NAME

const wait = (time) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time)
  })
}

let retries = 3

const run = async () => {
  let success = false
  while (retries > 0) {
    try {
      const result = await axios.get(`https://www.npmjs.com/package/@zettel/${package}/v/${version}`)
      if (result.status !== 200) {
        throw new Error(`package: ${package}:${version} not released yet or not available`)
      } else {
        retries = 0
        success = true
      }
    } catch (err) {
      retries--
      console.log(`Failed with error: ${err.message}, retrying in 2 seconds`)
      await wait(2000)
    }
  }

  if (!success) {
    core.setFailed(`Package ${package}:${version} not on npm`)
  } else {
    console.log(`Package ${package}:${version} is on npm 🚀`)
  }
}

run()