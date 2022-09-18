#ifdef GL_ES
  precision mediump float;
#endif

attribute vec2 a_position;
attribute vec3 a_color ;

varying vec3 fragColor;

void main(void) {
  fragColor = a_color;
  gl_Position = vec4(a_position,0.0,1.0);
}
