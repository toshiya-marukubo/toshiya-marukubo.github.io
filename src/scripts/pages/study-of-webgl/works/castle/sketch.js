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

    this.shape.onResize();

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
      Math.max(this.cameraP.y * this.dist, -150),
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
    this.spotLightV = new THREE.Vector3();
    this.spotLightP = new THREE.Vector3(0, this.dist * 0.1, this.dist * 0.01);
    this.spotLight.position.set(this.spotLightP);
    this.spotLight.lookAt(new THREE.Vector3());
    this.scene.add(this.spotLight);
  }

  updateLight() {
    this.spotLightV.subVectors(this.mouse.mouse, this.spotLightP).multiplyScalar(0.05);
    this.spotLightP.add(this.spotLightV);

    this.spotLight.position.set(
      this.spotLightP.x * this.dist,
      this.spotLightP.y * this.dist,
      this.spotLightP.z * this.dist * (1.0 + this.mouse.delta)
    );

    this.spotLight.lookAt(new THREE.Vector3());
  }
  
  setupShape() {
    this.shape = new Shape(this, 0, 0, 0);
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    this.shape.render(time * 0.1);

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
  constructor(sketch) {
    this.sketch = sketch;
    
    this.depth = 5;
    this.length = 15;
    this.angle = 0;
    this.radian = 0;
    this.startX = 0 - this.length * 31 / 2;
    this.startY = 0 - this.length * 31 / 2;
    this.height = 100;
    this.pos = [];
    this.timeoutArray = [];
    
    this.fractal(90, this.depth);
    this.init();
  }
  
  getCoordinate() {
    const rad = this.angle * Math.PI / 180;
    const nx = Math.cos(rad) * this.length + this.startX;
    const ny = Math.sin(rad) * this.length + this.startY;
    const dist = Math.sqrt(nx * nx + ny * ny) * 0.01;

    this.pos.push([this.startX, this.startY, nx, ny, dist]);
    this.startX = nx;
    this.startY = ny;
  }
  
  turn(increaseNumber) {
    this.angle += increaseNumber;
  };
  
  fractal(angle, depth) {
    if (depth > 0) {
      this.turn(angle);
      this.fractal(-angle, depth - 1);
      this.getCoordinate(this.length);
      this.turn(-angle);
      this.fractal(angle, depth - 1);
      this.getCoordinate(this.length);
      this.fractal(angle, depth - 1);
      this.turn(-angle);
      this.getCoordinate(this.length);
      this.fractal(-angle, depth - 1);
      this.turn(angle);
    }
  };
  
  init() {
    // floor
    this.floorGeometry = new THREE.PlaneGeometry(this.length * 32, this.length * 32);
    this.floorMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, color: 0xffffff});
    this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floor.rotation.set(90 * Math.PI / 180, 0, 0);
    this.sketch.scene.add(this.floor);

    // wall
    this.wallMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      color: 0xffffff
    });
    
    for (let i = 0; i < this.pos.length; i++) {
      this.timeoutId = setTimeout(() => {
        const x = this.pos[i][0] - this.pos[i][2];
        const z = this.pos[i][1] - this.pos[i][3];

        this.wallGeometry =
          new THREE.BoxGeometry(
            x + 2,
            this.height / this.pos[i][4],
            z + 2
          );
        this.mesh = new THREE.Mesh(this.wallGeometry, this.wallMaterial);
        this.mesh.position.set(
          this.pos[i][0] - x / 2,
          0 + this.height / this.pos[i][4] / 2,
          this.pos[i][1] - z / 2
        );
        this.sketch.scene.add(this.mesh);
      }, i * 20);
      
      this.timeoutArray.push(this.timeoutId);
    }
  }
  
  onResize() {
    for (var i = 0; i < this.timeoutArray.length; i++) {
      clearInterval(this.timeoutArray[i]);
    }
  }
  
  render(time) {
    this.sketch.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        const dist = obj.position.distanceTo(new THREE.Vector3()) * 0.1;
        
        obj.material.color.setHSL(Math.abs(Math.sin(time)), 0.8, 0.6);
      }
    });
  }
}
