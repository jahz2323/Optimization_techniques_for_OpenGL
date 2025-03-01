/*
    * Goal - Review optimisations arising from degenerate triangles
    * Steps

   non-degenerate triangles
   * create triangle strip with 50 triangles calling gl.drawArrays 50 times
   degenerate triangles
   * create triangle strip with 50 triangles with 2 degenerate triangles between each triangle
   * call gl.drawArrays once

 */

const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl");
//define vertex and fragment shaders
let vertexShaderSource = `
attribute vec4 a_position;
attribute vec4 a_color;
uniform vec2 u_resolution; 

varying vec4 vColor;

void main(){
    // convert the position from pixels to 0.0 to 1.0
     vec2 zeroToOne = a_position.xy / u_resolution;

     // convert from 0->1 to 0->2
     vec2 zeroToTwo = zeroToOne * 2.0;

     // convert from 0->2 to -1->+1 (clipspace)
     vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace, 0, 1);
    vColor = a_color;
}`;

let fragmentShaderSource = `
precision mediump float;

varying vec4 vColor;

void main(){
    gl_FragColor = vColor;
}`;


let meshwidth = canvas.width / 10;
let meshheight = canvas.height / 10;


let DemoSwitch = false; //FALSE is non-degenerate triangles, TRUE is degenerate triangles

function drawTriangle(triangle, positionBuffer, colorBuffer, color_data) {
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function randomColor() {
    //create random color from clip -1 to 1
    return [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, 1];
}

let triangle = [];
function createMesh(i=0,j=0, positionBuffer, colorBuffer) {
    if (!DemoSwitch) {
        //i is current mesh height pos
        //j is current mesh width pos
        let triangle = [
            20 + (j * 10), 20 + (i * 10),
            20 + (j * 10), 30 + (i * 10),
            30 + (j * 10), 30 + (i * 10),
        ];
        let triangle_reverse = [
            30 + (j * 10), 30 + (i * 10),
            30 + (j * 10), 20 + (i * 10),
            20 + (j * 10), 20 + (i * 10),
        ];
        let color_data = [
            1, 0, 0, 1, // Red
            0, 1, 0, 1, // Green
            0, 0, 1, 1  // Blue
        ];
        let color_data_reverse = [
            0, 0, 1, 1, // Blue
            0, 1, 0, 1, // Green
            1, 0, 0, 1  // Red
        ];


        drawTriangle(triangle, positionBuffer,colorBuffer,color_data);
        drawTriangle(triangle_reverse, positionBuffer,colorBuffer, color_data_reverse);
        return;
    }
    //generate degenerate triangles
    else{
        //determine if we need an even amount of triangles
        //each strip has 40 rectangles so 80 triangles
        //there are 40 rows of rectangles
        //introduce degenerate triangles for the gap between each row
        /*
        TEST
            example in notes
            v0 -v3 and v4 - v7
            introduce degenerate triangles between v3 and v4
         */
        // create for 40 squares 40 rows
        let color_data = [];
        let vertice_data = [];
        for(let i = 0; i < meshheight; i++){
            for(let j = 0; j < meshwidth; j++){
                //push two strip example
                color_data.push(
                    1, 0, 0, 1, // Red
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 1, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    1, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 0, 1,

                    0, 0, 0, 1,
                    0, 0, 0, 1,
                    0, 0, 1, 1,
                );
                vertice_data.push(
                    // First triangle
                    520 + (j * 10), 20 + (i * 10), // v0
                    520 + (j * 10), 30 + (i * 10), // v1
                    530 + (j * 10), 30 + (i * 10), // v2

                    // Second triangle
                    530 + (j * 10), 30 + (i * 10), // v2
                    520 + (j * 10), 20 + (i * 10), // v0
                    530 + (j * 10), 20 + (i * 10), // v3

                    // Degenerate triangle (stitch)
                    530 + (j * 10), 30 + (i * 10), // v2
                    530 + (j * 10), 20 + (i * 10), // v3
                    530 + (j * 10), 20 + (i * 10), // v3 (repeated)

                    // Degenerate triangle (stitch)
                    530 + (j * 10), 20 + (i * 10), // v3
                    530 + (j * 10), 20 + (i * 10), // v3
                    540 + (j * 10), 30 + (i * 10), // v4

                    530 + (j * 10), 20 + (i * 10), // v3
                    540 + (j * 10), 30 + (i * 10), // v4
                    540 + (j * 10), 30 + (i * 10), // v4

                    // Degenerate triangle (stitch)
                    540 + (j * 10), 30 + (i * 10), // v4
                    540 + (j * 10), 30 + (i * 10), // v4
                    540 + (j * 10), 20 + (i * 10), // v5 (repeated)

                    // Fourth triangle
                    540 + (j * 10), 30 + (i * 10), // v4
                    540 + (j * 10), 20 + (i * 10), // v5 (repeated)
                    550 + (j * 10), 30 + (i * 10), // v6

                    // Fifth triangle
                    540 + (j * 10), 20 + (i * 10), // v5
                    550 + (j * 10), 30 + (i * 10), // v6
                    550 + (j * 10), 20 + (i * 10), // v7
                );
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice_data), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_data), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, vertice_data.length / 2);
    }
   
}
function clearCanvas() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function createBuffers(program, positionAttributeLocation, colorAttributeLocation, resolutionUniformLocation, colorUniformLocation) {
    let positionBuffer = gl.createBuffer();
    let colorBuffer = gl.createBuffer();

    //resize canvas
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //clear the canvas
    clearCanvas();

    //tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Set up position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Set up color buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorAttributeLocation);
    //set the resolution
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


    console.log("Drawing non-degenerate triangles");
    let startTime = window.performance.now();

    //generate non-degenerate Triangle Strip

    for (let i = 0; i <= meshheight; i++) {
        if (i >= meshheight) {
            break;
        }
        for (let j = 0; j <= meshwidth; j++) {
            if (j >= meshwidth) {
                break;
            }
            createMesh(i, j, positionBuffer,colorBuffer);
        }

    }
    console.log("Finished drawing non-degenerate triangles");
    console.log("Time taken:", window.performance.now() - startTime);

    //generate degenerate Triangle Strip
    console.log("Drawing degenerate triangles");
    startTime = window.performance.now();
    DemoSwitch = true;
    createMesh(0, 0, positionBuffer,colorBuffer);
    console.log("Finished drawing degenerate triangles");
    console.log("Time taken:", window.performance.now() - startTime);
}

let degenerateTrianglesDemo = () => {
    //create program
    //setup shaders
    //create buffers
    //draw
    DemoSwitch = false;
    if (!gl) {
        console.log("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }
    console.log("Mesh width:", meshwidth);
    console.log("Mesh height:", meshheight);
    let program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    let resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    let colorUniformLocation = gl.getUniformLocation(program, "u_color");
    createBuffers(program, positionAttributeLocation, colorAttributeLocation, resolutionUniformLocation, colorAttributeLocation);
}


export {degenerateTrianglesDemo};