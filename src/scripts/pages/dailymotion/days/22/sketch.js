import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Mouse } from '../../modules/mouse';
import { Ease } from '../../modules/ease';
import { Utilities } from '../../modules/utilities';

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
      ease: 'easeOutBounce',
      number: 5,
      scale: 100,
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
    this.easeLinear = Ease.returnEaseFunc('linear');

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
    this.frameSize =
      Math.min(
        Math.floor(
          Math.min(
            window.innerWidth,
            window.innerHeight
          ) * 0.9), 500
      );
    this.width = this.preWidth = this.frameSize;
    this.height = this.frameSize;
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0xFFFFFF, 1.0);
    
    this.renderer.domElement.style.outline    = 'none';
    this.renderer.domElement.style.position   = 'fixed';
    this.renderer.domElement.style.top        = '50%';
    this.renderer.domElement.style.left       = '50%';
    this.renderer.domElement.style.transform  = 'translate(-50%, -50%)';
    this.renderer.domElement.style.background = '#FFF';
    this.renderer.domElement.style.zIndex     = '-1';
    this.renderer.domElement.style.border     = '3px solid #000';
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

    geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, size / 4, size / 4));

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
      Math.sin(t) * 200,
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
    this.timeNum   = params.sketch.gui.params.number * 2 + 2;
    this.timeScale = 2;
    
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
    this.mesh.rotation.z = Math.floor(this.index % 4) * Math.PI / 2;

    this.sketch.scene.add(this.mesh);
  }

  getScaledTime(t) {
    // based on index number
    const scaledTime = t * this.timeScale - this.index / this.sketch.shapes.length / 1;
    // based on mesh distance
    //const scaledTime = t * this.timeScale + this.dist / this.sketch.maxDist / 1;
    // same time
    //const scaledTime = t * this.timeScale;

    return scaledTime;
  }
  
  render() {
    const t = this.getScaledTime(this.time.getElapsedTime());
    const intT = Math.floor(t % this.timeNum);

    let st;
    let moveY = 0;

    if (this.index === intT) {
      st = this.sketch.ease(t % 1);
      
      moveY = Utilities.map(st, 0, 1, 500, 0);
    } else {
      moveY = 1000;
    }

    if (this.index < intT) {
      moveY = 0;
    }

    if (intT === this.timeNum - 1) {
      st = this.sketch.easeLinear(t % 1);

      moveY = Utilities.map(st, 0, 1, 0, -500);
    }

    const newV = this.position.clone().add(new THREE.Vector3(0, moveY, 0));

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

(function () {
  function computeTangents(geometry) {
    geometry.computeTangents();
    console.warn(
      "THREE.BufferGeometryUtils: .computeTangents() has been removed. Use THREE.BufferGeometry.computeTangents() instead."
    );
  }
  /**
   * @param  {Array<BufferGeometry>} geometries
   * @param  {Boolean} useGroups
   * @return {BufferGeometry}
   */

  function mergeBufferGeometries(geometries, useGroups = false) {
    const isIndexed = geometries[0].index !== null;
    const attributesUsed = new Set(Object.keys(geometries[0].attributes));
    const morphAttributesUsed = new Set(
      Object.keys(geometries[0].morphAttributes)
    );
    const attributes = {};
    const morphAttributes = {};
    const morphTargetsRelative = geometries[0].morphTargetsRelative;
    const mergedGeometry = new THREE.BufferGeometry();
    let offset = 0;

    for (let i = 0; i < geometries.length; ++i) {
      const geometry = geometries[i];
      let attributesCount = 0; // ensure that all geometries are indexed, or none

      if (isIndexed !== (geometry.index !== null)) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            ". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."
        );
        return null;
      } // gather attributes, exit early if they're different

      for (const name in geometry.attributes) {
        if (!attributesUsed.has(name)) {
          console.error(
            "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
              i +
              '. All geometries must have compatible attributes; make sure "' +
              name +
              '" attribute exists among all geometries, or in none of them.'
          );
          return null;
        }

        if (attributes[name] === undefined) attributes[name] = [];
        attributes[name].push(geometry.attributes[name]);
        attributesCount++;
      } // ensure geometries have the same number of attributes

      if (attributesCount !== attributesUsed.size) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            ". Make sure all geometries have the same number of attributes."
        );
        return null;
      } // gather morph attributes, exit early if they're different

      if (morphTargetsRelative !== geometry.morphTargetsRelative) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
            i +
            ". .morphTargetsRelative must be consistent throughout all geometries."
        );
        return null;
      }

      for (const name in geometry.morphAttributes) {
        if (!morphAttributesUsed.has(name)) {
          console.error(
            "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
              i +
              ".  .morphAttributes must be consistent throughout all geometries."
          );
          return null;
        }

        if (morphAttributes[name] === undefined) morphAttributes[name] = [];
        morphAttributes[name].push(geometry.morphAttributes[name]);
      } // gather .userData

      mergedGeometry.userData.mergedUserData =
        mergedGeometry.userData.mergedUserData || [];
      mergedGeometry.userData.mergedUserData.push(geometry.userData);

      if (useGroups) {
        let count;

        if (isIndexed) {
          count = geometry.index.count;
        } else if (geometry.attributes.position !== undefined) {
          count = geometry.attributes.position.count;
        } else {
          console.error(
            "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index " +
              i +
              ". The geometry must have either an index or a position attribute"
          );
          return null;
        }

        mergedGeometry.addGroup(offset, count, i);
        offset += count;
      }
    } // merge indices

    if (isIndexed) {
      let indexOffset = 0;
      const mergedIndex = [];

      for (let i = 0; i < geometries.length; ++i) {
        const index = geometries[i].index;

        for (let j = 0; j < index.count; ++j) {
          mergedIndex.push(index.getX(j) + indexOffset);
        }

        indexOffset += geometries[i].attributes.position.count;
      }

      mergedGeometry.setIndex(mergedIndex);
    } // merge attributes

    for (const name in attributes) {
      const mergedAttribute = mergeBufferAttributes(attributes[name]);

      if (!mergedAttribute) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " +
            name +
            " attribute."
        );
        return null;
      }

      mergedGeometry.setAttribute(name, mergedAttribute);
    } // merge morph attributes

    for (const name in morphAttributes) {
      const numMorphTargets = morphAttributes[name][0].length;
      if (numMorphTargets === 0) break;
      mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
      mergedGeometry.morphAttributes[name] = [];

      for (let i = 0; i < numMorphTargets; ++i) {
        const morphAttributesToMerge = [];

        for (let j = 0; j < morphAttributes[name].length; ++j) {
          morphAttributesToMerge.push(morphAttributes[name][j][i]);
        }

        const mergedMorphAttribute = mergeBufferAttributes(
          morphAttributesToMerge
        );

        if (!mergedMorphAttribute) {
          console.error(
            "THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the " +
              name +
              " morphAttribute."
          );
          return null;
        }

        mergedGeometry.morphAttributes[name].push(mergedMorphAttribute);
      }
    }

    return mergedGeometry;
  }
  /**
   * @param {Array<BufferAttribute>} attributes
   * @return {BufferAttribute}
   */

  function mergeBufferAttributes(attributes) {
    let TypedArray;
    let itemSize;
    let normalized;
    let arrayLength = 0;

    for (let i = 0; i < attributes.length; ++i) {
      const attribute = attributes[i];

      if (attribute.isInterleavedBufferAttribute) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported."
        );
        return null;
      }

      if (TypedArray === undefined) TypedArray = attribute.array.constructor;

      if (TypedArray !== attribute.array.constructor) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. THREE.BufferAttribute.array must be of consistent array types across matching attributes."
        );
        return null;
      }

      if (itemSize === undefined) itemSize = attribute.itemSize;

      if (itemSize !== attribute.itemSize) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. THREE.BufferAttribute.itemSize must be consistent across matching attributes."
        );
        return null;
      }

      if (normalized === undefined) normalized = attribute.normalized;

      if (normalized !== attribute.normalized) {
        console.error(
          "THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. THREE.BufferAttribute.normalized must be consistent across matching attributes."
        );
        return null;
      }

      arrayLength += attribute.array.length;
    }

    const array = new TypedArray(arrayLength);
    let offset = 0;

    for (let i = 0; i < attributes.length; ++i) {
      array.set(attributes[i].array, offset);
      offset += attributes[i].array.length;
    }

    return new THREE.BufferAttribute(array, itemSize, normalized);
  }
  /**
   * @param {Array<BufferAttribute>} attributes
   * @return {Array<InterleavedBufferAttribute>}
   */

  function interleaveAttributes(attributes) {
    // Interleaves the provided attributes into an THREE.InterleavedBuffer and returns
    // a set of InterleavedBufferAttributes for each attribute
    let TypedArray;
    let arrayLength = 0;
    let stride = 0; // calculate the the length and type of the interleavedBuffer

    for (let i = 0, l = attributes.length; i < l; ++i) {
      const attribute = attributes[i];
      if (TypedArray === undefined) TypedArray = attribute.array.constructor;

      if (TypedArray !== attribute.array.constructor) {
        console.error(
          "AttributeBuffers of different types cannot be interleaved"
        );
        return null;
      }

      arrayLength += attribute.array.length;
      stride += attribute.itemSize;
    } // Create the set of buffer attributes

    const interleavedBuffer = new THREE.InterleavedBuffer(
      new TypedArray(arrayLength),
      stride
    );
    let offset = 0;
    const res = [];
    const getters = ["getX", "getY", "getZ", "getW"];
    const setters = ["setX", "setY", "setZ", "setW"];

    for (let j = 0, l = attributes.length; j < l; j++) {
      const attribute = attributes[j];
      const itemSize = attribute.itemSize;
      const count = attribute.count;
      const iba = new THREE.InterleavedBufferAttribute(
        interleavedBuffer,
        itemSize,
        offset,
        attribute.normalized
      );
      res.push(iba);
      offset += itemSize; // Move the data for each attribute into the new interleavedBuffer
      // at the appropriate offset

      for (let c = 0; c < count; c++) {
        for (let k = 0; k < itemSize; k++) {
          iba[setters[k]](c, attribute[getters[k]](c));
        }
      }
    }

    return res;
  }
  /**
   * @param {Array<BufferGeometry>} geometry
   * @return {number}
   */

  function estimateBytesUsed(geometry) {
    // Return the estimated memory used by this geometry in bytes
    // Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
    // for InterleavedBufferAttributes.
    let mem = 0;

    for (const name in geometry.attributes) {
      const attr = geometry.getAttribute(name);
      mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;
    }

    const indices = geometry.getIndex();
    mem += indices
      ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT
      : 0;
    return mem;
  }
  /**
   * @param {BufferGeometry} geometry
   * @param {number} tolerance
   * @return {BufferGeometry>}
   */

  function mergeVertices(geometry, tolerance = 1e-4) {
    tolerance = Math.max(tolerance, Number.EPSILON); // Generate an index buffer if the geometry doesn't have one, or optimize it
    // if it's already available.

    const hashToIndex = {};
    const indices = geometry.getIndex();
    const positions = geometry.getAttribute("position");
    const vertexCount = indices ? indices.count : positions.count; // next value for triangle indices

    let nextIndex = 0; // attributes and new attribute arrays

    const attributeNames = Object.keys(geometry.attributes);
    const attrArrays = {};
    const morphAttrsArrays = {};
    const newIndices = [];
    const getters = ["getX", "getY", "getZ", "getW"]; // initialize the arrays

    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i];
      attrArrays[name] = [];
      const morphAttr = geometry.morphAttributes[name];

      if (morphAttr) {
        morphAttrsArrays[name] = new Array(morphAttr.length)
          .fill()
          .map(() => []);
      }
    } // convert the error tolerance to an amount of decimal places to truncate to

    const decimalShift = Math.log10(1 / tolerance);
    const shiftMultiplier = Math.pow(10, decimalShift);

    for (let i = 0; i < vertexCount; i++) {
      const index = indices ? indices.getX(i) : i; // Generate a hash for the vertex attributes at the current index 'i'

      let hash = "";

      for (let j = 0, l = attributeNames.length; j < l; j++) {
        const name = attributeNames[j];
        const attribute = geometry.getAttribute(name);
        const itemSize = attribute.itemSize;

        for (let k = 0; k < itemSize; k++) {
          // double tilde truncates the decimal value
          hash += `${~~(attribute[getters[k]](index) * shiftMultiplier)},`;
        }
      } // Add another reference to the vertex if it's already
      // used by another index

      if (hash in hashToIndex) {
        newIndices.push(hashToIndex[hash]);
      } else {
        // copy data to the new index in the attribute arrays
        for (let j = 0, l = attributeNames.length; j < l; j++) {
          const name = attributeNames[j];
          const attribute = geometry.getAttribute(name);
          const morphAttr = geometry.morphAttributes[name];
          const itemSize = attribute.itemSize;
          const newarray = attrArrays[name];
          const newMorphArrays = morphAttrsArrays[name];

          for (let k = 0; k < itemSize; k++) {
            const getterFunc = getters[k];
            newarray.push(attribute[getterFunc](index));

            if (morphAttr) {
              for (let m = 0, ml = morphAttr.length; m < ml; m++) {
                newMorphArrays[m].push(morphAttr[m][getterFunc](index));
              }
            }
          }
        }

        hashToIndex[hash] = nextIndex;
        newIndices.push(nextIndex);
        nextIndex++;
      }
    } // Generate typed arrays from new attribute arrays and update
    // the attributeBuffers

    const result = geometry.clone();

    for (let i = 0, l = attributeNames.length; i < l; i++) {
      const name = attributeNames[i];
      const oldAttribute = geometry.getAttribute(name);
      const buffer = new oldAttribute.array.constructor(attrArrays[name]);
      const attribute = new THREE.BufferAttribute(
        buffer,
        oldAttribute.itemSize,
        oldAttribute.normalized
      );
      result.setAttribute(name, attribute); // Update the attribute arrays

      if (name in morphAttrsArrays) {
        for (let j = 0; j < morphAttrsArrays[name].length; j++) {
          const oldMorphAttribute = geometry.morphAttributes[name][j];
          const buffer = new oldMorphAttribute.array.constructor(
            morphAttrsArrays[name][j]
          );
          const morphAttribute = new THREE.BufferAttribute(
            buffer,
            oldMorphAttribute.itemSize,
            oldMorphAttribute.normalized
          );
          result.morphAttributes[name][j] = morphAttribute;
        }
      }
    } // indices

    result.setIndex(newIndices);
    return result;
  }
  /**
   * @param {BufferGeometry} geometry
   * @param {number} drawMode
   * @return {BufferGeometry>}
   */

  function toTrianglesDrawMode(geometry, drawMode) {
    if (drawMode === THREE.TrianglesDrawMode) {
      console.warn(
        "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."
      );
      return geometry;
    }

    if (
      drawMode === THREE.TriangleFanDrawMode ||
      drawMode === THREE.TriangleStripDrawMode
    ) {
      let index = geometry.getIndex(); // generate index if not present

      if (index === null) {
        const indices = [];
        const position = geometry.getAttribute("position");

        if (position !== undefined) {
          for (let i = 0; i < position.count; i++) {
            indices.push(i);
          }

          geometry.setIndex(indices);
          index = geometry.getIndex();
        } else {
          console.error(
            "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
          );
          return geometry;
        }
      } //

      const numberOfTriangles = index.count - 2;
      const newIndices = [];

      if (drawMode === THREE.TriangleFanDrawMode) {
        // gl.TRIANGLE_FAN
        for (let i = 1; i <= numberOfTriangles; i++) {
          newIndices.push(index.getX(0));
          newIndices.push(index.getX(i));
          newIndices.push(index.getX(i + 1));
        }
      } else {
        // gl.TRIANGLE_STRIP
        for (let i = 0; i < numberOfTriangles; i++) {
          if (i % 2 === 0) {
            newIndices.push(index.getX(i));
            newIndices.push(index.getX(i + 1));
            newIndices.push(index.getX(i + 2));
          } else {
            newIndices.push(index.getX(i + 2));
            newIndices.push(index.getX(i + 1));
            newIndices.push(index.getX(i));
          }
        }
      }

      if (newIndices.length / 3 !== numberOfTriangles) {
        console.error(
          "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."
        );
      } // build final geometry

      const newGeometry = geometry.clone();
      newGeometry.setIndex(newIndices);
      newGeometry.clearGroups();
      return newGeometry;
    } else {
      console.error(
        "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",
        drawMode
      );
      return geometry;
    }
  }
  /**
   * Calculates the morphed attributes of a morphed/skinned THREE.BufferGeometry.
   * Helpful for Raytracing or Decals.
   * @param {Mesh | Line | Points} object An instance of Mesh, Line or Points.
   * @return {Object} An Object with original position/normal attributes and morphed ones.
   */

  function computeMorphedAttributes(object) {
    if (object.geometry.isBufferGeometry !== true) {
      console.error(
        "THREE.BufferGeometryUtils: Geometry is not of type THREE.BufferGeometry."
      );
      return null;
    }

    const _vA = new THREE.Vector3();

    const _vB = new THREE.Vector3();

    const _vC = new THREE.Vector3();

    const _tempA = new THREE.Vector3();

    const _tempB = new THREE.Vector3();

    const _tempC = new THREE.Vector3();

    const _morphA = new THREE.Vector3();

    const _morphB = new THREE.Vector3();

    const _morphC = new THREE.Vector3();

    function _calculateMorphedAttributeData(
      object,
      material,
      attribute,
      morphAttribute,
      morphTargetsRelative,
      a,
      b,
      c,
      modifiedAttributeArray
    ) {
      _vA.fromBufferAttribute(attribute, a);

      _vB.fromBufferAttribute(attribute, b);

      _vC.fromBufferAttribute(attribute, c);

      const morphInfluences = object.morphTargetInfluences;

      if (material.morphTargets && morphAttribute && morphInfluences) {
        _morphA.set(0, 0, 0);

        _morphB.set(0, 0, 0);

        _morphC.set(0, 0, 0);

        for (let i = 0, il = morphAttribute.length; i < il; i++) {
          const influence = morphInfluences[i];
          const morph = morphAttribute[i];
          if (influence === 0) continue;

          _tempA.fromBufferAttribute(morph, a);

          _tempB.fromBufferAttribute(morph, b);

          _tempC.fromBufferAttribute(morph, c);

          if (morphTargetsRelative) {
            _morphA.addScaledVector(_tempA, influence);

            _morphB.addScaledVector(_tempB, influence);

            _morphC.addScaledVector(_tempC, influence);
          } else {
            _morphA.addScaledVector(_tempA.sub(_vA), influence);

            _morphB.addScaledVector(_tempB.sub(_vB), influence);

            _morphC.addScaledVector(_tempC.sub(_vC), influence);
          }
        }

        _vA.add(_morphA);

        _vB.add(_morphB);

        _vC.add(_morphC);
      }

      if (object.isSkinnedMesh) {
        object.boneTransform(a, _vA);
        object.boneTransform(b, _vB);
        object.boneTransform(c, _vC);
      }

      modifiedAttributeArray[a * 3 + 0] = _vA.x;
      modifiedAttributeArray[a * 3 + 1] = _vA.y;
      modifiedAttributeArray[a * 3 + 2] = _vA.z;
      modifiedAttributeArray[b * 3 + 0] = _vB.x;
      modifiedAttributeArray[b * 3 + 1] = _vB.y;
      modifiedAttributeArray[b * 3 + 2] = _vB.z;
      modifiedAttributeArray[c * 3 + 0] = _vC.x;
      modifiedAttributeArray[c * 3 + 1] = _vC.y;
      modifiedAttributeArray[c * 3 + 2] = _vC.z;
    }

    const geometry = object.geometry;
    const material = object.material;
    let a, b, c;
    const index = geometry.index;
    const positionAttribute = geometry.attributes.position;
    const morphPosition = geometry.morphAttributes.position;
    const morphTargetsRelative = geometry.morphTargetsRelative;
    const normalAttribute = geometry.attributes.normal;
    const morphNormal = geometry.morphAttributes.position;
    const groups = geometry.groups;
    const drawRange = geometry.drawRange;
    let i, j, il, jl;
    let group, groupMaterial;
    let start, end;
    const modifiedPosition = new Float32Array(
      positionAttribute.count * positionAttribute.itemSize
    );
    const modifiedNormal = new Float32Array(
      normalAttribute.count * normalAttribute.itemSize
    );

    if (index !== null) {
      // indexed buffer geometry
      if (Array.isArray(material)) {
        for (i = 0, il = groups.length; i < il; i++) {
          group = groups[i];
          groupMaterial = material[group.materialIndex];
          start = Math.max(group.start, drawRange.start);
          end = Math.min(
            group.start + group.count,
            drawRange.start + drawRange.count
          );

          for (j = start, jl = end; j < jl; j += 3) {
            a = index.getX(j);
            b = index.getX(j + 1);
            c = index.getX(j + 2);

            _calculateMorphedAttributeData(
              object,
              groupMaterial,
              positionAttribute,
              morphPosition,
              morphTargetsRelative,
              a,
              b,
              c,
              modifiedPosition
            );

            _calculateMorphedAttributeData(
              object,
              groupMaterial,
              normalAttribute,
              morphNormal,
              morphTargetsRelative,
              a,
              b,
              c,
              modifiedNormal
            );
          }
        }
      } else {
        start = Math.max(0, drawRange.start);
        end = Math.min(index.count, drawRange.start + drawRange.count);

        for (i = start, il = end; i < il; i += 3) {
          a = index.getX(i);
          b = index.getX(i + 1);
          c = index.getX(i + 2);

          _calculateMorphedAttributeData(
            object,
            material,
            positionAttribute,
            morphPosition,
            morphTargetsRelative,
            a,
            b,
            c,
            modifiedPosition
          );

          _calculateMorphedAttributeData(
            object,
            material,
            normalAttribute,
            morphNormal,
            morphTargetsRelative,
            a,
            b,
            c,
            modifiedNormal
          );
        }
      }
    } else {
      // non-indexed buffer geometry
      if (Array.isArray(material)) {
        for (i = 0, il = groups.length; i < il; i++) {
          group = groups[i];
          groupMaterial = material[group.materialIndex];
          start = Math.max(group.start, drawRange.start);
          end = Math.min(
            group.start + group.count,
            drawRange.start + drawRange.count
          );

          for (j = start, jl = end; j < jl; j += 3) {
            a = j;
            b = j + 1;
            c = j + 2;

            _calculateMorphedAttributeData(
              object,
              groupMaterial,
              positionAttribute,
              morphPosition,
              morphTargetsRelative,
              a,
              b,
              c,
              modifiedPosition
            );

            _calculateMorphedAttributeData(
              object,
              groupMaterial,
              normalAttribute,
              morphNormal,
              morphTargetsRelative,
              a,
              b,
              c,
              modifiedNormal
            );
          }
        }
      } else {
        start = Math.max(0, drawRange.start);
        end = Math.min(
          positionAttribute.count,
          drawRange.start + drawRange.count
        );

        for (i = start, il = end; i < il; i += 3) {
          a = i;
          b = i + 1;
          c = i + 2;

          _calculateMorphedAttributeData(
            object,
            material,
            positionAttribute,
            morphPosition,
            morphTargetsRelative,
            a,
            b,
            c,
            modifiedPosition
          );

          _calculateMorphedAttributeData(
            object,
            material,
            normalAttribute,
            morphNormal,
            morphTargetsRelative,
            a,
            b,
            c,
            modifiedNormal
          );
        }
      }
    }

    const morphedPositionAttribute = new THREE.Float32BufferAttribute(
      modifiedPosition,
      3
    );
    const morphedNormalAttribute = new THREE.Float32BufferAttribute(
      modifiedNormal,
      3
    );
    return {
      positionAttribute: positionAttribute,
      normalAttribute: normalAttribute,
      morphedPositionAttribute: morphedPositionAttribute,
      morphedNormalAttribute: morphedNormalAttribute
    };
  }

  THREE.BufferGeometryUtils = {};
  THREE.BufferGeometryUtils.computeMorphedAttributes = computeMorphedAttributes;
  THREE.BufferGeometryUtils.computeTangents = computeTangents;
  THREE.BufferGeometryUtils.estimateBytesUsed = estimateBytesUsed;
  THREE.BufferGeometryUtils.interleaveAttributes = interleaveAttributes;
  THREE.BufferGeometryUtils.mergeBufferAttributes = mergeBufferAttributes;
  THREE.BufferGeometryUtils.mergeBufferGeometries = mergeBufferGeometries;
  THREE.BufferGeometryUtils.mergeVertices = mergeVertices;
  THREE.BufferGeometryUtils.toTrianglesDrawMode = toTrianglesDrawMode;
})();
