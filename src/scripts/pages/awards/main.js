import { FullScreen } from './modules/full-screen';
import { Load } from './modules/load';

const main = () => {
  const F = new FullScreen();
  const P = new Load();
  
  P.initialize()
    .then(() => {
      alert('loaded');
    });
};

export { main }
