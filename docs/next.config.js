// next.config.js
const withTypescript = require('@zeit/next-typescript')
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

module.exports = withTypescript(withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx']
}))