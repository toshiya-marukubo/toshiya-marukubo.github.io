import * as THREE from 'three';
import {CellAutomaton} from './CellAutomaton';
import {Mouse} from '../modules/mouse';
import { vertexShaderForSphere,
         fragmentShaderForSphere,
         vertexShaderForGround,
         vertexShaderForRain,
         fragmentShaderForRain
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
    if (this.preWidth === window.innerWidth) {
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
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(1.0);
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
        this.dist * 10
      );
    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3(0, this.dist * 0.01, this.dist * 0.005);
    this.camera.position.set(this.cameraP);
    this.camera.lookAt(new THREE.Vector3());

    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);
    this.camera.position.set(
      this.cameraP.x * this.dist,
      Math.max(this.cameraP.y * 150, 0),
      this.cameraP.z * this.dist * (1.0 + this.mouse.delta)
    );
    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.position.set(this.dist, this.dist, this.dist);
    this.scene.add(this.spotLight);
  }

  setupShape() {
    this.setupSizes();

    this.shapes = [];
    
    for (let i = 0; i < 1; i++) {
      const s = new Shape(this, 0, 0, 0, this.sphereSize, this.rainNumber, this.groundSize);
      this.shapes.push(s);
    }
  }
  
  setupSizes() {
    const ratio = Math.min(this.width, 1024) / 1024;
    
    this.sphereSize = Math.floor(200 * ratio);
    this.rainNumber = Math.floor(20000 * ratio);
    this.groundSize = Math.max(this.width * 2, this.height * 2);
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
  constructor(sketch, x, y, z, s, n, g) {
    this.sketch = sketch;
    this.sphereSize = s;
    this.rainNumber = n;
    this.groundSize = g;
    this.position = new THREE.Vector3(x, y, z);
    
    this.beta = 0;

    this.initialize();
  }
  
  initialize() {
    this.createTexture();
    
    // sphere 
    this.sphereGeometry = new THREE.SphereGeometry(this.sphereSize, 16, 16);
    this.sphereMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uMouseSpeed: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexShaderForSphere,
      fragmentShader: fragmentShaderForSphere
    });
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphereMesh.position.set(this.position.x, this.position.y, this.position.z);
    
    this.sketch.scene.add(this.sphereMesh);
    
    // rain
    this.rainGeometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.rainNumber * 3);
    this.numbers = new Float32Array(this.rainNumber);
    
    for (let i = 0; i < this.rainNumber * 3; i++) {
      this.vertices[i * 3 + 0] = Math.random() * this.sketch.width - this.sketch.width / 2;
      this.vertices[i * 3 + 1] = Math.random() * this.sketch.height - this.sketch.height / 2;
      this.vertices[i * 3 + 2] = Math.random() * this.sketch.dist - this.sketch.dist / 2;
    }
    
    for (let i = 0; i < this.rainNumber; i++) {
      this.numbers[i] = Math.random();
    }
    
    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.rainGeometry.setAttribute('number', new THREE.BufferAttribute(this.numbers, 1));
    
    this.rainMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexShaderForRain,
      fragmentShader: fragmentShaderForRain
    });
    
    this.rain = new THREE.Points(this.rainGeometry, this.rainMaterial);
    
    this.sketch.scene.add(this.rain);
    
    // ground
    this.groundGeometry = new THREE.PlaneGeometry(this.groundSize, this.groundSize, 32, 32);
    this.groundMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexShaderForGround,
      fragmentShader: fragmentShaderForSphere
    });
    this.groundMesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
    this.groundMesh.rotation.x = -90 * Math.PI / 180;
    this.groundMesh.position.y = -this.sphereSize;
    
    this.sketch.scene.add(this.groundMesh);
  }
  
  createTexture() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    const length = 256;
    
    this.canvas.width = length;
    this.canvas.height = length;
    
    this.CA = new CellAutomaton(this.ctx, length, length);
    
    this.texture = new THREE.CanvasTexture(this.canvas);
  }
  
  returnTexture() {
    return this.texture;
  }
  
  updateTexture(time) {
    this.CA.render();
  }
  
  render(time) {
    this.texture.needsUpdate = true; // important
    this.updateTexture(time);

    this.beta -= (this.beta - this.sketch.mouse.speed) * 0.01;
    this.sketch.mouse.speed *= 0.9;
    
    this.rain.material.uniforms.uTime.value = time;
    this.groundMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.uMouseSpeed.value = this.beta;

    const scale = 1 - this.sketch.mouse.delta;

    this.groundMesh.scale.set(scale, scale, scale);
    this.rainGeometry.setDrawRange(0, Math.max(this.rainNumber * scale, 1000));
  }
}
