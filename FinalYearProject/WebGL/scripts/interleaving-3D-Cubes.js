const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl")

let vsGLSL = `
attribute vec4 a_position;
attribute vec4 a_color;
uniform vec2 u_resolution;
varying vec4 vColor;

void main(){
    vec2 zeroToOne = a_position.xy / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
    vColor = a_color;
}
`;
let fsGLSL = `
precision mediump float;

varying vec4 vColor;

void main(){
    gl_FragColor = vColor;
}
`;


let interleaving_demo = () =>{
    //shaders
    //get locations
    //create buffers
    //clear
    //attribute pointers
    //draw

}