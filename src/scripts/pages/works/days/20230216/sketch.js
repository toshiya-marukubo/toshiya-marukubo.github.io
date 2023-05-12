import GUI from 'lil-gui';
import SimplexNoise from 'simplex-noise';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Stopwatch } from '../template-from-20230215/stopwatch';
import { AnimationTimer } from '../template-from-20230215/animation-timer';
import { Easings } from '../template-from-20230215/easings';
import { Utilities } from '../template-from-20230215/utilities';
import { Points } from '../template-from-20230215/points';
import { Grid } from '../template-from-20230215/grid';
import { vertexShader, fragmentShader } from './shaders';


export class Sketch {
  constructor(data) {
    this.devMode = false;
    this.setupGUI();
    this.simplex = new SimplexNoise();
    this.createCanvas();
    this.setupEvents();
    
    this.initialize();
  }

  setupGUI() {
    this.gui = new GUI();
    
    this.obj = {
      num: 2,
      ease: 'easeInOutExpo',
      gridScale: 300
    };

    this.gui.add(this.obj, 'num', 1, 5, 1).onChange(() => {
      this.initialize();
    });

    this.gui.add(this.obj, 'ease', Easings.returnEaseType()).onChange(() => {
      this.initialize();
    });

    this.gui.add(this.obj, 'gridScale', 0, 1000, 1).onChange(() => {
      this.initialize();
    });

    this.gui.hide();
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
    const d = document;
    
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onResize() {
    if (this.preWidth === window.innerWidth) {
      this.height = this.canvas.height = window.innerHeight;
      
      return;
    }
    
    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.scene = new THREE.Scene();

    this.setupSizes();
    this.setupCanvas();
    this.setupCamera();
    this.setupLights();
    this.setupShapes();
    this.setupRest();
    
    this.time = new THREE.Clock(true);

    this.easeInOutExpo = Easings.returnEaseFunc('easeInOutExpo');
    this.linear = Easings.returnEaseFunc('linear');
    
    this.render(0);
  }
  
  setupSizes() {
    this.width = this.preWidth = window.innerWidth;
    this.height = this.preHeight = window.innerHeight;
  }

  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 1.0);

