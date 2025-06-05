document.addEventListener('DOMContentLoaded', () => {
    // --- Configurações Globais ---
    const cardColors = ['color-0', 'color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7'];

    // --- Dados para o "Baralho das Perguntas" ---
    const NUM_CARDS_PERGUNTAS = 30;
    const QUESTIONS_PERGUNTAS = [
        "Em que momentos você fica envergonhada(o)?",
        "Como você gostaria de ser percebido?",
        "O que você não gosta, mas acaba fazendo?",
        "Defina o que é ser feliz",
        "Lembre-se de uma situação que tenha te magoado. Se você pudesse viver essa situação novamente, o que faria diferente?",
        "Em que momentos você tem vontade de fugir?",
        "Que mudanças você deseja para a sua vida?",
        "O que te deixa com vontade de chorar?",
        "O você acha difícil na vida?",
        "Que situações te deixam com “frio na barriga”?",
        "O que você gosta, mas não faz?",
        "O que te deixa preocupado(a)?",
        "O que te deixa com vontade de gritar?",
        "O que te deixa desconfiado?",
        "Você encontrou uma lâmpada mágica e o gênio lhe concedeu três pedidos. Quais pedidos são esses?",
        "O que mais te irrita?",
        "O que faz você se sentir seguro(a)?",
        "Que coisas ou situações te deixam estressado(a)?",
        "O que você acha fácil?",
        "Se você fosse um sentimento, qual seria?",
        "Se seu coração falasse, o que ele diria?",
        "O que ou quem te passa confiança?",
        "O que você pode dizer sobre seus amigos?",
        "Se você não fosse você, o que você seria? E o que não seria?",
        "O que mais te assusta?",
        "Quais são os seus maiores sonhos?",
        "Se pudesse descrever a sua família em uma frase, qual seria?",
        "O que te deixa ansioso(a)?",
        "Qual o significado da escola e/ou trabalho pra você? ",
        "Quais são suas maiores qualidades?"
    ];

    // --- Dados para "Complete a frase..." ---
    const NUM_CARDS_FRASES = 34;
    const QUESTIONS_FRASES = [
        "As garotas(os) da minha idade preferem…",
        "Quando sinto raiva eu …",
        "Fico feliz quando…",
        "A maior mudança na minha vida foi…",
        "O que mais me desagrada…",
        "Se eu pudesse…",
        "Neste ano eu…",
        "Sempre quis…, mas nunca poderei fazê-lo…",
        "Acho que trabalhar em equipe…",
        "Se eu fosse… poderia…",
        "Quando penso na universidade…",
        "Acho que, quando for mais velho poderei…",
        "Meus pais gostariam que eu…",
        "Quando era criança queria…",
        "O mais importante na vida é…",
        "Sempre gostei de…",
        "Não consigo me ver fazendo…",
        "Daqui a cinco anos quero…",
        "Estou muito…",
        "Meu maior medo é…",
        "Os professores acham que eu…",
        "O que me falta hoje é…",
        "O mais importante pra mim é…",
        "Meus colegas pensam que eu…",
        "Ainda terei oportunidade de…",
        "Quando não consigo algo que desejava…",
        "Tenho necessidade de…",
        "Sei que estou com raiva quando…",
        "Gostaria que…",
        "A aprovação dos outros é…",
        "Penso que as pessoas deveriam…",
        "Os jovens da minha idade preferem…",
        "Estou certo de que…",
        "Prefiro…"
    ];

    function initializeCardGame(config) {
        const {
            gridId,
            popupId,
            numCards,
            questions,
            cardLabelPrefix,
            defaultCardsPerRow
        } = config;

        const cardsGrid = document.getElementById(gridId);
        if (!cardsGrid) {
            console.error(`Elemento com ID '${gridId}' não encontrado.`);
            return;
        }
        const questionPopup = document.getElementById(popupId);
        if (!questionPopup) {
            console.error(`Elemento com ID '${popupId}' não encontrado.`);
            return;
        }
        
        const popupCardNumber = questionPopup.querySelector('.popup-card-number');
        const popupQuestionText = questionPopup.querySelector('.popup-question-text');
        const closePopupBtn = questionPopup.querySelector('.close-popup-btn');

        if (!popupCardNumber || !popupQuestionText || !closePopupBtn) {
            console.error(`Elementos internos do popup '${popupId}' não encontrados.`);
            return;
        }

        let currentCardsPerRow = defaultCardsPerRow;
        let cardStates = new Array(numCards).fill('closed');
        let activeQuestionCardIndex = null;

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
                currentCardsPerRow = defaultCardsPerRow;
            }
            cardsGrid.style.gridTemplateColumns = `repeat(${currentCardsPerRow}, minmax(80px, 1fr))`;
        }

        function createCards() {
            cardsGrid.innerHTML = '';
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
                cardColors.forEach(colorClass => cardElement.classList.remove(colorClass));
            } else if (cardStates[index] === 'revealed' && activeQuestionCardIndex === null) {
                cardStates[index] = 'closed';
                cardElement.classList.remove('revealed');
                cardElement.classList.add(cardColors[index % cardColors.length]);
            }
        }

        closePopupBtn.addEventListener('click', () => {
            questionPopup.classList.add('hidden');
            activeQuestionCardIndex = null;
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !questionPopup.classList.contains('hidden')) {
                closePopupBtn.click();
            }
        });

        adjustCardsPerRowOnScreen();
        createCards();

        // O listener de resize foi removido pelo usuário devido a erro de sintaxe
        // Se desejar recolocá-lo com a sintaxe correta:
        /*
        window.addEventListener('resize', () => {
            adjustCardsPerRowOnScreen();
        });
        */
    }

    initializeCardGame({
        gridId: 'cards-grid-perguntas',
        popupId: 'popup-perguntas',
        numCards: NUM_CARDS_PERGUNTAS,
        questions: QUESTIONS_PERGUNTAS,
        cardLabelPrefix: 'Carta',
        defaultCardsPerRow: 6
    });

    initializeCardGame({
        gridId: 'cards-grid-frases',
        popupId: 'popup-frases',
        numCards: NUM_CARDS_FRASES,
        questions: QUESTIONS_FRASES,
        cardLabelPrefix: 'Caixa',
        defaultCardsPerRow: 6
    });
});