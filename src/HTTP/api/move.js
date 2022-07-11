'use strict';

const memory = require('../memory');

module.exports = async (name, x, y) => {
  const rect = memory.get(name);
  if (!rect) return { error: `Shape ${name} not found` };
  rect.x = x;
  rect.y = y;
  return `Shape ${name} was move success!`;
};
