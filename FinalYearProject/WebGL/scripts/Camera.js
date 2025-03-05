import {fetchShadertxt, clearCanvas} from "./FetchShaders.js";
const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl");
let ctx = WebGLDebugUtils.makeDebugContext(canvas.getContext("webgl"));
/*
    Draw via indexed geometry
 */
let vertices = [
    // Front face
    50, 50, 0,
    15, 50, 0,
    15, 15, 0,
    50, 50, 0,
    15, 15, 0,
    50, 15, 0,

    // Back face
    50, 50, -50,
    15, 15, -50,
    15, 50, -50,
    50, 50, -50,
    50, 15, -50,
    15, 15, -50,

    // Top face
    15, 50, 0,
    50, 50, 0,
    50, 50, -50,
    15, 50, 0,
    50, 50, -50,
    15, 50, -50,

    // Bottom face
    15, 15, 0,
    50, 15, -50,
    50, 15, 0,
    15, 15, 0,
    15, 15, -50,
    50, 15, -50,

    // Left face
    15, 15, 0,
    15, 50, -50,
    15, 50, 0,
    15, 15, 0,
    15, 15, -50,
    15, 50, -50,

    // Right face
    50, 15, 0,
    50, 50, 0,
    50, 50, -50,
    50, 15, 0,
    50, 50, -50,
    50, 15, -50
];
let colors = [
    //front face
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    //back face
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    //top face
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    //bottom face
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    //left face
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    //right face
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
]


const vsglsl_path= '../WebGL/shaders/3DCube.vert';
const fsglsl_path= '../WebGL/shaders/3DCube.frag';


let m4 = {

    projection: function(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [
            2 / width, 0, 0, 0,
            0, -2 / height, 0, 0,
            0, 0, 2 / depth, 0,
            -1, 1, 0, 1,
        ];
    },

    multiply: function(a, b) {
        let a00 = a[0 * 4 + 0];
        let a01 = a[0 * 4 + 1];
        let a02 = a[0 * 4 + 2];
        let a03 = a[0 * 4 + 3];
        let a10 = a[1 * 4 + 0];
        let a11 = a[1 * 4 + 1];
        let a12 = a[1 * 4 + 2];
        let a13 = a[1 * 4 + 3];
        let a20 = a[2 * 4 + 0];
        let a21 = a[2 * 4 + 1];
        let a22 = a[2 * 4 + 2];
        let a23 = a[2 * 4 + 3];
        let a30 = a[3 * 4 + 0];
        let a31 = a[3 * 4 + 1];
        let a32 = a[3 * 4 + 2];
        let a33 = a[3 * 4 + 3];
        let b00 = b[0 * 4 + 0];
        let b01 = b[0 * 4 + 1];
        let b02 = b[0 * 4 + 2];
        let b03 = b[0 * 4 + 3];
        let b10 = b[1 * 4 + 0];
        let b11 = b[1 * 4 + 1];
        let b12 = b[1 * 4 + 2];
        let b13 = b[1 * 4 + 3];
        let b20 = b[2 * 4 + 0];
        let b21 = b[2 * 4 + 1];
        let b22 = b[2 * 4 + 2];
        let b23 = b[2 * 4 + 3];
        let b30 = b[3 * 4 + 0];
        let b31 = b[3 * 4 + 1];
        let b32 = b[3 * 4 + 2];
        let b33 = b[3 * 4 + 3];
        return [
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ];
    },

    translation: function(tx, ty, tz) {
        return [
            1,  0,  0,  0,
            0,  1,  0,  0,
            0,  0,  1,  0,
            tx, ty, tz, 1,
        ];
    },

    xRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1,
        ];
    },

    yRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1,
        ];
    },

    zRotation: function(angleInRadians) {
        let c = Math.cos(angleInRadians);
        let s = Math.sin(angleInRadians);

        return [
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ];
    },

    scaling: function(sx, sy, sz) {
        return [
            sx, 0,  0,  0,
            0, sy,  0,  0,
            0,  0, sz,  0,
            0,  0,  0,  1,
        ];
    },

    translate: function(m, tx, ty, tz) {
        return m4.multiply(m, m4.translation(tx, ty, tz));
    },

    xRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.xRotation(angleInRadians));
    },

    yRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.yRotation(angleInRadians));
    },

    zRotate: function(m, angleInRadians) {
        return m4.multiply(m, m4.zRotation(angleInRadians));
    },

    scale: function(m, sx, sy, sz) {
        return m4.multiply(m, m4.scaling(sx, sy, sz));
    },

};
function SetupBuffers(vsglsl,fsglsl){
    let program = webglUtils.createProgramFromSources(gl,[vsglsl, fsglsl]);
    //use program
    gl.useProgram(program);
    gl.getError();

    let positionLoc = gl.getAttribLocation(program, "a_position");
    let colorloc = gl.getAttribLocation(program, "a_color");
    let matrixloc = gl.getUniformLocation(program, "u_matrix");

    let position_buffer = gl.createBuffer();
    let color_buffer = gl.createBuffer();

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    clearCanvas();

    webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
    webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#z", {value: translation[2], slide: updatePosition(2), max: gl.canvas.height});
    webglLessonsUI.setupSlider("#angleX", {value: radToDeg(rotation[0]), slide: updateRotation(0), max: 360});
    webglLessonsUI.setupSlider("#angleY", {value: radToDeg(rotation[1]), slide: updateRotation(1), max: 360});
    webglLessonsUI.setupSlider("#angleZ", {value: radToDeg(rotation[2]), slide: updateRotation(2), max: 360});
    webglLessonsUI.setupSlider("#scaleX", {value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleY", {value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2});
    webglLessonsUI.setupSlider("#scaleZ", {value: scale[2], slide: updateScale(2), min: -5, max: 5, step: 0.01, precision: 2});


    // pos attribute
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position_buffer), gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);

    // color attribute
    gl.enableVertexAttribArray(colorloc);
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_buffer), gl.STATIC_DRAW);
    gl.vertexAttribPointer(colorloc, 4, gl.UNSIGNED_BYTE, false, 0, 0);


    // Matrix uniform
    console.log("Canvas dim" , gl.canvas.width, gl.canvas.height);
    let matrix = m4.projection(gl.canvas.width, gl.canvas.height, 400);
    matrix = m4.translate(matrix,0,0,20);
    console.log("affine matrix", matrix);
    gl.uniformMatrix4fv(matrixloc, false, matrix);

    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

let CameraDemo = async () => {
    if (!gl) {
        console.error("WebGL requires WebGL!");
    }
    let vsglsl= null;
    let fsglsl = null;
    try {
        const shaders = await fetchShadertxt(vsglsl_path,fsglsl_path);
        vsglsl = shaders.vspath;
        fsglsl = shaders.fspath;
        console.log(vsglsl);
        console.log(fsglsl);
        gl.enable(gl.CULL_FACE);
        /**
         * Create scene here
         *  program, locations
         *  Create buffers
         */
        SetupBuffers(vsglsl,fsglsl);
    } catch (error) {
        console.error("Error loading WebGL context" , error);
    }
}
export {CameraDemo}
