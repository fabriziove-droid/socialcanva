const canvas = document.createElement('canvas');
canvas.width = 360;
canvas.height = 640;
document.getElementById('container').appendChild(canvas);
const ctx = canvas.getContext('2d');

function generateReel() {
    const text = document.getElementById('textInput').value || "✨Your Reel✨";
    const duration = 8; // secondi
    const fps = 30;
    const totalFrames = duration * fps;
    let currentFrame = 0;

    // Tema contestuale
    const themes = [
        {
            pattern: /torta/i,
            bg: "#fff0f5",
            particles: "sprinkles",
            colors: ["#f8c8dc","#ffd1dc","#ffe4e1","#fff0f5"]
        },
        {
            pattern: /festa/i,
            bg: "#e0f7fa",
            particles: "confetti",
            colors: ["#ff8a80","#ffea00","#80d8ff","#ffd180"]
        },
        {
            pattern: /viaggio/i,
            bg: "#cce0ff",
            particles: "clouds",
            colors: ["#cce0ff","#99ccff","#66b2ff","#3399ff"]
        }
    ];

    // Default theme
    let theme = {bg:"#f2f2f2", particles:"stars", colors:["#ffe4b5","#ffdead","#fafad2","#fff8dc"]};
    themes.forEach(t => { if(t.pattern.test(text)) theme = t; });

    // Genera particelle multiple
    const particles = [];
    for(let i=0;i<50;i++){
        particles.push({
            x: Math.random()*360,
            y: Math.random()*640,
            r: Math.random()*8 + 4,
            speed: Math.random()*2 + 0.5,
            color: theme.colors[Math.floor(Math.random()*theme.colors.length)],
            rotation: Math.random()*360,
            rotSpeed: (Math.random()*2-1)*2
        });
    }

    // Stream video
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
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0,0,360,640);

        // Particelle animate con rotazione
        particles.forEach(p=>{
            p.y -= p.speed;
            if(p.y + p.r < 0) p.y = 640 + p.r;
            p.rotation += p.rotSpeed;
            ctx.save();
            ctx.translate(p.x,p.y);
            ctx.rotate(p.rotation*Math.PI/180);
            ctx.beginPath();
            ctx.arc(0,0,p.r,0,Math.PI*2);
            ctx.fillStyle = p.color;
            ctx.fill();
            ctx.restore();
        });

        // Testo animato lettera per lettera
        ctx.fillStyle = "#333";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        let offset = Math.sin(currentFrame*0.1)*20;
        ctx.fillText(text, 180, 320 + offset);

        currentFrame++;
        if(currentFrame <= totalFrames){
            requestAnimationFrame(drawFrame);
        } else {
            recorder.stop();
        }
    }

    drawFrame();
}
