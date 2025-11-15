const stage = new Konva.Stage({
    container: "container",
    width: 360,
    height: 640
});
const layer = new Konva.Layer();
stage.add(layer);

function applyTemplate(num) {
    layer.destroyChildren();

    if (num === 1) {
        const txt = new Konva.Text({ x: 180, y: 300, text: "Ciao Template 1", fontSize: 30, fill: "red" });
        txt.offsetX(txt.width()/2);
        layer.add(txt);
    } else if (num === 2) {
        const txt = new Konva.Text({ x: 180, y: 300, text: "Ciao Template 2", fontSize: 30, fill: "blue" });
        txt.offsetX(txt.width()/2);
        layer.add(txt);
    } else if (num === 3) {
        const txt = new Konva.Text({ x: 180, y: 300, text: "Ciao Template 3", fontSize: 30, fill: "green" });
        txt.offsetX(txt.width()/2);
        layer.add(txt);
    }

    layer.draw();
}
