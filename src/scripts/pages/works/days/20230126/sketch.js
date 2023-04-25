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

    this.initialize();
  }
  
  setupGUI() {
    this.gui = new dat.GUI();

    this.gui.params = {
      st: 1,
      ease: 'easeInCubic',
      number: 7,
      scale: 60,
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

  setupSizes() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    //const ratio = Math.min(this.width, 1024) / 1024;
    this.scale = this.gui.params.scale;
    
    // size
    //this.size = Math.floor(this.scale * Math.sqrt(2));
    this.size = Math.floor(this.scale); // square
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2); // hex
    //this.size = Math.floor(scale * 0.4 * 2 * Math.PI / num); // circle
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
  
  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.ease = Ease.returnEaseFunc(this.gui.params.ease);

    this.scene = new THREE.Scene();
    
    this.setupSizes();
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
    this.spotLight.shadow.mapSize.width = 256;
    this.spotLight.shadow.mapSize.height = 256;
    
    this.scene.fog = new THREE.Fog(0xFFFFFF, 0, this.dist * 1.5);
    
    if (this.devMode) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      const cameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.scene.add(cameraHelper);
      
      const axesHelper = new THREE.AxesHelper(10000);
      this.scene.add(axesHelper);

      this.gui.open();
    }
  }
  
  setupCamera() {
    const fov = 50;
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
    const noise = this.simplex.noise3D(this.camera.position.x * 0.001, this.camera.position.y * 0.001, t);
    
    this.camera.lookAt(new THREE.Vector3(
      0,
      10 * noise,
      0
    ));
    
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
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.directionalLight.position.set(0, this.dist, 0);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xFFFFFF, 1.0);
    this.spotLight.position.set(this.dist, this.dist, 0);
    this.spotLight.lookAt(new THREE.Vector3());
    this.scene.add(this.spotLight);

    //this.pointLight = new THREE.PointLight(0xFFFFFF, 5, 200, 1);
    //this.pointLight.position.set(50, -50, 100);

    //this.scene.add(this.pointLight);
  }

  setupShape() {
    const num = this.gui.params.number;
    this.maxDist = 0.0001;
    this.shapes = [];
    this.setupSizes();

    this.addFloor();

    if (num === 1) {
      this.shapes.push(new Shape(this, 0, 0, 0, this.size, 0.0001, 0, false));
      this.maxDist = 0.0001;
      
      return;
    }

    this.shapes = this.getGrid(num, this.scale, this.size);
  }

  addFloor() {
    const floorSize = Math.max(this.width * 10, this.height * 10);
    const geometry = new THREE.CylinderGeometry(this.width, this.width, this.height, 64, 1);
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(-this.width * 1.2, 0, 0);
    mesh.receiveShadow = true;

    this.scene.add(mesh);
  }

  getGrid(num, scale, size) {
    const tmp = [];

    let index = 0;
    for (let x = 0; x < 1; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = 0; z < 1; z++) {
          const nx = scale * x;
          const ny = scale * y;
          const nz = scale * -y;
          const d = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const s = new Shape(this, nx, ny, nz, size, d, index++, true);

          tmp.push(s);

          this.maxDist = Math.max(d, this.maxDist);
        }
      }
    }

    return tmp;
  }
  
  draw() {
    const t = this.time.getElapsedTime() * this.gui.params.st;
    
    for (let i = 0; i < this.shapes.length; i++) {
      //const st = this.ease((t - (this.shapes[i].dist / this.maxDist / 1)) % 1);
      //const st = this.ease((t - (i / this.shapes.length / 1)) % 1);
      const st = this.ease(t % 1);
      this.shapes[i].render(t, st);
    }

    this.updateCamera(t);
    
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
    this.size = s;
    this.dist = d;
    this.index = i;
    this.shadow = shadow;
    
    this.initialize();
  }
  
  initialize() {
    // geometry
    const geometry = new THREE.BoxGeometry(this.size * 8, this.size, this.size, 1, 1, 1);

    // material
    const material = new THREE.MeshPhongMaterial({
      //blending: THREE.AdditiveBlending,
      //transparent: true,
      side: THREE.DoubleSide,
      color: 0xFFFFFF
    });
    material.fog = true;
    
    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.sketch.scene.add(this.mesh);
  }
  
  render(t, st) {
    let moveX = 0, moveY = 0, moveZ = 0;
    
    moveY = Utilities.map(st, 0, 1.0, 0, -this.size);
    moveZ = Utilities.map(st, 0, 1.0, 0, this.size);
    
    this.mesh.position.set(this.position.x, this.position.y + moveY, this.position.z + moveZ);
  }
}
