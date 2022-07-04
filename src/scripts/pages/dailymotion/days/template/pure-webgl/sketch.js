import * as THREE from 'three';
import * as dat from 'dat.gui';
import { Stopwatch } from '../../modules/stopwatch'; 
import { Ease } from '../../modules/ease';
import { Utilities } from '../../modules/utilities';
import { shaders } from  './shaders';

class Mouse {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.setupEvents();
  }

  setupEvents() {
    window.addEventListener('mousemove', this.onMousemove.bind(this), false);
    window.addEventListener('touchmove', this.onTouchmove.bind(this), false);
  }

  onMousemove(e) {
    this.x = e.clientX - window.innerWidth / 2;
    this.y = -e.clientY + window.innerHeight / 2;
  }

  onTouchmove(e) {
    const touch = e.targetTouches[0];

    this.x = touch.pageX - window.innerWidth / 2;
    this.y = -touch.pageY + window.innerHeight / 2;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}

/**
 * Sketch class
 */
export class Sketch {
  constructor() {
    this.setupGUI();
    this.setupCanvas();
    this.setupEvents();
    this.initialize();
  }

  setupGUI() {
    this.gui = new dat.GUI();
    this.gui.params = {
      st: 0.001,
    };
    this.gui.ctrls = {
      st: this.gui.add(this.gui.params, 'st', 0.001, 1.0, 0.001),
    };
    this.gui.hide();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    document.body.appendChild(this.canvas);

    this.canvas.style.background = '#000';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.display = 'block';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.zIndex = '-1';
  }
  
  setupEvents() {
    window.addEventListener('resize', this.onResize.bind(this), false);
  }
  
  onResize() {
    this.initialize();
  }

  initialize() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.time = new Stopwatch();
    this.mouse = new Mouse();

    this.gl = this.canvas.getContext("webgl");
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.width, this.height);

    this.shader = new Shader(this);

    this.draw();
  }

  draw() {
    this.time.calculateTime();

    this.shader.render(this.time.getElapsedTime() * this.gui.params.st);

    this.animationId = requestAnimationFrame(this.draw.bind(this));
  }
}

/**
 * Shader class
 */
class Shader {
  constructor(sketch) {
    this.sketch = sketch;
    this.mouse = this.sketch.mouse;
    this.gl = this.sketch.gl;

    this.position = [
      -1.0,  1.0,  0.0,
       1.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
    ];

    this.index = [
      0, 2, 1,
      1, 2, 3
    ];

    this.initialize();
  }

  initialize() {
    this.vertexShader = this.createVertexShader(shaders.vertex);
    this.fragmentShader = this.createFragmentShader(shaders.fragment);

    this.program = this.createProgram(this.vertexShader, this.fragmentShader);

    this.vertexIndex = this.createIbo(this.index);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vertexIndex);

    this.vertexPosition = this.createVbo(this.position);
    this.setAttributes({
      position: {
        location: this.gl.getAttribLocation(this.program, 'aPosition'),
        size: 3,
        buffer: this.vertexPosition
      }
    });

    this.uniLocation = [];
    this.uniLocation[0] = this.gl.getUniformLocation(this.program, 'uTime');
    this.uniLocation[1] = this.gl.getUniformLocation(this.program, 'uMouse');
    this.uniLocation[2] = this.gl.getUniformLocation(this.program, 'uResolution');

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  }

  createVertexShader(src) {
    const shader = this.gl.createShader(this.gl.VERTEX_SHADER);
    
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      
      return shader;
    } else {
      console.log(this.gl.getShaderInfoLog(shader));
    }
  }

  createFragmentShader(src) {
    const shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    
    this.gl.shaderSource(shader, src);
    this.gl.compileShader(shader);
    
    if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      
      return shader;
    } else {
      console.log(this.gl.getShaderInfoLog(shader));
    }
  }
  
  createProgram(vs, fs) {
    const program = this.gl.createProgram();

    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);

    if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      this.gl.useProgram(program);

      return program;
    } else {
      console.log(this.gl.getProgramInfoLog(program));
    }
  }

  createVbo(data) {
    const vbo = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    return vbo;
  }

  createIbo(data) {
    const ibo = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    return ibo;
  }

  setAttributes(attributes) {
    Object.keys(attributes).forEach((name) => {
      const attribute = attributes[name];

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attribute.buffer);
      this.gl.enableVertexAttribArray(attribute.location);
      this.gl.vertexAttribPointer(attribute.location, attribute.size, this.gl.FLOAT, false, 0, 0);
    });

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  render(time) {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.uniform1f(this.uniLocation[0], time);
    this.gl.uniform2fv(this.uniLocation[1], [this.mouse.getX(), this.mouse.getY()]);
    this.gl.uniform2fv(this.uniLocation[2], [this.sketch.width, this.sketch.height]);

    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    this.gl.flush();
  }
}
