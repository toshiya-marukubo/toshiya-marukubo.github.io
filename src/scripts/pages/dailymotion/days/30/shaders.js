const fragment = `

precision mediump float;
precision mediump int;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec3 vPosition;
varying vec4 vColor;

float circle(vec2 p, float radius){
  vec2 dist = p - vec2(0.0);
	return 1.0 - smoothstep(radius - (radius*0.01), radius + (radius*0.01), dot(dist,dist) * 4.0);
}

void main()	{
  vec2 p = vec2(gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  vec3 color = vec3(circle(p, abs(sin(uTime)) * 0.9));

  gl_FragColor = vec4(color, 1.0);
}

`;

const vertex = `

precision mediump float;
precision mediump int;

attribute vec3 aPosition;

void main()	{
  gl_Position = vec4(aPosition, 1.0);
}

`;

const shaders = {
  vertex: vertex,
  fragment: fragment
}

export { shaders }
