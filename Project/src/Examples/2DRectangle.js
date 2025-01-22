// Vertex shader program
const vsGSGL = `
    precision mediump float;
    attribute vec3 coordinates;
    attribute vec3 color;
    varying vec3 vColor;
    void main(void) {
        vColor = color;
        gl_Position = vec4(coordinates, 1);
    }
`;

const fsGSGL = `
    precision mediump float;
    uniform vec4 u_color;
    varying vec3 vColor;
    void main(void) {
        gl_FragColor = vec4(0.0,1.0,0.0, 1); //green color 
    }
`;

function _2DRectangle(gl, canvas) {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    const dim = 2;
    // Define the vertices for a rectangle
    const vertices = new Float32Array([
        -0.5,  0.5,  // Top left
        -0.5, -0.5,  // Bottom left
        0.5,  0.5,  // Top right
        -0.5, -0.5,  // Bottom left
        0.5, -0.5,  // Bottom right
        0.5,  0.5   // Top right
    ]);


    // Create a buffer for the vertex data
    const posbuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posbuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Create and compile the vertex shader
    const vertexshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexshader, vsGSGL);
    gl.compileShader(vertexshader);

    // Create and compile the fragment shader
    const fragmentshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentshader, fsGSGL);
    gl.compileShader(fragmentshader);

    // Create the program and attach the shaders
    const program = gl.createProgram();
    gl.attachShader(program, vertexshader);
    gl.attachShader(program, fragmentshader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Get the position attribute location and enable it
    const positionlocation = gl.getAttribLocation(program, "coordinates");
    gl.enableVertexAttribArray(positionlocation);
    gl.vertexAttribPointer(positionlocation, dim, gl.FLOAT, false, 0, 0);

    // Use the program and draw the rectangle
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 6); // Use TRIANGLE_FAN to draw a rectangle
    gl.flush();
}

export { _2DRectangle, vsGSGL, fsGSGL };
