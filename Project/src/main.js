import {_2DTriangle, vsGSGL, fsGSGL} from "./Examples/2DTriangle.js";
import {_2DRectangle} from "./Examples/2DRectangle.js";




function main() {
    const canvas = document.querySelector("#canvas");
    canvas.width = 400;
    canvas.height = 300;
// Initialize the GL context
    const gl = canvas.getContext("webgl");

// Only continue if WebGL is available and working
    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.",);
        return;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
// Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
// Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    function drawTriangle() {
        const type = "Triangle";
        gl.clear(gl.COLOR_BUFFER_BIT);
        _2DTriangle(gl, canvas);
        document.getElementById("Display").innerHTML = "Triangle";

    }

    function drawRectangle() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        const type = "Rectangle";
        _2DRectangle(gl, canvas);
        document.getElementById("Display").innerHTML = "Rectangle";

    }

    function drawCube() {
        // Implement the function to draw a 3D cube
        document.getElementById("Display").innerHTML = "Cube";

    }

    function drawSphere() {
        // Implement the function to draw a 3D sphere
        document.getElementById("Display").innerHTML = "Sphere";

    }

    document.getElementById("triangle").addEventListener("click", drawTriangle);
    document.getElementById("rectangle").addEventListener("click", drawRectangle);
    document.getElementById("cube").addEventListener("click", drawCube);
    document.getElementById("sphere").addEventListener("click", drawSphere);

}
const matrix = new Vector4(1,0,0,1).transform([
    1,0,0,0,
    0,1,0,0,
    0,0,1,0,
    0,0,0,1
    ]
);
console.log(matrix);
document.addEventListener("DOMContentLoaded", main);
main();