import { FullScreen } from './modules/full-screen';
import { Load } from './modules/load';
import { Sketch } from './modules/sketch';

const main = () => {
  const F = new FullScreen();
  const P = new Load();

  P.initialize()
    .then(() => {
      console.log('loaded');
      const S = new Sketch();
    });
};

export { main }
