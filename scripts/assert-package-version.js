const core = require('@actions/core')

const version = core.getInput('version', { required: true });
const packages = core.getInput('packages', { required: true });


console.log({ version })
console.log({ packages })