import * as THREE from 'three';
import {Mouse} from '../20230128/mouse';
import {GPUComputationRenderer} from '../20230128/GPUComputationRenderer';

/** vertex shader source */
const vertexShader = `
attribute vec2 reference;
uniform float uTime;
uniform sampler2D texturePosition;
varying vec3 vPosition;
float PI = 3.14159265359;
void main(){
  vec3 pos = texture2D(texturePosition, reference).xyz;
  
  float dist = length(pos);
  // Referred to https://t.co/9RSKLLVOrB?amp=1
  float shrink = 2.0 / PI * atan(sin(PI * 2.0 * (uTime * 0.3 - dist * 0.9) * (1.0 / 4.0)) / 0.1);
  float scale = 1.0 + shrink * 0.9;
  
  pos *= scale;
  
  vPosition = pos;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = 2.0 * (3.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

/** fragment shader source */
const fragmentShader = `
uniform float uTime;
varying vec3 vPosition;
// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;
  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  // x0 = x0 - 0. + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;
  // Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  // Gradients
  // ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  //Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}
const float scale = 0.1;
void main () {
  /**
   * square to circle
   * Referred to
   * https://qiita.com/uma6661/items/20accc9b5fb9845fc73a
   * Thank you so much.
   */
  //float f = length(gl_PointCoord - vec2(0.5, 0.5));
  //if (f > 0.1) discard;
  
  vec3 color;
  color.r = abs(snoise(vec3(vPosition.x * scale, vPosition.y * scale, uTime * 0.1)));
  color.g = abs(snoise(vec3(vPosition.x * scale, vPosition.y * scale, uTime * 0.2)));
  color.b = abs(snoise(vec3(vPosition.x * scale, vPosition.y * scale, uTime * 0.3)));
  
  gl_FragColor = vec4(color, 1.0);
}
`;

/** fragment simulation */
const positionSimulation = `
uniform float uTime;
uniform float uScale;
//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}
vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;
  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 
  return p;
}
float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);
// Other corners
// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;
  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;
  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );
  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;
// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);
// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));
// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}
const float scale = 0.05;
float PI = 3.14159265359;
void main () {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec4 pos = tmpPos.xyzw;
  vec4 vel = tmpVel.xyzw;
  
  float noisyX = snoise(vec4(pos.x * uScale, pos.y / uScale, pos.z / uScale, uTime));
  float noisyY = snoise(vec4(pos.x / uScale, pos.y * uScale, pos.z / uScale, uTime));
  float noisyZ = snoise(vec4(pos.x / uScale, pos.y / uScale, pos.z * uScale, uTime));
  
  pos.x += (noisyX + tmpVel.x) * scale;
  pos.y += (noisyY + tmpVel.y) * scale;
  pos.z += (noisyZ + tmpVel.z) * scale;
  
  if (length(pos.xyz) > 5.0) {
    pos.x = 0.0;
    pos.y = 0.0;
    pos.z = 0.0;
  }
  
  gl_FragColor = pos;
}
`;

const velocitySimulation = `
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  //float idParticle = uv.y * resolution.x + uv.x;
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec4 pos = tmpPos.xyzw;
  vec4 vel = tmpVel.xyzw;
  
  gl_FragColor = vel;
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
    
    //this.dist = this.height / 2 / Math.tan(fovRadian);
    this.dist = 4;
    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        0.01,
        8
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
    this.spotLight.position.set(0, 0, this.dist);
    this.spotLightV = new THREE.Vector3();
    this.spotLightP = new THREE.Vector3();
    this.scene.add(this.spotLight);
  }
  
  setupShape() {
    this.shapes = new Array();
    const s = new Shape(this);
    this.shapes.push(s);
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].update(time);
    }

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
    this.num = null;

    if (this.sketch.width < 768) {
      this.num = 256;
    }

    if (this.sketch.width >= 768) {
      this.num = 512;
    }
  }
  
  init() {
    this.initGPGPU();
    
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        texturePosition: {type: 'v4', value: null},
        textureVelocity: {type: 'v4', value: null},
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    let positions = new Float32Array(this.num * this.num * 3);
    let reference = new Float32Array(this.num * this.num * 2);
    
    for (let i = 0; i < this.num * this.num; i++) {
      positions.set([0, 0, 0], i * 3);
    }
    
    for (let j = 0; j < this.num; j++) {
      for (let i = 0; i < this.num; i++) {
        const index = j * this.num + i;
        
        reference.set([i / this.num, j / this.num], index * 2);
      }
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference, 2));
    
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.sketch.scene.add(this.mesh);
  }
  
  initGPGPU() {
    this.gpuCompute = new GPUComputationRenderer(THREE, this.sketch.width, this.sketch.height, this.sketch.renderer).setDataType(THREE.HalfFloatType);
    
    this.dataTexturePosition = this.gpuCompute.createTexture();
    this.dataTextureVelocity = this.gpuCompute.createTexture();
    this.dataTexturePosition.needsUpdate = true;
    this.dataTextureVelocity.needsUpdate = true; 
    
    this.setPositions(this.dataTexturePosition);
    this.setVelocities(this.dataTextureVelocity);
    
    this.positionVariable = this.gpuCompute.addVariable('texturePosition', positionSimulation, this.dataTexturePosition);
    this.velocityVariable = this.gpuCompute.addVariable('textureVelocity', velocitySimulation, this.dataTextureVelocity);
    
    /** It does not work without these codes. */
    this.gpuCompute.setVariableDependencies( this.velocityVariable, [ this.positionVariable, this.velocityVariable ] );
    this.gpuCompute.setVariableDependencies( this.positionVariable, [ this.positionVariable, this.velocityVariable ] );
    
    this.positionVariable.material.uniforms['uTime'] = {type: 'f', value: 0};
    this.positionVariable.material.uniforms['uScale'] = {type: 'f', value: 0.001};
    this.gpuCompute.init();
  }
  
  setVelocities(texture) {
    const arr = texture.image.data;
    
    for (let i = 0; i < arr.length; i += 4) {
      const r = Math.PI * 2 * Math.random();
      const rand = Math.random();
      arr[i + 0] = Math.cos(r) * rand;
      arr[i + 1] = Math.sin(r) * rand;
      arr[i + 2] = Math.sin(Math.PI * 2 * Math.random()) * Math.random();
      arr[i + 3] = 0.0;
    }
  }
  
  setPositions(texture) {
    const arr = texture.image.data;
    
    for (let i = 0; i < arr.length; i += 4) {
      const r = Math.random();
      const x = 0.0;
      const y = 0.0;
      arr[i + 0] = 0.0;
      arr[i + 1] = 0.0;
      arr[i + 2] = 0.0;
      arr[i + 3] = r;
    }
  }
  
  update(time) {
    this.gpuCompute.compute();
    
    this.material.uniforms.texturePosition.value =
      this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
    this.material.uniforms.textureVelocity.value =
      this.gpuCompute.getCurrentRenderTarget(this.velocityVariable).texture;
    
    this.mesh.material.uniforms.uTime.value = time;

    //this.mesh.rotation.y = time * 0.1;
    //this.mesh.rotation.z = time * 0.2;
    
    this.positionVariable.material.uniforms.uTime.value = time;
    this.positionVariable.material.uniforms.uScale.value = (time + 0.0001) % 15.0;
  }
}
