'use strict';
const memory = require('../memory');

class Rect {
  constructor(name, x = 10, y = 10, rotate = 0, scale = 1) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.rotate = rotate;
    this.scale = scale;
  }

  toSvg() {
    return `
      <?xml version="1.0" standalone="no"?>
      <svg width="auto" height="1000" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="${this.x}" y="${this.y}" width="50" height="50"
          fill="skyblue"
          transform="rotate(${this.rotate}) scale(${this.scale})"
        />
      </svg>
    `.replace(/\n(\s\s)*/g, ' ').trim();
  }
}

module.exports = async (name, x, y, rotate = 0, scale = 1) => {
  console.log('naaaaaaaame', name, x);
  try {
    if (!name) throw new Error('Argument name is required!');
    const rect = new Rect(name, x, y, rotate, scale);
    memory.set(name, rect);
    return 'ok';
  } catch (e) {
    return Promise.reject(JSON.stringify({ error: e.message }));
  }
};



