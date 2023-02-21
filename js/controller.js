function Controller (graph){
    this.graph = graph;
    let _this = this,
        $canvas = $(graph.gl.canvas)

    $canvas.on('mousedown', function (event) {
        if (graph.cursor === 0){
            let x = event.clientX;
            let y = event.clientY;
            graph.vertices.push(new Vertex(x,y))
            graph.scene()
            console.log(graph.vertices)
        }

    });

}

class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}