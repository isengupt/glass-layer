export var fragment1 = `

uniform float time;
uniform float progress;
uniform sampler2D texture;
uniform vec4 resolution;

varying vec2 vUv;
varying vec3 vPosition;
varying float  vDist;
float PI = 3.141592653589793238;
void main(){

vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);

  
  

  gl_FragColor = vec4(1.0,1.0,1.0,0.9 * vDist);
  
  

}
`;
