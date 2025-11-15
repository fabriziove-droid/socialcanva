const canvas = document.createElement('canvas');
canvas.width = 360;
canvas.height = 640;
document.getElementById('container').appendChild(canvas);
const ctx = canvas.getContext('2d');

function generateReel() {
    const text = document.getElementById('textInput').value || "✨Your Reel✨";

    // Durata video
    const duration = 5; // secondi
    const fps = 30;
    const totalFrames = duration * fps;
    let currentFrame = 0;

    // Scegli tema in base al testo
    let theme = {
        bg: "#ffcccc",
        particles: "sprinkles",
        colors: ["#ff9aa2","#ffb7b2","#ffdac1","#e2f0cb"]
    };

    if(/torta/i.test(text)) {
        theme.bg = "#fff0f5";
        theme.particles = "sprinkles";
        theme.colors = ["#f8c8dc","#ffd1dc","#ffe4e1","#fff0f5"];
    } else if(/festa/i.test(text)) {
        theme.bg = "#e0f7fa";
        theme.particles = "balloons";
        theme.colors = ["#ff8a80","#ffea00","#80d8ff","#ffd180"];
    } else if(/viaggio/i.test(text)) {
        theme.bg = "#cce0ff";
        theme.particles = "clouds";
        theme.colors = ["#cce0ff","#99ccff","#66b2ff","#3399ff"];
    }

    // Genera particelle iniziali
    const particles = [];
    for(let i=0;i<30;i++){
        particles.push({
            x: Math.random()*360,
            y: Math.random()*640,
            r: Math.random()*10 + 5,
            speed: Math.random()*2 + 0.5,
            color: theme.colors[Math.floor(Math.random()*theme.colors.length)]
        });
    }

    // Stream per registrazione
    const stream = canvas.captureStream(fps);
    const chunks = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'reel.webm';
        a.click();
    };
    recorder.start();

    function drawFrame() {
        // Sfondo
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0,0,360,640);

        // Particelle animate
        particles.forEach(p=>{
            p.y -= p.speed;
            if(p.y + p.r < 0) p.y = 640 + p.r;
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        // Testo centrale oscillante
        ctx.fillStyle = "#333";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText(text, 180, 320 + Math.sin(currentFrame*0.2)*20);

        currentFrame++;
        if(currentFrame<=totalFrames){
            requestAnimationFrame(drawFrame);
        } else {
            recorder.stop();
        }
    }

    drawFrame();
}
