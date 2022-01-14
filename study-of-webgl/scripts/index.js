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

/** rain fragment shader */
const fragmentRainShader = `
varying vec3 vPosition;

void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.3);
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

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
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
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(1.0);
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
        this.dist * 5
      );
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(new THREE.Vector3());
    
    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3();
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);
    
    this.camera.position.set(
      this.cameraP.x * 300,
      Math.max(this.cameraP.y * 150, -150),
      this.dist * (1 + this.mouse.delta) 
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
    this.shapes = [];
    this.num = 1;
    
    for (let y = 0; y < this.num; y++) {
      const s = new Shape(this, 0, 0, 0);
      this.shapes.push(s);
    }
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(time * 0.1);
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
  constructor(sketch, x, y, z) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.initialize();
  }
  
  initialize() {
    this.createTexture();
    
    // sphere
    const sphereSize = Math.max(Math.min(this.sketch.width / 7, this.sketch.height / 2), 130);

    this.sphereGeometry = new THREE.SphereGeometry(sphereSize, 16, 16);
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
    this.num = this.sketch.width < 480 ? 5000 : 15000; 
    this.rainGeometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.num * 3);
    this.numbers = new Float32Array(this.num);
    
    for (let i = 0; i < this.num * 3; i++) {
      this.vertices[i * 3 + 0] = Math.random() * this.sketch.width - this.sketch.width / 2;
      this.vertices[i * 3 + 1] = Math.random() * this.sketch.height - this.sketch.height / 2;
      this.vertices[i * 3 + 2] = Math.random() * this.sketch.dist - this.sketch.dist / 2;
    }
    
    for (let i = 0; i < this.num; i++) {
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
          value: new THREE.Vector2(this.sketch.width, this.sketch.height)
        }
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexRainShader,
      fragmentShader: fragmentRainShader
    });
    
    this.rainPoint = new THREE.Points(this.rainGeometry, this.rainMaterial);
    this.sketch.scene.add(this.rainPoint);
    
    // ground
    const groundSize = Math.max(this.sketch.width, this.sketch.height);

    this.groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize, 32, 32);
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
    this.groundMesh.position.y = -sphereSize;
    
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
    this.texture.needsUpdate = true;
    this.updateTexture(time);
    
    this.rainPoint.material.uniforms.uTime.value = time;
    this.groundMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.uTime.value = time;

    const scale = 1 - this.sketch.mouse.delta;

    //this.sphereMesh.scale.set(scale, scale, scale);
    this.groundMesh.scale.set(scale, scale, scale);
    this.rainGeometry.setDrawRange(0, Math.max(this.num * scale, 1000));
  }
}

(() => {
  window.addEventListener('load', () => {
    console.log('HI. I\'m Toshiya Marukubo. Nice to meet you.');

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');
    
    new FullScreen();

    new Sketch();
  });
})();
