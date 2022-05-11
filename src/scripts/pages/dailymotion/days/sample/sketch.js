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
  constructor(devMode) {
    this.devMode = true;
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
      st: 0.2,
      ease: 'easeInOutSine',
      number: 3,
      scale: 50,
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

    this.frameSize = Math.min(Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.9), 500);
    this.width = this.preWidth = this.frameSize;
    this.height = this.frameSize;
    
    this.ease = Ease.returnEaseFunc(this.gui.params.ease);

    this.scene = new THREE.Scene();
    
    if (this.devMode) {
      this.scene.add(new THREE.AxesHelper(10000));
    }
    
    this.setupCanvas();
    this.setupCamera();
    this.setupLight();
    this.setupShape();
    this.setupRest(this.dist);
    
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
    this.spotLight.shadow.mapSize.width = 128;
    this.spotLight.shadow.mapSize.height = 128;
    this.scene.fog = new THREE.Fog(0x000000, 0, this.dist * 5);
    
    if (this.devMode) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      const cameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.scene.add(cameraHelper);
      this.gui.open();
    }
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio / 2);
    this.renderer.setClearColor(0x000000, 1.0);
    
    this.renderer.domElement.style.outline = 'none';
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '50%';
    this.renderer.domElement.style.left = '50%';
    this.renderer.domElement.style.transform = 'translate(-50%, -50%)';
    this.renderer.domElement.style.background = '#000';
    this.renderer.domElement.style.zIndex = '-1';
    this.renderer.domElement.style.border = '3px solid #FFF';
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
    const ratio = Math.min(this.width, 1024) / 1024;

    this.scale = this.gui.params.scale;
  }
  
  setupShape() {
    this.setupSizes();

    this.shapes = [];
    this.maxDist = 0;
    const num = this.gui.params.number;
    
    // floor
    /*
    const floorSize = Math.max(this.width * 10, this.height * 10);
    const geometry = new THREE.BoxGeometry(floorSize, this.scale, floorSize, 1, 1, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(0, -this.scale - 50, 0);
    mesh.receiveShadow = true;
    
    this.scene.add(mesh);
    */

    // size
    //const size = Math.floor(this.scale * Math.sqrt(2) / 2);
    const size = Math.floor(this.scale); // square
    //const size = Math.floor(Math.sqrt(3) * this.scale / 2); // hex
    //const size = Math.floor(scale * 0.4 * 2 * Math.PI / num); // circle
    if (num === 1) {
      this.shapes.push(new Shape(this, 0, 0, 0, size, 0.001, 0, false));
      this.maxDist = 0.001;
      
      return;
    }

    this.shapes = this.getSquareGrid(num, this.scale, size);
  }
  
  getSquareGrid(num, scale, size) {
    const tmp = [];
    
    let index = 0;
    for (let y = -num; y < num; y++) {
      for (let x = -num; x < num; x++) {
        for (let z = 0; z < 1; z++) {
          const nx = scale * x + scale / 2;
          const ny = size * y + size / 2;
          const nz = scale * z + scale / 2;
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
    const time = this.time.getElapsedTime() * this.gui.params.st;
    
    for (let i = 0; i < this.shapes.length; i++) {
      const st = this.ease((time - (this.shapes[i].dist / this.maxDist / Math.PI * 2)) % 1);
      //const st = this.ease(time % 1);
      this.shapes[i].render(time, st);
    }
    
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
  
  getGeometry(geoName, size, segments) {
    let geometry;
    
    switch (geoName) {
      case 'sphere':
        geometry = new THREE.SphereGeometry(size, segments, segments);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(size - size / 2, size / 4, segments, segments);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(size, size, segments, segments);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(size, size, size, segments, 1);
        break;
      case 'torusKnotGeometry':
        geometry = new THREE.TorusKnotGeometry(size / 2, size / 5, segments, segments);
        break;
      case 'box':
        geometry = new THREE.BoxGeometry(size * 2, size * 2, size * 2, segments, segments, segments);
        break;
      default:
        console.log('not geometry name');
    }
    
    return geometry;
  }
  
  initialize() {
    // geometry
    const geometry = this.getGeometry('box', this.size, 4);
    
    // material
    const material = new THREE.MeshPhongMaterial({
      //blending: THREE.AdditiveBlending,
      //transparent: true,
      side: THREE.DoubleSide,
      color: `hsl(${Math.floor(360 * (this.sketch.maxDist / this.dist))}, 80%, 60%)`
    });
    material.fog = true;
    
    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.castShadow = this.shadow;
    
    this.sketch.scene.add(this.mesh);
  }
  
  render(time, scaledTime) {
    //this.mesh.scale.set(scale, scale, scale);
  }
}

