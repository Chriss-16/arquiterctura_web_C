        // Preguntas y respuestas del cuestionario.
        const questions = [
            {
                question: "¿Qué caracteriza principalmente a una arquitectura desacoplada?",
                answers: [
                    "El frontend y el backend están separados y se comunican mediante APIs.",
                    "Toda la aplicación vive dentro de una sola página HTML.",
                    "El backend no necesita almacenar ni procesar datos."
                ],
                correct: 0,
                explanation: "Correcto: las capas son independientes y la API define cómo intercambian información."
            },
            {
                question: "¿Cuál es el papel principal de una API en esta arquitectura?",
                answers: [
                    "Diseñar los estilos visuales de la interfaz.",
                    "Permitir la comunicación entre el frontend y los servicios del backend.",
                    "Reemplazar la base de datos y almacenar todas las imágenes."
                ],
                correct: 1,
                explanation: "Así es: la API actúa como una interfaz para solicitar datos y servicios al backend."
            },
            {
                question: "¿Qué ventaja permite que varios tipos de clientes consuman el mismo backend?",
                answers: [
                    "Omnicanalidad.",
                    "Acoplamiento entre las capas.",
                    "Eliminación de las solicitudes de red."
                ],
                correct: 0,
                explanation: "Correcto: web, móvil y otros canales pueden consumir servicios compartidos."
            },
            {
                question: "¿Qué es importante acordar para que los equipos trabajen en paralelo?",
                answers: [
                    "Usar exactamente el mismo lenguaje en todas las capas.",
                    "Los contratos y formatos de la API.",
                    "Evitar que frontend y backend se comuniquen."
                ],
                correct: 1,
                explanation: "Exacto: los contratos claros de API ayudan a coordinar los cambios entre equipos."
            },
            {
                question: "¿Cuál afirmación describe mejor una posible desventaja de desacoplar?",
                answers: [
                    "No es posible actualizar el frontend de manera independiente.",
                    "La coordinación y la gestión de APIs pueden añadir complejidad.",
                    "El backend queda obligado a servir una sola interfaz."
                ],
                correct: 1,
                explanation: "Correcto: se gana flexibilidad, pero hay que gestionar bien las APIs y la coordinación."
            }
        ];

        const quizContent = document.querySelector("#quiz-content");
        const questionCount = document.querySelector("#question-count");
        const scoreLabel = document.querySelector("#score-label");
        const progressFill = document.querySelector("#progress-fill");
        const progressTrack = document.querySelector(".progress-track");
        let currentQuestion = 0;
        let score = 0;
        let answered = false;

        // Muestra la pregunta actual y sus opciones.
        function renderQuestion() {
            const item = questions[currentQuestion];
            answered = false;
            questionCount.textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
            scoreLabel.textContent = `Puntaje: ${score}`;
            progressFill.style.width = `${(currentQuestion / questions.length) * 100}%`;
            progressTrack.setAttribute("aria-valuenow", String(currentQuestion));
            quizContent.innerHTML = `
                <h3 class="question" id="question-title">${item.question}</h3>
                <div class="answers" role="group" aria-labelledby="question-title">
                    ${item.answers.map((answer, index) => `
                        <button class="answer" type="button" data-answer="${index}">${answer}</button>
                    `).join("")}
                </div>
                <p class="feedback" id="feedback" aria-live="assertive"></p>
                <div class="quiz-footer"><button class="button" id="next-button" type="button" disabled>Siguiente</button></div>
            `;

            quizContent.querySelectorAll(".answer").forEach((button) => {
                button.addEventListener("click", () => selectAnswer(button, item));
            });
            quizContent.querySelector("#next-button").addEventListener("click", nextQuestion);
        }

        // Da retroalimentación inmediata y bloquea cambios después de responder.
        function selectAnswer(selectedButton, item) {
            if (answered) return;
            answered = true;
            const isCorrect = Number(selectedButton.dataset.answer) === item.correct;
            const feedback = quizContent.querySelector("#feedback");

            if (isCorrect) {
                score += 1;
                selectedButton.classList.add("correct");
                feedback.textContent = item.explanation;
                feedback.classList.add("success");
            } else {
                selectedButton.classList.add("incorrect");
                quizContent.querySelector(`[data-answer="${item.correct}"]`).classList.add("correct");
                feedback.textContent = `No exactamente. ${item.explanation}`;
                feedback.classList.add("error");
            }

            scoreLabel.textContent = `Puntaje: ${score}`;
            quizContent.querySelectorAll(".answer").forEach((button) => { button.disabled = true; });
            const nextButton = quizContent.querySelector("#next-button");
            nextButton.disabled = false;
            nextButton.textContent = currentQuestion === questions.length - 1 ? "Ver resultado" : "Siguiente";
        }

        // Avanza a la siguiente pregunta o muestra el resultado final.
        function nextQuestion() {
            if (!answered) return;
            currentQuestion += 1;
            if (currentQuestion < questions.length) {
                renderQuestion();
            } else {
                renderResult();
            }
        }

        // Presenta el puntaje y permite volver a intentarlo.
        function renderResult() {
            const percentage = Math.round((score / questions.length) * 100);
            questionCount.textContent = "Cuestionario completado";
            scoreLabel.textContent = `Puntaje: ${score} / ${questions.length}`;
            progressFill.style.width = "100%";
            progressTrack.setAttribute("aria-valuenow", String(questions.length));
            const message = percentage === 100
                ? "¡Dominio completo del tema!"
                : percentage >= 60
                    ? "¡Buen trabajo! Ya tienes claras las ideas principales."
                    : "¡Sigue explorando! Repasa el contenido y vuelve a intentarlo.";

            quizContent.innerHTML = `
                <div class="quiz-result">
                    <span class="eyebrow">Resultado final · ${percentage}%</span>
                    <h3>${score} de ${questions.length} respuestas correctas</h3>
                    <p>${message}</p>
                    <button class="button" id="retry-button" type="button">Intentarlo de nuevo</button>
                </div>
            `;
            quizContent.querySelector("#retry-button").addEventListener("click", restartQuiz);
        }

        function restartQuiz() {
            currentQuestion = 0;
            score = 0;
            renderQuestion();
        }

        const menuToggle = document.querySelector(".menu-toggle");
        const navLinks = document.querySelector("#nav-links");
        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            navLinks.classList.toggle("is-open", !isOpen);
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                menuToggle.setAttribute("aria-expanded", "false");
                navLinks.classList.remove("is-open");
            });
        });

        renderQuestion();
