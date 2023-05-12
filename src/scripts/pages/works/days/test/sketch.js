import GUI from 'lil-gui';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Stopwatch } from '../template-from-20230215/stopwatch';
import { AnimationTimer } from '../template-from-20230215/animation-timer';
import { Easings } from '../template-from-20230215/easings';
import { Utilities } from '../template-from-20230215/utilities';
import { Points } from '../template-from-20230215/points';
import { Grid } from '../template-from-20230215/grid';

export class Sketch {
  constructor(data) {
    this.devMode = true;
    this.setupGUI();
    this.createCanvas();
    this.setupEvents();
    
    this.initialize();
  }

  setupGUI() {
    this.gui = new GUI();
    
    this.obj = {
      num: 2,
      ease: 'easeInOutExpo',
      gridScale: 50
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

    this.ease = Easings.returnEaseFunc(this.obj.ease);
    
    this.render(0);
  }
  
  setupSizes() {
    this.width = this.preWidth = window.innerWidth;
    this.height = this.preHeight = window.innerHeight;
  }

  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0xFAFAFA, 1.0);

    this.renderer.domElement.style.outline    = 'none';
    this.renderer.domElement.style.position   = 'fixed';
    this.renderer.domElement.style.top        = '0';
    this.renderer.domElement.style.left       = '0';
    this.renderer.domElement.style.background = '#FAFAFA';
    this.renderer.domElement.style.zIndex     = '-1';
  }

  setupCamera() {
    const fov = 60;
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
    const geometry = new THREE.BoxGeometry(size, size * 20, size);

    return geometry;
  }

  getMaterial() {
    const texture = new CreateTexture(this).getTexture();
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      map: texture,
    });

    material.fog = true;

    return material;
  }

  addShape() {
    const geometry = new THREE.BoxGeometry(this.width * 10, 10, this.height * 10, 1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xDDDDDD,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -this.size * 1.5, 0);
    mesh.receiveShadow = true;

    this.scene.add(mesh);
  }

  getGrid(num, scale, size, geometry, material) {
    const tmp = [];
    
    let index = 0;
    let xIndex = 0;
    let yIndex = 0;
    let zIndex = 0;

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
      for (let y = 0; y < 1; y++) {
        for (let z = -num; z <= num; z++) {
          const nx = x * scale;
          const ny = y * scale;
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
            indexes: {
              i: index++,
              x: xIndex++,
              y: yIndex++,
              z: z + 2
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
    */
    
    for (let x = -1; x <= 1; x++) {
      if (x === 0) continue;
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < 10; z++) {
          const nx = x * scale;
          const ny = y * scale;
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

    // circle
    /*
    for (let x = 0; x < 1; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = 0; z < num; z++) {
          const rad = z / num * Math.PI * 2;
          const nx = Math.cos(rad) * scale * 5;
          const nz = Math.sin(rad) * scale * 5;
          const ny = scale * y;
          const dist = new THREE.Vector3(nx, ny, nz).distanceTo(new THREE.Vector3());
          const others = {
            angle: Math.atan2(nz, nx)
          };
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
    /*
    for (let x = 0; x < 1; x++) {
      for (let y = 0; y < 1; y++) {
        for (let z = -num; z <= num; z++) {
          const nx = x * scale * 0;
          const ny = y * scale * 0;
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
    */

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

  render() {
    const t = this.time.getElapsedTime() / 1000;

    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].draw();
    }

    //this.updateEquipments(t);

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
    this.zRadian = Math.PI * 2 / 10 * this.zIndex;

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);

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

    const z = (Math.acos(Math.cos(this.zRadian - this.time.getElapsedTime() * 0.5)) / (Math.PI / 2) - 1);
    
    this.position.setZ(Math.asin(Math.sin(this.zRadian - this.time.getElapsedTime() * 0.5)) / (Math.PI / 2) * this.sketch.dist * 2);

    this.mesh.position.setZ(this.position.z);

    if (z < 0) {
      this.mesh.visible = false;
    } else {
      this.mesh.visible = true;
    }

    let st, rotate;
    switch (intT) {
      case 0:
        st = this.sketch.ease(t % 1);
        rotate = Utilities.map(st, 0, 1, -Math.PI / 2, 0);

        break;

      case 1:
        st = this.sketch.ease(t % 1);
        rotate = Utilities.map(st, 0, 1, 0, Math.PI / 2);

        break;

      case 2:
        st = this.sketch.ease(t % 1);
        rotate = Math.PI / 2;

        break;

      default:
        break;
    }

    //this.mesh.rotation.y = rotate;
  }
}

/**
 * main shape class
 */
/*
class MainShape extends Shape {
  constructor(params) {
    super(params);

    this.timeNum = 2;
  }

  initialize() {
    const geometry = new THREE.TorusGeometry(this.size * 2, this.size * 0.5, 36, 36);
    const material = new THREE.MeshPhongMaterial({
      //side: THREE.DoubleSide,
      transparent: true,
      color: 0xffffff
    });
    material.fog = true;

    // mesh
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = this.shadow;
    this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    this.mesh.material.opacity = 0;

    this.sketch.scene.add(this.mesh);
  }

  render() {
    const t = this.getScaledTime(this.time.getElapsedTime());
    const intT = Math.floor(t % this.timeNum);

    let st;
    let move = 0, rotate = 0;
    switch (intT) {
      case 0:
        st = this.sketch.linear(t % 1);

        rotate = Utilities.map(st, 0, 1, 0, Math.PI / 2);

        break;

      case 1:
        st = this.sketch.linear(t % 1);

        rotate = Utilities.map(st, 0, 1, Math.PI / 2, Math.PI);

        break;

      default:
        return;
    }

    const newV = this.position.clone().add(new THREE.Vector3(0, move, 0));

    //this.mesh.position.set(newV.x, newV.y + this.size, newV.z);

    this.mesh.rotation.y = rotate;
  }
}
*/

class CreateTexture {
  constructor(sketch) {
    this.sketch = sketch;

    this.initialize();
  }

  initialize() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.sketch.width;
    this.canvas.height = this.sketch.height;

    this.drawTexture();
  }

  drawTexture() {
    this.ctx.lineWidth = 20;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.sketch.width, this.sketch.height);
    this.ctx.strokeRect(0, 0, this.sketch.width, this.sketch.height);
  }

  getTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);

    texture.needsUpdate = true;

    return texture;
  }
}

