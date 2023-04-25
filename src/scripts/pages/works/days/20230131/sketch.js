import * as THREE from 'three';
import {Mouse} from '../20230128/mouse';
import {TuringPattern} from './turing-pattern';

const vertexShader = `
uniform float uTime;
varying vec2 vUv;
float PI = 3.14159265359;
void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vUv = uv;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
void main () {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color);
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
    this.renderer.setClearColor('#000000', 1.0);

    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex =  '-1';
    this.renderer.domElement.style.outline = 'none';
  }

  setupCamera() {
    const fov = 100;
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
    this.cameraP = new THREE.Vector3(0, this.dist * 0.05, this.dist * 0.1);

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
      this.dist * 0.1
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
    this.position = new THREE.Vector3(x, y, z);

    this.initialize();
  }

  initialize() {
    this.createTexture();

    // sphere
    this.boxGeometry = new THREE.BoxGeometry(this.sketch.dist * 2, this.sketch.dist * 2, this.sketch.dist * 2);

    this.boxMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    this.boxMesh.position.set(this.position.x, this.position.y, this.position.z);
    this.sketch.scene.add(this.boxMesh);
  }

  createTexture() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.length = 256;

    this.canvas.width = this.length;
    this.canvas.height = this.length;

    this.tp = new TuringPattern(this.ctx, this.length, this.length, 'Amorphous', 5);

    this.texture = new THREE.CanvasTexture(this.canvas);
  }

  returnTexture() {
    return this.texture;
  }

  updateTexture(time) {
    this.tp.render();
  }

  render(time) {
    this.texture.needsUpdate = true; // important
    this.updateTexture(time);

    this.boxMesh.material.uniforms.uTime.value = time;
  }
}
