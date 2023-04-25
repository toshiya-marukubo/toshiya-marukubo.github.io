import * as THREE from 'three';
import {Mouse} from '../20230128/mouse';
import { vertexShaderForSphere,
         fragmentShaderForSphere,
         vertexShaderForFloor,
         fragmentShaderForFloor,
       } from './shaders';

/**
 * class Sketch
 */
export class Sketch {
  constructor() {
    this.createCanvas();
    this.setupEvents();
    this.time = new THREE.Clock(true);
    this.mouse = new Mouse(this, THREE);
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
    //this.setupLight();
    this.setupShape();

    this.draw();
  }

  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor('#FAFAFA', 1.0);

    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex =  '-1';
    this.renderer.domElement.style.outline = 'none';
    this.renderer.domElement.style.background = '#FAFAFA';
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

    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3(0, this.dist * 0.02, this.dist * 0);

    this.camera.position.set(this.cameraP.x, this.cameraP.y, this.cameraP.z);
    this.camera.lookAt(new THREE.Vector3());

    this.scene.add(this.camera);
  }

  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);
    this.camera.position.set(
      this.cameraP.x * this.dist,
      Math.max(this.cameraP.y * 150, 0),
      this.cameraP.z * this.dist
    );
    this.camera.lookAt(new THREE.Vector3());
  }

  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xffffff);

    this.spotLightV = new THREE.Vector3();
    this.spotLightP = new THREE.Vector3(0, 0, this.dist * 0.1);

    this.spotLight.position.set(this.spotLightP.x, this.spotLightP.y, this.spotLightP.z);
    this.spotLight.lookAt(new THREE.Vector3());

    this.scene.add(this.spotLight);
  }

  setupShape() {
    this.shape = new Shape(this, 0, 0, 0);
  }

  draw() {
    const time = this.time.getElapsedTime();

    this.shape.render(time * 0.1);

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
    this.beta = 0;
    this.position = new THREE.Vector3(x, y, z);

    this.setupSizes();
    this.initialize();
  }

  setupSizes() {
    const ratio = Math.min(this.sketch.width, 1024) / 1024;
    
    this.sphereSize = Math.floor(200 * ratio);
    this.floorSize = Math.max(this.sketch.width * 2, this.sketch.height * 2);
  }

  initialize() {
    this.createTexture();

    //floor
    this.floorGeometry = new THREE.PlaneGeometry(this.floorSize, this.floorSize, 128, 128);
    this.floorMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        mouse: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexShaderForFloor,
      fragmentShader: fragmentShaderForFloor
    });

    this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floorMesh.position.set(0, -this.sketch.height / 3, 0);
    this.floorMesh.rotation.x = Math.PI / 2;

    this.sketch.scene.add(this.floorMesh);

    // sphere
    this.sphereGeometry = new THREE.SphereGeometry(this.sphereSize, 64, 64);
    this.sphereMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        mouse: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexShaderForSphere,
      fragmentShader: fragmentShaderForSphere
    });

    this.sphereMeshV = new THREE.Vector3();
    this.sphereMeshP = new THREE.Vector3(0, -2000, 0);

    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphereMesh.position.set(this.sphereMeshP.x, this.sphereMeshP.y, this.sphereMeshP.z);

    this.sphereMesh.rotation.y = -Math.PI / 2;
    this.sketch.scene.add(this.sphereMesh);
  }

  createTexture() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.length = 128;

    this.canvas.width = this.length;
    this.canvas.height = this.length;

    this.plasma = new Plasma(this.ctx, this.length, this.length);

    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  returnTexture() {
    return this.texture;
  }

  updateTexture(time) {
    this.plasma.render(time * 10);
  }

  render(time) {
    this.sphereMeshV.subVectors(new THREE.Vector3(), this.sphereMeshP).multiplyScalar(0.05);
    this.sphereMeshP.add(this.sphereMeshV);
    this.sphereMesh.position.set(this.sphereMeshP.x, this.sphereMeshP.y, this.sphereMeshP.z);

    this.beta -= (this.beta - this.sketch.mouse.speed) * 0.05;
    this.sketch.mouse.speed *= 0.99;

    this.texture.needsUpdate = true; // important
    this.updateTexture(time);

    this.sphereMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.mouse.value = this.beta;
    this.floorMesh.material.uniforms.uTime.value = time;
    this.floorMesh.material.uniforms.mouse.value = this.beta;
  }
}

// Reference
// https://towardsdatascience.com/fun-with-html-canvas-lets-make-lava-lamp-plasma-e4b0d89fe778
// Thank you so much.
class Plasma {
  constructor(ctx, s) {
    this.ctx = ctx;
    this.size = s;
    this.mapSize = this.size * 2;

    this.initialize();
  }

