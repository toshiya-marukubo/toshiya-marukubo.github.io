import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Mouse } from '../../modules/mouse';
import { Ease } from '../../modules/ease';
import { Utilities } from '../../modules/utilities';

/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    this.devMode = false;
    this.setupGUI();
    this.createCanvas();
    this.setupEvents();
    
    this.time = new THREE.Clock(true);
    this.mouse = new Mouse(this, THREE);
    
    this.initialize();
  }
  
  setupGUI() {
    this.gui = new dat.GUI();

    this.gui.params = {
      st: 0.8,
      ease: 'easeInSine',
      number: 20,
      scale: 100,
      start: () => this.start(),
      stop: () => this.stop()
    };

    this.gui.ctrls = {
      st: this.gui.add(this.gui.params, 'st', 0.1, 1.0, 0.1),
      ease: this.gui.add(this.gui.params, 'ease', Ease.returnEaseType())
        .onChange(() => this.initialize()),
      number: this.gui.add(this.gui.params, 'number', 1, 10, 1)
        .onChange(() => this.initialize()),
      scale: this.gui.add(this.gui.params, 'scale', 1, 1000, 1)
        .onChange(() => this.initialize()),
      start: this.gui.add(this.gui.params, 'start'),
      stop: this.gui.add(this.gui.params, 'stop')
    };

    this.gui.hide();
  }
  
  start() {
    this.initialize();
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
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

    this.frameSize =
      Math.min(
        Math.floor(
          Math.min(
            window.innerWidth,
            window.innerHeight
          ) * 0.9), 500
      );
    this.width = this.preWidth = this.frameSize;
    this.height = this.frameSize;
    
    this.ease = Ease.returnEaseFunc(this.gui.params.ease);

    this.scene = new THREE.Scene();
    
    this.setupCanvas();
    this.setupCamera();
    this.setupLight();
    this.setupShape();
    this.setupRest();
    
    this.draw();
  }
  
  setupRest() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.left = -this.dist;
    this.directionalLight.shadow.camera.right = this.dist;
    this.directionalLight.shadow.camera.top = -this.dist;
    this.directionalLight.shadow.camera.bottom = this.dist;
    
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 32;
    this.spotLight.shadow.mapSize.height = 32;
    
    this.scene.fog = new THREE.Fog(0xFFFFFF, 0, this.dist * 2);
    
    if (this.devMode) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      const cameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.scene.add(cameraHelper);
      
      const axesHelper = new THREE.AxesHelper(10000);
      this.scene.add(axesHelper);

      this.gui.open();
    }
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    
    this.renderer.domElement.style.outline = 'none';
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '50%';
    this.renderer.domElement.style.left = '50%';
    this.renderer.domElement.style.transform = 'translate(-50%, -50%)';
    this.renderer.domElement.style.background = '#FFF';
    this.renderer.domElement.style.zIndex = '-1';
    this.renderer.domElement.style.border = '3px solid #000';
  }
  
  setupCamera() {
    const fov = 45;
    const fovRadian = (fov / 2) * (Math.PI / 180);
    
    this.dist = this.height / 2 / Math.tan(fovRadian);
    
    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        0.01,
        this.dist * 10
      );
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }

  updateCamera(t) {
    this.camera.position.set(
      Math.cos(-t) * this.dist,
      Math.sin(t) * this.dist / 2,
      Math.sin(-t) * this.dist
    );
    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 1);
    this.spotLight.position.set(0, 0, this.dist);
    this.spotLight.lookAt(new THREE.Vector3());
    this.scene.add(this.spotLight);
  }

  setupSizes() {
    //const ratio = Math.min(this.width, 1024) / 1024;
    this.scale = this.gui.params.scale;
    
    // size
    //this.size = Math.floor(this.scale * Math.sqrt(2));
    this.size = Math.floor(this.scale); // square
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2); // hex
    //this.size = Math.floor(scale * 0.4 * 2 * Math.PI / num); // circle
  }
  
  setupShape() {
    const num = this.gui.params.number;
    this.maxDist = 0;
    this.shapes = [];
    this.setupSizes();

    //this.addFloor();

    const geometry = new THREE.TorusGeometry(this.size + 20, 10, 10, 4, Math.PI * 2);
    const material = new THREE.MeshLambertMaterial({
      color: 0xDDDDDD
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -25);
    mesh.receiveShadow = true;
    
    this.scene.add(mesh);

    if (num === 1) {
      this.shapes.push(new Shape(this, 0, 0, 0, this.size, 0.0001, 0, false));
      this.maxDist = 0.0001;
      
      return;
    }

    this.shapes = this.getLineGrid(num, this.scale, this.size);
  }

  addFloor() {
    const floorSize = Math.max(this.width * 10, this.height * 10);
    const geometry = new THREE.BoxGeometry(floorSize, 100, floorSize, 1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(0, -this.frameSize / 2, 0);
    mesh.receiveShadow = true;
    
    this.scene.add(mesh);
  }

  getLineGrid(num, scale, size) {
    const tmp = [];

    let index = 0;
    for (let y = 0; y < 1; y++) {
      for (let x = 0; x < 1; x++) {
        for (let z = -num; z < num; z++) {
          const nx = scale / 2 * x;
          const ny = scale / 2 * y;
          const nz = scale / 2 * z;
          const d = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const s = new Shape(this, nx, ny, nz, size, d, index++, true);

          tmp.push(s);

          this.maxDist = Math.max(d, this.maxDist);
        }
      }
    }

    return tmp;
  }
  
  getSquareGrid(num, scale, size) {
    const tmp = [];
    
    let index = 0;
    for (let y = -num; y < num; y++) {
      for (let x = -num; x < num; x++) {
        for (let z = 0; z < 1; z++) {
          const nx = scale * x + size / 2;
          const ny = scale * y + size / 2;
          const nz = scale * z + size / 2;
          const d = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3()); 
          const s = new Shape(this, nx, ny, nz, size, d, index++, true);
          
          tmp.push(s);
          
          this.maxDist = Math.max(d, this.maxDist);
        }
      }
    }
    
    return tmp;
  }
  
  getHexGrid(num, size) {
    const tmp = [];
    const vectors = [];

    for (let x = -num; x <= num; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = -num; z <= num; z++) {
          if (x + y + z === 0) {
            const v = new THREE.Vector2(x, y);
            
            vectors.push(v);
          }
        } 
      }
    }
    
    for (let i = 0; i < vectors.length; i++) {
      const x = Math.sqrt(3) * (vectors[i].x + vectors[i].y / 2) / 2 * size;
      const y = 3 / 2 * vectors[i].y / 2 * size;
      const d = new THREE.Vector3(x, y, 0).distanceTo(new THREE.Vector3()) || 0.0001;
      const s = new Shape(this, x, y, 0, size, d, i, false);
      
      tmp.push(s);
      
      this.maxDist = Math.max(d, this.maxDist);
    }
    
    return tmp;
  }
  
  draw() {
    const t = this.time.getElapsedTime() * this.gui.params.st;
    
    for (let i = 0; i < this.shapes.length; i++) {
      //const st = this.ease((t - (this.shapes[i].dist / this.maxDist / Math.PI * 2)) % 1);
      //const st = this.ease((t - (i / this.shapes.length / Math.PI * 2)) % 1);
      const st = this.ease(t % 1);
      this.shapes[i].render(t, st);
    }

    this.updateCamera(t * 0.5);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

/**
 * shape class
 */
class Shape {
  constructor(sketch, x, y, z, s, d, i, shadow) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.position2 = new THREE.Vector3();
    this.size = s / 2;
    this.dist = d;
    this.index = i;
    this.shadow = shadow;
    this.atan = Math.atan2(y, x);
    
    this.initialize();
  }
  
  initialize() {
    // geometry
    const geometry = new THREE.BoxGeometry(this.size * 3, this.size * 3, 5, 1, 1, 1);
    
    // material
    const material = new THREE.MeshPhongMaterial({
      //blending: THREE.AdditiveBlending,
      //transparent: true,
      side: THREE.DoubleSide,
      color: 0xDDDDDD,
    });
    material.fog = true;
    
    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.castShadow = this.shadow;
    
    this.sketch.scene.add(this.mesh);
  }
  
  render(t, st) {
    let rotate = 0, moveZ = 0;
    if (st < 0.25) {
      rotate = Utilities.map(st, 0, 0.25, 0, Math.PI / 4);
      moveZ = Utilities.map(st, 0, 0.25, 0, 0);
    } else if (st >= 0.25 && st < 0.5) {
      rotate = Utilities.map(st, 0.25, 0.5, Math.PI / 4, Math.PI / 4);
      moveZ = Utilities.map(st, 0.25, 0.5, 0, 25);
    } else if (st >= 0.5 && st < 0.75) {
      rotate = Utilities.map(st, 0.5, 0.75, Math.PI / 4, Math.PI / 4);
      moveZ = Utilities.map(st, 0.5, 0.75, 25, 50);
    } else {
      rotate = Utilities.map(st, 0.75, 1, Math.PI / 4, 0);
      moveZ = Utilities.map(st, 0.75, 1.0, 50, 50);
    }

    if (this.index === 19) {
      this.mesh.rotation.z = rotate;
    }

    this.mesh.position.set(this.position.x, this.position.y, this.position.z + moveZ);
  }
}
