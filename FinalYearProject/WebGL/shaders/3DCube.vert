
attribute vec4 a_position;
attribute vec4 a_color;

uniform mat4 u_matrix;

varying vec4 vColor;

void main() {
    //clip space
    gl_Position = u_matrix * a_position;
    vColor = a_color;
}