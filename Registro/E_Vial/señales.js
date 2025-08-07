document.addEventListener("DOMContentLoaded", () => {
  const welcomeMessage = document.getElementById("welcome-message");
  const gameBoard = document.getElementById("game-board");
  const scoreElement = document.getElementById("score");
  const correctMatchesElement = document.getElementById("correct-matches");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const finishBtn = document.getElementById("finish-btn");
  const feedbackMessage = document.getElementById("feedback-message");

  let score = 0;
  let correctMatches = 0;
  let availableQuestions = [];
  const totalQuestions = 10;
  let selectedSign = null;
  let selectedCategory = null;

  const cardContent = [
    // Señales Preventivas
    { image: "img/Baden.png", category: "Preventiva" },
    { image: "img/Derrumbes.png", category: "Preventiva" },
    { image: "img/Curva_comun.png", category: "Preventiva" },
    { image: "img/Escuela.png", category: "Preventiva" },
    { image: "img/Niños_jugando.png", category: "Preventiva" },

    { image: "img/Tunel.png", category: "Preventiva" },
    { image: "img/Rotonda.png", category: "Preventiva" },
    { image: "img/Camino_sinuoso.png", category: "Preventiva" },
    { image: "img/Encrucijada.png", category: "Preventiva" },
    { image: "img/Calzada_resbaladiza.png", category: "Preventiva" },
    { image: "img/Hombres_trabajando.png", category: "Preventiva" },
    { image: "img/Encrucijada_empale.png", category: "Preventiva" },
    { image: "img/Inicio_doble_circulacion.png", category: "Preventiva" },
    { image: "img/Eestrechamiento_de_calzada.png", category: "Preventiva" },

    // Señales Reglamentarias
    { image: "img/Contramano.png", category: "Reglamentaria" },
    { image: "img/Prohibido_adelantar.png", category: "Reglamentaria" },
    { image: "img/Prohibido_cambiar_de_carril.png", category: "Reglamentaria" },
    { image: "img/No_avanzar.png", category: "Reglamentaria" },
    { image: "img/Prohibido_estacionar.png", category: "Reglamentaria" },
    { image: "img/sentido_de_circulacion.png", category: "Reglamentaria" },
    { image: "img/Prohibicon_de_circular.png", category: "Reglamentaria" },
    { image: "img/señal_pare.png", category: "Reglamentaria" },
    { image: "img/No_girar_derecha.png", category: "Reglamentaria" },
    { image: "img/No_girar_izquierda.png", category: "Reglamentaria" },
    { image: "img/NO_girar_en_U.png", category: "Reglamentaria" },

    // Señales Informativas
    { image: "img/Comienza_Autopista.png", category: "Informativa" },
    { image: "img/Aeropuerto.png", category: "Informativa" },
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function renderGame() {
    gameBoard.innerHTML = "";
    const signsToDisplay = availableQuestions;
    const categoriesToDisplay = signsToDisplay.map((sign) => sign.category);
    shuffle(categoriesToDisplay);

    const signsColumn = document.createElement("div");
    signsColumn.classList.add("signs-column");
    const categoriesColumn = document.createElement("div");
    categoriesColumn.classList.add("categories-column");

    signsToDisplay.forEach((sign, index) => {
      const signItem = document.createElement("div");
      signItem.classList.add("sign-item");
      const signImg = document.createElement("img");
      signImg.src = sign.image;
      signImg.alt = sign.category;
      signItem.appendChild(signImg);
      signItem.dataset.category = sign.category;
      signItem.addEventListener("click", handleSelection);
      signsColumn.appendChild(signItem);
    });

    categoriesToDisplay.forEach((category, index) => {
      const categoryItem = document.createElement("div");
      categoryItem.classList.add("category-item");
      categoryItem.textContent = category;
      categoryItem.dataset.category = category;
      categoryItem.addEventListener("click", handleSelection);
      categoriesColumn.appendChild(categoryItem);
    });

    gameBoard.appendChild(signsColumn);
    gameBoard.appendChild(categoriesColumn);
  }

  function handleSelection(event) {
    const item = event.target.closest(".sign-item, .category-item");
    if (
      !item ||
      item.classList.contains("correct") ||
      item.classList.contains("incorrect")
    )
      return;

    if (item.classList.contains("sign-item")) {
      if (selectedSign) selectedSign.classList.remove("selected");
      selectedSign = item;
      selectedSign.classList.add("selected");
    } else {
      if (selectedCategory) selectedCategory.classList.remove("selected");
      selectedCategory = item;
      selectedCategory.classList.add("selected");
    }

    if (selectedSign && selectedCategory) {
      checkMatch();
    }
  }

  function checkMatch() {
    if (selectedSign.dataset.category === selectedCategory.dataset.category) {
      score += 10;
      correctMatches++;
      selectedSign.classList.remove("selected");
      selectedCategory.classList.remove("selected");
      selectedSign.classList.add("correct");
      selectedCategory.classList.add("correct");
      feedbackMessage.textContent = "¡Correcto! ✅";

      selectedSign = null;
      selectedCategory = null;
    } else {
      selectedSign.classList.add("incorrect");
      selectedCategory.classList.add("incorrect");
      feedbackMessage.textContent = "¡Incorrecto! ❌";

      setTimeout(() => {
        selectedSign.classList.remove("selected", "incorrect");
        selectedCategory.classList.remove("selected", "incorrect");
        selectedSign = null;
        selectedCategory = null;
        feedbackMessage.textContent = "";
      }, 1000);
    }

    scoreElement.textContent = score;
    correctMatchesElement.textContent = correctMatches;
    checkEndGame();
  }

  function checkEndGame() {
    if (correctMatches === totalQuestions) {
      feedbackMessage.textContent = `¡Felicidades, lograste ${score} puntos! Juego terminado.`;
      endGame(true);
    } else if (correctMatches >= 8) {
      finishBtn.style.display = "inline-block";
    }
  }

  function startGame() {
    score = 0;
    correctMatches = 0;
    scoreElement.textContent = score;
    correctMatchesElement.textContent = correctMatches;
    feedbackMessage.textContent = "";

    shuffle(cardContent);
    availableQuestions = cardContent.slice(0, totalQuestions);

    welcomeMessage.style.display = "none";
    startBtn.style.display = "none";
    finishBtn.style.display = "none";
    gameBoard.style.display = "grid";

    renderGame();
  }

  function endGame(isPerfect = false) {
    gameBoard.style.display = "none";
    if (isPerfect) {
      welcomeMessage.textContent = `¡Juego completado! Tu puntaje es: ${score} de 100.`;
    } else {
      welcomeMessage.textContent = `Tu puntaje final es: ${score} de 100.`;
    }
    welcomeMessage.style.display = "block";
    restartBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", () => location.reload());
  finishBtn.addEventListener("click", () => endGame());

  gameBoard.style.display = "none";
});
