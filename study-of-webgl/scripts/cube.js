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
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(1.0);
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
        this.dist * 5
      );
    this.camera.position.set(0, 0, this.dist);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.camera.position.set(
      this.mouse.mouse.x * 300,
      this.mouse.mouse.y * 300,
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
    
    for (let i = 0; i < this.num; i++) {
      const s = new Shape(this, 0, 0, 0);
      this.shapes.push(s);
    }
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(time);
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
    
    this.initialize();
  }
  
  initialize() {
    this.size = 150;
    
    // box
    this.boxGeometry = new THREE.BoxGeometry(this.size * 0.8, this.size * 0.8, this.size * 0.8, 36, 36, 36);
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
    this.number = 1000;

    this.particleGeometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.number * 3);
    this.numbers = new Float32Array(this.number);
    
    for (let i = 0; i < this.number; i++) {
      /*
      const a = 100;
      const b = 100;
      let u = i * Math.PI / 180 * 0.01;
      
      const x = (a + b * Math.cos(u)) * Math.cos(i);
      const y = (a + b * Math.cos(u)) * Math.sin(i);
      const z = b * Math.sin(u);
      */
      this.positions.set([0, 0, 0], i * 3);
    }
    
    for (let i = 0; i < this.number; i++) {
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
    
    this.particlePoint = new THREE.Line(this.particleGeometry, this.particleMaterial);
    this.sketch.scene.add(this.particlePoint);
  }
  
  updateParameters(time) {
    this.particlePoint.material.uniforms.uTime.value = time;
    this.particlePoint.material.uniforms.uSize.value = this.size;
    this.particlePoint.rotation.z = -time;
    
    this.boxMesh.material.uniforms.uTime.value = time;
    this.boxMesh.rotation.z = -time;
    this.boxMesh.rotation.x = time;
  }
  
  render(time) {
    this.updateParameters(time);
  }
}

(() => {
  window.addEventListener('load', () => {
    console.clear();

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    new Sketch();
  });
})();