/*

class Shape {
  constructor(sketch, params) {
    this.sketch = sketch;
    this.ctx = this.sketch.ctx;
    this.maxDist = this.sketch.maxDist;
    this.size = this.sketch.size;

    this.vector = params.v;
    this.dist = params.d;
    this.index = params.i;

    this.initialize();
  }

  initialize() {
    this.time = new Stopwatch();
    this.time.start();
    this.timeScale = 0.001;
    this.timeNum = 2 + 1;
    
    this.circle = Points.polygon(this.sketch.vector, 36, 36);
  }

  getTime(i) {
    const t = this.time.getElapsedTime() / 1000;
    //const scaledTime = t * this.timeScale - i / this.shapesNum / Math.PI * 2;
    const scaledTime = t - this.dist / this.maxDist / Math.PI * 2;
    //const scaledTime = t * this.timeScale;

    return Math.abs(scaledTime);
  }

  drawShape(points, size) {
    this.ctx.beginPath();
    for (let i = 0; i < points.length; i++) {
      if (i === 0) {
        this.ctx.moveTo(points[i].getX() * size, points[i].getY() * size);
      } else {
        this.ctx.lineTo(points[i].getX() * size, points[i].getY() * size);
      }
    }
    this.ctx.closePath();
    //this.ctx.fill();
    this.ctx.stroke();
  }

  updateParams() {
    const t = this.getTime();
    const intT = Math.floor(t % this.timeNum);

    let et, scale;
    switch (intT) {
      case 0:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 0, 1);

        break;
      
      case 1:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 1, 1);

        break;
      
      case 2:
        et = this.sketch.ease(t % 1);
        scale = Utilities.map(et, 0, 1, 1, 0);

        break;
      
      default:
        break;
    }

    this.ctx.scale(scale, scale);
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(this.vector.getX(), this.vector.getY());

    this.updateParams();

    this.drawShape(this.circle, this.size);

    this.ctx.restore();
  }
}
*/
