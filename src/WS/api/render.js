'use strict';
const memory = require('../memory');

module.exports = async (name) => {
  const rect = memory.get(name);
  if (!rect) return { error: `Shape ${name} not found` };
  return JSON.stringify([rect.toSvg()]);
};
