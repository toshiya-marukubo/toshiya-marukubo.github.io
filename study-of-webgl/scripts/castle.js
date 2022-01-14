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

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].onResize();
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
    this.renderer.setClearColor(0x000000, 1.0);
    
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
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.camera.position.set(
      this.mouse.mouse.x * 500,
      this.mouse.mouse.y * 500,
      this.dist
    );
    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(0, this.dist * 0.5, 0);
    this.scene.add(this.spotLight);
  }
  
  setupShape() {
    this.shapes = [];
    this.num = 1;
    
    for (let i = 0; i < this.num; i++) {
      const s = new Shape(this, 0, 0, 0);
      this.shapes.push(s);
    }
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(time * 0.1);
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
  constructor(sketch) {
    this.sketch = sketch;
    
    this.depth = 5;
    this.length = 15;
    this.angle = 0;
    this.radian = 0;
    this.startX = 0 - this.length * 31 / 2;
    this.startY = 0 - this.length * 31 / 2;
    this.height = 100;
    this.pos = [];
    this.timeoutArray = [];
    
    this.fractal(90, this.depth);
    this.init();
  }
  
  getCoordinate() {
    const rad = this.angle * Math.PI / 180;
    const nx = Math.cos(rad) * this.length + this.startX;
    const ny = Math.sin(rad) * this.length + this.startY;
    const dist = Math.sqrt(nx * nx + ny * ny) * 0.01;

    this.pos.push([this.startX, this.startY, nx, ny, dist]);
    this.startX = nx;
    this.startY = ny;
  }
  
  turn(increaseNumber) {
    this.angle += increaseNumber;
  };
  
  fractal(angle, depth) {
    if (depth > 0) {
      this.turn(angle);
      this.fractal(-angle, depth - 1);
      this.getCoordinate(this.length);
      this.turn(-angle);
      this.fractal(angle, depth - 1);
      this.getCoordinate(this.length);
      this.fractal(angle, depth - 1);
      this.turn(-angle);
      this.getCoordinate(this.length);
      this.fractal(-angle, depth - 1);
      this.turn(angle);
    }
  };
  
  init() {
    // floor
    this.floorGeometry = new THREE.PlaneGeometry(this.length * 32, this.length * 32);
    this.floorMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffffff});
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.set(90 * Math.PI / 180, 0, 0);
    this.sketch.scene.add(this.floor);

    // wall
    this.wallMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff
    });
    
    for (let i = 0; i < this.pos.length; i++) {
      this.timeoutId = setTimeout(() => {
        const x = this.pos[i][0] - this.pos[i][2];
        const z = this.pos[i][1] - this.pos[i][3];

        this.wallGeometry =
          new THREE.BoxGeometry(
            x + 2,
            this.height / this.pos[i][4],
            z + 2
          );
        this.mesh = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.mesh.position.set(
          this.pos[i][0] - x / 2,
          0 + this.height / this.pos[i][4] / 2,
          this.pos[i][1] - z / 2
        );
        this.sketch.scene.add(this.mesh);
      }, i * 20);
      
      this.timeoutArray.push(this.timeoutId);
    }
  }
  
  onResize() {
    for (var i = 0; i < this.timeoutArray.length; i++) {
      clearInterval(this.timeoutArray[i]);
    }
  }
  
  render(time) {
    this.sketch.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const dist = obj.position.distanceTo(new THREE.Vector3()) * 0.1;
        
        obj.material.color.setHSL(Math.abs(Math.sin(time)), 0.8, 0.6);
      }
    });
  }
}

(() => {
  window.addEventListener('load', () => {
    console.clear();

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    new Sketch();
  });
})();