  initialize() {
    this.prevDirection = 1;
    this.dx1 = 0;
    this.dy1 = 0;
    this.dx2 = 0;
    this.dy2 = 0;
    this.heightMap1 = [];
    this.heightMap2 = [];
    this.palette = [];
    this.palettes = [this.makeRandomPalette(), this.makeRandomPalette()];
    this.image = this.ctx.createImageData(this.size, this.size);

    this.getImageData();
    this.getHeightMap();
  }

  getImageData() {
    for (let i = 0; i < this.image.data.length; i += 4) {
      this.image.data[i + 0] = 0;
      this.image.data[i + 1] = 0;
      this.image.data[i + 2] = 0;
      this.image.data[i + 3] = 255;
    }
  }

  distance(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  randomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return {r, g, b}
  }

  updatePalette(time) {
    const inter = (Math.cos(time) + 1) / 2;
    const direction = Math.sin(time) >= 0 ? -1 : 1;

    if (this.prevDirection != direction) {
      this.prevDirection = direction;
      if (direction == -1) {
        this.palettes[0] = this.makeRandomPalette();
      } else {
        this.palettes[1] = this.makeRandomPalette();
      }
    }

    for (let i = 0; i < 256; i++) {
      this.palette[i] = this.interpolate(this.palettes[0][i], this.palettes[1][i], inter);
    }
  }

  makeRandomPalette() {
    const c1 = this.randomColor();
    const c2 = this.randomColor();
    const c3 = this.randomColor();
    const c4 = this.randomColor();
    const c5 = this.randomColor();

    return this.makeFiveColorGradient(c1, c2, c3, c4, c5);
  }

  interpolate(c1, c2, f) {
    return {
      r: Math.floor(c1.r + (c2.r - c1.r) * f),
      g: Math.floor(c1.g + (c2.g - c1.g) * f),
      b: Math.floor(c1.b + (c2.b - c1.b) * f)
    };
  }

  makeFiveColorGradient(c1, c2, c3, c4, c5) {
    const g = [];

      for (let i = 0; i < 64; i++) {
        const f = i / 64;

        g[i] = this.interpolate(c1, c2, f);
      }
      for (let i = 64; i < 128; i++) {
        const f = (i - 64) / 64;

        g[i] = this.interpolate(c2, c3, f);
      }
      for (let i = 128; i < 192; i++) {
        const f = (i - 128) / 64;

        g[i] = this.interpolate(c3, c4, f);
      }
      for (let i = 192; i < 256; i++) {
        const f = (i - 192) / 64;

        g[i] = this.interpolate(c4, c5, f);
      }

      return g;
  }

  getHeightMap() {
    for (let x = 0; x < this.mapSize; x++) {
      for (let y = 0; y < this.mapSize; y++) {
        const i  = x * this.mapSize + y;
        const cx = x - this.mapSize / 2;
        const cy = y - this.mapSize / 2;
        const d  = this.distance(cx, cy);
        const s  = (Math.PI * 2) / (this.mapSize / 2);
        const r  = Math.sin(d * s);
        const n  = (r + 1) / 2;

        this.heightMap1[i] = Math.floor(n * 128);
      }
    }

    for (let x = 0; x < this.mapSize; x++) {
      for (let y = 0; y < this.mapSize; y++) {
        const i  = x * this.mapSize + y;
        const cx = x - this.mapSize / 2;
        const cy = y - this.mapSize / 2;
        const d1 = this.distance(cx, cy) * 0.1;
        const d2 = this.distance(cx, cy) * 0.02;
        const s  = Math.sin(d1);
        const c  = Math.cos(d2);
        const h  = s + c;
        const n  = (h + 2) / 4;

        this.heightMap2[i] = Math.floor(n * 127);
      }
    }
  }

  moveHeightMap(time) {
    this.dx1 = Math.floor(
      (((Math.cos(time * 0.5) + 1) / 2) * this.mapSize) / 2
    );
    this.dy1 = Math.floor(
      (((Math.sin(time * 0.2) + 1) / 2) * this.mapSize) / 2
    );
    this.dx2 = Math.floor(
      (((Math.cos(time * 0.3) + 1) / 2) * this.mapSize) / 2
    );
    this.dy2 = Math.floor(
      (((Math.sin(time * 0.4) + 1) / 2) * this.mapSize) / 2
    );
  }

  updateImageData() {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        const i = (x + this.dy1) * this.mapSize + (y + this.dx1);
        const k = (x + this.dy2) * this.mapSize + (y + this.dx2);
        const j = x * this.size * 4 + y * 4;
        const h = this.heightMap1[i] + this.heightMap2[k];
        const c = this.palette[h];

        this.image.data[j] = c.r;
        this.image.data[j + 1] = c.g;
        this.image.data[j + 2] = c.b;
      }
    }
  }

  drawImageData() {
    this.ctx.putImageData(this.image, 0, 0);
  }

  render(time) {
    this.ctx.clearRect(0, 0, this.size, this.size);
    this.moveHeightMap(time);
    this.updatePalette(time * 2);
    this.updateImageData();
    this.drawImageData();
  }
}
