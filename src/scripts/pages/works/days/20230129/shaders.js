export const vertexShader = `
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

export const fragmentShader = ` 
uniform float uTime;
uniform sampler2D uTexture;
varying vec2 vUv;
void main () {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = vec4(color);
}
`;
