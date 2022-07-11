'use strict';

const api = {};
const baseUrl = 'http://localhost:3000';
const $app = document.getElementById('app');

const socket = new WebSocket('ws://localhost:3000');

const buildApi = () => {
  ['rect', 'move', 'render'].forEach((key) => {
    api[key] = (...args) => new Promise((resolve, reject) => {
      socket.send(JSON.stringify({ methodKey: key, args }));
    });
  });
};

const show = async (shapeName) => {
  const figureSvg = await api.render(shapeName);
  $app.innerHTML = figureSvg[0];
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
  console.log(`[message] Данные получены с сервера: ${event.data}`);
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



