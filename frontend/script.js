const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const generateBtn = document.getElementById("generate");
const promptInput = document.getElementById("prompt");
const downloadDiv = document.getElementById("download-link");

// Chiamata al backend per generare immagini
async function fetchImages(prompt) {
  const res = await fetch("/api/generate_image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  const data = await res.json();
  return data.urls || [];
}

// Funzione per creare il reel video
async function createReelVideo(urls) {
  return new Promise(async (resolve) => {
    const stream = canvas.captureStream(30); // 30fps
    const recordedChunks = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    mediaRecorder.start();

    for (let url of urls) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      await new Promise(r => img.onload = r);

      // Animazione fade semplice
      for (let alpha = 0; alpha <= 1; alpha += 0.05) {
        ctx.globalAlpha = alpha;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        await new Promise(r => setTimeout(r, 30));
      }
      ctx.globalAlpha = 1;
      await new Promise(r => setTimeout(r, 1000)); // immagine visibile 1 secondo
    }

    mediaRecorder.stop();
  });
}

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value;
  if (!prompt) return alert("Inserisci un prompt");

  downloadDiv.innerHTML = "Generazione in corso…";
  const urls = await fetchImages(prompt);

  if (!urls.length) return alert("Nessuna immagine generata");

  const videoURL = await createReelVideo(urls);

  const a = document.createElement("a");
  a.href = videoURL;
  a.download = "reel.webm";
  a.textContent = "Scarica il tuo reel!";
  downloadDiv.innerHTML = "";
  downloadDiv.appendChild(a);
});
