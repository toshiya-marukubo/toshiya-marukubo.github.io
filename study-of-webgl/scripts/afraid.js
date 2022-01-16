/** rain vertex shader*/
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

/** rain fragment shader */
const fragmentRainShader = `
void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  
  gl_FragColor = vec4(0.5, 0.8, 1.0, 0.4);
}
`;

/** vertex shader source */
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
  pos.z = sin(pos.x * 0.01 + uTime * 0.5) * 50.0 + pos.z;
  pos.x = cos(pos.y * 0.01 + uTime * 0.5) * 50.0 + pos.x;
  pos.y = sin(pos.z * 0.01 + uTime * 0.5) * 50.0 + pos.y;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  gl_PointSize = 20.0 * (40.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}

`;

/** fragment shader source */
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
  //gl_FragColor = vec4(0.5, 0.8, 1.0, color.w / 255.0);
  gl_FragColor = vec4(col, color.w / 255.0);
}

`;

/** state simulation */
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
        this.dist * 5
      );
    this.camera.position.set(0, 200, this.dist / 3);
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
      Math.max(this.cameraP.y * this.dist, 100),
      this.dist * 0.6 
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
  /**
   * @constructor
   * @param {object} sketch - canvas
   */
  constructor(sketch) {
    this.sketch = sketch;
    this.init();
  }
  
  /**
   * initialize shape
   */
  init() {
    this.initGPGPU();
    
    /** ground */
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
    
    this.groundNum = 512;
    let positions = new Float32Array(this.groundNum * this.groundNum  * 3);
    
    for (let y = 0; y < this.groundNum ; y++) {
      for (let x = 0; x < this.groundNum ; x++) {
        const index = y * this.groundNum  + x;
        
        positions.set([x - this.groundNum  / 2, y - this.groundNum  / 2, 0.0], index * 3);
      }
    }
    
    let reference = new Float32Array(this.groundNum  * this.groundNum  * 2);
    
    for (let y = 0; y < this.groundNum ; y++) {
      for (let x = 0; x < this.groundNum ; x++) {
        const index = y * this.groundNum  + x;
        
        reference.set([x / this.groundNum , y / this.groundNum ], index * 2);
      }
    }
    
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('reference', new THREE.BufferAttribute(reference, 2));
    
    this.mesh = new THREE.Points(this.geometry, this.material);

    this.mesh.rotation.x = -90 * Math.PI / 180;
    
    this.sketch.scene.add(this.mesh);
    
    /** rain */
    this.num = 20000; 
    this.rainGeometry = new THREE.BufferGeometry();
    this.vertices = new Float32Array(this.num * 3);
    this.numbers = new Float32Array(this.num);
    
    for (let i = 0; i < this.num * 3; i++) {
      this.vertices[i * 3 + 0] = Math.random() * this.groundNum - this.groundNum / 2;
      this.vertices[i * 3 + 1] = Math.random() * this.groundNum * 2 - this.groundNum;
      this.vertices[i * 3 + 2] = Math.random() * this.groundNum - this.groundNum / 2;
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
    this.gpuCompute = new GPUComputationRenderer(this.sketch.width, this.sketch.height, this.sketch.renderer).setDataType( THREE.HalfFloatType );
    
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
    
    this.mesh.material.uniforms.uTime.value = time;
    
    this.rainPoint.material.uniforms.uTime.value = time;
    
    // does not pass time to positionVariable
    //this.positionVariable.material.uniforms.uTime.value = time;
    //this.positionVariable.material.uniforms.uScale.value = (time * 0.3 + 0.0001) % 15.0;
  }
}

/**
 * GPGPU
 * This code from https://github.com/mrdoob/three.js/blob/342946c8392639028da439b6dc0597e58209c696/examples/js/misc/GPUComputationRenderer.js
 */
