export var vertex = `
attribute vec3 color;
varying vec2 vUv;
varying vec2 vUv1;
uniform vec2 uvRate1;
uniform sampler2D texture;
  void main() {
    vUv = uv;
    

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;
