import * as THREE from 'three';
import {Mouse} from '../20230128/mouse';

const vertexLineShader = `
uniform float uTime;
uniform float uSize;
varying vec3 vPos;
float PI = 3.14159265359;
attribute float number;
float a = 5.0;
float b = 3.14159265359 / 3.0;
float c = 7.0;
float d = 3.14159265359 / 5.0;
void main(){
  vec3 pos = position.xyz;
  
  pos.x = cos(a * number + b + uTime) * uSize;
  pos.y = cos(c * number + d + uTime) * uSize;
  pos.z = tan(number + uTime) * uSize;
  
  vPos = pos;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentLineShader = `
uniform float uTime;
varying vec3 vPos;
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}
void main () {
  float len = length(vPos);
  
  vec3 color =
    pal(
      length(len * 0.001 - uTime * 0.5),
      vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    );
  
  gl_FragColor = vec4(color, 0.2);
}
`;

const vertexBoxShader = `
uniform float uTime;
uniform float uSize;
varying vec3 vPos;
float PI = 3.14159265359;
attribute float number;
float a = 5.0;
float b = 3.14159265359 / 3.0;
float c = 7.0;
float d = 3.14159265359 / 5.0;
void main(){
  vec3 pos = position.xyz;
  
  vPos = pos;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  //gl_PointSize = 60.0 * (120.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentBoxShader = `
uniform float uTime;
varying vec3 vPos;
// Referred to https://iquilezles.org/www/articles/palettes/palettes.htm
// Thank you so much.
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}
void main () {
  //float f = length(gl_PointCoord - vec2(0.5, 0.5));
  //if (f > 0.1) discard;
  
  float len = length(vPos);
  
  vec3 color =
    pal(
      length(len * 0.01 - uTime * 0.5),
      vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(2.0,1.0,0.0),vec3(0.5,0.20,0.25)
    );
  
  gl_FragColor = vec4(color, 0.4);
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
    this.renderer.setClearColor('#001033', 1.0);
    
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
    
    this.shape = new Shape(this, 0, 0, 0, this.cubeSize, this.lineNumber);
  }

  setupSizes() {
    const ratio = Math.min(this.width, 1024) / 1024;

    this.cubeSize = Math.floor(280 * ratio);
    this.lineNumber = Math.floor(1000 * ratio);
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
  constructor(sketch, x, y, z, s, ln) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.cubeSize = s;
    this.lineNumber = ln;

    this.initialize();
  }
  
  initialize() {
    // box
    this.boxGeometry = new THREE.BoxGeometry(this.cubeSize * 0.8, this.cubeSize * 0.8, this.cubeSize * 0.8, 36, 36, 36);
    this.boxMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0}
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexBoxShader,
      fragmentShader: fragmentBoxShader
    });

    this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    this.sketch.scene.add(this.boxMesh);
    
    // line
    this.particleGeometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.lineNumber * 3);
    this.numbers = new Float32Array(this.lineNumber);
    
    for (let i = 0; i < this.lineNumber; i++) {
      this.positions.set([0, 0, 0], i * 3);
    }
    
    for (let i = 0; i < this.lineNumber; i++) {
      this.numbers.set([i], i);
    }
    
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.particleGeometry.setAttribute('number', new THREE.BufferAttribute(this.numbers, 1));
    
    this.particleMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uSize: {type: 'f', value: this.size},
        uResolution: {
          type: 'v2',
          value: new THREE.Vector2(this.sketch.width, this.sketch.height)
        }
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexLineShader,
      fragmentShader: fragmentLineShader
    });
    
    this.linePoint = new THREE.Line(this.particleGeometry, this.particleMaterial);
    this.sketch.scene.add(this.linePoint);
  }
  
  updateParameters(time) {
    this.linePoint.material.uniforms.uTime.value = time;
    this.linePoint.material.uniforms.uSize.value = this.cubeSize;
    this.linePoint.rotation.z = -time;
    
    this.boxMesh.material.uniforms.uTime.value = time;
    this.boxMesh.rotation.z = -time;
    this.boxMesh.rotation.x = time;
  }
  
  render(time) {
    this.updateParameters(time);
  }
}
