'use strict';

const api = {};
const baseUrl = 'http://localhost:3000';
const $app = document.getElementById('app');

const buildApi = async () => {
  await fetch(`${baseUrl}/api/allMethods`)
    .then((res) => res.json())
    .then((methods) => {
      methods.forEach((key) => {
        api[key] = (...args) => fetch(`${baseUrl}/api/${key}`, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args)
        })
          .then((res) => res.json())
          .catch((err) => err)
          .then((res) => res)
          .catch((err) => err);
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

(async () => {
  try {
    await buildApi();
    initFigure();
  } catch (e) {
    console.error(e);
  }
})();

