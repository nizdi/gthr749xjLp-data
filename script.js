document.addEventListener('DOMContentLoaded', () => {
    // --- Configurações Globais (se houver) ---
    const cardColors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7'];
    let globalDefaultCardsPerRow = 6; // Será ajustado com base na largura da tela para cada instância

    // --- Dados para o "Baralho das Perguntas" ---
    const NUM_CARDS_PERGUNTAS = 30;
    const QUESTIONS_PERGUNTAS = [
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
        "Pergunta teste 16", "Pergunta teste 17", "Pergunta teste 18", "Pergunta teste 19", "Pergunta teste 20",
        "Pergunta teste 21", "Pergunta teste 22", "Pergunta teste 23", "Pergunta teste 24", "Pergunta teste 25",
        "Pergunta teste 26", "Pergunta teste 27", "Pergunta teste 28", "Pergunta teste 29",
        "Pergunta teste 30 - Esta é uma pergunta um pouco mais longa."
    ];

    // --- Dados para "Complete a frase..." ---
    const NUM_CARDS_FRASES = 34;
    const QUESTIONS_FRASES = [
        "O sol nasce no ________.",
        "A água ferve a ________ graus Celsius.",
        "Quem tem boca vai a ________.",
        "Em terra de cego, quem tem um olho é ________.",
        "Mais vale um pássaro na mão do que dois ________.",
        "Filho de peixe, ________ é.",
        "De grão em grão, a galinha enche o ________.",
        "Água mole em pedra dura, tanto bate até que ________.",
        "A pressa é inimiga da ________.",
        "Cavalo dado não se olha os ________.",
        "Para bom entendedor, meia palavra ________.",
        "Quem não tem cão, caça com ________.",
        "Quem ri por último, ri ________.",
        "Casa de ferreiro, espeto de ________.",
        "Antes tarde do que ________.",
        "Frase teste 16", "Frase teste 17", "Frase teste 18", "Frase teste 19", "Frase teste 20",
        "Frase teste 21", "Frase teste 22", "Frase teste 23", "Frase teste 24", "Frase teste 25",
        "Frase teste 26", "Frase teste 27", "Frase teste 28", "Frase teste 29", "Frase teste 30",
        "Frase teste 31", "Frase teste 32", "Frase teste 33",
        "Frase teste 34 - Uma frase mais longa para testar a exibição e o layout."
    ];


    // --- Função para inicializar um jogo de cartas ---
    function initializeCardGame(config) {
        const {
            gridId,
            popupId,
            numCards,
            questions,
            cardLabelPrefix, // "Carta" ou "Caixa" ou "Frase"
            defaultCardsPerRow
        } = config;

        // Elementos do DOM específicos para esta instância
        const cardsGrid = document.getElementById(gridId);
        const questionPopup = document.getElementById(popupId);
        // Seleciona elementos internos do popup pela classe, dentro do popup específico
        const popupCardNumber = questionPopup.querySelector('.popup-card-number');
        const popupQuestionText = questionPopup.querySelector('.popup-question-text');
        const closePopupBtn = questionPopup.querySelector('.close-popup-btn');

        let currentCardsPerRow = defaultCardsPerRow;
        let cardStates = new Array(numCards).fill('closed'); // 'closed', 'revealed'
        let activeQuestionCardIndex = null;

        // Ajusta a lista de perguntas para corresponder a numCards
        const adjustedQuestions = [];
        for (let i = 0; i < numCards; i++) {
            if (questions[i]) {
                adjustedQuestions.push(questions[i]);
            } else {
                adjustedQuestions.push(`${cardLabelPrefix} Padrão ${i + 1}`);
            }
        }

        function adjustCardsPerRowOnScreen() {
            const screenWidth = window.innerWidth;
            if (screenWidth < 500) {
                currentCardsPerRow = 3;
            } else if (screenWidth < 800) {
                currentCardsPerRow = 4;
            } else {
                currentCardsPerRow = defaultCardsPerRow; // Usa o default da instância
            }
            cardsGrid.style.gridTemplateColumns = `repeat(${currentCardsPerRow}, minmax(80px, 1fr))`;
        }

        function createCards() {
            cardsGrid.innerHTML = ''; // Limpa cartas existentes
            for (let i = 0; i < numCards; i++) {
                const card = document.createElement('div');
                card.classList.add('card', cardColors[i % cardColors.length]);
                card.dataset.index = i;

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
                popupCardNumber.textContent = `${cardLabelPrefix} ${index + 1}`;
                popupQuestionText.textContent = adjustedQuestions[index];
                questionPopup.classList.remove('hidden');
                activeQuestionCardIndex = index;

                cardStates[index] = 'revealed';
                cardElement.classList.add('revealed');
                cardElement.classList.remove(...cardColors);
            } else if (cardStates[index] === 'revealed' && activeQuestionCardIndex === null) {
                // Opcional: permitir fechar cartas reveladas se nenhum popup estiver ativo
                // cardStates[index] = 'closed';
                // cardElement.classList.remove('revealed');
                // cardElement.classList.add(cardColors[index % cardColors.length]);
            }
        }

        closePopupBtn.addEventListener('click', () => {
            questionPopup.classList.add('hidden');
            activeQuestionCardIndex = null;
        });

        // Fechar popup específico com a tecla Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !questionPopup.classList.contains('hidden')) {
                closePopupBtn.click();
            }
        });

        // --- Inicialização da instância ---
        adjustCardsPerRowOnScreen();
        createCards();

        // Ajusta colunas em redimensionamento da janela para esta instância
        window.addEventListener('resize', () => {
            adjustCardsPerRowOnScreen();
        });
    }

    // --- Inicializar os Jogos ---

    // Jogo 1: Baralho das Perguntas
    initializeCardGame({
        gridId: 'cards-grid-perguntas',
        popupId: 'popup-perguntas',
        numCards: NUM_CARDS_PERGUNTAS,
        questions: QUESTIONS_PERGUNTAS,
        cardLabelPrefix: 'Carta',
        defaultCardsPerRow: 6
    });

    // Jogo 2: Complete a frase...
    initializeCardGame({
        gridId: 'cards-grid-frases',
        popupId: 'popup-frases',
        numCards: NUM_CARDS_FRASES,
        questions: QUESTIONS_FRASES,
        cardLabelPrefix: 'Caixa', // Ou "Frase", como preferir
        defaultCardsPerRow: 6 // Pode ser diferente se desejar
    });

});