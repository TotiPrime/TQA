import { topics, cases, replyTo, topicReply } from './knowledge.mjs';
import { initGames } from './games.mjs';

const log = document.querySelector('#messages');
const input = document.querySelector('#question');
const followUps = document.querySelector('#follow-ups');
const quiz = document.querySelector('#quiz');
const modes = [...document.querySelectorAll('[data-view]')];
let current = 0;
let correctCount = 0;
let lastTopic;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function message(speaker, body, source) {
  const article = element('article', '', speaker === 'Tú' ? 'message user' : 'message');
  article.append(element('span', speaker, 'sender'), element('p', body));
  if (source) {
    const link = element('a', source[0] + ' ›');
    link.href = source[1];
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    article.append(link);
  }
  log.append(article);
  const messageTop = log.scrollTop + article.getBoundingClientRect().top - log.getBoundingClientRect().top;
  log.scrollTop = Math.min(log.scrollHeight - log.clientHeight, messageTop - 12);
}

function resetChat() {
  log.replaceChildren();
  input.value = '';
  lastTopic = undefined;
  followUps.replaceChildren();
  followUps.hidden = true;
  message('Asistente', 'Hola, soy el asistente de IA con Criterio. Dime en qué sueles depender de la IA o elige una pregunta. Podemos preparar un primer intento propio, una pista o un plan para usarla menos.');
}

function converse(question, result) {
  message('Tú', question);
  message('Asistente', result.answer, result.source);
  lastTopic = result.id;
  const suggestions = result.suggestions ?? [];
  followUps.replaceChildren(...suggestions.map(question => {
    const button = element('button', question, 'outline');
    button.type = 'button';
    button.addEventListener('click', () => {
      converse(question, replyTo(question, lastTopic));
      input.focus();
    });
    return button;
  }));
  followUps.hidden = suggestions.length === 0;
}

function switchView(name) {
  for (const mode of modes) {
    const selected = mode.dataset.view === name;
    document.getElementById(mode.dataset.view).hidden = !selected;
    mode.setAttribute('aria-pressed', String(selected));
  }
}

function renderQuiz(focus = false) {
  quiz.replaceChildren();
  if (current === cases.length) {
    const title = element('h3', `Resultado · ${correctCount} de ${cases.length}`);
    title.tabIndex = -1;
    const restart = element('button', 'Volver a practicar', 'primary');
    restart.style.marginTop = '14px';
    restart.addEventListener('click', () => {
      current = 0;
      correctCount = 0;
      renderQuiz(true);
    });
    quiz.append(title, element('p', 'Puedes repetir el reto o conversar sobre el caso que te hizo dudar.'), restart);
    if (focus) title.focus();
    return;
  }

  const scenario = cases[current];
  const title = element('h3', scenario.prompt);
  title.tabIndex = -1;
  const options = element('div', '', 'choices');
  const feedback = element('p');
  feedback.id = 'feedback';
  feedback.setAttribute('role', 'status');
  const next = element('button', current === cases.length - 1 ? 'Ver resultado' : 'Siguiente caso', 'primary');
  next.disabled = true;
  next.addEventListener('click', () => {
    current += 1;
    renderQuiz(true);
  });

  for (const [index, label] of scenario.options.entries()) {
    const choice = element('button', label, 'choice');
    choice.addEventListener('click', () => {
      const isCorrect = index === scenario.correct;
      if (isCorrect) correctCount += 1;
      for (const option of options.children) option.disabled = true;
      options.children[scenario.correct].classList.add('correct');
      if (!isCorrect) choice.classList.add('incorrect');
      feedback.textContent = (isCorrect ? 'Correcto. ' : 'Respuesta recomendada: ' + scenario.options[scenario.correct] + ' ') + scenario.feedback;
      next.disabled = false;
      next.focus();
    });
    options.append(choice);
  }
  quiz.append(element('p', `CASO ${current + 1} DE ${cases.length}`, 'eyebrow'), title, options, feedback, next);
  if (focus) title.focus();
}

document.querySelector('#ask').addEventListener('submit', (event) => {
  event.preventDefault();
  const question = input.value.trim();
  if (!question) return;
  converse(question, replyTo(question, lastTopic));
  input.value = '';
  input.focus();
});
document.querySelector('#reset').addEventListener('click', () => {
  resetChat();
  input.focus();
});
for (const mode of modes) mode.addEventListener('click', () => switchView(mode.dataset.view));
for (const button of document.querySelectorAll('[data-topic]')) {
  button.addEventListener('click', () => {
    const id = button.dataset.topic;
    switchView('chat');
    converse(topics[id].question, topicReply(id));
    input.focus();
  });
}
resetChat();
renderQuiz();
initGames(document.querySelector('#logic-games'));
if (['juegos','reto','chat'].includes(location.hash.slice(1))) switchView(location.hash.slice(1));
