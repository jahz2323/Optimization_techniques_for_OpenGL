//texture code
const texture_fsGSGL = `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;

    void main() {
        // look up a color from the texture
        gl_FragColor = texture2D(u_image, v_texCoord).gbra;
    }`;

const texture_vsGSGL = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;

    uniform vec2 u_resolution;

    varying vec2 v_texCoord;

   void main() {
   // convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = a_position / u_resolution;

   // convert from 0->1 to 0->2
   vec2 zeroToTwo = zeroToOne * 2.0;

   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace = zeroToTwo - 1.0;

   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

   // pass the texCoord to the fragment shader
   // The GPU will interpolate this value between points.
   v_texCoord = a_texCoord;
    }`;


const textureData = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
]

function texture_main() {
    const image = new Image();
    image.src = "../Textures/clouds_texture2885-3069400120.jpg"

    image.onload = function () {
        render(image);
    }
}

function render(image) {
    const canvas = document.querySelector('#glCanvas');
    const gl = canvas.getContext('webgl');
    const program = gl.createProgram();

    //vertex shader
    const vertexshader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexshader, texture_vsGSGL);
    gl.compileShader(vertexshader);
    //fragment shader
    const fragmentshader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentshader, texture_fsGSGL);
    gl.compileShader(fragmentshader);
    //create program
    gl.attachShader(program, vertexshader);
    gl.attachShader(program, fragmentshader);
    gl.linkProgram(program);

    try {
        console.log(gl.getShaderInfoLog(vertexshader));
        console.log(gl.getShaderInfoLog(fragmentshader));
        console.log(gl.getProgramInfoLog(program));
    }
    catch (err){
        console.error(err);
    }
    console.log("No errors");
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    function setRectangle(gl, x, y, width, height) {
        let x1 = x;
        let x2 = x + width;
        let y1 = y;
        let y2 = y + height;
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), gl.STATIC_DRAW);
    }

    setRectangle(gl, 0, 0, image.width, image.height);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureData), gl.STATIC_DRAW);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    const resolutionLocation = gl.getUniformLocation(program,"u_resolution");
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);

    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation,gl.canvas.width,gl.canvas.height);


    gl.drawArrays(gl.TRIANGLES, 0, 6);

}