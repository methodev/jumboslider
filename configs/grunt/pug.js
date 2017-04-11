var grunt = require('grunt');

module.exports = {
  options: {
    pretty: true,
    data: grunt.pluginData
  },

  page: {
    files: {
      'index.html': '<%= assets %>src/markup/index.pug'
    }
  }
};