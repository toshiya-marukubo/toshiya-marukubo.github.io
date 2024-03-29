import * as THREE from 'three';
import {Mouse} from '../20230128/mouse';

// sphere vertex shader source
const vertexSphereShader = `
uniform float uTime;
varying vec2 vUv;
float PI = 3.14159265359;
void main(){
  vec3 pos = position;

  pos.y += sin(pos.y * 0.01 - uTime * 20.0) * 20.0;
  pos.z += sin(pos.y * 0.01 - uTime * 20.0) * 20.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
`;

// sphere fragment shader source
const fragmentSphereShader = `
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
void main () {
  vec4 color = texture2D(uTexture, vUv);

  gl_FragColor = vec4(1.0 - color);
}
`;

// ground vertex shader source
const vertexGroundShader = `
uniform float uTime;
varying vec2 vUv;
float PI = 3.14159265359;
void main(){
  vec3 newPosition = position;
  newPosition.y = sin(newPosition.x / PI * 2.0 + uTime) * 10.0 + newPosition.y;
  newPosition.z = sin(newPosition.y / PI * 2.0 + uTime) * 5.0 + newPosition.z;
  newPosition.x = sin(newPosition.z / PI * 2.0 + uTime) * 5.0 + newPosition.x;

  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
`;

// rain vertex shader
const vertexRainShader = `
attribute float number;
uniform float uTime;
uniform vec2 uResolution;
float PI = 3.14159265359;
void main(){
  vec3 pos = position;

  pos.x += tan(pos.x + uTime * 10.0 * number) * 100.0;
  pos.y -= tan(pos.y + uTime * 10.0 * 0.5) * 100.0;
  pos.z -= tan(pos.z + uTime * 10.0 * number) * 100.0;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = 40.0 * (80.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// rain fragment shader
const fragmentRainShader = `
varying vec3 vPosition;
void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;

  gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

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
    this.cameraP = new THREE.Vector3(0, 0, 0);

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
    this.spotLight.position.set(this.dist, this.dist, this.dist);
    this.scene.add(this.spotLight);
  }

  setupShape() {
    this.setupSizes();

    this.shape = new Shape(this, 0, 0, 0, this.sphereSize, this.rainNumber, this.groundSize);
  }

  setupSizes() {
    const ratio = Math.min(this.width, 1024) / 1024;

    this.groundSize = Math.max(this.width * 2, this.height * 2);
    this.sphereSize = Math.floor(200 * ratio);
    this.rainNumber = Math.floor(20000 * ratio);
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
  constructor(sketch, x, y, z, s, n, g) {
    this.sketch = sketch;
    this.sphereSize = s;
    this.rainNumber = n;
    this.groundSize = g;
    this.position = new THREE.Vector3(x, y, z);

    this.initialize();
  }

  initialize() {
    this.createTexture();

    // sphere
    this.sphereGeometry = new THREE.SphereGeometry(this.sphereSize, 32, 32);
    this.sphereMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexSphereShader,
      fragmentShader: fragmentSphereShader
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
      //blending: THREE.AdditiveBlending,
      //transparent: true,
      vertexShader: vertexRainShader,
      fragmentShader: fragmentRainShader
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
      vertexShader: vertexGroundShader,
      fragmentShader: fragmentSphereShader
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

    this.pdm = new CellAutomaton(this.ctx, length, length);

    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  returnTexture() {
    return this.texture;
  }

  updateTexture(time) {
    this.pdm.render();
  }

  render(time) {
    this.texture.needsUpdate = true; // important
    this.updateTexture(time);

    this.rain.material.uniforms.uTime.value = time;
    this.groundMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.uTime.value = time;
  }
}

class CellAutomaton {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

    this.state = this.createMultipleArray(this.height, this.width);
    this.lastState = this.createMultipleArray(this.height, this.width);

    this.d = this.ctx.createImageData(this.width, this.height);

    this.setupData();
  }

  createMultipleArray(one, two) {
    const arr = [];

    for (let y = 0; y < one; y++) {
      arr[y] = [];
      for (let x = 0; x < two; x++) {
        arr[y][x] = 0;
      }
    }

    return arr;
  }

  setupData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.state[y][x] = Math.floor(Math.random() * 256);
      }
    }
  }

  drawData() {
    this.ctx.putImageData(this.d, 0, 0);
  }

  updateData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * this.width + x;

        this.d.data[4 * i + 0] = 0xff;
        this.d.data[4 * i + 1] = 0xff;
        this.d.data[4 * i + 2] = 0xff;
        this.d.data[4 * i + 3] = 0xff - this.state[y][x];
      }
    }
  }

  updateState() {
    const array = this.createMultipleArray(this.height, this.width);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let total = 0;
        let above = y - 1;
        let below = y + 1;
        let left = x - 1;
        let right = x + 1;

        if (above < 0) above = this.height - 1;
        if (below == this.height) below = 0;
        if (left < 0) left = this.width - 1;
        if (right == this.width) right = 0;

        const t = this.state[above][x]; // top
        const r = this.state[y][right]; // right
        const b = this.state[below][x]; // bottom
        const l = this.state[y][left]; // left
        const tl = this.state[above][left]; // top left
        const bl = this.state[below][left]; // bottom left
        const br = this.state[below][right]; // bottom right
        const tr = this.state[above][right]; // top right

        total = t + r + b + l + tl + bl + br + tr;

        let average = Math.floor(total / 8);
        let nextStateNum;

        if (average == 0xff) {
          nextStateNum = 0x00;
        } else if (average == 0x00) {
          nextStateNum = 0xff;
        } else {
          nextStateNum = this.state[y][x] + average;
          if (this.lastState[y][x] > 0x00) {
            nextStateNum =  nextStateNum - this.lastState[y][x];
          }
          if (nextStateNum > 0xff) {
            nextStateNum = 0xff;
          } else if (nextStateNum < 0x00) {
            nextStateNum = 0x00;
          }
        }
        array[y][x] = nextStateNum;
      }
    }

    this.lastState = this.state;
    this.state = array;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateData();
    this.updateState();
    this.drawData();
  }
}
