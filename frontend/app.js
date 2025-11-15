// === CREAZIONE CANVAS KONVA ===
const stage = new Konva.Stage({
    container: 'container',
    width: 360,
    height: 640,
});

const layer = new Konva.Layer();
stage.add(layer);

// === AGGIUNTA TESTO ===
function addText() {
    const val = document.getElementById('textInput').value;
    if (!val) return;

    const txt = new Konva.Text({
        x: 180,
        y: 700, // fuori dallo schermo per animazione
        text: val,
        fontSize: 28,
        fill: 'black',
        align: 'center',
    });
    txt.offsetX(txt.width() / 2);
    layer.add(txt);

    // Animazione di ingresso
    txt.to({
        y: 300,
        duration: 1.5,
        easing: Konva.Easings.EaseInOut,
    });

    layer.draw();
}

// === ESPORTAZIONE VIDEO ===
let recorder;
let recordedChunks = [];

function startRecording() {
    const canvas = stage.toCanvas();
    const stream = canvas.captureStream(30);

    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    recorder.ondataavailable = e => recordedChunks.push(e.data);

    recorder.onstop = saveVideo;

    recorder.start();

    alert("Registrazione avviata per 5 secondi...");
    setTimeout(() => recorder.stop(), 5000);
}

function saveVideo() {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "reel.webm";
    a.click();

    recordedChunks = [];
}
