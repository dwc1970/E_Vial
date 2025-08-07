document.addEventListener("DOMContentLoaded", () => {
  const welcomeMessage = document.getElementById("welcome-message");
  const scoreElement = document.getElementById("score");
  const correctMatchesElement = document.getElementById("correct-matches");
  const spinBtn = document.getElementById("spin-btn");
  const restartBtn = document.getElementById("restart-btn");
  const finishBtn = document.getElementById("finish-btn");
  const continueBtn = document.getElementById("continue-btn");
  const exitBtn = document.getElementById("exit-btn"); // Nuevo botón
  const rouletteSection = document.getElementById("roulette-section");
  const rouletteWheel = document.querySelector(".roulette-wheel");

  // Elementos del modal
  const questionModal = document.getElementById("question-modal");
  const modalTitle = document.getElementById("modal-title");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const feedbackMessage = document.getElementById("feedback-message");

  let score = 0;
  let correctMatches = 0;
  const earlyFinishThreshold = 8;
  let gameIsRunning = false;
  let currentQuestion = null;
  let availableQuestions = [];

  const cardContent = [
    {
      image: "img/Baden.png",
      definition:
        "Señal que advierte sobre un 'baden' o irregularidad en el camino.",
    },
    {
      image: "img/Derrumbes.png",
      definition:
        "Advierte la posibilidad de caída de rocas o tierra en la calzada.",
    },
    {
      image: "img/Curva_comun.png",
      definition: "Indica una curva próxima a la derecha o izquierda.",
    },
    {
      image: "img/Escuela.png",
      definition:
        "Advierte la cercanía de una zona escolar con posible presencia de niños.",
    },
    {
      image: "img/Niños_jugando.png",
      definition:
        "Indica la presencia de un área de juego para niños cerca de la vía.",
    },
    {
      image: "img/Tunel.png",
      definition: "Advierte sobre un túnel en el camino.",
    },
    {
      image: "img/Rotonda.png",
      definition: "Indica la proximidad de una rotonda o glorieta.",
    },
    {
      image: "img/Camino_sinuoso.png",
      definition: "Señal de advertencia sobre un tramo de curvas peligrosas.",
    },
    {
      image: "img/Encrucijada.png",
      definition: "Advierte sobre un cruce de caminos.",
    },
    {
      image: "img/Calzada_resbaladiza.png",
      definition:
        "Advierte que la calzada puede ser resbaladiza por lluvia u otras causas.",
    },
    {
      image: "img/Hombres_trabajando.png",
      definition: "Indica que hay trabajadores en la vía.",
    },
    {
      image: "img/Eestrechamiento_de_calzada.png",
      definition: "Advierte un estrechamiento de la calzada.",
    },
    {
      image: "img/Contramano.png",
      definition:
        "Indica que se circula en sentido contrario, prohíbe el ingreso.",
    },
    {
      image: "img/Prohibido_adelantar.png",
      definition: "Prohíbe a los vehículos sobrepasar a otros en la vía.",
    },
    {
      image: "img/Prohibido_estacionar.png",
      definition: "Prohíbe detener o dejar el vehículo en un lugar específico.",
    },
    {
      image: "img/señal_pare.png",
      definition: "Obliga a detener completamente la marcha del vehículo.",
    },

    {
      image: "img/Comienza_Autopista.png",
      definition: "Indica el inicio de una autopista o vía rápida.",
    },
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function createRouletteSlices() {
    rouletteWheel.innerHTML = "";
    const numSlices = 20;
    for (let i = 0; i < numSlices; i++) {
      const slice = document.createElement("div");
      slice.classList.add("roulette-slice");
      slice.style.transform = `rotate(${i * (360 / numSlices)}deg)`;
      slice.innerHTML = `<span>${i + 1}</span>`;
      rouletteWheel.appendChild(slice);
    }
  }

  function spinRoulette() {
    if (gameIsRunning) return;
    gameIsRunning = true;
    spinBtn.disabled = true;

    const randomSpin = Math.floor(Math.random() * 360) + 1800; // Múltiples vueltas
    rouletteWheel.style.transition =
      "transform 3s cubic-bezier(0.1, 0.7, 1.0, 0.1)";
    rouletteWheel.style.transform = `rotate(${randomSpin}deg)`;

    const finalAngle = randomSpin % 360;
    const sliceAngle = 360 / 20;
    const winningSliceIndex = Math.floor(finalAngle / sliceAngle);

    setTimeout(() => {
      gameIsRunning = false;
      spinBtn.disabled = false;

      const chosenQuestionIndex =
        (winningSliceIndex + Math.floor(Math.random() * 20)) % 20;
      currentQuestion = cardContent[chosenQuestionIndex];

      showQuestionModal(winningSliceIndex + 1);
    }, 3000);
  }

  function showQuestionModal(rouletteNumber) {
    modalTitle.textContent = `Número ${rouletteNumber}`;
    questionText.textContent = currentQuestion.definition;
    optionsContainer.innerHTML = "";
    optionsContainer.style.pointerEvents = "auto";
    feedbackMessage.textContent = "";

    const options = getOptions(currentQuestion);
    options.forEach((option) => {
      const optionItem = document.createElement("div");
      optionItem.classList.add("option-item");
      const optionImg = document.createElement("img");
      optionImg.src = option.image;
      optionImg.alt = option.definition;
      optionItem.appendChild(optionImg);
      optionItem.dataset.image = option.image;
      optionItem.addEventListener("click", handleAnswer);
      optionsContainer.appendChild(optionItem);
    });

    questionModal.style.display = "flex";
  }

  function hideQuestionModal() {
    questionModal.style.display = "none";
    rouletteWheel.style.transform = `rotate(0deg)`;
  }

  function getOptions(correctQuestion) {
    let options = [correctQuestion];
    let incorrectOptions = cardContent.filter(
      (q) => q.image !== correctQuestion.image
    );
    shuffle(incorrectOptions);
    options.push(...incorrectOptions.slice(0, 3));
    shuffle(options);
    return options;
  }

  function handleAnswer(event) {
    if (gameIsRunning) return;
    gameIsRunning = true;
    optionsContainer.style.pointerEvents = "none";

    const selectedImage = event.target.closest(".option-item");

    if (selectedImage.dataset.image === currentQuestion.image) {
      score += 20;
      correctMatches++;
      selectedImage.classList.add("correct");
      feedbackMessage.textContent = "¡Correcto! ✅";
    } else {
      selectedImage.classList.add("incorrect");
      const correctOption = optionsContainer.querySelector(
        `[data-image="${currentQuestion.image}"]`
      );
      if (correctOption) correctOption.classList.add("correct");
      feedbackMessage.textContent = "¡Incorrecto! ❌";
    }

    scoreElement.textContent = score;
    correctMatchesElement.textContent = correctMatches;

    setTimeout(() => {
      feedbackMessage.textContent = "";
      gameIsRunning = false;
      hideQuestionModal();
      if (score >= 100) {
        welcomeMessage.textContent = `¡Felicidades, ganaste! Tu puntaje es de ${score}.`;
        endGame(true);
      } else if (correctMatches >= earlyFinishThreshold) {
        endGame();
      } else {
        welcomeMessage.textContent = "¡Gira la Ruleta!";
        showInitialControls();
      }
    }, 2000);
  }

  function showInitialControls() {
    spinBtn.style.display = "inline-block";
    restartBtn.style.display = "none";
    finishBtn.style.display = "none";
    continueBtn.style.display = "none";
    exitBtn.style.display = "none";
  }

  function endGame(isWin = false) {
    rouletteSection.style.display = "none";
    hideQuestionModal();

    if (isWin) {
      welcomeMessage.textContent = `¡Felicidades, ganaste! Tu puntaje es de ${score}.`;
    } else if (correctMatches >= earlyFinishThreshold) {
      welcomeMessage.textContent = `Tienes ${correctMatches} aciertos y ${score} puntos.`;
    } else {
      welcomeMessage.textContent = `Juego terminado. Tu puntaje final es: ${score}.`;
    }

    welcomeMessage.style.display = "block";
    spinBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
    continueBtn.style.display = "none";
    exitBtn.style.display = "inline-block"; // Mostrar el botón de Salir
  }

  function exitGame() {
    alert("Saliendo del juego. ¡Gracias por participar!");
    // Aquí podrías agregar lógica para redirigir a otra página si fuera necesario.
    // Por ahora, simplemente recarga la página.
    location.reload();
  }

  createRouletteSlices();

  spinBtn.addEventListener("click", spinRoulette);
  restartBtn.addEventListener("click", () => location.reload());
  finishBtn.addEventListener("click", () =>
    alert("Juego Terminado. Gracias por jugar.")
  );
  continueBtn.addEventListener("click", () => {
    welcomeMessage.textContent = "¡Gira la Ruleta!";
    restartBtn.style.display = "none";
    finishBtn.style.display = "none";
    continueBtn.style.display = "none";
    exitBtn.style.display = "none";
    rouletteSection.style.display = "flex";
    spinBtn.style.display = "inline-block";
  });
  exitBtn.addEventListener("click", exitGame); // Listener para el botón de Salir
});
