const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
if (!gl) {
    throw new Error('WebGL not supported');
}

function checkShaderCompileStatus(shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile failed with: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
}

function checkProgramLinkStatus(program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link failed with: ' + gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
}

function main() {
    const canvas = document.getElementById('glcanvas');
    //clear canvas
    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //ColourMask(gl,1.0, 0,1.0,1.0);
    WebGL(gl,vertexShaderSource,fragmentShaderSource);
}

const vertexShaderSource = `
attribute vec3 position;
attribute vec4 color;
varying vec4 vColor;
void main() {
    gl_Position = vec4(position, 1);
    vColor = color;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec4 vColor;
void main() {
    gl_FragColor = vColor;
}
`;

main();
