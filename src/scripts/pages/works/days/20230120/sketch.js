import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Mouse } from '../20230110/mouse';
import { Ease } from '../20230110/ease';
import { Utilities } from '../20230110/utilities';
import { mergeGeometry } from '../20230110/mergeGeometry';

import SimplexNoise from 'simplex-noise';

/*
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const font = require('three/examples/fonts/helvetiker_bold.typeface.json');
*/

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
    this.simplex = new SimplexNoise();
    
    /*
    const loader = new FontLoader();
    this.font = loader.parse(font);
    */

    this.initialize();
  }
  
  setupGUI() {
    this.gui = new dat.GUI();

    this.gui.params = {
      st: 0.5,
      ease: 'linear',
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

    this.ease = Ease.returnEaseFunc(this.gui.params.ease);
    this.easeOutBounce = Ease.returnEaseFunc('easeOutBounce');

    this.scene = new THREE.Scene();
   
    this.setupSizes(); 
    this.setupCanvas();
    this.setupCamera();
    this.setupLights();
    this.setupShapes();
    this.setupRest();
    
    this.draw();
  }
  
   setupSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(1.0);
    this.renderer.setClearColor(0xFFFFFF, 1.0);

    this.renderer.domElement.style.outline    = 'none';
    this.renderer.domElement.style.position   = 'fixed';
    this.renderer.domElement.style.top        = '0';
    this.renderer.domElement.style.left       = '0';
    this.renderer.domElement.style.background = '#FAFAFA';
    this.renderer.domElement.style.zIndex     = '-1';
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
    this.camera.position.set(this.dist / 2, this.dist / 2, this.dist);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  setupLights() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.directionalLight.position.set(0, this.dist, this.dist);
    this.scene.add(this.directionalLight);

    // spot light
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 1);
    this.spotLight.position.set(0, this.dist * 0.5, 0);
    this.spotLight.lookAt(new THREE.Vector3());
    this.scene.add(this.spotLight);

    // point light
    /*
    this.pointLight = new THREE.PointLight(0xFFFFFF, 5, 200, 1);
    this.pointLight.position.set(50, -50, 100);
    this.scene.add(this.pointLight);
    */
  }
  
  setupRest() {
    // shadow
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.camera.left = -this.dist;
    this.directionalLight.shadow.camera.right = this.dist;
    this.directionalLight.shadow.camera.top = -this.dist;
    this.directionalLight.shadow.camera.bottom = this.dist;
    
    this.spotLight.castShadow = true;
    this.spotLight.shadow.mapSize.width = 256;
    this.spotLight.shadow.mapSize.height = 256;
    
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
  
  setupShapes() {
    const num = this.gui.params.number;
    
    //const ratio = Math.min(this.width, 1024) / 1024;
    this.scale = this.gui.params.scale;
    
    //this.size = Math.floor(this.scale * Math.sqrt(2) / 2);
    this.size = Math.floor(this.scale);
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2);
    //this.size = Math.floor(scale * 0.4 * 2 * Math.PI / num);
    
    this.maxDist = Number.MIN_VALUE;
    this.shapes = [];

    this.addShape();

    if (num === 1) {
      this.shapes.push(new Shape(this, 0, 0, 0, this.size, this.maxDist, 0, true, ''));
      
      return;
    }

    this.shapes = this.getGrid(num, this.scale, this.size);
  }

  addShape() {
    const geometry = new THREE.BoxGeometry(this.width * 10, 10, this.height * 10, 1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xDDDDDD,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -this.size / 2 - 5, 0);
    mesh.receiveShadow = true;

    this.scene.add(mesh);
  }

  getGrid(num, scale, size) {
    const tmp = [];

    // square
    /*
    let index = 0;
    for (let x = -num; x <= num; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = -num; z <= num; z++) {
          const nx = x * scale;
          const ny = y * scale;
          const nz = z * scale;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          const s = new Shape(this, nx, ny, nz, size, dist, index++, true, others);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // circle
    /*
    let index = 0;
    for (let x = 0; x < 1; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < num; z++) {
          const rad = z / num * Math.PI * 2;
          const nx = Math.cos(rad) * scale;
          const nz = Math.sin(rad) * scale;
          const ny = scale * y;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          const s = new Shape(this, nx, ny, nz, size * 0.1, dist, index++, true, others);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // archimedesSpiral
    /*
    const alpha = 10;
    let index = 0;
    for (let x = 0; x < 1; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < num; z++) {
          let rad = z / num * Math.PI * 2;
          let nextRad;
          if (z === num - 1) {
            nextRad = (z) / num * Math.PI * 2;
          } else {
            nextRad = (z + 1) / num * Math.PI * 2;
          }
          const rScale = z / num * z / num;
          const r = (rad * index) * scale * 0.001;
          const nr = (nextRad * index) * scale * 0.001;
          const nx = Math.cos(rad * alpha) * r;
          const nz = Math.sin(rad * alpha) * r;
          const ny = scale * y;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {
            position: {
              x: Math.cos(nextRad * alpha) * nr,
              z: Math.sin(nextRad * alpha) * nr,
              y: scale * y + 20 * rScale
            }
          };
          const s = new Shape(this, nx, ny + 20 * rScale, nz, 20 * rScale, dist, index++, true, others);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // line
    let index = 0;
    for (let x = -num; x <= num; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < 1; z++) {
          const nx = x * scale;
          const ny = y * scale;
          const nz = z * scale;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          const s = new Shape(this, nx, ny, nz, size, dist, index++, true, others);
          
          tmp.push(s);

          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    
    // stairs
    /*
    let index = 0;
    for (let x = 0; x < 1; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = 0; z < 1; z++) {
          const nx =  x * scale;
          const ny =  y * scale;
          const nz = -y * scale;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          const s = new Shape(this, nx, ny, nz, size, dist, index++, true, others);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // hex:w

    /*
    const vectors = [];
    
    let index = 0;
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
      const nx = Math.sqrt(3) * (vectors[i].x + vectors[i].y / 2) / 2 * size;
      const ny = 3 / 2 * vectors[i].y / 2 * size;
      const nz = 0;
      const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3()) || Number.MIN_VALUE;
      const others = {};
      const s = new Shape(this, nx, ny, nz, size / 2, dist, index++, true, others);
      
      tmp.push(s);
      
      this.maxDist = Math.max(dist, this.maxDist);
    }
    */

    return tmp;
  }
  
  updateEquipments(t) {
    /*
    const noise =
      this.simplex.noise3D(
        this.camera.position.x * 0.001,
        this.camera.position.y * 0.001,
        t
      );
    */

    // camera
    this.camera.position.set(
      Math.cos(t) * this.dist,
      Math.abs(Math.sin(t)) * 100,
      Math.sin(t) * this.dist
    );

    this.camera.lookAt(new THREE.Vector3());
    
    // spotlight
    /* 
    this.spotLight.position.set(
      Math.cos(t) * this.dist,
      200,
      Math.sin(t) * this.dist
    );
    this.spotLight.lookAt(new THREE.Vector3());
    this.pointLight.position.set(
      0,
      Math.cos(t) * 100,
      Math.sin(t) * 100
    );
    this.pointLight.lookAt(new THREE.Vector3());
    */
  }
  
  draw() {
    const t = this.time.getElapsedTime() * this.gui.params.st;
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render();
    }

    this.updateEquipments(t);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

