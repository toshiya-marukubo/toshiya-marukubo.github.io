import { FullScreen } from './modules/full-screen';
import { Loading } from './modules/loading';
import { Sketch } from './modules/sketch';

const main = () => {
  const F = new FullScreen();
  const L = new Loading([{imagePath:'./dist/assets/images/dammy.png'}]);

  L.initialize()
    .then((d) => {
      const S = new Sketch();
  });
};

export { main }
