
const btnPlay         = document.getElementById("btn-play");
const inputPlayerName = document.getElementById("input-playerName");

let errorParagraph = null;

// ─── Inicialização do tema ────────────────────────────────────────────────────
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        const toggle = document.getElementById("toggle_chkBox");
        if (toggle) toggle.checked = true;
    }
})();

// ─── Evento: clique no botão Jogar ───────────────────────────────────────────
btnPlay.addEventListener("click", handlePlay);

// Permite acionar o jogo pressionando Enter no campo de nome
inputPlayerName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handlePlay();
});

// ─── Evento: limpar erro ao digitar ──────────────────────────────────────────
inputPlayerName.addEventListener("input", () => {
    if (errorParagraph) {
        clearError();
    }
});

// ─── Funções principais ───────────────────────────────────────────────────────

/**
 * Valida o nome e redireciona para a tela do jogo.
 */
function handlePlay() {
    const playerName = inputPlayerName.value.trim();
    // Aceita letras (incluindo acentuadas) com 3 a 15 caracteres
    const validName = /^[a-zA-ZÀ-ÿ]{3,15}$/.test(playerName);

    clearError();

    if (!validName) {
        showError("<strong>* Insira um nome válido!</strong>");
        inputPlayerName.focus();
        return;
    }

    // Persiste nome e tema antes de navegar
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");

    window.location.href = "jokenpo.html";
}


function showError(msg) {
    errorParagraph = document.createElement("p");
    errorParagraph.innerHTML = msg;
    errorParagraph.classList.add("error-msg");
    errorParagraph.setAttribute("role", "alert");
    inputPlayerName.parentNode.insertBefore(errorParagraph, inputPlayerName.nextSibling);
    inputPlayerName.setAttribute("aria-invalid", "true");
}


function clearError() {
    if (errorParagraph) {
        errorParagraph.remove();
        errorParagraph = null;
    }
    inputPlayerName.removeAttribute("aria-invalid");
}
