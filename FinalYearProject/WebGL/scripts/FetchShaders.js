/**
 * Fetch the frag and vertex shader txt from external files
 * @param vertexshaderpath
 * @param fragshaderpath
 * @returns {Promise<vertexshadertxt:string | null, fragmentshadertxt: string | null>}
 */

const canvas = document.getElementById("glCanvas");
let gl = canvas.getContext("webgl");
async function fetchShadertxt(vspath, fspath) {
    const result = {
        vspath: null,
        fspath: null,
    };
    let errors = [];

    await Promise.all([
        fetch(vspath).catch((error) => {
            errors.push(error);
        })
            .then(async (response) => {
                if (response.status === 200) {
                    result.vspath = await response.text();
                } else {
                    errors.push(`non-200 response for ${vspath}. ${response.status}: ${response.statusText}`);
                }
            }),
        fetch(fspath).catch((error) => {
            errors.push(error);
        })
            .then(async (response) => {
                if (response.status === 200) {
                    result.fspath = await response.text();
                } else {
                    errors.push(`non-200 response for ${fspath}. ${response.status}: ${response.statusText}`);
                }
            }),
    ]);

    if (errors.length !== 0) {
        throw new Error(
            `Failed to fetch shader(s):\n${JSON.stringify(errors, (key, value) => {
                if (value?.constructor.name === 'Error') {
                    return {
                        name: value.name,
                        message: value.message,
                        stack: value.stack,
                        cause: value.cause,
                    };
                }
                return value;
            }, 2)}`
        );
    }

    return result;
}


function clearCanvas() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}


export { fetchShadertxt,  clearCanvas};