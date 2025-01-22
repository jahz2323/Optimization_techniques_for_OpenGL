//Mouse position code ---
const box = document.querySelector('canvas')
const pageX = document.getElementById('x')
const pageY = document.getElementById('y')

function UserPos(evt) {
    // console.log("User Pos X: ", evt.x)
    // console.log("User Pos Y: ", evt.y)
    return evt;
}

box.addEventListener('mousemove', UserPos, false);
box.addEventListener('mouseenter', UserPos, false);
box.addEventListener('mouseleave', UserPos, false);

// Canvas code ------------
function main() {
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext("webgl");
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    Demo(gl, canvas);
}

const vsGSGL = `
    precision mediump float;
    
    attribute vec3 coordinates;
    attribute vec3 color;
    varying vec3 vColor;
    
    uniform mat4 matrix;
    
    void main(void) {
        vColor = color;
        gl_Position = matrix*vec4(coordinates, 1);
    }
`;

const fsGSGL = `
    precision mediump float;
    uniform vec4 u_color;
    varying vec3 vColor;
    void main(void) {
        gl_FragColor = vec4(vColor, 1);
    }
`;

// const r_vsGSGL = `
// attribute vec2 a_position;
// uniform mat3 u_matrix;
//
// void main() {
//   // Multiply the position by the matrix.
//   gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
// }`;


function Demo(gl, canvas) {
    const vertexdata = [
        0, 0.25, 0,
        0.25, -0.25, 0,
        -0.25, -0.25, 0
    ];
    const CubeData = [

        // Front
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        -.5, -.5, 0.5,

        // Left
        -.5, 0.5, 0.5,
        -.5, -.5, 0.5,
        -.5, 0.5, -.5,
        -.5, 0.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, -.5,

        // Back
        -.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, 0.5, -.5,
        0.5, 0.5, -.5,
        -.5, -.5, -.5,
        0.5, -.5, -.5,

        // Right
        0.5, 0.5, -.5,
        0.5, -.5, -.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, -.5, 0.5,
        0.5, -.5, -.5,

        // Top
        0.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, 0.5,
        -.5, 0.5, 0.5,
        0.5, 0.5, -.5,
        -.5, 0.5, -.5,

        // Bottom
        0.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, 0.5,
        -.5, -.5, 0.5,
        0.5, -.5, -.5,
        -.5, -.5, -.5,
    ];

    function randomColor() {
        return [Math.random(), Math.random(), Math.random()];
    }

    let colorData = [];
    for (let face = 0; face < 6; face++) {
        let facecolor = randomColor();
        for (let vertex = 0; vertex < 6; vertex++) {
            colorData.push(...facecolor);
        }
    }

    const posbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(CubeData), gl.STATIC_DRAW);

    const colorbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    //vertex shader
    const vertexshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexshader, vsGSGL);
    gl.compileShader(vertexshader);
    //fragment shader
    const fragmentshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentshader, fsGSGL);
    gl.compileShader(fragmentshader);

    //create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexshader);
    gl.attachShader(program, fragmentshader);
    gl.linkProgram(program);

    //get attribute in vertex shader
    const positionlocation = gl.getAttribLocation(program, "coordinates");
    gl.enableVertexAttribArray(positionlocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, posbuffer);
    gl.vertexAttribPointer(positionlocation, 3, gl.FLOAT, false, 0, 0);
    //get color attrib
    const colorlocation = gl.getAttribLocation(program, "color");
    gl.enableVertexAttribArray(colorlocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorbuffer);
    gl.vertexAttribPointer(colorlocation, 3, gl.FLOAT, false, 0, 0);
    //lookup uniforms
    // lookup uniforms
    // var colorLocation = gl.getUniformLocation(program, "u_color");
    // var matrixLocation = gl.getUniformLocation(program, "coordinates");
    // Set a random color.
    //gl.uniform4fv(colorLocation, [Math.random(), Math.random(), Math.random(), 1]);
    //requestAnimationFrame(drawScene);
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    const matrixLocation = gl.getUniformLocation(program, 'matrix')
    if (matrixLocation === null) {
        console.log("Matrix Location is null");
    }
    const matrix = glMatrix.mat4.create();
    //console.log(matrix, "Identity Matrix");
    glMatrix.mat4.translate(matrix, matrix, [0.2, 0.5, 0.1]);
    glMatrix.mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

    //console.log(matrix, "Translate Matrix");
    //TODO - 3D Translation
    // const translation = [0,0];
    // const width = 100;
    // const height = 50;
    // // Setup a ui.
    // webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
    // webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});


    function animate() {
        requestAnimationFrame(animate);
        gl.useProgram(program)
        glMatrix.mat4.rotate(matrix, matrix, Math.PI / 4 / 100, [0, 0, 1]);
        glMatrix.mat4.rotate(matrix, matrix, Math.PI / 4 / 100, [1, 0, 0]);
        gl.uniformMatrix4fv(matrixLocation, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, CubeData.length / 3);

    }

    animate();

}

document.addEventListener("DOMContentLoaded", main);
main();