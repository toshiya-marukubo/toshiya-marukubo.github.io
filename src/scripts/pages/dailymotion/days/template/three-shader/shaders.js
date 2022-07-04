const vertex = `

precision mediump float;
precision mediump int;

uniform float uTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
attribute vec4 color;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{
  
  vPosition = position;
  vColor = color;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}

`;

const fragment = `

precision mediump float;
precision mediump int;

uniform float uTime;

varying vec3 vPosition;
varying vec4 vColor;

void main()	{

  vec4 color = vec4( vColor );
  color.r += sin( vPosition.x * 0.1 + uTime ) * 0.5;

  gl_FragColor = color;

}

`;

const shaders = {
  vertex: vertex,
  fragment: fragment
}

export { shaders }