    this.renderer.domElement.style.outline    = 'none';
    this.renderer.domElement.style.position   = 'fixed';
    this.renderer.domElement.style.top        = '0';
    this.renderer.domElement.style.left       = '0';
    this.renderer.domElement.style.background = '#000000';
    this.renderer.domElement.style.zIndex     = '-1';
  }

  setupCamera() {
    const fov = 80;
    const fovRadian = (fov / 2) * (Math.PI / 180);

    this.dist = this.height / 2 / Math.tan(fovRadian);

    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        1,
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
    this.spotLight.position.set(0, this.dist * 2, 0);
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

    this.scene.fog = new THREE.Fog(0x000000, 0, this.dist * 2);

    if (this.devMode) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      const cameraHelper = new THREE.CameraHelper(this.spotLight.shadow.camera);
      this.scene.add(cameraHelper);

      const axesHelper = new THREE.AxesHelper(10000);
      this.scene.add(axesHelper);

      this.gui.open();
    }

    this.beta = 0;
    this.easeInOutQuint = Easings.returnEaseFunc('easeInOutQuint');
    this.duration = 1000;
    this.animationTimer = new AnimationTimer(new Stopwatch(), this.duration, this.easeInOutQuint);
    this.animationTimer.start();
  }

  setupShapes() {
    this.num = this.obj.num;
    
    this.gridScale = this.obj.gridScale;
    //this.size = Math.floor(this.gridScale * Math.sqrt(2) / 2);
    this.size = Math.floor(this.gridScale / 2);
    //this.size = Math.floor(Math.sqrt(3) * this.scale / 2 / 2);
    
    const geometry = this.getGeometry(this.size);
    const material = this.getMaterial();

    this.maxDist = Number.MIN_VALUE;
    this.shapes = [];

    this.addShape();
    //this.addPanel();

    if (this.num === 1) {
      const others = {};
      const params = {
        sketch: this,
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        size: this.size,
        dist: 0,
        index: 0,
        shadow: true,
        geometry: geometry,
        material: material,
        others: others
      };
      
      this.shapes.push(new Shape(params));
      
      return;
    }

    this.shapes = this.getGrid(this.num, this.gridScale, this.size, geometry, material);
  }

  getGeometry(size) {
    const geometry = new THREE.BoxGeometry(size, size * 5, size);

    return geometry;
  }

  getMaterial() {
    const texture = new CreateTexture(this, this.size * 4, this.size * 40).getTexture();
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.width, this.height)
        },
        uTime: { type: 'f', value: 0 },
        uMouse: { type: 'f', value: 0 },
        uTexture: { type: 't', value: texture },
        uMeshSizes: { type: 'v2', value: new THREE.Vector2(this.size, this.size) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    return material;
  }

  addShape() {
    const texture = new CreateTexture(this, this.size * 4, this.size * 40).getTexture();
    const geometry = new THREE.BoxGeometry(this.size, this.size * 5, 10, 1, 1, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: {
          value: new THREE.Vector2(this.width, this.height)
        },
        uTime: { type: 'f', value: 0 },
        uMouse: { type: 'f', value: 0 },
        uTexture: { type: 't', value: texture },
        uMeshSizes: { type: 'v2', value: new THREE.Vector2(this.size, this.size) }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.floor = new THREE.Mesh(geometry, material);
    
    this.floor.position.set(0, -this.size * 1.5, 0);
    this.floor.rotation.x = Math.PI / 2;
    this.floor.rotation.z = Math.PI;
    this.floor.receiveShadow = true;

    this.floor.scale.x = 2;
    this.floor.scale.y = 10;

    this.scene.add(this.floor);
  }

  getGrid(num, scale, size, geometry, material) {
    const tmp = [];
    
    let index = 0;
    let xIndex = 0;
    let yIndex = 0;
    let zIndex = 0;
    
    for (let x = -3; x <= 3; x++) {
      if (x === 0) continue;
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < 14; z++) {
          const nx = x * scale;
          const ny = y * scale;
          const nz = z * scale;

          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {};
          // sketch, position, size, dist, index, shadow, geometry, material, others
          const params = {
            sketch: this,
            scale: Utilities.randomRange(0.5, 2),
            position: {
              x: nx,
              y: ny,
              z: nz
            },
            size: size,
            dist: dist,
            indexes: {
              i: index++,
              x: x,
              y: yIndex++,
              z: z
            },
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
    
    return tmp;
  }

  updateEquipments(t) {
    // camera
    /*
    this.camera.position.set(
      Math.cos(t) * this.dist,
      Math.abs(Math.sin(t)) * 100,
      Math.sin(t) * this.dist
    );
    */

    const intT = Math.floor(t % 8);

    if (t > 8) {
      const noise = this.simplex.noise3D(this.camera.position.x * 0.001, this.camera.position.y * 0.001, t);

      this.camera.lookAt(new THREE.Vector3(
        20 * Math.sin(t) * noise,
        20 * noise,
        20 * Math.cos(t) * noise
      ));
      
      return;
    }

    //const delay = 0;
    //const elapsedTime = this.animationTimer.getElapsedTime(delay) / this.duration;

    let st, alpha, beta, gamma, delta;
    switch (intT) {
      case 0:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 0;
        beta = 0;
        gamma = 0;
        delta = 0;

        break;

      case 1:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 0;
        beta = 0;
        gamma = 0;
        delta = 0;

        break;

      case 2:
        st = this.easeInOutExpo(t % 1);
        
        alpha = Utilities.map(st, 0, 1, 0, 1);
        beta = 0;
        gamma = 0;
        delta = 0;

        break;

      case 3:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 1;
        beta = Utilities.map(st, 0, 1, 0, 1);
        gamma = 0;
        delta = 0;

        break;

      case 4:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 1;
        beta = 1;
        gamma = Utilities.map(st, 0, 1, 0, Math.PI);
        delta = 1;

        break;
      
      case 5:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 1;
        beta = 1;
        gamma = Utilities.map(st, 0, 1, Math.PI, Math.PI * 2);
        delta = 1;

        break;

      case 6:
        st = this.easeInOutExpo(t % 1);
        
        alpha = Utilities.map(st, 0, 1, 1, 0);
        beta = 1;
        gamma = Math.PI * 2;
        delta = 0;

        break;
      
      case 7:
        st = this.easeInOutExpo(t % 1);
        
        alpha = 0;
        beta = Utilities.map(st, 0, 1, 1, 0.5);
        gamma = Math.PI * 2;
        delta = 0;

        break;
      
      default:

        return;

        break;
    }

    this.camera.position.set(
      Math.sin(gamma) * this.dist * 3.0 * delta, 
      this.dist * 3 * alpha + 10,
      Math.cos(gamma) * this.dist * 3.0 * beta
    );

    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  render() {
    const t = this.time.getElapsedTime();

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw();
    }
    
    this.floor.material.uniforms.uTime.value = t;

    this.updateEquipments(t);

    this.renderer.render(this.scene, this.camera);

    this.animationId = requestAnimationFrame(this.render.bind(this));
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
    this.timeNum   = 3;
    this.timeScale = 2;

    this.scale = params.scale;

    // parameters
    this.sketch   = params.sketch;
    this.size     = params.size;
    this.dist     = params.dist;
    this.iIndex   = params.indexes.i;
    this.xIndex   = params.indexes.x;
    this.yIndex   = params.indexes.y;
    this.zIndex   = params.indexes.z;
    this.shadow   = params.shadow;
    this.geometry = params.geometry;
    this.material = params.material;
    this.others   = params.others;
    this.position = new THREE.Vector3(params.position.x, params.position.y, params.position.z);

    this.initialize();
  }

  initialize() {
    this.xRadian = Math.PI * 2 / this.sketch.shapes.length * this.xIndex;
    this.yRadian = Math.PI * 2 / this.sketch.shapes.length * this.yIndex;
    this.zRadian = Math.PI * 2 / 14 * this.zIndex;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y / 2, this.position.z);

    this.sketch.scene.add(this.mesh);
  }

  
  getTime(i) {
    const t = this.time.getElapsedTime();
    //const scaledTime = t * this.timeScale - i / this.shapesNum / Math.PI * 2;
    const scaledTime = t - this.dist / this.sketch.maxDist / Math.PI * 2;
    //const scaledTime = t * this.timeScale;

    return Math.abs(scaledTime);
  }

  draw() {
    const t = this.getTime();
    const intT = Math.floor(t % 3);

    const z = (Math.acos(Math.cos(this.zRadian - this.time.getElapsedTime() * 0.04)) / (Math.PI / 2) - 1);
    
    this.position.setZ(Math.asin(Math.sin(this.zRadian - this.time.getElapsedTime() * 0.04)) / (Math.PI / 2) * this.sketch.dist * 2);

    this.mesh.position.setZ(this.position.z);

    this.mesh.scale.x = this.scale;
    this.mesh.scale.y = this.scale;
    this.mesh.scale.z = this.scale;

    if (z < 0) {
      this.mesh.visible = false;
    } else {
      this.mesh.visible = true;
    }

    this.mesh.material.uniforms.uTime.value = t;
  }
}

class CreateTexture {
  constructor(sketch, width, height) {
    this.sketch = sketch;
    this.width = width;
    this.height = height;

    this.initialize();
  }

  initialize() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.drawTexture();
  }

  drawTexture() {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const xx = this.width / 24;
    const yy = this.height / 128;
    
    for (let x = 0; x < this.canvas.width; x += xx) {
      for (let y = 0; y < this.canvas.height; y += yy) {
        const text = String.fromCodePoint(Math.floor(Math.random() * 0xffff));
        
        this.ctx.fillStyle = "#24cdc1";
        this.ctx.font = `${xx}px 'sans-serif'`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
      }
    }
  }

  getTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);

    texture.needsUpdate = true;

    return texture;
  }
}
