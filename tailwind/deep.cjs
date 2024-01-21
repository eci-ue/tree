const plugin = require("tailwindcss/plugin");

const deep = plugin(function({ matchVariant }) {
  if (matchVariant) {
    matchVariant('deep', (value) => {
      return `& ${value}`;
    }, {
      values: {}
    });
  }
});

module.exports = deep;