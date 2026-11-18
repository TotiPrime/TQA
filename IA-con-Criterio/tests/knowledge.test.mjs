import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cases, replyTo, topicReply, topics} from '../dist/knowledge.mjs';

const sampleQuestions = [
  ['¿Cómo le hago para bajar el uso de la IA?', 'reducir'],
  ['Quiero dejar de depender tanto de ChatGPT', 'reducir'],
  ['Me acostumbré a preguntarle todo', 'reducir'],
  ['¿Cómo uso la IA como asistente y no como nuestro cerebro?', 'asistente'],
  ['Quiero que la IA no piense por mí', 'asistente'],
  ['¿Cómo le pido pistas sin que resuelva mi tarea?', 'pistas'],
  ['¿Cómo le pido ayuda sin que me haga la tarea?', 'pistas'],
  ['Quiero un plan de 7 días para usar menos IA', 'plan'],
  ['¿Cómo mido si dependo menos de ChatGPT?', 'medir'],
  ['¿Cómo hago seguimiento de mi progreso?', 'medir'],
  ['Me quedo en blanco sin IA', 'bloqueo'],
  ['No sé por dónde empezar sin ChatGPT', 'bloqueo'],
  ['¿Cómo programo con ayuda de IA sin depender?', 'programar'],
  ['¿Cómo depuro en C# sin pedir el código completo?', 'programar'],
  ['¿Cómo puedo practicar C# sin ChatGPT?', 'programar'],
  ['¿Cómo redacto mi informe con mi propio criterio?', 'escribir'],
  ['¿Cómo estudio para un examen sin depender de ChatGPT?', 'estudiar'],
  ['¿Cómo hago ejercicios sin copiar el procedimiento?', 'ejercicios'],
  ['¿Cuándo me conviene consultar a la IA?', 'decidir'],
  ['¿Qué prompt uso para que la IA me ayude a aprender?', 'prompts'],
  ['Quiero retroalimentación sobre mi borrador sin que lo rehaga', 'revisar'],
  ['¿Cómo sé si realmente aprendí?', 'comprobar'],
  ['¿Qué hago si voy tarde y dependo de ChatGPT?', 'entrega'],
  ['¿Qué alternativas puedo usar para depurar?', 'alternativas'],
  ['Volví a usar la IA para todo', 'retomar'],
  ['¿Cómo verifico una cita de ChatGPT para mi informe?', 'fuentes'],
  ['¿Puedo subir los datos personales de mi tarea?', 'privacidad'],
  ['¿Qué datos debo evitar compartir?', 'privacidad'],
  ['¿Qué cuenta como plagio en mi informe?', 'tarea'],
  ['¿Cómo compruebo un video viral?', 'desinformacion'],
  ['¿Cuál es la capital de Francia?', undefined],
];

test('clasifica preguntas con variantes y mantiene los temas anteriores', () => {
  for (const [question, expected] of sampleQuestions) {
    assert.equal(replyTo(question).id, expected, question);
  }
});

test('responde seguimientos con el último tema y permite cambiarlo', () => {
  const plan = replyTo('Quiero un plan de siete días');
  assert.equal(plan.id, 'plan');
  assert.deepEqual(plan.suggestions, ['Dame un ejemplo', '¿Cómo empiezo?']);
  assert.equal(replyTo('Dame un ejemplo', plan.id).answer, topics.plan.example);
  assert.equal(replyTo('¿Cómo empiezo?', plan.id).answer, topics.plan.nextStep);
  assert.equal(replyTo('¿Cómo uso IA para estudiar?', plan.id).id, 'estudiar');
  assert.equal(replyTo('Dame un ejemplo').id, undefined);
});

test('todos los temas tienen orientación y se mantienen los seis casos', () => {
  for (const id of Object.keys(topics)) {
    const result = topicReply(id);
    assert.ok(result.answer.length > 30, id);
    if (topics[id].example) {
      assert.ok(topicReply(id, 'example').answer.length > 30, id);
      assert.ok(topicReply(id, 'start').answer.length > 30, id);
    }
  }
  assert.equal(cases.length, 6);
});
