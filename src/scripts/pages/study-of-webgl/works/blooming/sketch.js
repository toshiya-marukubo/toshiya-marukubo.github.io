import * as THREE from 'three';
import {Mouse} from '../../modules/mouse';

// vertex shader source
const vertexShader = `
uniform float uTime;
float PI = 3.14159265359;
varying vec3 vPosition;
void main(){
  vec3 pos = position;
  pos.x = position.x * cos(uTime * 0.3) - position.y * sin(uTime * 0.3);
  pos.y = position.x * sin(uTime * 0.3) + position.y * cos(uTime * 0.3);
  
  float q = sin(cos(position.z * sin(uTime * 0.1) * 12.0) - uTime);
  
  pos.x = pos.x * q;
  pos.y = pos.y * q;
  pos.z = tan(uTime * 0.3 * q) * 0.1;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  vPosition = pos;
  
  gl_PointSize = 2.0 * (14.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// fragment shader source
const fragmentShader = `
uniform float uTime;
varying vec3 vPosition;
// Reference
// https://iquilezles.org/www/articles/palettes/palettes.htm
// Thank you so much.
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}
void main () {
  // Reference
  // https://qiita.com/uma6661/items/20accc9b5fb9845fc73a
  // Thank you so much.
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  
  vec3 color =
    palette(
      length(vPosition) - uTime * 0.5, 
      vec3(0.5,0.5,0.5),
      vec3(0.5,0.5,0.5),
      vec3(1.0,1.0,1.0),
      vec3(0.0,0.33,0.67)
    );
  
  gl_FragColor = vec4(color, 1.0);
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
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.setPixelRatio(1.0);
    this.renderer.setClearColor('#0a0927', 1.0);
    
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
    
    //this.dist = this.height / 2 / Math.tan(fovRadian);
    this.dist = 2;
    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        0.01,
        4
      );
    
    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3(0, 0, this.dist);
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
    this.spotLight.position.set(0, 0, 2);
    this.scene.add(this.spotLight);
  }
  
  setupShape() {
    this.shape = new Shape(this, 0, 0, 0);
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    this.shape.render(time);
    
    this.updateCamera(time);
    
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
    this.setupSizes();
    this.init();
  }
  
  setupSizes() {
    const ratio = Math.min(this.sketch.width, 1024) / 1024;

    this.count = Math.floor(20000 * ratio);
  }

  init() {
    // particles
    this.geometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.count * 3);
    
    for (let i = 0; i < this.count * 3; i++) {
      const rad = Math.PI * 2 / this.count * (i * 3);
      const x = Math.cos(rad);
      const y = Math.sin(rad);
      
      this.vertices[i * 3 + 0] = x;
      this.vertices[i * 3 + 1] = y;
      this.vertices[i * 3 + 2] = Math.atan2(y, x);
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.sketch.scene.add(this.mesh);
  }
  
  render(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}
