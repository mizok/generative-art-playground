#ifdef GL_ES
  precision mediump float;
#endif
varying vec3 fragColor; 

void main(void) {
    gl_FragColor=vec4(fragColor,0.4);
}