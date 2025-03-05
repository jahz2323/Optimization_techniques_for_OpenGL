"use strict";
import { degenerateTrianglesDemo } from "./scripts/degenerate-triangles.js";
import { interleaving_demo } from "./scripts/interleaving-data.js";
import {CameraDemo} from "./scripts/Camera.js";
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
    let Interleaving3DCubes = document.getElementById("Interleaving-Data");
    let Camera = document.getElementById("Camera");

    //get reset button
    let Reset = document.getElementById("reset");

    $(DegenerateTriangles).click(function () {
        console.log("Starting Degenerate Triangles Demo");
        degenerateTrianglesDemo();
    });
    $(Interleaving3DCubes).click(function () {
        console.log("Starting Interleaving 3D Cubes Demo");
        interleaving_demo();
    });
    $(Camera).click(function () {
         console.log("Starting Camera Demo");
         CameraDemo();
    })

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