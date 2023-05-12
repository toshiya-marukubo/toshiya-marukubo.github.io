export const vertexShader = `
uniform float uTime;                                                                                                                                                            
uniform float uMouse;
uniform vec2 uMeshSizes;

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vMeshSizes;

float PI = 3.14159265359;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  
  vUv = uv;
  vPosition = position;
  vMeshSizes = uMeshSizes;

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShader = ` 
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec2 vMeshSizes;
varying vec3 vPosition;

vec3 rain() {
  float x = vUv.x * vMeshSizes.x - mod(vUv.x * vMeshSizes.x, vMeshSizes.x / 24.0);
  
  float offset = sin(x * 15.0);
  float speed = cos(x * 3.0) * 0.3 + 0.7;

  float y = fract(vPosition.y / uResolution.y + uTime * 0.5 * speed + offset);
  
  return vec3(0.1, 1.0, 0.35) / (y * 15.0);
}

void main () {
  vec4 uv = texture2D(uTexture, vUv);
  
  vec3 color = vec3(uv.rgb * rain());

  gl_FragColor = vec4(color, 1.0);
}
`;
