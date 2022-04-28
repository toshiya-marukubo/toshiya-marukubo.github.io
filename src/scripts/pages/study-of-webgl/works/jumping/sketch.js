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
    this.renderer.setClearColor('#FBDD0A', 1.0);
    
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
    this.cameraP = new THREE.Vector3(0, this.dist * 0.1, this.dist * 0.01);
    this.camera.position.set(this.cameraP);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);
    this.camera.position.set(
      this.cameraP.x * this.dist,
      Math.max(this.cameraP.y * this.dist, 10),
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
    this.spotLightP = new THREE.Vector3(0, this.dist * 0.005, this.dist);
    this.spotLight.position.set(this.spotLightP);
    this.spotLight.lookAt(new THREE.Vector3());

    this.scene.add(this.spotLight);
  }

  updateLight() {
    this.spotLightV.subVectors(this.mouse.mouse, this.spotLightP).multiplyScalar(0.05);
    this.spotLightP.add(this.spotLightV);

    this.spotLight.position.set(
      this.spotLightP.x * this.dist,
      Math.max(this.spotLightP.y * this.dist, 10),
      this.spotLightP.z * this.dist
    );

    this.spotLight.lookAt(new THREE.Vector3());
  }
  
  setupShape() {
    this.setupSize();

    this.shapes = [];
    this.num = 4;
    
    let index = 0;
    
    for (let x = -this.num; x < this.num; x++) {
      for (let z = -this.num; z < this.num; z++) {
        const tx = this.size * x + this.size / 2;
        const tz = this.size * z + this.size / 2;
        const a = Math.atan2(tz, tx);
        // sketch, x, y, z, size, index
        const s = new Shape(this, tx, -this.size * 2, tz, this.size, this.shapeHeight, index++, a);

        this.shapes.push(s);
      }
    }
    
    // ground
    this.geometry = new THREE.BoxGeometry(this.groundSize, this.groundSize, this.groundSize);
    this.material = new THREE.MeshBasicMaterial({
      color: '#FBDD0A',
      side: THREE.DoubleSide
    });
    this.box = new THREE.Mesh(this.geometry, this.material);
    this.box.position.set(0, -this.groundSize / 2 - this.size * 2, 0);
    this.scene.add(this.box);
  }

  setupSize() {
    this.size = null;
    this.shapeHeight =  null;
    this.groundSize = Math.max(this.width * 5, this.height * 5);

    if (this.width <= 768) {
      this.size = 25;
      this.shapeHeight = 50;
    }
    if (this.width >= 768) {
      this.size = 40;
      this.shapeHeight = 80;
    }
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
  constructor(sketch, x, y, z, size, height, index, a) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.size = size / 2;
    this.index = index;
    this.a = a * 0.5;
    this.height = height;
    this.dist = this.position.distanceTo(new THREE.Vector3());
    
    this.initialize();
  }
  
  initialize() {
    // cylinder mesh
    this.cylinderGeometry = new THREE.CylinderGeometry(this.size, this.size, this.height, 36, 1, false, 0, Math.PI * 2);
    this.cylinderMaterial = new THREE.MeshPhongMaterial(this.getMaterial(this.index));
    this.cylindereMesh = new THREE.Mesh(this.cylinderGeometry, this.cylinderMaterial);
    this.cylindereMesh.position.set(this.position.x, this.position.y, this.position.z);
    
    this.sketch.scene.add(this.cylindereMesh);
    
    // sphere mesh
    this.sphereGeometry = new THREE.SphereGeometry(this.size * 0.9, 32, 32);
    this.sphereMaterial = new THREE.MeshPhongMaterial(this.getMaterial(this.index));
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphereMesh.position.set(this.position.x, this.position.y + this.height / 2, this.position.z);
    
    this.sketch.scene.add(this.sphereMesh);
  }
  
  getMaterial(index) {
    const i = Math.floor(index % 3);
    
    let obj;
    
    if (i === 0) {
      obj = {
        side: THREE.DoubleSide,
        color: '#AAFF00',
        emissive: 0x0,
        specular: 0xffffff,
        shininess: 8
      };
    }
    
    if (i === 1) {
      obj = {
        side: THREE.DoubleSide,
        color: '#FFAA00',
        emissive: 0x0,
        specular: 0xffffff,
        shininess: 8
      };
    }
    
    if (i === 2) {
      obj = {
        side: THREE.DoubleSide,
        color: '#FF00A9',
        emissive: 0x0,
        specular: 0xffffff,
        shininess: 8
      };
    }
    
    return obj;
  }
  
  updateParameters(time) {
    this.cylindereMesh.scale.y = Math.abs(Math.sin(this.dist * 0.005 - this.a - time)) * 2 + 1.5;
    this.sphereMesh.position.y = Math.abs(Math.sin(this.dist * 0.005 - this.a - time)) * this.height * 2.5;
  }
  
  render(time) {
    this.updateParameters(time);
  }
}
