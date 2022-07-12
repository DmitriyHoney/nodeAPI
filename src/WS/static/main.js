'use strict';

const api = {};
// const baseUrl = 'http://localhost:3000';
const $app = document.getElementById('app');

const socket = new WebSocket('ws://localhost:3000');

const buildApi = () => {
  ['rect', 'move', 'render'].forEach((key) => {
    api[key] = (...args) => new Promise(() => {
      socket.send(JSON.stringify({ methodKey: key, args }));
    });
  });
};

const show = async (shapeName) => {
  api.render(shapeName);
};

const initFigure = async () => {
  try {
    await api.rect('rect1', 10, 10);
    show('rect1');
  } catch (e) {
    console.error(e);
  }
};

socket.onopen = async function(e) {
  console.log('onopen', e);
  await buildApi();
  initFigure();
};

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.result.indexOf('xml') >= 0) {
    $app.innerHTML = data.result;
  }
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`
      [close] Соединение закрыто чисто,
      код=${event.code} причина=${event.reason}
    `);
  } else {
    // например, сервер убил процесс или сеть недоступна
    // обычно в этом случае event.code 1006
    console.log('[close] Соединение прервано');
  }
};

socket.onerror = function(error) {
  console.log(`[error] ${error.message}`);
};



