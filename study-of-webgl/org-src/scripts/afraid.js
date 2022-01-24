// rain vertex shader
const vertexRainShader = `
attribute float number;

uniform float uTime;
uniform vec2 uResolution;

float PI = 3.14159265359;

void main(){
  vec3 pos = position;
  
  pos.x += cos(pos.x + uTime * number) * 10.0;
  pos.y -= tan(pos.y + uTime * 5.0) * 100.0;
  pos.z += sin(pos.z + uTime * number) * 10.0;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = 40.0 * (80.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// rain fragment shader
const fragmentRainShader = `
void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  
  gl_FragColor = vec4(0.5, 0.8, 1.0, 0.2);
}
`;

// vertex shader source
const vertexShader = `
attribute vec2 reference;

uniform float uTime;

varying vec2 vUv;

float PI = 3.14159265359;

void main(){
  vUv = reference;
  
  vec3 pos = position;
  
  //pos.x = cos(pos.x * 0.1 + uTime) * 10.0 + pos.x;
  //pos.y = sin(pos.y * 0.1 + uTime) * 10.0 + pos.y;
  pos.z = sin(pos.x * 0.01 + uTime * 0.5) * 30.0 + pos.z;
  pos.x = cos(pos.y * 0.01 + uTime * 0.5) * 30.0 + pos.x;
  pos.y = sin(pos.z * 0.01 + uTime * 0.5) * 30.0 + pos.y;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = 20.0 * (40.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}

`;

// fragment shader source
const fragmentShader = `
uniform float uTime;
uniform sampler2D textureState;

varying vec2 vUv;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

void main () {
  vec4 color = texture2D(textureState, vUv);
  

  vec3 col =
    pal(
      distance(vUv, vec2(0.5)) - uTime * 0.1,
      vec3(0.5,0.5,0.5),vec3(0.5,0.5,0.5),vec3(1.0,1.0,1.0),vec3(0.3,0.20,0.20)
    );
  
  gl_FragColor = vec4(col, color.w / 255.0);
}

`;

// state simulation
const stateSimulation = `
void main () {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  
  vec4 tmpState = texture2D(textureState, uv);
  vec4 state = tmpState;
  
  vec2 above  = gl_FragCoord.xy + vec2( 0.0,  1.0);
  vec2 below  = gl_FragCoord.xy + vec2( 0.0, -1.0);
  vec2 right  = gl_FragCoord.xy + vec2( 1.0,  0.0);
  vec2 left   = gl_FragCoord.xy + vec2(-1.0,  0.0);
  
  vec2 aRight = gl_FragCoord.xy + vec2( 1.0,  1.0);
  vec2 aLeft  = gl_FragCoord.xy + vec2(-1.0,  1.0);
  vec2 bRight = gl_FragCoord.xy + vec2( 1.0, -1.0);
  vec2 bLeft  = gl_FragCoord.xy + vec2(-1.0, -1.0);
  
  if (above.y > floor(resolution.y) || aRight.y > floor(resolution.y) || aLeft.y > floor(resolution.y)) {
    above.y  = 0.0;
    aRight.y = 0.0;
    aLeft.y  = 0.0;
  }
  
  if (below.y < 0.0 || bRight.y < 0.0 || bLeft.y < 0.0) {
    below.y  = floor(resolution.y);
    bRight.y = floor(resolution.y);
    bLeft.y  = floor(resolution.y);
  }
  
  if (right.x > floor(resolution.x) || aRight.x > floor(resolution.x) || bRight.x > floor(resolution.x)) {
    right.x  = 0.0;
    aRight.x = 0.0;
    bRight.x = 0.0;
  }
  
  if (left.x < 0.0 || aLeft.x < 0.0 || bLeft.x < 0.0) {
    left.x  = floor(resolution.x);
    aLeft.x = floor(resolution.x);
    bLeft.x = floor(resolution.x);
  }
  
  vec2 uAbove = above / resolution.xy;
  vec2 uBelow = below / resolution.xy;
  vec2 uRight = right / resolution.xy;
  vec2 uLeft  = left  / resolution.xy;
  
  vec2 uAboveRight = aRight / resolution.xy;
  vec2 uAboveLeft  = aLeft  / resolution.xy;
  vec2 uBelowRight = bRight / resolution.xy;
  vec2 uBelowLeft  = bLeft  / resolution.xy;
  
  float a = texture2D(textureState, uAbove).w;
  float b = texture2D(textureState, uBelow).w;
  float l = texture2D(textureState, uRight).w;
  float r = texture2D(textureState, uLeft).w;
  
  float ar = texture2D(textureState, uAboveRight).w;
  float al = texture2D(textureState, uAboveLeft).w;
  float br = texture2D(textureState, uBelowRight).w;
  float bl = texture2D(textureState, uBelowLeft).w;
  
  int total = int(a + b + l + r + ar + al + br + bl);
  
  int average = total / 8;
  
  int nextStateNumber;
  
  if (average == 255) {
    nextStateNumber = 0;
  } else if (average == 0) {
    nextStateNumber = 255;
  } else {
    nextStateNumber = int(state.w) + average;
    if (state.z > 0.0) {
      nextStateNumber = nextStateNumber - int(state.z);
    }
    if (nextStateNumber > 255) {
      nextStateNumber = 255;
    } else if (nextStateNumber < 0) {
      nextStateNumber = 0;
    }
  }
  
  state.z = state.w;
  state.w = float(nextStateNumber);
  
  gl_FragColor = state;
}
`;

/**
 * Mouse class
 */
class Mouse {
  constructor(sketch) {
    this.sketch = sketch;
    this.initialize();
  }
  
  initialize() {
    this.delta = 0;
    this.mouse = new THREE.Vector3();
    this.setupEvents();
  }
  
  setupEvents() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
    window.addEventListener('mousemove', this.onMousemove.bind(this), false);
    window.addEventListener('touchmove', this.onTouchmove.bind(this), false);
  }

  onScroll(e) {
    const docScrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docScrollTop / docHeight;

    this.delta = scrollPercent;
  }

  onMousemove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.z = 0;
  }

  onTouchmove(e) {
    const touch = e.targetTouches[0];

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;;
    this.mouse.y =  -(touch.pageY / window.innerHeight) * 2 + 1;
    this.mouse.z = 0;
  }
}

/**
 * class Sketch
 */
class Sketch {
  constructor() {
    this.createCanvas();
    this.setupEvents();
    this.time = new THREE.Clock(true);
    this.mouse = new Mouse(this);
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
    this.renderer.setPixelRatio(0.75);
    this.renderer.setClearColor(0x072336, 1.0);
    
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
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.03);
    this.cameraP.add(this.cameraV);

    this.camera.position.set(
      this.cameraP.x * this.dist,
      Math.max(this.cameraP.y * this.dist, 100),
      this.dist * 0.5 
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
    this.groundNum = null;
    this.rainNum = null;

    if (this.sketch.width < 768) {
      this.groundNum = 512;
      this.rainNum = 10000;
    }

    if (this.sketch.width >= 768) {
      this.groundNum = 768;
      this.rainNum = 20000;
    }
  }
  
  init() {
    this.initGPGPU();
    
    // ground
    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        textureState: {type: 'v4', value: null}
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    let positions = new Float32Array(this.groundNum * this.groundNum  * 3);
    
    for (let y = 0; y < this.groundNum ; y++) {
      for (let x = 0; x < this.groundNum ; x++) {
        const index = y * this.groundNum + x;
        
        positions.set([x - this.groundNum  / 2, y - this.groundNum  / 2, 0.0], index * 3);
      }
    }
    
    let reference = new Float32Array(this.groundNum  * this.groundNum  * 2);
    
    for (let y = 0; y < this.groundNum ; y++) {
      for (let x = 0; x < this.groundNum ; x++) {
        const index = y * this.groundNum + x;
        
        reference.set([x / this.groundNum , y / this.groundNum ], index * 2);
      }
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference, 2));
    
    this.mesh = new THREE.Points(this.geometry, this.material);

    this.mesh.rotation.x = -90 * Math.PI / 180;
    this.mesh.scale.set(2, 2, 2);
    
    this.sketch.scene.add(this.mesh);
    
    // rain 
    this.rainGeometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.rainNum * 3);
    this.numbers = new Float32Array(this.rainNum);
    
    for (let i = 0; i < this.rainNum * 3; i++) {
      this.vertices[i * 3 + 0] = Math.random() * this.groundNum * 2 - this.groundNum;
      this.vertices[i * 3 + 1] = Math.random() * this.groundNum * 2 - this.groundNum;
      this.vertices[i * 3 + 2] = Math.random() * this.groundNum * 2 - this.groundNum;
    }
    
    for (let i = 0; i < this.rainNum; i++) {
      this.numbers[i] = Math.random();
    }
    
    this.rainGeometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.rainGeometry.setAttribute('number', new THREE.BufferAttribute(this.numbers, 1));
    
    this.rainMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uResolution: {
          type: 'v2',
          value: new THREE.Vector2(this.groundNum, this.groundNum)
        }
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexRainShader,
      fragmentShader: fragmentRainShader
    });
    
    this.rainPoint = new THREE.Points(this.rainGeometry, this.rainMaterial);
    this.sketch.scene.add(this.rainPoint);
  }
  
  initGPGPU() {
    this.gpuCompute = new GPUComputationRenderer(THREE, this.sketch.width, this.sketch.height, this.sketch.renderer).setDataType( THREE.HalfFloatType ); // important
    
    this.statesTextureState = this.gpuCompute.createTexture();
    
    // important 
    this.statesTextureState.needsUpdate = true;
    this.setStates(this.statesTextureState);
    
    this.stateVariable = this.gpuCompute.addVariable('textureState', stateSimulation, this.statesTextureState);
    
    this.gpuCompute.setVariableDependencies(this.stateVariable, [this.stateVariable]);
    
    //this.stateVariable.material.uniforms['uTime'] = {type: 'f', value: 0};
    //this.stateVariable.material.uniforms['uScale'] = {type: 'f', value: 0.001};
    
    this.gpuCompute.init();
  }
  
  setStates(texture) {
    const arr = texture.image.data;
    
    for (let y = 0; y < this.sketch.height; y++) {
      for (let x = 0; x < this.sketch.width; x++) {
        const index = y * this.sketch.width + x;
        const num = Math.floor(Math.random() * 256);
        
        arr[index * 4 + 0] = 0.0;
        arr[index * 4 + 1] = 0.0;
        arr[index * 4 + 2] = num;
        arr[index * 4 + 3] = num;
      }
    }
  }
  
  /**
   * update shape
   * @param {number} time - time 
   */
  update(time) {
    this.gpuCompute.compute();

    this.material.uniforms.textureState.value =
      this.gpuCompute.getCurrentRenderTarget(this.stateVariable).texture;
    
    this.mesh.material.uniforms.uTime.value = time * 2;
    
    this.rainPoint.material.uniforms.uTime.value = time;
    
    // does not pass time to positionVariable
    //this.positionVariable.material.uniforms.uTime.value = time;
    //this.positionVariable.material.uniforms.uScale.value = (time * 0.3 + 0.0001) % 15.0;
  }
}

(() => {
  window.addEventListener('load', () => {
    new Loading('loading', 'loaded');
    new FullScreen();
    new Sketch();
  });
})();
