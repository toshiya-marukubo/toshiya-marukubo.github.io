import { FullScreen } from '../../../index/modules/full-screen';
import { Loading } from '../../../index/modules/loading';
import { Sketch } from './sketch';

const main = () => {
  const F = new FullScreen();
  const L = new Loading([{imagePath:'../../dist/assets/images/dammy.png'}]);
  
  L.initialize()
    .then((d) => {
      const S = new Sketch();
    });
};

export { main }
