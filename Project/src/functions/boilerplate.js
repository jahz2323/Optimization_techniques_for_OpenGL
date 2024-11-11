let shape_pattern = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0]
];

function WebGL(gl) {
    let vertices_count = 10000; // Update to reflect the total number of vertices needed
    const vertexData = Vertices_task(gl, vertices_count, shape_pattern);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    checkShaderCompileStatus(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    checkShaderCompileStatus(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    checkProgramLinkStatus(program);

    const positionLocation = gl.getAttribLocation(program, 'position');
    const colorLocation = gl.getAttribLocation(program, 'color');

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 7 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);

    gl.useProgram(program);

    // Set the viewport and clear the canvas
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const numSquares = Math.floor(vertices_count / 6); // 6 vertices per square
    gl.drawArrays(gl.TRIANGLES, 0, numSquares * 6); // 6 vertices per square
}