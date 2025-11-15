// Canvas stage
const stage = new Konva.Stage({
    container: "container",
    width: 360,
    height: 640
});
const layer = new Konva.Layer();
stage.add(layer);

// Aggiungi testo animato
function addText() {
    const val = document.getElementById("textInput").value;
    if (!val) return;

    const txt = new Konva.Text({
        x: 180,
        y: 700,
        text: val,
        fontSize: 30,
        fill: "black"
    });

    txt.offsetX(txt.width() / 2);
    layer.add(txt);

    txt.to({
        y: 300,
        duration: 1.5
    });

    layer.draw();
}

// Esporta video lato browser
function recordVideo() {
    const canvas = stage.toCanvas();
    const stream = canvas.captureStream(30); // 30 fps

    let chunks = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e => chunks.push(e.data);

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "reel.webm";
        a.click();
    };

    recorder.start();
    alert("Registrazione avviata (5s)");
    setTimeout(() => recorder.stop(), 5000);
}
