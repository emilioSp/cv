const yaml = require('js-yaml');
const fs = require('fs');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/js');

  // Add YAML data file support
  eleventyConfig.addDataExtension('yaml,yml', (contents) => yaml.load(contents));

  return {
    pathPrefix: '/cv/',
    dir: {
      input: 'src',
      output: 'docs',
      includes: '_includes',
      data: '_data',
    },
  };
};
