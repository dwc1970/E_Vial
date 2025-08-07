document.addEventListener("DOMContentLoaded", () => {
  const gameBoard = document.getElementById("game-board");
  const scoreElement = document.getElementById("score");
  const startBtn = document.getElementById("start-btn");
  const restartBtn = document.getElementById("restart-btn");
  const finishBtn = document.getElementById("finish-btn");
  const continueBtn = document.getElementById("continue-btn"); // Elementos del modal

  const modalOverlay = document.getElementById("modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDescription = document.getElementById("modal-description");
  const modalContinueBtn = document.getElementById("modal-continue-btn");

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let score = 0;
  let isFlipping = false;
  const winningScore = 100; // Nuevo array de objetos con la información completa de las señales

  const cardContent = [
    {
      image: "img/Inicio_doble_circulacion.png",
      name: "Doble Circulación",
      description:
        "Indica que un camino de un solo sentido se convierte en un camino de doble sentido.",
    },
    {
      image: "img/Baden.png",
      name: "Baden",
      description: "Advierte sobre una depresión en la superficie de la vía.",
    },
    {
      image: "img/Derrumbes.png",
      name: "Derrumbes",
      description:
        "Advierte sobre posibles caídas de rocas o tierra en la carretera.",
    },
    {
      image: "img/Camino_sinuoso.png",
      name: "Camino Sinuoso",
      description: "Advierte sobre la presencia de varias curvas en el camino.",
    },
    {
      image: "img/Curva_comun.png",
      name: "Curva Común",
      description: "Advierte sobre una curva peligrosa en el camino.",
    },
    {
      image: "img/Prohibicon_de_circular.png",
      name: "Prohibido Circular",
      description: "Prohíbe la circulación de todo tipo de vehículos.",
    },
    {
      image: "img/Encrucijada_empale.png",
      name: "Encrucijada Empalme",
      description: "Indica un empalme en forma de T en la vía.",
    },
    {
      image: "img/NO_girar_en_U.png",
      name: "Prohibido Girar en U",
      description: "Prohíbe dar la vuelta completa en la intersección.",
    },
    {
      image: "img/No_girar_izquierda.png",
      name: "Prohibido Girar a la Izquierda",
      description: "Prohíbe girar hacia la izquierda en la intersección.",
    },
    {
      image: "img/Escuela.png",
      name: "Zona de Escuela",
      description:
        "Advierte sobre la proximidad de una escuela y la posible presencia de niños.",
    },
    {
      image: "img/No_avanzar.png",
      name: "No Avanzar",
      description: "Prohíbe el avance en la dirección de la flecha.",
    },
    {
      image: "img/Rotonda.png",
      name: "Rotonda",
      description: "Advierte sobre la proximidad de una rotonda.",
    },
    {
      image: "img/Prohibido_estacionar.png",
      name: "Prohibido Estacionar",
      description: "Indica que el estacionamiento está prohibido en esa área.",
    },
    {
      image: "img/No_girar_derecha.png",
      name: "Prohibido Girar a la Derecha",
      description: "Prohíbe girar hacia la derecha en la intersección.",
    },
    {
      image: "img/Prohibido_adelantar.png",
      name: "Prohibido Adelantar",
      description:
        "Prohíbe adelantar a otros vehículos en ese tramo de la carretera.",
    },
    {
      image: "img/Comienza_Autopista.png",
      name: "Comienza Autopista",
      description: "Indica el inicio de una autopista.",
    },
    {
      image: "img/Contramano.png",
      name: "Contramano",
      description: "Prohíbe el paso de vehículos, indica un sentido contrario.",
    },
    {
      image: "img/Encrucijada.png",
      name: "Encrucijada",
      description: "Advierte sobre un cruce de caminos.",
    },
  ];

  function createCard(content) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = content.name; // Usamos el nombre para la coincidencia

    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.textContent = "?";

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    const img = document.createElement("img");
    img.src = content.image;
    cardBack.appendChild(img);

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);

    cardElement.addEventListener("click", () => {
      if (!isFlipping && !cardElement.classList.contains("flipped")) {
        cardElement.classList.add("flipped");
        flippedCards.push(cardElement);

        if (flippedCards.length === 2) {
          isFlipping = true;
          checkMatch();
        }
      }
    });

    return cardElement;
  }

  function createBoard() {
    const fullDeck = [...cardContent, ...cardContent]; // Duplicamos el array para tener 18 pares
    fullDeck.sort(() => 0.5 - Math.random());

    gameBoard.innerHTML = "";
    gameBoard.style.display = "grid";
    cards = [];
    fullDeck.forEach((content) => {
      const cardElement = createCard(content);
      gameBoard.appendChild(cardElement);
      cards.push(cardElement);
    });
  }

  function checkMatch() {
    const [card1, card2] = flippedCards;
    const name1 = card1.dataset.name;
    const name2 = card2.dataset.name;

    if (name1 === name2) {
      matchedPairs++;
      score += 20;
      scoreElement.textContent = score; // Encontrar la información completa de la señal

      const matchedCardInfo = cardContent.find((card) => card.name === name1);
      showModal(matchedCardInfo);
    } else {
      setTimeout(() => {
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        flippedCards = [];
        isFlipping = false;
      }, 1000);
    }
  }

  function showModal(cardInfo) {
    modalTitle.textContent = cardInfo.name;
    modalImage.src = cardInfo.image;
    modalDescription.textContent = cardInfo.description;
    modalOverlay.style.display = "flex";
  }

  function hideModal() {
    modalOverlay.style.display = "none"; // Una vez que el modal se cierra, se continúa el juego

    flippedCards[0].removeEventListener("click", () => {});
    flippedCards[1].removeEventListener("click", () => {});
    flippedCards = [];
    isFlipping = false;

    if (score >= winningScore) {
      continueBtn.style.display = "inline-block";
      alert("¡Felicidades! Has completado el juego. ¡Continúa!");
    }
  }

  function startGame() {
    score = 0;
    matchedPairs = 0;
    scoreElement.textContent = score;
    startBtn.style.display = "none";
    restartBtn.style.display = "inline-block";
    finishBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
    createBoard();
  }

  function restartGame() {
    startGame();
  }

  function finishGame() {
    alert("Juego terminado. Tu puntaje final es: " + score);
    location.reload();
  }

  function continueGame() {
    // Redirige a señal.html, como solicitaste
    window.location.href = "vial.html";
  }

  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", restartGame);
  finishBtn.addEventListener("click", finishGame);
  continueBtn.addEventListener("click", continueGame);
  modalContinueBtn.addEventListener("click", hideModal);

  restartBtn.style.display = "none";
  finishBtn.style.display = "none";
  continueBtn.style.display = "none";
  gameBoard.style.display = "none";
});
