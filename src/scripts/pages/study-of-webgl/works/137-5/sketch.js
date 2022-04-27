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
    this.renderer.setPixelRatio(window.devicePixelRatio);
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
        this.dist * 10
      );
    
    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3(0, 0, this.dist * 0.1);
    this.camera.position.set(this.cameraP.x, this.cameraP.y, this.cameraP.z);
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
    this.pointLight = new THREE.PointLight(0xffffff, 1, this.dist);
    this.pointLight.position.set(0, this.dist, 0);
    this.scene.add(this.pointLight);
  }
  
  setupShape() {
    this.shape = new Shape(this, 0, 0, 0);
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    this.shape.render(time * 2);

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

    this.setupSizes();
    this.initialize();
  }

  setupSizes() {
    const ratio = Math.min(this.sketch.width, 1024) / 1024;

    this.radius = Math.floor(Math.min(15 * ratio, 10));
    this.size = this.radius / 5;
  }

  initialize() {
    for (let i = 0; i < 130; i++) {
      const rad = 137.5 * Math.PI / 180 * i;
      const x = Math.cos(rad) * this.radius;
      const z = Math.sin(rad) * this.radius;
      
      this.material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: new THREE.Color(`hsl(${360 / 8 * i}, 90%, 90%)`)
      });
      this.geometry = new THREE.SphereGeometry(this.size, 32, 32);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.mesh.position.set(x, (0 + this.size), z);
      this.sketch.scene.add(this.mesh);

      this.radius /= 0.9745;
      this.size /= 0.9745;
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

