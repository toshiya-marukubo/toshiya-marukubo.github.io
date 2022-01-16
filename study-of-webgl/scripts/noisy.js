// vertex shader source
const vertexShader = `
uniform float uTime;

varying vec2 vUv;

float PI = 3.14159265359;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(){
  vec3 pos = position;
  
  float o = tan(pos.y * (mod(uTime, 2.0) * PI / 180.0) - uTime) * tan(uTime) * 0.01 * mod(uTime, 10.0) * random(pos.xy);
  
  vUv = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos.x, pos.y + o, pos.z, 1.0);
}
`;

// fragment shader source
const fragmentShader = `
uniform sampler2D uImage;
uniform float uTime;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main () {  
  vec2 offset = random(vUv) * vec2(0.05, 0.0);
  
  vec2 split = vec2(2.0, 4.0);
  
  vec2 uv = fract(vUv * split + vec2(uTime, 0.0));
  
  if (vUv.y < 0.75) {
    uv = fract(vUv * split + vec2(-uTime - 0.25, 0.0));
  }
  
  if (vUv.y < 0.5) {
    uv = fract(vUv * split + vec2(+uTime + 0.5, 0.0));
  }
  
  if (vUv.y < 0.25) {
    uv = fract(vUv * split + vec2(-uTime - 0.75, 0.0));
  }
  
  // Referred to https://codepen.io/bokoko33/pen/vYmWjOB?editors=0010
  // Thank you so much.
  float r = texture2D(uImage, uv + offset).r;
  float g = texture2D(uImage, uv + offset * 0.5).g;
  float b = texture2D(uImage, uv).b;
  
  vec4 texture = vec4(r, g, b, 1.0);
  
  gl_FragColor = texture;
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
    this.setupLight();
    this.setupShape();
    
    this.draw();
  }
  
  setupCanvas() {
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.setPixelRatio(1.0);
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
    this.camera.position.set(0, this.dist, this.dist);
    this.camera.lookAt(new THREE.Vector3());

    this.cameraV = new THREE.Vector3();
    this.cameraP = new THREE.Vector3();
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);

    this.camera.position.set(
      this.cameraP.x * this.dist,
      Math.max(this.cameraP.y * this.dist, 50),
      this.dist 
    );

    this.camera.lookAt(new THREE.Vector3());
    
    this.spotLightV.subVectors(this.mouse.mouse, this.spotLightP).multiplyScalar(0.05);
    this.spotLightP.add(this.spotLightV);

    this.spotLight.position.set(
      this.spotLightP.x * this.dist,
      this.spotLightP.y * this.dist,
      this.dist 
    );

    this.spotLight.lookAt(new THREE.Vector3());
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
    this.shapes = [];
    const s = new Shape(this);
    this.shapes.push(s);
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
  /**
   * @constructor
   * @param {object} sketch - canvas
   */
  constructor(sketch) {
    this.sketch = sketch;
    
    this.initialize();
  }
  
  /**
   * initialize shape
   */
  initialize() {
    this.texture = new createTexture(this.sketch);
    
    // box
    this.size = 150;
    
    this.sphereGeometry =
      new THREE.SphereGeometry(
        this.size, this.size, this.size
      );
    
    this.sphereMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uImage: {type: 't', value: this.texture.getTexture()}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphereMesh.position.y = this.size;
    this.sphereMesh.rotation.z = -90 * Math.PI / 180;
    
    this.sketch.scene.add(this.sphereMesh);
    
    // ground
    this.length = Math.max(this.sketch.width, this.sketch.height) * 3;
    
    this.groundGeometry = new THREE.PlaneGeometry(this.length, this.length, 100);
    this.groundMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uImage: {type: 't', value: this.texture.getTexture()}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.groundMesh = new THREE.Mesh(this.groundGeometry, this.groundMaterial);
    this.groundMesh.rotation.x = -90 * Math.PI / 180;
    this.groundMesh.rotation.z = 90 * Math.PI / 180;
    
    this.sketch.scene.add(this.groundMesh);
  }
  
  /**
   * render shape
   * @param {number} time - time 
   */
  render(time) {
    this.sphereMesh.material.uniforms.uTime.value = time;
    this.groundMesh.material.uniforms.uTime.value = time;
  }
}

class createTexture {
  constructor(sketch) {
    this.sketch = sketch;
    
    this.initialize();
  }
  
  initialize() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.length = 400;
    this.fontSize = 400;
    
    this.canvas.width = this.length;
    this.canvas.height = this.length;
    
    this.drawTexture();
  }
  
  drawTexture() {
    const font = 'Impact';
    
    this.ctx.font = this.fontSize + 'px "' + font + '"';
    
    const measuredText = this.ctx.measureText('NOISY');
    
    if (measuredText.width > this.length * 0.9) {
      this.fontSize--;
      
      return this.drawTexture();
    }
    
    this.ctx.lineWidth = 20;
    this.ctx.strokeStyle = 'white';
    this.ctx.strokeRect(0, 0, this.length, this.length);
    
    this.ctx.fillStyle = 'white';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('NOISY', this.length / 2, this.length / 2);
  }
  
  getTexture() {
    const texture = new THREE.CanvasTexture(this.canvas);
    
    texture.needsUpdate = true;
    
    return texture;
  }
}

(() => {
  window.addEventListener('load', () => {
    new Loading('loading', 'loaded');
    new FullScreen();
    new Sketch();
  });
})();
