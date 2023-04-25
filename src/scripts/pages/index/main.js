import { FullScreen } from './modules/full-screen';
import { Loading } from './modules/loading';
import { header } from './modules/header';
import { Sketch } from './modules/sketch';
import { data } from './modules/data';

const main = () => {
  const F = new FullScreen();
  const L = new Loading(data);
  
  header();

  L.initialize()
    .then((d) => {
      const S = new Sketch(d);
  });
};

export { main }
