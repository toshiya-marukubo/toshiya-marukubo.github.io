// vertex shader source
const vertexSphereShader = `
uniform float uTime;

varying vec2 vUv;

float PI = 3.14159265359;
float scale = 0.1;

float scaling(float t, float delta, float a, float f) {
  return ((2.0 * a) / PI) * atan(sin(2.0 * PI * t * f) / delta);
}

void main(){
  vec3 pos = position;
  
  float dist = length(pos);
  float scale = scaling(uTime * 5.0 - dist * 0.01, 0.1, 1.0, 1.0 / 4.0) * 0.3 + 1.0;
  
  pos *= scale;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  vUv = uv;
  
  gl_Position = projectionMatrix * mvPosition;
}

`;

// fragment shader source
const fragmentSphereShader = `
uniform float uTime;

uniform sampler2D uTexture;

varying vec2 vUv;

// Referred to https://iquilezles.org/www/articles/palettes/palettes.htm
// Thank you so much.
vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
  return a + b*cos( 6.28318*(c*t+d) );
}

void main () {
  vec4 color = texture2D(uTexture, vUv);
  
  float len = distance(vUv.xy, vec2(0.5));
  
  vec3 color2 =
    pal(
      len - uTime * 5.0,
      vec3(0.5,0.5,0.5),
      vec3(0.5,0.5,0.5),
      vec3(1.0,1.0,1.0),
      vec3(0.3,0.20,0.20)
    );
  
  color.r *= color2.r;
  color.g *= color2.g;
  color.b *= color2.b;
  
  gl_FragColor = vec4(1.0 - color.r, 1.0 - color.g, 1.0 - color.b, color.a);
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
    this.renderer.setClearColor('#084C4A', 1.0);
    
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
    this.cameraP = new THREE.Vector3(this.dist * 0.01, this.dist * 0.01, this.dist);
    this.camera.position.set(this.cameraP);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
  }
  
  updateCamera(time) {
    this.cameraV.subVectors(this.mouse.mouse, this.cameraP).multiplyScalar(0.01);
    this.cameraP.add(this.cameraV);

    this.camera.position.set(
      this.cameraP.x * this.dist,
      this.cameraP.y * this.dist,
      this.dist 
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
    this.setupSize();

    this.shapes = [];
    
    for (let i = 0; i < 1; i++) {
      const s = new Shape(this, 0, 0, 0, this.cubeSize);
      this.shapes.push(s);
    }
  }

  setupSize() {
    this.cubeSize = null;

    if (this.width <= 768) {
      this.cubeSize = 120;
    }
    if (this.width >= 768) {
      this.cubeSize = 200;
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
  constructor(sketch, x, y, z, s) {
    this.sketch = sketch;
    this.position = new THREE.Vector3(x, y, z);
    this.size = s;

    this.initialize();
  }
  
  initialize() {
    this.createTexture();
    
    // box
    this.boxGeometry = new THREE.BoxGeometry(this.size, this.size, this.size, 36, 36, 36);
    this.boxMaterial = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        uTexture: {type: 't', value: this.returnTexture()}
      },
      vertexShader: vertexSphereShader,
      fragmentShader: fragmentSphereShader
    });
    this.boxMesh = new THREE.Mesh(this.boxGeometry, this.boxMaterial);
    this.boxMesh.position.set(this.position.x, this.position.y, this.position.z);
    
    this.sketch.scene.add(this.boxMesh);
  }
  
  createTexture() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.texture = new THREE.CanvasTexture(this.canvas);
    
    const length = 256;
    
    this.canvas.width = length;
    this.canvas.height = length;
    
    this.pdm = new CellAutomaton(this.ctx, length, length);
    
    this.updateTexture();
  }
  
  returnTexture() {
    return this.texture;
  }
  
  updateTexture() {
    this.texture.needsUpdate = true;
    this.pdm.render();
  }
  
  render(time) {
    this.updateTexture();
    this.boxMesh.material.uniforms.uTime.value = time;
  }
}

(() => {
  window.addEventListener('load', () => {
    new Loading('loading', 'loaded');
    new FullScreen();
    new Sketch();
  });
})();

class CellAutomaton {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.mod = 3;

    this.state = this.createMultArr(this.height, this.width);

    this.d = this.ctx.createImageData(this.width, this.height);

    this.setupData();
  }

  createMultArr(one, two) {
    const arr = [];

    for (let y = 0; y < one; y++) {
      arr[y] = [];
      for (let x = 0; x < two; x++) {
        arr[y][x] = 0;
      }
    }

    return arr;
  }

  setupData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (y === this.height / 2 && x === this.width / 2) {
          this.state[y][x] = 1;
        }
      }
    }
  }

  drawData() {
    this.ctx.putImageData(this.d, 0, 0);
  }

  updateData() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * this.width + x;

        this.d.data[4 * i + 0] = 0xff;
        this.d.data[4 * i + 1] = 0xff;
        this.d.data[4 * i + 2] = 0xff;
        if (this.state[y][x] === 1) {
          this.d.data[4 * i + 3] = 0x00;
        } else {
          this.d.data[4 * i + 3] = 0xff;
        }
      }
    }
  }

  // Referred to 数学から創るジェネラティブアート ―Processingで学ぶかたちのデザイン / 巴山 竜来
  // ありがとうございます。
  updateState() {
    const array = this.createMultArr(this.height, this.width);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let total = 0;
        let above = y - 1;
        let below = y + 1;
        let left = x - 1;
        let right = x + 1;

        if (above < 0) above = this.height - 1;
        if (below == this.height) below = 0;
        if (left < 0) left = this.width - 1;
        if (right == this.width) right = 0;

        const t = this.state[above][x]; // top
        const r = this.state[y][right]; // right
        const b = this.state[below][x]; // bottom
        const l = this.state[y][left]; // left
        const tl = this.state[above][left]; // top left
        const bl = this.state[below][left]; // bottom left
        const br = this.state[below][right]; // bottom right
        const tr = this.state[above][right]; // top right

        total = t + r + b + l + tl + bl + br + tr;
        array[y][x] = total % this.mod;
      }
    }

    this.state = array;
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawData();
    this.updateData();
    this.updateState();
  }
}
