#ifdef GL_ES
  precision mediump float;
#endif

attribute vec3 a_position;
attribute vec3 a_color;
varying vec3 fragColor;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld; 

void main(void) {
  fragColor = a_color;
  gl_Position = mProj * mView * mWorld * vec4(a_position,1.0);
}
