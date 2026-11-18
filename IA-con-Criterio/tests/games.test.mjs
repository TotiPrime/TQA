import {test} from 'node:test';
import assert from 'node:assert/strict';
import {logicGames, routeDirections, routeNeighbor, newLogicMatch, useLogicHint, solveLogicRound, advanceLogicRound} from '../dist/games.mjs';

test('una partida ofrece una pista, después del primer intento, y solo una', () => {
  for (const game of logicGames) {
    const match = newLogicMatch();
    assert.equal(useLogicHint(match, game), null);
    match.tried = true;
    assert.equal(useLogicHint(match, game), game.rounds[0].hint);
    assert.equal(useLogicHint(match, game), null);
    solveLogicRound(match);
    solveLogicRound(match);
    assert.equal(match.score, 1);
    assert.equal(match.autonomous, 0);
    advanceLogicRound(match);
    match.tried = true;
    assert.equal(useLogicHint(match, game), null);
    solveLogicRound(match);
    assert.equal(match.score, 3);
    assert.equal(match.autonomous, 1);
    assert.equal(newLogicMatch().hintRound, null);
  }
});

test('los nueve niveles tienen contenido y cada laberinto se puede resolver', () => {
  assert.equal(logicGames.flatMap(game => game.rounds).length, 9);
  for (const game of logicGames) {
    for (const round of game.rounds) {
      assert.ok(round.hint && round.explanation);
      if (!round.board) {
        assert.ok(round.choices[round.correct]);
        continue;
      }
      const startRow = round.board.findIndex(row => row.includes('S'));
      const queue = [{position: [startRow, round.board[startRow].indexOf('S')], distance: 0}];
      const seen = new Set([queue[0].position.join(',')]);
      let distanceToGoal = Infinity;
      while (queue.length) {
        const {position, distance} = queue.shift();
        if (round.board[position[0]][position[1]] === 'G') {
          distanceToGoal = distance;
          break;
        }
        for (const {offset} of routeDirections) {
          const next = routeNeighbor(round.board, position, offset);
          if (!next || seen.has(next.join(','))) continue;
          seen.add(next.join(','));
          queue.push({position: next, distance: distance + 1});
        }
      }
      assert.ok(distanceToGoal <= round.limit, round.title);
    }
  }
});
