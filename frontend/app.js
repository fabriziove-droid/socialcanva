const canvas = document.createElement('canvas');
canvas.width = 360;
canvas.height = 640;
document.getElementById('container').appendChild(canvas);
const ctx = canvas.getContext('2d');

function generateReel() {
    const text = document.getElementById('textInput').value || "✨ Your Reel ✨";

    // Variabili animazione
    let start = Date.now();
    const duration = 5; // secondi
    const fps = 60;
    let circles = [];
    for(let i=0; i<20; i++){
        circles.push({
            x: Math.random()*360,
            y: Math.random()*640,
            r: Math.random()*30 + 10,
            speed: Math.random()*2 + 0.5,
            color: `hsl(${Math.random()*360},70%,60%)`
        });
    }

    // Stream per registrare
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

    // Animazione frame by frame
    function animate() {
        const elapsed = (Date.now() - start)/1000;
        if(elapsed>duration){
            recorder.stop();
            return;
        }

        // Sfondo animato
        const gradient = ctx.createLinearGradient(0,0,360,640);
        gradient.addColorStop(0, `hsl(${(elapsed*60)%360},70%,60%)`);
        gradient.addColorStop(1, `hsl(${(elapsed*60+60)%360},70%,70%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,360,640);

        // Cerchi animati
        circles.forEach(c=>{
            c.y -= c.speed;
            if(c.y + c.r < 0) c.y = 640 + c.r;
            ctx.beginPath();
            ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
            ctx.fillStyle = c.color;
            ctx.fill();
        });

        // Testo centrale animato
        ctx.fillStyle = 'white';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(text, 180, 320 + Math.sin(elapsed*3)*10);

        requestAnimationFrame(animate);
    }

    animate();
}
