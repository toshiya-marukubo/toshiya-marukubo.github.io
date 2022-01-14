/**
 * Mouse class
 */
class Mouse {
  constructor(sketch) {
    this.sketch = sketch;
    this.initialize();
  }
  
  initialize() {
    this.delta = 0;
    this.mouse = new THREE.Vector3();
    this.setupEvents();
  }
  
  setupEvents() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    window.addEventListener('mousemove', this.onMousemove.bind(this), false);
    window.addEventListener('touchmove', this.onTouchmove.bind(this), false);
  }

  onScroll(e) {
    const docScrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docScrollTop / docHeight;

    this.delta = scrollPercent;
  }

  onMousemove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.z = 0;
  }

  onTouchmove(e) {
    const touch = e.targetTouches[0];

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;;
    this.mouse.y =  -(touch.pageY / window.innerHeight) * 2 + 1;
    this.mouse.z = 0;
  }
}

/**
 * class Sketch
 */
class Sketch {
  constructor() {
    this.createCanvas();
    this.setupEvents();
    this.time = new THREE.Clock(true);
    this.mouse = new Mouse(this);
    this.initialize();
  }
  
  createCanvas() {
    this.renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
    
    document.body.appendChild(this.renderer.domElement); 
  }
  
  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }
  
  onResize() {
    if (this.preWidth === window.innerWidth && window.innerWidth < 480) {
      return;
    }

    this.initialize();
  }
  
  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.preWidth = this.width = Math.ceil(window.innerWidth);
    this.height = Math.ceil(window.innerHeight);

    this.scene = new THREE.Scene();
    
    this.setupCanvas();
    this.setupCamera();
    this.setupLight();
    this.setupShape();
    
    this.draw();
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.setPixelRatio(1.0);
    this.renderer.setClearColor(0x444444, 1.0);
    
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex =  '-1';
    this.renderer.domElement.style.outline = 'none';
  }
  
  setupCamera() {
    const fov = 70;
    const fovRadian = (fov / 2) * (Math.PI / 180);
    
    this.dist = this.height / 2 / Math.tan(fovRadian);
    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        0.01,
        this.dist * 5
      );
    this.camera.position.set(0, 200, this.dist / 3);
    this.camera.lookAt(new THREE.Vector3());

    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3();
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);

    this.camera.position.set(
      this.cameraP.x * this.dist,
      this.cameraP.y * this.dist,
      this.dist 
    );

    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    //this.spotLight = new THREE.SpotLight(0xffffff);
    //this.spotLight.position.set(this.dist, this.dist, this.dist);
    //this.scene.add(this.spotLight);
  }
  
  setupShape() {
    this.shapes = [];
    this.num = 1;
    
    for (let y = 0; y < this.num; y++) {
      const s = new Shape(this, 0, 0, 0);
      this.shapes.push(s);
    }
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].update(time);
    }

    this.updateCamera(time);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

/**
 * shape class
 */
class Shape {
  /**
   * @constructor
   * @param {object} sketch - canvas
   */
  constructor(sketch) {
    this.sketch = sketch;
    this.init();
  }
  
  /**
   * initialize shape
   */
  init() {
    this.initPositions = this.getInitPositions(0);
    this.positions = this.getPositions(0);
      
    this.material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 70,
      emissive: 0x232323,
      specular: 0xffffff
    });
    
    for (let i = 0; i < this.positions.length; i++) {
      this.geometry = new THREE.SphereGeometry(this.positions[i][2], 16, 16);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(this.positions[i][0], 0, this.positions[i][1]);
      this.sketch.scene.add(this.mesh);
    }
  }
  
  /**
   * get initialize positions
   * @param {number} t - time
   */
  getInitPositions(t) {
    const arr = new Array();
    
    this.num = 16;
    this.rad = Math.PI * 2 / this.num;
    
    const initDist = 40;
    let x = initDist;
    let r = initDist * Math.tan(this.rad / 2);
    
    const y2 = Math.sqrt(x * x + r * r) + r;
    const y1 = Math.sqrt(x * x + r * r) - r;
    const scale = y2 / y1;

    for (let i = 0; i < 6; i++) {
      arr.push([x, r]);
      x = x * scale;
      r = r * scale;
    }
    
    return arr;
  }
  
  /**
   * get positions
   * @param {number} t - time
   */
  getPositions(t) {
    const arr = new Array();
    
    for (let j = 0; j < this.num; j++) {
      for (let i = 0; i < this.initPositions.length; i++) {
        let ix = this.initPositions[i][0];
        let iy = this.initPositions[i][1];
        let nx = Math.cos(this.rad * j) * ix - Math.sin(this.rad * j) * iy;
        let ny = Math.sin(this.rad * j) * ix + Math.cos(this.rad * j) * iy;
        
        if (i % 2 === 0) {
          if (Math.sin(t * 4) > 0) {
            nx = Math.cos(this.rad * j + t) * ix - Math.sin(this.rad * j + t) * iy;
            ny = Math.sin(this.rad * j + t) * ix + Math.cos(this.rad * j + t) * iy;
          }
        } else {
          if (Math.sin(t * 4) > 0) {
            nx = Math.cos(this.rad * j - t) * ix - Math.sin(this.rad * j - t) * iy;
            ny = Math.sin(this.rad * j - t) * ix + Math.cos(this.rad * j - t) * iy;
          }
        }
        
        arr.push([nx, ny, this.initPositions[i][1] * Math.abs(Math.cos(t * 4)), j]);
      }
    }
    
    return arr;
  }
  
  /**
   * update shape
   * @param {number} time - time 
   */
  update(time) {
    let index = 0;
    
    this.sketch.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.position.set(this.positions[index][0], 0, this.positions[index][1]);
        
        if (this.positions[index][3] % 2 === 0) {
          obj.scale.set(
            Math.abs(Math.sin(time)),
            Math.abs(Math.sin(time)),
            Math.abs(Math.sin(time))
          );
        } else {
          obj.scale.set(
            Math.abs(Math.cos(time)),
            Math.abs(Math.cos(time)),
            Math.abs(Math.cos(time))
          );
        }
        index++;
      }
    });
    
    this.positions = this.getPositions(time);
  }
}

(() => {
  window.addEventListener('load', () => {
    console.clear();

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    new FullScreen();

    new Sketch();
  });
})();
