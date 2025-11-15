const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {
    const prompt = document.getElementById("prompt").value;
    if (!prompt) return alert("Scrivi un prompt!");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Generazione in corso...", 50, 320);

    try {
        const res = await fetch("/api/generate_image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });
        const data = await res.json();
        const urls = data.urls || [];

        if (urls.length === 0) return alert("Nessuna immagine generata!");

        // Carica la prima immagine sul canvas
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = urls[0];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };

    } catch (err) {
        console.error(err);
        alert("Errore nella generazione.");
    }
});
