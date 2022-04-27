export const vertexShaderForSphere = `
uniform float uTime;
uniform float uMouseSpeed;
varying vec2 vUv;
float PI = 3.14159265359;
// Reference
// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// Thank you so much.
float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}
float noise(vec3 p){
  vec3 a = floor(p);
  vec3 d = p - a;
  d = d * d * (3.0 - 2.0 * d);
  vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
  vec4 k1 = perm(b.xyxy);
  vec4 k2 = perm(k1.xyxy + b.zzww);
  vec4 c = k2 + a.zzzz;
  vec4 k3 = perm(c);
  vec4 k4 = perm(c + 1.0);
  vec4 o1 = fract(k3 * (1.0 / 41.0));
  vec4 o2 = fract(k4 * (1.0 / 41.0));
  vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
  vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
  return o4.y * d.y + o4.x * (1.0 - d.y);
}
void main(){
  float noisy = uMouseSpeed * pow(noise(normal * 2.0 + uTime * 10.0), 2.0);
  
  vec3 newPosition = position + noisy * normal * 100.0;
 
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  //vec3 pos = position;
  
  //pos.y += sin(pos.y * 0.01 - uTime * 20.0) * 20.0;
  //pos.z += sin(pos.y * 0.01 - uTime * 20.0) * 20.0;
  
  //vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  vUv = uv;
  
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const fragmentShaderForSphere = `
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
void main () {
  vec4 color = texture2D(uTexture, vUv);
  
  gl_FragColor = vec4(1.0 - color);
}
`;

export const vertexShaderForGround = `
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

export const vertexShaderForRain = `
attribute float number;
uniform float uTime;
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

export const fragmentShaderForRain = `
void main () {
  float f = length(gl_PointCoord - vec2(0.5, 0.5));
  if ( f > 0.1 ) discard;
  gl_FragColor = vec4(1.0, 1.0, 1.0, 0.4);
}
`;
