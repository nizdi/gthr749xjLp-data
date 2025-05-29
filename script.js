document.addEventListener('DOMContentLoaded', () => {
    // --- Configurações ---
    const NUM_CARDS = 30; // <<< AJUSTE AQUI O NÚMERO DE CARTAS
    let CARDS_PER_ROW = 6; // Será ajustado com base na largura da tela

    // <<< COLOQUE SUAS PERGUNTAS AQUI >>>
    const QUESTIONS = [
        "Qual é a capital da França?",
        "Quem escreveu 'Dom Quixote'?",
        "Qual é o maior planeta do nosso sistema solar?",
        "Em que ano o homem pisou na Lua pela primeira vez?",
        "Qual é o símbolo químico da água?",
        "Quem pintou a Mona Lisa?",
        "Qual animal é conhecido como o 'rei da selva'?",
        "Quantos continentes existem?",
        "Qual oceano é o maior do mundo?",
        "Quem foi o primeiro presidente dos Estados Unidos?",
        "Qual a fórmula da Teoria da Relatividade de Einstein?",
        "Qual o nome do rio mais longo do mundo?",
        "Qual a montanha mais alta do mundo?",
        "Qual a velocidade da luz?",
        "Qual a cor do cavalo branco de Napoleão?",
        "Pergunta teste 16",
        "Pergunta teste 17",
        "Pergunta teste 18",
        "Pergunta teste 19",
        "Pergunta teste 20",
        "Pergunta teste 21",
        "Pergunta teste 22",
        "Pergunta teste 23",
        "Pergunta teste 24",
        "Pergunta teste 25",
        "Pergunta teste 26",
        "Pergunta teste 27",
        "Pergunta teste 28",
        "Pergunta teste 29",
        "Pergunta teste 30 - Esta é uma pergunta um pouco mais longa para testar o sistema de quebra de linha e ver como ele se comporta com mais texto."
    ];

    // Ajusta a lista de perguntas para corresponder a NUM_CARDS
    const adjustedQuestions = [];
    for (let i = 0; i < NUM_CARDS; i++) {
        if (QUESTIONS[i]) {
            adjustedQuestions.push(QUESTIONS[i]);
        } else {
            adjustedQuestions.push(`Pergunta Padrão ${i + 1}`);
        }
    }

    const cardColors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7'];

    // Elementos do DOM
    const cardsGrid = document.getElementById('cards-grid');
    const questionPopup = document.getElementById('question-popup');
    const popupCardNumber = document.getElementById('popup-card-number');
    const popupQuestionText = document.getElementById('popup-question-text');
    const closePopupBtn = document.getElementById('close-popup-btn');

    let cardStates = new Array(NUM_CARDS).fill('closed'); // 'closed', 'revealed'
    let activeQuestionCardIndex = null;

    // --- Funções ---

    function adjustCardsPerRow() {
        const screenWidth = window.innerWidth;
        if (screenWidth < 500) {
            CARDS_PER_ROW = 3;
        } else if (screenWidth < 800) {
            CARDS_PER_ROW = 4;
        } else {
            CARDS_PER_ROW = 6;
        }
        cardsGrid.style.gridTemplateColumns = `repeat(${CARDS_PER_ROW}, minmax(80px, 1fr))`;
    }


    function createCards() {
        cardsGrid.innerHTML = ''; // Limpa cartas existentes
        for (let i = 0; i < NUM_CARDS; i++) {
            const card = document.createElement('div');
            card.classList.add('card', cardColors[i % cardColors.length]);
            card.dataset.index = i; // Armazena o índice da carta

            const flap = document.createElement('div');
            flap.classList.add('card-flap');

            const number = document.createElement('div');
            number.classList.add('card-number');
            number.textContent = i + 1;

            card.appendChild(flap);
            card.appendChild(number);

            card.addEventListener('click', () => handleCardClick(i));
            cardsGrid.appendChild(card);
        }
    }

    function handleCardClick(index) {
        const cardElement = cardsGrid.children[index];

        if (cardStates[index] === 'closed') {
            // Abre a pergunta
            popupCardNumber.textContent = `Carta ${index + 1}`;
            popupQuestionText.textContent = adjustedQuestions[index];
            questionPopup.classList.remove('hidden');
            activeQuestionCardIndex = index;

            // Marca como revelada
            cardStates[index] = 'revealed';
            cardElement.classList.add('revealed');
            cardElement.classList.remove(...cardColors); // Remove cores específicas para usar a 'revealed'
        } else if (cardStates[index] === 'revealed' && activeQuestionCardIndex === null) {
            // Fecha uma carta já revelada (se nenhuma pergunta estiver ativa)
            cardStates[index] = 'closed';
            cardElement.classList.remove('revealed');
            cardElement.classList.add(cardColors[index % cardColors.length]); // Readiciona cor original
        }
        // Se clicar em uma carta revelada enquanto outra pergunta está aberta, não faz nada.
    }

    closePopupBtn.addEventListener('click', () => {
        questionPopup.classList.add('hidden');
        activeQuestionCardIndex = null; // Permite interagir com outras cartas novamente
    });

    // Fechar popup com a tecla Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !questionPopup.classList.contains('hidden')) {
            closePopupBtn.click();
        }
    });

    // --- Inicialização ---
    adjustCardsPerRow(); // Ajusta colunas na carga inicial
    createCards();

    // Ajusta colunas em redimensionamento da janela
    window.addEventListener('resize', () => {
        adjustCardsPerRow();
        // Recriar as cartas pode ser pesado no resize, mas garante que o aspect-ratio funcione bem
        // com o novo número de colunas e larguras.
        // Alternativamente, pode-se apenas ajustar o grid-template-columns e confiar no aspect-ratio.
        // Para simplificar, vou apenas reajustar as colunas.
        // Se o layout quebrar muito, pode ser necessário recalcular tamanhos ou recriar.
    });
});