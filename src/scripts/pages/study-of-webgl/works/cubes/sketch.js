import * as THREE from 'three';
import {Mouse} from '../../modules/mouse';

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
    this.setupLight();
    this.setupShape();
    
    this.draw();
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio / 2);
    this.renderer.setClearColor('#089DA0', 1.0);
    
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
    this.cameraP = new THREE.Vector3(0, 0, this.dist * 0.01);
    this.camera.position.set(this.cameraP);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);
    this.camera.position.set(
      this.cameraP.x * this.dist,
      this.cameraP.y * this.dist,
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
    this.spotLightP = new THREE.Vector3(0, 0, this.dist * 0.01);
    this.spotLight.position.set(this.spotLightP);
    this.spotLight.lookAt(new THREE.Vector3());
    
    this.scene.add(this.spotLight);
  }

  updateLight(time) {
    this.spotLightV.subVectors(this.mouse.mouse, this.spotLightP).multiplyScalar(0.05);
    this.spotLightP.add(this.spotLightV);

    this.spotLight.position.set(
      this.spotLightP.x * this.dist,
      this.spotLightP.y * this.dist,
      this.spotLightP.z * this.dist
    );

    this.spotLight.lookAt(new THREE.Vector3());
  }
  
  setupShape() {
    this.setupSizes();

    this.shapes = new Array();
    this.num = 4;
    
    let index = 0;
    
    for (let y = -this.num; y < this.num; y++) {
      for (let x = -this.num; x < this.num; x++) {
        for (let z = -this.num; z < this.num; z++) {
          const tx = this.size * x + this.size / 2;
          const ty = this.size * y + this.size / 2;
          const tz = this.size * z + this.size / 2;
          const a = Math.atan2(x, y);
          // sketch, x, y, z, size, index
          const s = new Shape(this, tx, ty, tz, this.size, a, index++);
          
          this.shapes.push(s);
        }
      }
    }
  }

  setupSizes() {
    const ratio = Math.min(this.width, 1024) / 1024;

    this.size = Math.floor(Math.max(30 * ratio, 20));
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(time);
    }

    this.updateCamera(time);
    this.updateLight(time);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

/**
 * shape class
 */
class Shape {
  constructor(sketch, x, y, z, size, a, index) {
    this.sketch = sketch;
    this.size = size;
    this.a = a * 0.1;
    this.index = index;
    this.color = new THREE.Color(`hsl(${360 * Math.random()}, 80%, 60%)`); 
    this.position = new THREE.Vector3(x, y, z);
    
    this.initialize();
  }
  
  initialize() {
    this.vector = new THREE.Vector3(0, 0, 0);
    
    this.dist = this.position.distanceTo(new THREE.Vector3());
    
    // mesh
    this.boxGeometry = new THREE.BoxGeometry(this.size, this.size, this.size);
    this.boxMaterial = new THREE.MeshPhongMaterial({
      color: this.color
    });
    this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    this.boxMesh.position.set(this.position.x, this.position.y, this.position.z);
    
    this.sketch.scene.add(this.boxMesh);
  }
  
  updatePosition(time) {
    let v, s = 1;
    
    s = this.scaling(this.index * this.a * 0.01 - time - this.dist * 0.001, 0.05, 1.0, 1.0 / 4.0) * 0.3 + 1.0;
    v = this.position.clone().multiplyScalar(s);
    
    if (Math.sin(time) > 0) {
      this.boxMesh.position.set(Math.abs(Math.sin(time)) * v.x + v.x, v.y, v.z);
    } else {
      this.boxMesh.position.set(v.x, v.y, v.z);
    }
    
    this.boxMesh.scale.set(s, s, s);
  }
  
  scaling(t, d, a, f) {
    return ((2.0 * a) / Math.PI) * Math.atan(Math.sin(2.0 * Math.PI * t * f) / d);
  }
  
  render(time) {
    this.updatePosition(time);
  }
}
