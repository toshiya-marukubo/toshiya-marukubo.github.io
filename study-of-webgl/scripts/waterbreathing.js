/** vertex shader source */
const vertexShader = `
attribute float number;
uniform float uTime;
uniform vec2 uMouse;
float PI = 3.14159265359;

//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
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
  // i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

  // i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  // x0 = x0 - 0.0 + 0.0 * C 
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
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
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

const float scale = 0.1;

void main(){
  vec3 pos = position;

  float noisy =
    snoise(
      vec4(
        pos.x + cos(pos.x + uTime) * scale,
        pos.y + sin(pos.y + uTime) * scale, 
        pos.z + tan(pos.z + uTime * 0.5) * scale,
        uTime * 0.1
      ));
  
  pos.x += cos(pos.x * 5.0 * noisy + uTime * 1.0) * noisy;
  pos.y += sin(pos.x * 5.0 * noisy + uTime * 1.0) * noisy;
  pos.z += tan(pos.z * 5.0 + uTime * 1.0) * 0.1;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = 2.0 * (4.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}

`;

/** fragment shader source */
const fragmentShader = `
void main () {
  /**
   * Square to Circle.
   * Referred to
   * https://qiita.com/uma6661/items/20accc9b5fb9845fc73a
   * Thank you so much.
   */
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  
  gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);
}

`;

/**
 * Utils
 */
const createMultipleArray = (one, two) => {
  const arr = [];
  
  for (let y = 0; y < one; y++) {
    arr[y] = [];
    for (let x = 0; x < two; x++) {
      arr[y][x] = 0;
    }
  }

  return arr;  
};

/**
 * Mouse class
 */
class Mouse {
  constructor(sketch) {
    this.sketch = sketch;
    this.initialize();
  }
  
  initialize() {
    this.delta = 1;
    this.setupEvents();
  }
  
  setupEvents() {
    window.addEventListener('scroll', this.onScroll.bind(this), false);
  }

  onScroll(e) {
    const docScrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = docScrollTop / docHeight;

    this.delta = 1.0 - scrollPercent;
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
    
    document.getElementsByClassName('body-container')[0].
      appendChild(this.renderer.domElement);
  }
  
  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.width = Math.ceil(window.innerWidth);
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
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(1.0);
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
        1000
      );
    this.camera.position.set(0, 0, 2);
    this.camera.lookAt(new THREE.Vector3());
    
    this.scene.add(this.camera);
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }
  
  updateCamera(time) {
    this.camera.position.set(
      Math.cos(-time * 0.3) * this.dist,
      Math.sin( time * 0.3) * this.dist / 2,
      Math.sin(-time * 0.3) * this.dist
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
    this.shapes = new Array();
    this.num = 1;
    
    for (let y = 0; y < this.num; y++) {
      const s = new Shape(this, 0, 0, 0);
      this.shapes.push(s);
    }
  }
  
  draw() {
    const time = this.time.getElapsedTime();
    
    for (let i = 0; i < this.shapes.length; i++) {
      this.shapes[i].render(time);
    }
    
    //this.updateCamera(time);
    
    this.renderer.render(this.scene, this.camera);
    
    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
  
  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }
  
  onResize() {
    this.initialize();
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
  
  /**
   * initialize shape
   */
  initialize() {
    /** particles */
    this.count = this.sketch.width < 500 ? 80000 : 160000;
    this.geometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.count * 3);
    this.numbers = new Float32Array(this.count);
    
    for (let i = 0; i < this.count * 3; i++) {
      this.vertices[i * 3 + 0] = Math.random() * 0.5 - 0.25;
      this.vertices[i * 3 + 1] = Math.random() * 2 - 1;
      this.vertices[i * 3 + 2] = Math.random() * 2 - 1;
    }
    
    for (let i = 0; i < this.count; i++) {
      this.numbers[i] = Math.random();
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.vertices, 3));
    this.geometry.setAttribute('number', new THREE.BufferAttribute(this.numbers, 1));
    
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        uTime: {type: 'f', value: 0},
        //uMouse: {type: 'v2', value: this.sketch.mouse},
        uResolution: {
          type: 'v2',
          value: new THREE.Vector2(this.sketch.width, this.sketch.height),
        },
      },
      blending: THREE.AdditiveBlending,
      //transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });
    
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.sketch.scene.add(this.mesh);

    /** sphere */
    this.sphereGeometry = new THREE.SphereGeometry(0.3, 36, 36);
    this.sphereMaterial = new THREE.MeshLambertMaterial({
      color: 0x94ff,
      emissive: 0x072336
    });
    this.sphereMesh = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.sketch.scene.add(this.sphereMesh);  
  }
  
  /**
   * render shape
   */
  render(time) {
    this.mesh.material.uniforms.uTime.value = time;
    //this.mesh.material.uniforms.uMouse.value = this.sketch.mouse;
    this.sphereMesh.position.y = Math.sin(time) * 0.1;
    this.sphereMesh.rotation.z = time * 0.6;
    this.sphereMesh.rotation.x = time * 0.4;
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
