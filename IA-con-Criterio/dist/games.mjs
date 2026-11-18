export const logicGames = [
  {
    id: 'series', title: 'Código de patrones', badge: '01', skill: 'Detecta la regla',
    intro: 'Completa series que cambian de regla a medida que avanzas.',
    reflection: 'En tu próxima tarea, escribe una hipótesis y compruébala con dos ejemplos antes de consultar a la IA.',
    rounds: [
      {
        title: 'Saltos en aumento', prompt: '¿Qué número sigue en la serie?', sequence: [2, 5, 9, 14, 20],
        choices: ['25', '26', '27', '28'], correct: 2,
        hint: 'Escribe debajo de cada par cuánto cambia de un número al siguiente.',
        explanation: 'Los saltos son +3, +4, +5 y +6. El siguiente salto es +7, así que 20 + 7 = 27.',
      },
      {
        title: 'Dos ritmos', prompt: '¿Qué número sigue en la serie?', sequence: [4, 10, 7, 20, 10, 40],
        choices: ['80', '13', '30', '43'], correct: 1,
        hint: 'Prueba leer por separado las posiciones pares y las impares.',
        explanation: 'En las posiciones impares aparecen 4, 7 y 10, con saltos de +3. La próxima posición es impar y lleva 13.',
      },
      {
        title: 'Saltos que cambian', prompt: '¿Qué número sigue en la serie?', sequence: [3, 8, 18, 38, 78],
        choices: ['118', '156', '160', '158'], correct: 3,
        hint: 'Compara los saltos entre sí. Mira cuánto crece cada salto respecto del anterior.',
        explanation: 'Los saltos son 5, 10, 20 y 40. Cada salto duplica al anterior, así que toca sumar 80 a 78.',
      },
    ],
  },
  {
    id: 'deduccion', title: 'Expediente lógico', badge: '02', skill: 'Cruza las evidencias',
    intro: 'Usa las pistas del caso para descartar opciones y cerrar el expediente.',
    reflection: 'Cuando uses IA para revisar una idea, compara cada sugerencia con tus propias evidencias antes de aceptarla.',
    rounds: [
      {
        title: 'Fila de salida', prompt: 'Tres estudiantes esperan en fila. ¿Quién está en el medio?',
        clues: ['Ana está antes que Beto.', 'Cami está después de Beto.'],
        choices: ['Ana', 'Beto', 'Cami', 'Puede ser cualquiera'], correct: 1,
        hint: 'Dibuja tres puestos vacíos y piensa quién tiene a alguien antes y después.',
        explanation: 'Ana va antes de Beto y Cami después. La única fila compatible es Ana, Beto, Cami.',
      },
      {
        title: 'Equipo de feria', prompt: 'Luz, Leo y Sol preparan un tema distinto cada uno: Redes, Diseño o Código. ¿Quién preparó Redes?',
        clues: ['Luz no preparó Redes.', 'Leo preparó Diseño.', 'Sol no preparó Código.'],
        choices: ['Sol', 'Luz', 'Leo', 'Faltan datos'], correct: 0,
        hint: 'Completa primero la relación que el enunciado confirma directamente.',
        explanation: 'Leo tiene Diseño. A Sol le quedan Redes y Código, pero Código está descartado para ella. Sol preparó Redes.',
      },
      {
        title: 'La caja de fichas', prompt: 'Forma una clave de tres dígitos con fichas del 1 al 4. Cada ficha puede usarse una sola vez. ¿Qué clave abre la caja?',
        clues: ['La primera ficha es par.', 'La última ficha vale el doble de la primera.', 'La ficha del medio vale menos que la primera.'],
        choices: ['124', '234', '214', '412'], correct: 2,
        hint: 'Prueba cuáles fichas pares tienen su doble dentro del conjunto disponible.',
        explanation: 'La primera ficha debe ser 2, porque el doble de 4 no está disponible. La última es 4 y la única ficha menor que 2 es 1.',
      },
    ],
  },
  {
    id: 'ruta', title: 'Ruta sin GPS', badge: '03', skill: 'Planea antes de moverte',
    intro: 'Cruza una cuadrícula con obstáculos y un número limitado de pasos.',
    reflection: 'Antes de pedir ayuda con un problema, dibuja o escribe tu plan y localiza el paso exacto que te bloquea.',
    rounds: [
      {
        title: 'La primera salida', prompt: 'Llega a la meta en un máximo de 7 pasos.',
        board: ['S...#', '.##..', '....#', '#.#.G', '.....'], limit: 7,
        hint: 'Mira las casillas que tocan la meta y comprueba desde cuáles puedes entrar.',
        explanation: 'Revisar cómo puedes entrar a la meta te permite descartar los caminos que terminan en un muro.',
      },
      {
        title: 'El cruce escondido', prompt: 'Llega a la meta en un máximo de 8 pasos.',
        board: ['S.#.G', '#.#.#', '#....', '.##.#', '.....'], limit: 8,
        hint: 'Busca una fila donde puedas pasar del lado izquierdo al lado derecho.',
        explanation: 'Identificar el cruce entre los dos lados antes de moverte reduce los desvíos.',
      },
      {
        title: 'El desvío largo', prompt: 'Llega a la meta en un máximo de 11 pasos.',
        board: ['S.#..', '.#..G', '.#.#.', '.#.#.', '.....'], limit: 11,
        hint: 'Aunque la meta se vea cerca, revisa dónde termina la pared que tienes a tu derecha.',
        explanation: 'Comparar distancias sobre los pasillos disponibles da un mejor plan que mirar solo lo cerca que se ve la meta.',
      },
    ],
  },
];

