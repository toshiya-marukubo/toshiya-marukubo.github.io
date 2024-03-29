import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Mouse } from '../20230110/mouse';
import { Ease } from '../20230110/ease';
import { Utilities } from '../20230110/utilities';
import { mergeGeometry } from '../20230110/mergeGeometry';

import SimplexNoise from 'simplex-noise';

/*
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
const font = require('three/examples/fonts/helvetiker_bold.typeface.json');
*/

/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    mergeGeometry(THREE);

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
      st: 0.3,
      ease: 'linear',
      number: 2,
      scale: 150,
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

    this.linear = Ease.returnEaseFunc('linear');
    this.ease = Ease.returnEaseFunc(this.gui.params.ease);

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
    this.camera.position.set(0, 0, this.dist);
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
    this.spotLight.position.set(0, this.dist * 0.6, 0);
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
    this.maxDist = Number.MIN_VALUE;
    
    //const ratio = Math.min(this.width, 1024) / 1024;
    this.scale = this.gui.params.scale;
    
    this.size = Math.floor(this.scale);
    //this.size = Math.floor(this.scale * Math.sqrt(2) / 2);
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2);
    //this.size = Math.floor(scale * 0.4 * 2 * Math.PI / num);
    
    const geometry = this.getGeometry(this.size);
    const material = this.getMaterial();

    this.shapes = [];

    //this.addFloor();

    if (num === 1) {
      this.shapes.push(new Shape({
        sketch: this,
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        size: this.size,
        dist: this.maxDist,
        index: 0,
        shadow: true,
        geometry: geometry,
        material: material,
        others: null
      }));
      
      return;
    }

    this.shapes = this.getGrid(num, this.scale, this.size, geometry, material);
  }

  addFloor() {
    const geometry =
      new THREE.BoxGeometry(
        this.frameSize * 10,
        10,
        this.frameSize * 10,
        1,
        1,
        1
      );
    const material = new THREE.MeshPhongMaterial({color: 0xDDDDDD});
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(0, -this.scale * 1.8, 0);
    mesh.receiveShadow = true;

    this.scene.add(mesh);
  }

  getGeometry(size) {
    const lego = [];

    const base = new THREE.BoxGeometry(size, size * 0.5, size * 0.3, 1, 1, 1);
    
    lego.push(base);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const moveX = size * 0.25 * 1.5;
        const moveY = size * 0.25 * 0.5;
        const x = j * size * 0.25 - moveX;
        const y = i * size * 0.25 - moveY;
        const geo = new THREE.CylinderGeometry(size * 0.156 * 0.5, size * 0.156 * 0.5, size * 0.053, 36);

        geo.rotateX(Math.PI / 2);
        geo.translate(x, y, -size * 0.3 * 0.5 - size * 0.053 * 0.5);

        lego.push(geo);
      }
    }

    const geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(lego);

    return geometry;
  }

  getMaterial() {
    const material = new THREE.MeshPhongMaterial({
      //side: THREE.DoubleSide,
      //transparent: true,
      color: 0xFFFFFF
    });
    material.fog = true;
    
    return material;
  }

  getGrid(num, scale, size, geometry, material) {
    const tmp = [];
    
    let index = 0;

    // main shape
    /*
    this.mainShape = new MainShape({
      sketch: this,
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      size: size,
      dist: this.maxDist,
      index: 0,
      shadow: true,
      geometry: null,
      material: null,
      others: null
    });
    */

    // square
    /*
    for (let x = -num; x <= num; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = -num; z <= num; z++) {
          const nx = x * scale;
          const ny = y * scale * 0.3;
          const nz = z * scale * 0.5;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          // sketch, position, size, dist, index, shadow, geometry, material, others
          const params = {
            sketch: this,
            position: {
              x: nx,
              y: ny,
              z: nz
            },
            size: size,
            dist: dist,
            index: index++,
            shadow: true,
            geometry: geometry,
            material: material,
            others: others
          };
          const s = new Shape(params);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // circle
    /*
    for (let x = 0; x < 1; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < num; z++) {
          const rad = z / num * Math.PI * 2;
          const nx = Math.cos(rad) * scale;
          const nz = Math.sin(rad) * scale;
          const ny = scale * y;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          // sketch, position, size, dist, index, shadow, geometry, material, others
          const params = {
            sketch: this,
            position: {
              x: nx,
              y: ny,
              z: nz
            },
            size: size,
            dist: dist,
            index: index++,
            shadow: true,
            geometry: geometry,
            material: material,
            others: others
          };
          const s = new Shape(params);
          
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // line
    for (let x = 0; x < 1; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = 0; z < 1; z++) {
          const nx = x * scale;
          const ny = y * scale * 0.3;
          const nz = z * scale;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          // sketch, position, size, dist, index, shadow, geometry, material, others
          const params = {
            sketch: this,
            position: {
              x: nx,
              y: ny,
              z: nz
            },
            size: size,
            dist: dist,
            index: index++,
            shadow: true,
            geometry: geometry,
            material: material,
            others: others
          };

          const s = new Shape(params);
          
          tmp.push(s);

          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }

    // stairs
    /*
    for (let x = 0; x < 1; x++) {
      for (let y = -num; y <= num; y++) {
        for (let z = 0; z < 1; z++) {
          const nx =  x * scale;
          const ny =  y * scale;
          const nz = -y * scale;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          // sketch, position, size, dist, index, shadow, geometry, material, others
          const params = {
            sketch: this,
            position: {
              x: nx,
              y: ny,
              z: nz
            },
            size: size,
            dist: dist,
            index: index++,
            shadow: true,
            geometry: geometry,
            material: material,
            others: others
          };
          const s = new Shape(params);
          tmp.push(s);
          this.maxDist = Math.max(dist, this.maxDist);
        }
      }
    }
    */

    // hex
    /*
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
      const nx = Math.sqrt(3) * (vectors[i].x + vectors[i].y / 2) / 2 * size;
      const ny = 3 / 2 * vectors[i].y / 2 * size;
      const nz = 0;
      const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
      const others = {};
      // sketch, position, size, dist, index, shadow, geometry, material, others
      const params = {
        sketch: this,
        position: {
          x: nx,
          y: ny,
          z: nz
        },
        size: size,
        dist: dist,
        index: index++,
        shadow: true,
        geometry: geometry,
        material: material,
        others: others
      };
      const s = new Shape(params);
      
      tmp.push(s);
      
      this.maxDist = Math.max(dist, this.maxDist);
    }
    */

    return tmp;
  }
  
  updateEquipments(t) {
    // camera
    this.camera.position.set(
      Math.cos(t) * this.dist,
      Math.abs(Math.sin(t)) * 200,
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
  
    //this.mainShape.render();

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
  // sketch, position, size, dist, index, shadow, geometry, material, others
  constructor(params) {
    // times
    this.time      = new THREE.Clock(true);
    this.timeNum   = 1;
    this.timeScale = 0.8;
    
    // parameters
    this.sketch   = params.sketch;
    this.position = new THREE.Vector3(params.position.x, params.position.y, params.position.z);
    this.size     = params.size;
    this.dist     = params.dist;
    this.index    = params.index;
    this.shadow   = params.shadow;
    this.geometry = params.geometry;
    this.material = params.material;
    this.others   = params.others;

    this.initialize();
  }

  initialize() {
    // mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.rotation.x = Math.PI / 2;

    this.sketch.scene.add(this.mesh);
  }

  getScaledTime(t) {
    // based on index number
    //const scaledTime = t * this.timeScale - this.index / this.sketch.shapes.length / 1;
    // based on mesh distance
    //const scaledTime = t * this.timeScale + this.dist / this.sketch.maxDist / 1;
    // same time
    const scaledTime = t * this.timeScale;

    return scaledTime;
  }
  
  render() {
    const t = this.getScaledTime(this.time.getElapsedTime());
    const intT = Math.floor(t % this.timeNum);

    let st;
    let scale = 1, moveY = 0, rotate = 0;
    switch (intT) {
      case 0:
        st = this.sketch.ease(t % 1);

        moveY = Utilities.map(st, 0, 1, 0, -this.size * 0.3);

        if (this.index === this.sketch.shapes.length - 1) {
          rotate = Utilities.map(st, 0, 1, 0, Math.PI * 2);
          moveY = Utilities.map(st, 0, 1, 500, - this.size * 0.3);
        }

        if (this.index === 0) {
          rotate = Utilities.map(st, 0, 1, 0, Math.PI * 2);
          moveY = Utilities.map(st, 0, 1, 0, -500);
        }

        break;
      
      default:
        return;
    }

    const newV = this.position.clone().add(new THREE.Vector3(0, moveY, 0));

    //this.mesh.scale.set(scale, scale, 1);
    this.mesh.rotation.set(Math.PI / 2, 0, rotate);
    this.mesh.position.set(newV.x, newV.y, newV.z);
  }
}

/**
 * main shape class
 */
 /*
class MainShape extends Shape {
  constructor(params) {
    super(params);
  }
  initialize() {
    const geometry = new THREE.SphereGeometry(this.size / 2, 36);
    const material = new THREE.MeshPhongMaterial({
      //side: THREE.DoubleSide,
      //transparent: true,
      color: 0xffffff
    });
    material.fog = true;
    
    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.sketch.scene.add(this.mesh);
  }
  render() {
    const t = this.getScaledTime(this.time.getElapsedTime());
    const intT = Math.floor(t % this.timeNum);
    let st;
    let move = 0;
    switch (intT) {
      case 0:
        st = this.sketch.linear(t % 1);
        
        if (st < 0.5) {
          move = Utilities.map(st, 0, 0.5, 0, this.size);
        } else {
          move = Utilities.map(st, 0.5, 1, this.size, 0);
        }
        break;
      default:
        return;
    }
    const newV = this.position.clone().add(new THREE.Vector3(0, move, 0));
    this.mesh.position.set(newV.x, newV.y + this.size, newV.z);
  }
}
*/
