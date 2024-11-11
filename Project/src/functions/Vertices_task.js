/**
 * Create vertices program 10k vertices to draw image
 */

function Vertices_task(gl, vertices_count, shape_pattern) {
    function createSquareVertices(x, y, z, size, color) {
        return [
            x, y, z, 1, 0, 0, 1,               // Vertex 1: Bottom-left corner (Red)
            x + size, y, z,  1, 0, 0, 1,         // Vertex 2: Bottom-right corner (Green)
            x, y + size, z, 1, 0, 0, 1,     // Vertex 3: Top-left corner (Blue)

            x, y + size, z, 0, 0, 1, 1,        // Vertex 4: Top-left corner (Blue)
            x + size, y, z, 0, 0, 1, 1,       // Vertex 5: Bottom-right corner (Green)
            x + size, y + size, z, 0, 0, 1, 1,   // Vertex 6: Top-right corner (Yellow)
        ];
    }

    const vertexData = [];
    const squareSize = 0.1;
    const numSquares = Math.floor(vertices_count / 6); // 6 vertices per square
    const colors = [
        [1, 0, 0, 0.7], // Red
        [0, 0, 1, 0.7]  // Blue
    ];

    let currentX = -1;
    let currentY = -1;
    let currentZ = 0; // Set Z to 0 for 2D rendering

    for (let i = 0; i <= numSquares - 1; i++) {
        const color = colors[i % 2]; // Alternate colors
        // vertexData.push(...createSquareVertices(currentX, currentY, currentZ, squareSize, color));
        //implement shape pattern
        for (let j = 0; j < shape_pattern.length; j++) {
            for (let k = 0; k < shape_pattern[j].length; k++) {
                if (shape_pattern[j][k] == 1) {
                    vertexData.push(...createSquareVertices(currentX + (k * squareSize), currentY + (j * squareSize), currentZ, squareSize, color));
                }
            }
        }
        // currentX += squareSize;
        // if (currentX >= 0.5) {
        //     currentY += squareSize;
        //     currentX = -0.5;
        // }
        // if(currentY >= 0.5) {
        //     currentY = -0.5;
        //     currentX = -0.5;
        // }
    }

    // Print vertex data for debugging
    printVertexData(vertexData);
    return vertexData;
}
function printVertexData(vertexData) {
    const vertexSize = 7; // 3 for position (x, y, z) and 4 for color (r, g, b, a)
    for (let i = 0; i < vertexData.length; i += vertexSize) {
        const position = vertexData.slice(i, i + 3);
        const color = vertexData.slice(i + 3, i + 7);
        console.log(`Vertex ${i / vertexSize}: Position = [${position}], Color = [${color}]`);
    }
}