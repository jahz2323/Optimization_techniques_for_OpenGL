
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



function _2DTriangle(gl, canvas) {
    const vertexdata = [
        0,0.25,0,
        0.25,-0.25,0,
        -0.25,-0.25,0
    ];
    const colorData = [
        1,0,0,1, // red
        0,1,0,1, //green
        0,0,1,1 //blue
    ]

    const posbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexdata), gl.STATIC_DRAW);

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
    gl.useProgram(program);
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

    const uniformLocations = {
        matrix: gl.getUniformLocation(program, 'matrix'),
    }


    const matrix = glMatrix.mat4.create();
    //console.log(matrix, "Identity Matrix");
    glMatrix.mat4.translate( matrix, matrix, [-0.2, 0.5, 0.1]);
    glMatrix.mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);
    //console.log(matrix, "Translate Matrix");

    function animate() {
        requestAnimationFrame(animate);
        glMatrix.mat4.rotate(matrix, matrix, Math.PI/4/100, [0, 0, 1]);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

    }
    animate();
}

export { _2DTriangle, vsGSGL, fsGSGL };