export const routeDirections = [
  {label: '↑ Arriba', offset: [-1, 0]},
  {label: '← Izquierda', offset: [0, -1]},
  {label: '↓ Abajo', offset: [1, 0]},
  {label: '→ Derecha', offset: [0, 1]},
];

export function routeNeighbor(board, [row, column], [dy, dx]) {
  const next = [row + dy, column + dx];
  const cell = board[next[0]]?.[next[1]];
  return cell && cell !== '#' ? next : null;
}

export function newLogicMatch() {
  return {index: 0, score: 0, autonomous: 0, hintRound: null, tried: false, solved: false};
}

export function useLogicHint(match, game) {
  if (!match.tried || match.solved || match.hintRound !== null || !game.rounds[match.index]) return null;
  match.hintRound = match.index;
  return game.rounds[match.index].hint;
}

export function solveLogicRound(match) {
  if (match.solved) return;
  match.solved = true;
  const assisted = match.hintRound === match.index;
  match.score += assisted ? 1 : 2;
  if (!assisted) match.autonomous += 1;
}

export function advanceLogicRound(match) {
  if (!match.solved) return;
  match.index += 1;
  match.tried = false;
  match.solved = false;
}

export function initGames(root) {
  const sessions = new Map();

  function make(tag, label = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = label;
    node.className = className;
    return node;
  }

  function button(label, className, action) {
    const node = make('button', label, className);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function focusTitle(title) {
    title.tabIndex = -1;
    title.focus();
  }

  function lobby(focus = false) {
    const title = make('h3', 'Elige tu partida', 'logic-lobby-title');
    const cards = make('div', '', 'logic-cards');
    for (const game of logicGames) {
      const card = make('article', '', 'logic-card');
      const badge = make('span', game.badge, 'logic-badge');
      badge.setAttribute('aria-hidden', 'true');
      const match = sessions.get(game.id);
      const label = match ? 'Volver a ' + game.title : 'Jugar a ' + game.title;
      card.append(badge, make('p', game.skill, 'eyebrow'), make('h4', game.title),
        make('p', game.intro),
        button(label, 'outline', () => {
          if (!sessions.has(game.id)) sessions.set(game.id, newLogicMatch());
          play(game);
        }));
      cards.append(card);
    }
    root.replaceChildren(title, cards, make('p', 'Cada juego tiene 3 rondas y una sola pista por partida. Puedes cambiar de actividad y volver a tu partida mientras esta página esté abierta.', 'logic-muted'));
    if (focus) focusTitle(title);
  }

  function play(game) {
    const match = sessions.get(game.id);
    const round = game.rounds[match.index];
    const back = button('‹ Todos los juegos', 'outline', () => lobby(true));
    const title = make('h3', round ? round.title : 'Partida completada');
    root.replaceChildren(back);
    if (!round) {
      root.append(make('p', game.title, 'eyebrow'), title,
        make('p', `Resolviste ${match.autonomous} de ${game.rounds.length} rondas por tu cuenta. Puntaje: ${match.score} de ${game.rounds.length * 2}.`, 'logic-summary'),
        make('p', game.reflection, 'logic-reflection'),
        button('Jugar de nuevo', 'primary', () => {
          sessions.set(game.id, newLogicMatch());
          play(game);
        }));
      focusTitle(title);
      return;
    }

    const stats = make('p', '', 'logic-stats');
    const puzzle = make('div', '', 'logic-puzzle');
    const feedback = make('p', match.feedback ?? '', 'logic-feedback');
    feedback.setAttribute('role', 'status');
    const hintText = make('p', '', 'logic-hint');
    hintText.setAttribute('role', 'status');
    const hint = button('Pedir pista básica', 'outline', () => {
      const text = useLogicHint(match, game);
      if (!text) return;
      sync();
      hintText.focus();
    });
    hintText.tabIndex = -1;
    const next = button(match.index === game.rounds.length - 1 ? 'Ver mi resultado' : 'Siguiente ronda', 'primary', () => {
      advanceLogicRound(match);
      delete match.path;
      delete match.choice;
      delete match.feedback;
      play(game);
    });

    function sync() {
      const available = match.hintRound === null;
      stats.textContent = `Ronda ${match.index + 1}/${game.rounds.length} · ${match.score} ${match.score === 1 ? 'punto' : 'puntos'} · Pista ${available ? 'disponible' : 'usada'}`;
      hint.disabled = !match.tried || !available || match.solved;
      hint.textContent = available ? 'Pedir pista básica' : 'Pista de la partida usada';
      hintText.hidden = match.hintRound !== match.index;
      hintText.textContent = hintText.hidden ? '' : 'Pista: ' + round.hint;
      next.hidden = !match.solved;
      feedback.textContent = match.solved ? '¡Ronda resuelta! ' + round.explanation : match.feedback ?? '';
    }

    function check(success, retryMessage) {
      match.tried = true;
      if (success) solveLogicRound(match);
      else match.feedback = retryMessage;
      sync();
    }

    root.append(make('p', game.title, 'eyebrow'), title, stats, make('p', round.prompt, 'logic-prompt'),
      puzzle, feedback, hintText);
    const actions = make('div', '', 'logic-actions');
    actions.append(hint, next);
    root.append(actions, make('p', 'La pista se habilita tras tu primer intento. Cada ronda vale 2 puntos por tu cuenta o 1 si usas la pista.', 'logic-muted'));

    if (round.board) renderRoute();
    else renderChoices();
    sync();
    focusTitle(title);

    function renderChoices() {
      if (round.sequence) {
        const sequence = make('div', '', 'logic-sequence');
        sequence.setAttribute('aria-label', 'Serie numérica');
        for (const value of [...round.sequence, '?']) sequence.append(make('span', String(value)));
        puzzle.append(sequence);
      }
      if (round.clues) {
        const clues = make('ul', '', 'logic-clues');
        for (const clue of round.clues) clues.append(make('li', clue));
        puzzle.append(clues);
      }

      const choices = make('fieldset', '', 'logic-options');
      choices.append(make('legend', 'Elige una respuesta'));
      const submit = button('Comprobar respuesta', 'primary', () => {
        if (match.choice === undefined || match.solved) return;
        check(match.choice === round.correct, 'Esa opción no encaja con todas las condiciones. Revisa tu razonamiento y vuelve a intentar.');
        if (match.solved) {
          choices.disabled = true;
          submit.disabled = true;
          next.focus();
        }
      });
      submit.disabled = match.choice === undefined || match.solved;
      choices.disabled = match.solved;
      for (const [index, label] of round.choices.entries()) {
        const option = make('label', '', 'logic-option');
        const radio = make('input');
        radio.type = 'radio';
        radio.name = 'logic-choice';
        radio.checked = match.choice === index;
        radio.addEventListener('change', () => {
          match.choice = index;
          submit.disabled = false;
        });
        option.append(radio, make('span', label));
        choices.append(option);
      }
      puzzle.append(choices, submit);
    }

    function renderRoute() {
      const board = make('div', '', 'logic-board');
      const legend = make('p', 'S: salida · ×: muro · M: meta', 'logic-muted');
      const position = make('p', '', 'logic-position');
      position.setAttribute('role', 'status');
      const directions = make('div', '', 'logic-actions');
      directions.setAttribute('role', 'group');
      directions.setAttribute('aria-label', 'Direcciones');
      const startRow = round.board.findIndex(row => row.includes('S'));
      match.path ??= [[startRow, round.board[startRow].indexOf('S')]];
      const moveButtons = routeDirections.map(({label, offset}) => button(label, 'outline', () => {
        const step = routeNeighbor(round.board, match.path.at(-1), offset);
        if (match.solved || match.path.length > round.limit) return;
        if (!step) {
          match.feedback = 'Hay un muro o un borde en esa dirección.';
          sync();
          return;
        }
        match.path.push(step);
        const reached = round.board[step[0]][step[1]] === 'G';
        const exhausted = match.path.length - 1 === round.limit;
        check(reached, exhausted ? 'Llegaste al límite de pasos. Deshaz un movimiento o reinicia la ruta para probar otro camino.' : '');
        paint();
        if (match.solved) next.focus();
      }));
      directions.append(...moveButtons);

      const undo = button('Deshacer paso', 'outline', () => {
        if (match.path.length < 2 || match.solved) return;
        match.path.pop();
        match.feedback = '';
        sync();
        paint();
      });
      const reset = button('Reiniciar ruta', 'outline', () => {
        if (match.solved) return;
        match.path.length = 1;
        match.feedback = '';
        sync();
        paint();
      });
      const tools = make('div', '', 'logic-actions');
      tools.append(undo, reset);
      puzzle.append(board, legend, position, directions, tools);
      paint();

      function paint() {
        const [y, x] = match.path.at(-1);
        const steps = match.path.length - 1;
        position.textContent = `Fila ${y + 1}, columna ${x + 1} · Pasos ${steps}/${round.limit}`;
        board.setAttribute('role', 'img');
        board.setAttribute('aria-label', round.board.map((row, iy) => {
          const tiles = Array.from(row, (cell, ix) => cellLabel(cell, iy === y && ix === x)[0]);
          return `Fila ${iy + 1}: ${tiles.join(', ')}`;
        }).join('. '));
        const tiles = round.board.flatMap((row, iy) => Array.from(row, (cell, ix) => {
          const [label, style, icon] = cellLabel(cell, iy === y && ix === x);
          const tile = make('span', icon, 'logic-cell ' + style);
          tile.title = label;
          return tile;
        }));
        board.replaceChildren(...tiles);
        moveButtons.forEach(control => {
          control.disabled = match.solved || steps >= round.limit;
        });
        undo.disabled = reset.disabled = !steps || match.solved;
      }

      function cellLabel(cell, occupied) {
        if (occupied) return ['Tú', 'player', 'Tú'];
        if (cell === '#') return ['Muro', 'wall', '×'];
        if (cell === 'S') return ['Salida', 'start', 'S'];
        if (cell === 'G') return ['Meta', 'goal', 'M'];
        return ['Libre', '', '·'];
      }
    }
  }

  lobby();
}
