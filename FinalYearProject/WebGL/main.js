"use strict";
import { degenerateTrianglesDemo } from "./scripts/degenerate-triangles.js";
const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl");



function main() {
    //get gl context
    if (!gl) {
        console.log("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    console.log("WebGL initialized");
    //get rendering demos
    let DegenerateTriangles = document.getElementById("Degenerate-Triangles");

    //get reset button
    let Reset = document.getElementById("reset");


    $(DegenerateTriangles).click(function () {
        console.log("Starting Degenerate Triangles Demo");
        degenerateTrianglesDemo();
    });
    //reset canvas
    $(Reset).click(function () {
        console.log("Resetting canvas");
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        window.performance.clearMarks();
        window.performance.clearMeasures();

    });
}


$(document).ready(function () {
    main();
});