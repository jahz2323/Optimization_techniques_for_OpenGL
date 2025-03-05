const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl");

let vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;
varying vec4 vColor;

uniform mat4 u_matrix;

void main() {
    vec4 transformedPosition = u_matrix * a_position;
    gl_Position = transformedPosition;
    vColor = a_color;
}
`;

let fragmentShaderSource = `
precision mediump float;
varying vec4 vColor;

void main() {
    gl_FragColor = vColor;
}
`;

let positions = [
    // Front face
    0, 0, 0,
    100, 0, 0,
    100, 100, 0,
    0, 100, 0,
    // Back face
    0, 0, 100,
    100, 0, 100,
    100, 100, 100,
    0, 100, 100,
    // Top face
    0, 100, 0,
    100, 100, 0,
    100, 100, 100,
    0, 100, 100,
    // Bottom face
    0, 0, 0,
    100, 0, 0,
    100, 0, 100,
    0, 0, 100,
    // Right face
    100, 0, 0,
    100, 0, 100,
    100, 100, 100,
    100, 100, 0,
    // Left face
    0, 0, 0,
    0, 0, 100,
    0, 100, 100,
    0, 100, 0
];

let colors = [
    // Front face
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    // Back face
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    // Top face
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    // Bottom face
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    1, 1, 0, 1,
    // Right face
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    0, 1, 1, 1,
    // Left face
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1,
    1, 0, 1, 1
];


let error = gl.getError();
let vertice_count = 24;
let BytesPerVertex = 3 * Float32Array.BYTES_PER_ELEMENT + 4 * Uint8Array.BYTES_PER_ELEMENT;

let interleaved_data = new ArrayBuffer(vertice_count * BytesPerVertex);
let vertexPositionView = new Float32Array(interleaved_data);
let vertexColorView = new Uint8Array(interleaved_data); // 12 bytes offset for color

function setupAttributes(Locations, vertexBuffer) {
    let { program, positionAttributeLocation, colorAttributeLocation, matrixLocation } = Locations;
    console.log("setting up attributes");
    /*
    check if locations and program are defined
     */
    console.log("program:", program);
    console.log("positionAttributeLocation:", positionAttributeLocation);
    console.log("colorAttributeLocation:", colorAttributeLocation);
    console.log("matrixLocation:", matrixLocation);
    error = gl.getError();
    if (error !== gl.NO_ERROR) {
        console.error("WebGL error:", error);
    }

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 16, 12);

    let aspect = gl.canvas.width / gl.canvas.height;
    let perspectiveMatrix = createPerspectiveMatrix(Math.PI / 4, aspect, 1, 2000);
    console.log("Perspective matrix:", perspectiveMatrix);
    gl.uniformMatrix4fv(Locations.matrixLocation, false, perspectiveMatrix);

    error = gl.getError()
    if (error !== gl.NO_ERROR) {
        console.error("WebGL error:", error);
    }
    console.log("Number of vertices:", vertexBuffer.numItems);

    gl.drawArrays(gl.TRIANGLES, 0, vertexBuffer.numItems);
}

function setupBuffers() {
    console.log("setting up buffers");
    let vertexBuffer = gl.createBuffer();

    for (let v = 0; v < vertice_count; v++) {
        // Write position data (3 floats per vertex)
        vertexPositionView[v * 4] = positions[v * 3]; // x
        vertexPositionView[v * 4 + 1] = positions[v * 3 + 1]; // y
        vertexPositionView[v * 4 + 2] = positions[v * 3 + 2]; // z

        // Write color data (4 bytes per vertex, offset by 12 bytes)
        let colorOffset = v * 16 + 12; // 12 bytes offset for color
        vertexColorView[colorOffset] = colors[v * 4] ; // r
        vertexColorView[colorOffset + 1] = colors[v * 4 + 1] ; // g
        vertexColorView[colorOffset + 2] = colors[v * 4 + 2] ; // b
        vertexColorView[colorOffset + 3] = colors[v * 4 + 3] ; // a
    }
    
    console.log("First vertex position:", new Float32Array(interleaved_data, 0, 3));
    console.log("First vertex color:", new Uint8Array(interleaved_data, 12, 4));

    console.log("Last vertex position:", new Float32Array(interleaved_data, vertice_count * BytesPerVertex - 16, 3));
    console.log("Last vertex color:", new Uint8Array(interleaved_data, vertice_count * BytesPerVertex - 4, 4));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, interleaved_data, gl.STATIC_DRAW);

    console.log("vertexBuffer:", vertexBuffer);

    vertexBuffer.itemSize = 3;
    vertexBuffer.numItems = vertice_count;
    vertexBuffer.colorSize = 4;
    return vertexBuffer;
}

function clearCanvas() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function setupShaders() {
    console.log("setting up shaders");
    let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    let matrixLocation = gl.getUniformLocation(program, "u_matrix");

    if (!program) {
        console.error("Shader compilation or linking failed");
        return null;
    }
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    clearCanvas();

    gl.useProgram(program);

    return { program, positionAttributeLocation, colorAttributeLocation, matrixLocation };
}

function createPerspectiveMatrix(width, height, depth) {
    return [
        2 / width, 0, 0, 0,
        0, -2 / height, 0, 0,
        0, 0, 2 / depth, 0,
        -1, 1, 0, 1,
    ];
}

let interleaving_demo = () => {
    if(!gl){
        console.log("WebGL not initialized");
        return;
    }
    else{
        console.log("WebGL initialized");
    }

    gl.enable(gl.DEPTH_TEST);
    let Locations = {
        program: null,
        positionAttributeLocation: null,
        colorAttributeLocation: null,
        matrixLocation: null
    };
    let setupShadersResult = setupShaders();
    Locations = { ...Locations, ...setupShadersResult };

    let vertexBuffer = setupBuffers();

    setupAttributes(Locations, vertexBuffer);
};

export { interleaving_demo };