class GPUComputationRenderer {
  constructor(sizeX, sizeY, renderer) {
    this.variables = [];
    this.currentTextureIndex = 0;
    let dataType = THREE.FloatType;
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    camera.position.z = 1;
    const passThruUniforms = {
      passThruTexture: {
        value: null
      }
    };
    const passThruShader = createShaderMaterial(
      getPassThroughFragmentShader(),
      passThruUniforms
    );
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), passThruShader);
    scene.add(mesh);

    this.setDataType = function (type) {
      dataType = type;
      return this;
    };

    this.addVariable = function (
      variableName,
      computeFragmentShader,
      initialValueTexture
    ) {
      const material = this.createShaderMaterial(computeFragmentShader);
      const variable = {
        name: variableName,
        initialValueTexture: initialValueTexture,
        material: material,
        dependencies: null,
        renderTargets: [],
        wrapS: null,
        wrapT: null,
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter
      };
      this.variables.push(variable);
      return variable;
    };

    this.setVariableDependencies = function (variable, dependencies) {
      variable.dependencies = dependencies;
    };

    this.init = function () {
      if (
        renderer.capabilities.isWebGL2 === false &&
        renderer.extensions.has("OES_texture_float") === false
      ) {
        return "No OES_texture_float support for float textures.";
      }

      if (renderer.capabilities.maxVertexTextures === 0) {
        return "No support for vertex shader textures.";
      }

      for (let i = 0; i < this.variables.length; i++) {
        const variable = this.variables[i]; // Creates rendertargets and initialize them with input texture

        variable.renderTargets[0] = this.createRenderTarget(
          sizeX,
          sizeY,
          variable.wrapS,
          variable.wrapT,
          variable.minFilter,
          variable.magFilter
        );
        variable.renderTargets[1] = this.createRenderTarget(
          sizeX,
          sizeY,
          variable.wrapS,
          variable.wrapT,
          variable.minFilter,
          variable.magFilter
        );
        this.renderTexture(
          variable.initialValueTexture,
          variable.renderTargets[0]
        );
        this.renderTexture(
          variable.initialValueTexture,
          variable.renderTargets[1]
        ); // Adds dependencies uniforms to the THREE.ShaderMaterial

        const material = variable.material;
        const uniforms = material.uniforms;

        if (variable.dependencies !== null) {
          for (let d = 0; d < variable.dependencies.length; d++) {
            const depVar = variable.dependencies[d];

            if (depVar.name !== variable.name) {
              // Checks if variable exists
              let found = false;

              for (let j = 0; j < this.variables.length; j++) {
                if (depVar.name === this.variables[j].name) {
                  found = true;
                  break;
                }
              }

              if (!found) {
                return (
                  "Variable dependency not found. Variable=" +
                  variable.name +
                  ", dependency=" +
                  depVar.name
                );
              }
            }

            uniforms[depVar.name] = {
              value: null
            };
            material.fragmentShader =
              "\nuniform sampler2D " +
              depVar.name +
              ";\n" +
              material.fragmentShader;
          }
        }
      }

      this.currentTextureIndex = 0;
      return null;
    };

    this.compute = function () {
      const currentTextureIndex = this.currentTextureIndex;
      const nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;

      for (let i = 0, il = this.variables.length; i < il; i++) {
        const variable = this.variables[i]; // Sets texture dependencies uniforms

        if (variable.dependencies !== null) {
          const uniforms = variable.material.uniforms;

          for (let d = 0, dl = variable.dependencies.length; d < dl; d++) {
            const depVar = variable.dependencies[d];
            uniforms[depVar.name].value =
              depVar.renderTargets[currentTextureIndex].texture;
          }
        } // Performs the computation for this variable

        this.doRenderTarget(
          variable.material,
          variable.renderTargets[nextTextureIndex]
        );
      }

      this.currentTextureIndex = nextTextureIndex;
    };

    this.getCurrentRenderTarget = function (variable) {
      return variable.renderTargets[this.currentTextureIndex];
    };

    this.getAlternateRenderTarget = function (variable) {
      return variable.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
    };

    function addResolutionDefine(materialShader) {
      materialShader.defines.resolution =
        "vec2( " + sizeX.toFixed(1) + ", " + sizeY.toFixed(1) + " )";
    }

    this.addResolutionDefine = addResolutionDefine; // The following functions can be used to compute things manually

    function createShaderMaterial(computeFragmentShader, uniforms) {
      uniforms = uniforms || {};
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: getPassThroughVertexShader(),
        fragmentShader: computeFragmentShader
      });
      addResolutionDefine(material);
      return material;
    }

    this.createShaderMaterial = createShaderMaterial;

    this.createRenderTarget = function (
      sizeXTexture,
      sizeYTexture,
      wrapS,
      wrapT,
      minFilter,
      magFilter
    ) {
      sizeXTexture = sizeXTexture || sizeX;
      sizeYTexture = sizeYTexture || sizeY;
      wrapS = wrapS || THREE.ClampToEdgeWrapping;
      wrapT = wrapT || THREE.ClampToEdgeWrapping;
      minFilter = minFilter || THREE.NearestFilter;
      magFilter = magFilter || THREE.NearestFilter;
      const renderTarget = new THREE.WebGLRenderTarget(
        sizeXTexture,
        sizeYTexture,
        {
          wrapS: wrapS,
          wrapT: wrapT,
          minFilter: minFilter,
          magFilter: magFilter,
          format: THREE.RGBAFormat,
          type: dataType,
          depthBuffer: false
        }
      );
      return renderTarget;
    };

    this.createTexture = function () {
      const data = new Float32Array(sizeX * sizeY * 4);
      return new THREE.DataTexture(
        data,
        sizeX,
        sizeY,
        THREE.RGBAFormat,
        THREE.FloatType
      );

    };

    this.renderTexture = function (input, output) {
      // Takes a texture, and render out in rendertarget
      // input = Texture
      // output = RenderTarget
      passThruUniforms.passThruTexture.value = input;
      this.doRenderTarget(passThruShader, output);
      passThruUniforms.passThruTexture.value = null;
    };

    this.doRenderTarget = function (material, output) {
      const currentRenderTarget = renderer.getRenderTarget();
      mesh.material = material;
      renderer.setRenderTarget(output);
      renderer.render(scene, camera);
      mesh.material = passThruShader;
      renderer.setRenderTarget(currentRenderTarget);
    }; // Shaders

    function getPassThroughVertexShader() {
      return (
        "void main()	{\n" +
        "\n" +
        "	gl_Position = vec4( position, 1.0 );\n" +
        "\n" +
        "}\n"
      );
    }

    function getPassThroughFragmentShader() {
      return (
        "uniform sampler2D passThruTexture;\n" +
        "\n" +
        "void main() {\n" +
        "\n" +
        "	vec2 uv = gl_FragCoord.xy / resolution.xy;\n" +
        "\n" +
        "	gl_FragColor = texture2D( passThruTexture, uv );\n" +
        "\n" +
        "}\n"
      );
    }
  }
}



(() => {
  window.addEventListener('load', () => {
    new Loading('loading', 'loaded');
    new FullScreen();
    new Sketch();
  });
})();
