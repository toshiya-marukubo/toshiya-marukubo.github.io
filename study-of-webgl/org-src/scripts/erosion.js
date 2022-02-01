// sphere vertex shader source
const vertexSphereShader = `
uniform float uTime;
uniform float mouse;
varying vec2 vUv;
float PI = 3.14159265359;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
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

  gl_FragColor = vec4(color);
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
    
    this.lastX = 0;
    this.lastY = 0;
    this.speed = 0;
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
    
    this.speed =
        Math.sqrt((e.pageX - this.lastX) **2 +
                  (e.pageY - this.lastY) **2) * 0.1;
      this.lastX = e.pageX;
      this.lastY = e.pageY;
  }

  onTouchmove(e) {
    const touch = e.targetTouches[0];

    this.mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
    this.mouse.y =  -(touch.pageY / window.innerHeight) * 2 + 1;
    this.mouse.z = 0;

    this.speed =
      Math.sqrt((touch.pageX - this.lastX) **2 +
                (touch.pageY - this.lastY) **2) * 0.5;
    this.lastX = touch.pageX;
    this.lastY = touch.pageY;
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
    this.renderer.setClearColor('#FFF0A6', 1.0);
    
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.zIndex =  '-1';
    this.renderer.domElement.style.outline = 'none';
  }
  
  setupCamera() {
    const fov = 120;
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
    this.cameraP = new THREE.Vector3(0, this.dist, this.dist);

    this.camera.position.set(this.cameraP.x, this.cameraP.y, this.cameraP.z);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.05);
    this.cameraP.add(this.cameraV);

    this.camera.position.set(
      this.cameraP.x * this.dist * 0.0,
      this.cameraP.y * this.dist * 0.1,
      this.dist * 0
    );

    this.camera.lookAt(new THREE.Vector3());
  }
  
  setupLight() {
    // directinal light
    this.directionalLight = new THREE.DirectionalLight(0xffffff);
    this.scene.add(this.directionalLight);

    // point light
    this.spotLight = new THREE.SpotLight(0xffffff);

    this.spotLightV = new THREE.Vector3();
    this.spotLightP = new THREE.Vector3(0, 0, this.dist * 0.1);

    this.spotLight.position.set(this.spotLightP.x, this.spotLightP.y, this.spotLightP.z);
    this.spotLight.lookAt(new THREE.Vector3());

    this.scene.add(this.spotLight);
  }

  updateLight() {
    this.spotLightV.subVectors(this.mouse.mouse, this.spotLightP).multiplyScalar(0.05);
    this.spotLightP.add(this.spotLightV);

    this.spotLight.position.set(
      this.spotLightP.x * this.dist,
      this.spotLightP.y * this.dist,
      this.dist
    );

    this.spotLight.lookAt(new THREE.Vector3());
  }
  
  setupShape() {
    this.shape = new Shape(this, 0, 0, 0);
  }

  draw() {
    const time = this.time.getElapsedTime();
    
    this.shape.render(time);

    this.updateCamera(time);
    //this.updateLight(time);
    
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
    this.beta = 0;
    this.position = new THREE.Vector3(x, y, z);
    
    this.setupSizes();
    this.initialize();
  }

  setupSizes() {
    this.sphereSize = null;

    if (this.sketch.width < 768) {
      this.sphereSize = 120;
    }

    if (this.sketch.width >= 768) {
      this.sphereSize = 192;
    }
  }
  
  initialize() {
    this.createTexture();
    
    // sphere 
    this.sphereGeometry = new THREE.BoxGeometry(this.sphereSize, this.sphereSize, this.sphereSize, 128, 128, 128);
    this.sphereMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        mouse: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexSphereShader,
      fragmentShader: fragmentSphereShader
    });
    
    this.sphereMeshV = new THREE.Vector3();
    this.sphereMeshP = new THREE.Vector3(0, 0, 0);

    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sphereMesh.position.set(this.sphereMeshP.x, this.sphereMeshP.y, this.sphereMeshP.z);
    this.sphereMesh.rotation.y = -Math.PI / 4; 
    
    this.sketch.scene.add(this.sphereMesh);
  }
  
  createTexture() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.length = 256;
    
    this.canvas.width = this.length;
    this.canvas.height = this.length;
    
    this.bitOperation = new BitOperation(this.ctx, this.length, this.length);
    
    this.texture = new THREE.CanvasTexture(this.canvas);
  }
  
  returnTexture() {
    return this.texture;
  }
  
  updateTexture(time) {
    this.bitOperation.render(time);
  }
  
  render(time) {
    this.texture.needsUpdate = true; // important
    this.updateTexture(time);

    this.sphereMesh.rotation.y = time * 0.3;
    
    this.sphereMesh.material.uniforms.uTime.value = time;
    this.sphereMesh.material.uniforms.mouse.value = this.beta;
  }
}

// References
// https://twitter.com/aemkei/status/1378106731386040322
// Thank you so much.
class BitOperation {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    
    this.d = this.ctx.createImageData(this.width, this.height);
  }
  
  drawData() {
    this.ctx.putImageData(this.d, 0, 0);
  }
  
  updateData(t) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 4;
        this.d.data[i + 0] = ((y | x) + t) % 256 + Math.random() * 100;
        this.d.data[i + 1] = ((y ^ x) + t) % 256 + Math.random() * 100;
        this.d.data[i + 2] = ((y & x) + t) % 256 + Math.random() * 100;
        this.d.data[i + 3] = 0xff;
      }
    }
  }
  
  
  render(t) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.updateData(t * 100);
    this.drawData();
  }
}

(() => {
  window.addEventListener('load', () => {
    new Loading('loading', 'loaded');
    new FullScreen();
    new Sketch();
  });
})();
