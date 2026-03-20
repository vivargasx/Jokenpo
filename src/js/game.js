const CHOICES = ["pedra", "papel", "tesoura"];

/** Mapa de vitórias: chave vence o valor */
const WINS_AGAINST = {
    pedra:   "tesoura",
    papel:   "pedra",
    tesoura: "papel",
};

/** Imagens de cada escolha */
const CHOICE_IMAGES = {
    pedra:   "img/pedra-btn.png",
    papel:   "img/papel-btn.png",
    tesoura: "img/tesoura-btn.png",
};

// ─── Estado do jogo ───────────────────────────────────────────────────────────
let playerScore = 0;
let cpuScore    = 0;
let isAnimating = false;

// ─── Seletores ────────────────────────────────────────────────────────────────
const playerGreeting     = document.getElementById("player-greeting");
const playerScoreLabel   = document.getElementById("player-score-label");
const playerScoreEl      = document.getElementById("player-score");
const cpuScoreEl         = document.getElementById("cpu-score");
const playerChoiceDisplay = document.getElementById("player-choice-display");
const cpuChoiceDisplay    = document.getElementById("cpu-choice-display");
const resultMessage       = document.getElementById("result-message");
const btnReset            = document.getElementById("btn-reset");
const gameButtons         = document.querySelectorAll(".btn-game");

// ─── Inicialização ────────────────────────────────────────────────────────────
(function init() {
    // Restaura tema
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    // Exibe saudação personalizada
    const playerName = localStorage.getItem("playerName");
    if (playerName) {
        playerGreeting.textContent = `Olá, ${playerName}! Escolha sua jogada.`;
        playerScoreLabel.textContent = playerName;
    } else {
        // Redireciona se não houver nome (acesso direto à página)
        window.location.href = "index.html";
        return;
    }

    // Restaura placar salvo
    const savedPlayerScore = parseInt(localStorage.getItem("playerScore"), 10);
    const savedCpuScore    = parseInt(localStorage.getItem("cpuScore"), 10);
    if (!isNaN(savedPlayerScore)) playerScore = savedPlayerScore;
    if (!isNaN(savedCpuScore))    cpuScore    = savedCpuScore;
    updateScoreDisplay();
})();

// ─── Eventos dos botões de jogo ───────────────────────────────────────────────
gameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        if (isAnimating) return;
        const playerChoice = btn.dataset.choice;
        playRound(playerChoice);
    });
});

// ─── Evento: reiniciar placar ─────────────────────────────────────────────────
btnReset.addEventListener("click", resetScore);

// ─── Funções principais ───────────────────────────────────────────────────────


function playRound(playerChoice) {
    isAnimating = true;
    setButtonsDisabled(true);

    const cpuChoice = getRandomChoice();

    // Exibe escolhas com animação de "revelação"
    showChoiceWithAnimation(playerChoiceDisplay, playerChoice, cpuChoiceDisplay, cpuChoice, () => {
        const result = getResult(playerChoice, cpuChoice);
        displayResult(result, playerChoice, cpuChoice);
        updateScore(result);
        isAnimating = false;
        setButtonsDisabled(false);
    });
}


function getRandomChoice() {
    return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}


function getResult(player, cpu) {
    if (player === cpu) return "draw";
    if (WINS_AGAINST[player] === cpu) return "win";
    return "lose";
}

/**
 * Exibe as escolhas com animação de "shake" antes de revelar.
 */
function showChoiceWithAnimation(playerEl, playerChoice, cpuEl, cpuChoice, callback) {
    // Exibe placeholder animado
    playerEl.innerHTML = `<span class="choice-placeholder shaking">?</span>`;
    cpuEl.innerHTML    = `<span class="choice-placeholder shaking">?</span>`;

    setTimeout(() => {
        playerEl.innerHTML = `<img src="${CHOICE_IMAGES[playerChoice]}" alt="${playerChoice}" class="choice-revealed">`;
        cpuEl.innerHTML    = `<img src="${CHOICE_IMAGES[cpuChoice]}" alt="${cpuChoice}" class="choice-revealed">`;
        callback();
    }, 600);
}

/**
 * Exibe a mensagem de resultado.
 */
function displayResult(result, playerChoice, cpuChoice) {
    const resultTexts = {
        win:  `🏆 Você venceu! <strong>${capitalize(playerChoice)}</strong> vence <strong>${capitalize(cpuChoice)}</strong>.`,
        lose: `😔 Você perdeu! <strong>${capitalize(cpuChoice)}</strong> vence <strong>${capitalize(playerChoice)}</strong>.`,
        draw: `🤝 Empate! Ambos escolheram <strong>${capitalize(playerChoice)}</strong>.`,
    };

    resultMessage.innerHTML = resultTexts[result];
    resultMessage.className = `result-message result-${result}`;
}

/**
 * Atualiza o placar e persiste no localStorage.
 */
function updateScore(result) {
    if (result === "win")  playerScore++;
    if (result === "lose") cpuScore++;

    localStorage.setItem("playerScore", playerScore);
    localStorage.setItem("cpuScore", cpuScore);

    updateScoreDisplay();
}

/**
 * Atualiza os elementos de placar no DOM.
 */
function updateScoreDisplay() {
    playerScoreEl.textContent = playerScore;
    cpuScoreEl.textContent    = cpuScore;
}

/**
 * Reinicia o placar.
 */
function resetScore() {
    playerScore = 0;
    cpuScore    = 0;
    localStorage.removeItem("playerScore");
    localStorage.removeItem("cpuScore");
    updateScoreDisplay();

    // Limpa a arena e o resultado
    playerChoiceDisplay.innerHTML = `<span class="choice-placeholder">?</span>`;
    cpuChoiceDisplay.innerHTML    = `<span class="choice-placeholder">?</span>`;
    resultMessage.innerHTML       = "";
    resultMessage.className       = "result-message";
}

/**
 * Habilita ou desabilita os botões de jogo.
 * @param {boolean} disabled
 */
function setButtonsDisabled(disabled) {
    gameButtons.forEach((btn) => {
        btn.disabled = disabled;
    });
}

/**
 * Capitaliza a primeira letra de uma string.
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
