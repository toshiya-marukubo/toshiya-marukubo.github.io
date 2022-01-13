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

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
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
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(1.0);
    this.renderer.setClearColor(0xF4D0D9, 1.0);
    
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
    this.camera.position.set(0, 200, this.dist / 5);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.camera.position.set(
      this.mouse.mouse.x * this.width / 4,
      this.mouse.mouse.y * this.height / 4,
      this.dist * (1 + this.mouse.delta)
    );
    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.pointLight = new THREE.PointLight(0xffffff, 1, this.dist);
    this.pointLight.position.set(0, this.dist, 0);
    this.scene.add(this.pointLight);
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
      this.shapes[i].render(time * 2);
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
  constructor(sketch, x, y, z) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.initialize();
  }
  
  initialize() {
    let radius = 10;
    let size = radius / 5;
  
    for (let i = 0; i < 130; i++) {
      const rad = 137.5 * Math.PI / 180 * i;
      const x = Math.cos(rad) * radius;
      const z = Math.sin(rad) * radius;
      
      this.material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: new THREE.Color(`hsl(${360 / 8 * i}, 90%, 90%)`)
      });
      this.geometry = new THREE.SphereGeometry(size, 32, 32);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(x, (0 + size), z);
      this.sketch.scene.add(this.mesh);

      radius /= 0.9745;
      size /= 0.9745;
    }
  }
  
  render(time) {
    this.sketch.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const dist = obj.position.distanceTo(new THREE.Vector3()) * 0.01;
        obj.position.y = Math.sin(dist + time) * 80;
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
