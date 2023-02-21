function initBuffers(gl, vs) {
    const positionBuffer = initPositionBuffer(gl, vs);

    return {
        position: positionBuffer,
    };
}

function initPositionBuffer(gl, vs) {
    let buffers = []
    vs.forEach(v=> {
        let x = v.x;
        let y = v.y;
        let vertexBuffer = gl.createBuffer(),
            vertices = [],
            vertCount = 2;
        for (let i = 0.0; i <= 720; i += 1) {
            let j = i * Math.PI / 180;
            let vert1 = [
                x+Math.sin(j),
                y+Math.cos(j),
            ];
            let vert2 = [
                x,
                y
            ];
            vertices = vertices.concat(vert1);
            vertices = vertices.concat(vert2);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        buffers.push(vertexBuffer)
    })
    return buffers
}

export { initBuffers };