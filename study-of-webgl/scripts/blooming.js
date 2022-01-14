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
  
  gl_PointSize = 2.0 * (16.0 / - mvPosition.z);
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
    
    this.dist = this.height / 2 / Math.tan(fovRadian);
    this.camera =
      new THREE.PerspectiveCamera(
        fov,
        this.width / this.height,
        0.01,
        1000
      );
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  
  updateCamera(time) {
    this.camera.position.set(
      this.mouse.mouse.x,
      this.mouse.mouse.y,
      2
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
    this.init();
  }
  
  init() {
    // particles
    this.count = this.sketch.width < 500 ? 5000 : 20000;
    this.geometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.count * 3);
    
    for (let i = 0; i < this.count * 3; i++) {
      const rad = Math.PI * 2 / this.count * (i * 3);
      const rand = Math.random() * 0.5;
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
        uTime: {type: 'f', value: 0},
        uResolution: {
          type: 'v2',
          value: new THREE.Vector2(this.sketch.width, this.sketch.height),
        },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.mesh = new THREE.Points(this.geometry, this.material);
    //this.mesh.rotation.set(-90 * Math.PI / 180, 0.0, 0.0);
    this.sketch.scene.add(this.mesh);
  }
  
  render(time) {
    this.mesh.material.uniforms.uTime.value = time;
  }
}

(() => {
  window.addEventListener('load', () => {
    console.clear();

    const loading = document.getElementsByClassName('loading')[0];
    loading.classList.add('loaded');

    new FullScreen();

    new Sketch();
  });
})();
