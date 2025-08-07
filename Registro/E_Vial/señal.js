document.addEventListener("DOMContentLoaded", () => {
  const welcomeMessage = document.getElementById("welcome-message");
  const signImage = document.getElementById("sign-image");
  const categoriesContainer = document.getElementById("categories-container");
  const scoreElement = document.getElementById("score");
  const questionCountElement = document.getElementById("question-count");
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const feedbackMessage = document.getElementById("feedback-message");

  let score = 0;
  let questionsAsked = 0;
  const totalQuestions = 5;
  let availableQuestions = [];
  let currentCorrectCategory = "";

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

  function createQuestion() {
    if (availableQuestions.length === 0) {
      endGame();
      return;
    }

    categoriesContainer.style.pointerEvents = "auto";
    categoriesContainer.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("correct", "incorrect");
    });
    feedbackMessage.textContent = "";

    const currentSign = availableQuestions.pop();
    signImage.src = currentSign.image;
    signImage.style.transform = "scale(0.8)";
    signImage.style.transition = "transform 0.3s ease-in-out";
    setTimeout(() => (signImage.style.transform = "scale(1)"), 100);

    currentCorrectCategory = currentSign.category;
    questionsAsked++;
    questionCountElement.textContent = questionsAsked;
  }

  function handleAnswer(event) {
    const selectedCategory = event.target.dataset.category;
    categoriesContainer.style.pointerEvents = "none";

    if (selectedCategory === currentCorrectCategory) {
      score += 20;
      event.target.classList.add("correct");
      feedbackMessage.textContent = "¡Correcto! ✅";
    } else {
      event.target.classList.add("incorrect");
      const correctBtn = categoriesContainer.querySelector(
        `[data-category="${currentCorrectCategory}"]`
      );
      correctBtn.classList.add("correct");
      feedbackMessage.textContent = `¡Incorrecto! La respuesta correcta era "${currentCorrectCategory}". ❌`;
    }

    scoreElement.textContent = score;

    if (questionsAsked < totalQuestions) {
      nextBtn.style.display = "inline-block";
    } else {
      setTimeout(endGame, 1500);
    }
  }

  function startGame() {
    score = 0;
    questionsAsked = 0;
    scoreElement.textContent = score;
    questionCountElement.textContent = questionsAsked;

    shuffle(cardContent);
    availableQuestions = cardContent.slice(0, totalQuestions);

    welcomeMessage.style.display = "none";
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    categoriesContainer.style.display = "flex";
    signImage.style.display = "block";

    createQuestion();
  }

  function nextQuestion() {
    nextBtn.style.display = "none";
    createQuestion();
  }

  function endGame() {
    let finalMessage = `Juego terminado. Tu puntaje final es: ${score} de ${
      totalQuestions * 20
    }.`;
    feedbackMessage.textContent = finalMessage;

    categoriesContainer.style.display = "none";
    signImage.style.display = "none";

    nextBtn.style.display = "none";

    if (score >= totalQuestions * 20) {
      restartBtn.textContent = "¡Lo lograste! Continúa";
      restartBtn.classList.remove("secondary-btn");
      restartBtn.classList.add("primary-btn");
    } else {
      restartBtn.textContent = "¡Inténtalo de nuevo!";
      restartBtn.classList.remove("primary-btn");
      restartBtn.classList.add("secondary-btn");
    }
    restartBtn.style.display = "inline-block";
  }

  startBtn.addEventListener("click", startGame);
  categoriesContainer.addEventListener("click", handleAnswer);
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", () => {
    if (score >= totalQuestions * 20) {
      window.location.href = "resultado.html";
    } else {
      location.reload();
    }
  });

  categoriesContainer.style.display = "none";
  signImage.style.display = "none";
});
document.getElementById("restart-btn").addEventListener("click", function () {
  const scoreElement = document.getElementById("score");
  const currentScore = parseInt(scoreElement.textContent, 10);

  if (currentScore >= 100) {
    window.location.href = "index.html";
  }
});
