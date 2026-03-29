let deferredPrompt;

// Detecta instalação PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  showInstallButton();
});

function showInstallButton() {
  const btn = document.createElement("button");
  btn.innerText = "📲 Instalar App";
  btn.style.position = "fixed";
  btn.style.bottom = "20px";
  btn.style.right = "20px";
  btn.style.padding = "12px";
  btn.style.background = "#4f7cff";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "10px";
  btn.style.zIndex = "9999";

  btn.onclick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;

      if (choice.outcome === 'accepted') {
        console.log("App instalado");
      }

      deferredPrompt = null;
      btn.remove();
    }
  };

  document.body.appendChild(btn);
}

// Detecta modo app
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log("Rodando como APP instalado");
}