/**
 * shape class
 */
class Shape {
  constructor(sketch, x, y, z, size, dist, index, shadow, others) {
    this.sketch = sketch;

    // times
    this.time = new THREE.Clock(true);
    this.timeNum = 1;
    this.scale = 1;
    
    this.position = new THREE.Vector3(x, y, z);
    this.size = size;
    this.dist = dist;
    this.index = index;
    this.shadow = shadow;
    this.others = others;

    this.initialize();
  }
  
  initialize() {
    // geometry
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size, 1, 1, 1);

    // material
    const material = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      color: 0xFFFFFF
    });
    material.fog = true;
    
    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    this.sketch.scene.add(this.mesh);
  }
  
  render() {
    const t = this.time.getElapsedTime() * this.scale + this.index / this.sketch.shapes.length / 1;
    const IntT = Math.floor(t % this.timeNum);

    let st;
    let moveY = 0, scaleY = 1, rotateY = 0, scaleX = 1;

    switch (IntT) {
      case 0:
        st = this.sketch.easeOutBounce(t % 1);

        if (st < 0.5) {
          moveY = Utilities.map(st, 0, 0.5, 0, Math.abs(Math.sin(t)) * 200);
          scaleY = Utilities.map(st, 0, 0.5, 1, 2);
          scaleX = Utilities.map(st, 0, 0.5, 1, 0.5);
          rotateY = Utilities.map(st, 0, 0.5, 0, Math.PI * 2);
        } else {
          moveY = Utilities.map(st, 0.5, 1, Math.abs(Math.sin(t)) * 200, 0);
          scaleY = Utilities.map(st, 0.5, 1, 2, 1);
          scaleX = Utilities.map(st, 0.5, 1, 0.5, 1);
          rotateY = 0;
        }
        break;
      
      default:
        return;
    }

    this.mesh.position.set(
      this.position.x,
      this.position.y + moveY,
      this.position.z
    );
    this.mesh.scale.set(
      scaleX, scaleY, 1
    );
    this.mesh.rotation.set(
      0, rotateY, 0
    );
  }
}
