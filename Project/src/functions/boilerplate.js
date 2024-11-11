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

function createShader(gl,type,source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
    if(success){
        return shader;
    }
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl,vertexShader,fragmentShader){
    const program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program,gl.LINK_STATUS);
    if(success){
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}



function WebGL(gl,vertexShaderSource,fragmentShaderSource){
    let vertices_count = 10000;
    //create GLSL Shaders, upload the GLSL source, compile the shaders
    let vertexShader = createShader(gl,gl.VERTEX_SHADER,vertexShaderSource);
    let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);
    //link the two shaders into a program
    let program = createProgram(gl,vertexShader,fragmentShader);
    //look up where the vertex data needs to go.
    let positionAttributeLocation = gl.getAttribLocation(program,'position');
    let colorAttributeLocation = gl.getAttribLocation(program,'color');
    //create a buffer and clip 2d positions to the webgl context
    let positionBuffer = gl.createBuffer();
    //bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    let vertexArray = Vertices_task(gl,vertices_count,shape_pattern);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertexArray),gl.STATIC_DRAW);
    //turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation,3,gl.FLOAT,false,7*Float32Array.BYTES_PER_ELEMENT,0);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation,4,gl.FLOAT,false,7*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT);
    //bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER,positionBuffer);
    //use program
    gl.useProgram(program);
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.clearColor(0, 0, 0, 0.9);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const numsquares = Math.floor(vertices_count/6);
    gl.drawArrays(gl.TRIANGLES,0,numsquares*6);

}