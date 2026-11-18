const unesco = ['Guía de UNESCO sobre IA generativa', 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research'];
const nist = ['Perfil de riesgos de NIST', 'https://doi.org/10.6028/NIST.AI.600-1'];
const bastani = ['Estudio de Bastani y colaboradores', 'https://doi.org/10.1073/pnas.2422633122'];

function guide(question, signals, answer, example, nextStep) {
  return {question, signals, answer, example, nextStep};
}

const coaching = {
  pieza: guide('¿Cómo compruebo si se entiende mi afiche?', [[27,/\b(afiche|bocetos?|pieza visual|diseno grafico|tipografia)\b/]], 'Muestra tu boceto a una persona del público previsto. Pídele que identifique el mensaje sin explicárselo. Anota qué encontró y qué pasó por alto.', 'Si omitió el horario, compara dos ubicaciones del texto con el mismo tamaño de impresión.', 'Elige una afirmación visual y escribe cómo la comprobarías.'),
  costos: guide('¿Cómo verifico el presupuesto?', [[27,/\b(presupuesto|cotizacion|empaque|costos?|precio de venta)\b/]], 'Elige un costo que influya en la decisión y busca la cotización original. Revisa unidad, cantidad y fecha antes de aceptar el cálculo.', 'Divide el precio de la caja entre las unidades que realmente puedes usar.', 'Marca en tu presupuesto una cifra que aún necesite respaldo.'),
  caso: guide('¿Cómo analizo un caso de Derecho?', [[26,/\b(normativa|juridico|derecho|norma|jurisprudencia)\b/]], 'Separa los hechos del caso ficticio y el fragmento normativo asignado por tu docente. Anota qué parte del texto respalda tu interpretación.', 'Compara una condición del fragmento con un hecho concreto del caso.', 'Elige un párrafo de la fuente original y formula tu propia pregunta.'),
  salud: guide('¿Cómo reviso un folleto de salud?', [[27,/\b(folleto|salud|paciente|clinico)\b/]], 'Trabaja con material educativo y una fuente indicada por tu docente. Compara una frase del folleto con la fuente. Deja los datos de pacientes fuera del chat.', 'Señala un término que pueda resultar confuso para el público y ensaya una explicación propia.', 'Escoge una frase del folleto para revisarla con tu docente.'),
  defensa: guide('¿Cómo preparo la defensa del Integrador?', [[27,/\b(defensa|defender|exponer|exposicion|integrador)\b/]], 'Escoge una decisión del grupo. Ensaya una explicación de un minuto en la que muestres el primer intento, una alternativa y la evidencia final.', 'Abre tu ficha y señala el dato o la observación que hizo cambiar la propuesta.', 'Pide a otro integrante que te pregunte por qué descartaste la otra opción.'),
  reducir: guide(
    '¿Cómo reduzco mi uso de la IA?',
    [[16,/\b(redu[cz]\w*|disminu\w*|bajar|limitar|dejar de usar|dejar de depender|usar menos|utilizar menos|usar la ia tanto|uso excesivo|uso demasiado|uso mucho|paso horas|abus\w*)\b/], [7,/\b(para todo|siempre recurro|todo lo hago con|depend\w*|me cuesta empezar|sin pensar|sin ia|mucho la ia|segundo cerebro|sin chatgpt|me acostumbre|mucho chatgpt)\b/]],
    'Elige una actividad que hoy empiezas con IA, como un ejercicio o un párrafo. Durante tres días, haz el primer intento sin abrir el chat. Anota qué intentaste y en qué te trabaste. Si la consigna permite IA, pide una pista sobre ese punto y termina por tu cuenta. Empieza con una sola actividad para que puedas repetir el hábito.',
    'Si siempre le pides que escriba la introducción, redacta tres frases tuyas: qué problema vas a tratar, por qué importa y qué vas a explicar. Después puedes pedirle que señale qué idea quedó poco clara.',
    'Hoy elige una tarea habitual y deja la pestaña de IA cerrada durante el primer intento. Al final marca si pudiste empezar y explicar tu decisión.',
  ),
  asistente: guide(
    '¿Cómo uso la IA como asistente?',
    [[19,/\b(asistente|copiloto|apoyo|mi cerebro|nuestro cerebro|piense por mi|pensar por mi|haga todo|haga todo por mi|sin delegar|sin reemplazar|uso responsable|uso con criterio)\b/]],
    'Divide el trabajo en tres momentos. Antes de consultar, define tu objetivo y prepara un intento. Durante la consulta, asigna a la IA una función concreta, como dar una pista, hacerte preguntas o señalar un error. Después, decide qué sugerencias sirven, verifícalas y termina con tus palabras o tu código.',
    'Puedes pedir: «Este es mi intento y aquí me trabé. Hazme una pregunta que me ayude a avanzar. Espera mi respuesta antes de darme otra pista».',
    'Para tu próxima consulta escribe una línea con tu intento y otra con el tipo de ayuda permitido. Cuando cierres el chat, explica qué decidiste conservar y por qué.',
  ),
  pistas: guide(
    '¿Cómo le pido pistas sin que resuelva mi tarea?',
    [[30,/\b(pista|pistas|sin que resuelva|sin resolver|sin darme la respuesta|sin darme la solucion|sin hacer mi tarea|sin que haga mi tarea|sin que me haga la tarea|ayudame a pensar)\b/]],
    'Muestra lo que intentaste, marca el paso que te bloquea y pide una sola pista. Si recibes la solución completa, vuelve a tu intento y pide una pregunta orientadora sobre el paso exacto. Escribe tu siguiente paso antes de volver al chat.',
    'Puedes pedir: «Ya identifiqué las entradas y las salidas. Me trabé al elegir un bucle. Dame una pregunta para que yo decida cuál usar y espera mi intento».',
    'Prueba una ronda: una pista, un intento propio y una comprobación con un ejemplo distinto.',
  ),
  plan: guide(
    'Quiero un plan de 7 días para usar menos IA',
    [[31,/\b(plan|reto|rutina|horario|cronograma|una semana|siete dias|7 dias|habito semanal)\b/]],
    'Plan de 7 días\nDía 1 · Anota en qué tareas abres la IA y para qué.\nDía 2 · Elige una de esas tareas y haz el primer intento por tu cuenta.\nDía 3 · Si te trabas y está permitido, pide solo una pista.\nDía 4 · Muestra un borrador y pide comentarios puntuales.\nDía 5 · Verifica una sugerencia con tus apuntes o una fuente original.\nDía 6 · Resuelve un caso parecido sin IA.\nDía 7 · Compara tus intentos y elige un hábito para repetir la próxima semana.',
    'Si estudias Programación, trabaja toda la semana con ejercicios de bucles: registra cuándo consultas, pide una pista sobre el bloqueo y termina con un ejercicio nuevo sin el chat.',
    'Empieza hoy con una nota breve: tarea, cuándo abrí la IA y qué pude hacer primero. Usa la misma nota durante los siete días.',
  ),
  medir: guide(
    '¿Cómo mido mi avance al usar menos IA?',
    [[29,/\b(medir|mido|monitorear|seguimiento|registrar|registro|avance|progreso|voy mejorando|cuanto uso|cuantas veces|control de uso|bitacora|indicador)\b/]],
    'Durante una semana registra cuatro cosas por actividad: qué tarea hiciste, si empezaste por tu cuenta, qué tipo de ayuda pediste y si pudiste explicar el resultado con el chat cerrado. Compara tareas parecidas. Cuenta cuántas empezaste por tu cuenta y cuántas pudiste explicar. Esas dos medidas te dicen más sobre tu autonomía que contar mensajes.',
    'Registro de ejemplo: «Ejercicio de C# | Primer intento propio: sí | Ayuda: una pista sobre índices | Lo repetí sin chat: sí».',
    'Al final de la semana divide las tareas que empezaste por tu cuenta entre las tareas que registraste. Compara ese porcentaje con el de la semana siguiente.',
  ),
  bloqueo: guide(
    '¿Qué hago si me bloqueo sin IA?',
    [[23,/\b(bloque\w*|trab\w*|no se por donde|no se como (empezar|comenzar)|no se que hacer|me quedo en blanco|no me sale|paraliz\w*)\b/]],
    'Escribe en una frase qué pide la actividad. Después separa lo que ya sabes de lo que te falta y elige el paso más pequeño que puedas probar. Si sigues bloqueado, revisa un ejemplo de clase o consulta a un compañero. Si usas IA, describe el bloqueo concreto y pide una pista para ese paso.',
    'Si tienes que escribir un informe y la página está en blanco, anota una pregunta que tu informe debe responder. Escribe debajo dos ideas propias y recién después decide si necesitas ayuda para ordenarlas.',
    'Pon un temporizador de 5 minutos para probar un paso pequeño. Al terminar completa la frase «Pude hacer… y me falta entender…».',
  ),
  programar: guide(
    '¿Cómo programo con ayuda de IA sin depender?',
    [[27,/\b(program\w*|codigo|c sharp|javascript|python|bug|debug\w*|depur\w*|compil\w*|software)\b/]],
    'Antes de consultar, escribe qué debe hacer el programa y prepara un caso de prueba. Ejecuta tu intento y compara la salida esperada con la real. Si necesitas apoyo, pide que te ayuden a localizar el error o que sugieran un caso límite. Tú decides el cambio, lo pruebas y explicas por qué funciona.',
    'Puedes pedir: «En mi bucle de C#, para una lista de 3 elementos esperaba recorrer 3 índices. Señala qué condición debo revisar y sugiere una prueba. Mantén mi código y espera mi corrección».',
    'Haz dos pruebas sin asistencia: un caso normal y un caso límite. Luego explica en voz alta qué instrucción produce cada resultado.',
  ),
  escribir: guide(
    '¿Cómo uso IA para escribir un informe propio?',
    [[27,/\b(escri\w*|redac\w*|borrador|informe|ensayo|parrafo|introduccion|conclusion|monografia|ortografia)\b/]],
    'Escribe tu postura y tres ideas antes de abrir la IA. Redacta un primer borrador con tus palabras. Si se permite, pide observaciones sobre claridad, estructura o argumentos débiles. Revisa los comentarios uno por uno y edita tú el texto. Comprueba por separado cualquier dato o cita.',
    'Puedes pedir: «Lee este párrafo. Dime qué afirmación necesita evidencia y qué oración es difícil de entender. Enumera los comentarios para que yo lo revise».',
    'Abre tu borrador y marca una idea que puedas defender. Busca una fuente que la respalde antes de pedir comentarios de estilo.',
  ),
  estudiar: guide(
    '¿Cómo uso IA para estudiar para un examen?',
    [[27,/\b(examen|parcial|estudi\w*|repas\w*|memor\w*|tarjetas|flashcards|preguntas de practica)\b/]],
    'Empieza recordando lo que sabes con los apuntes cerrados. Después consulta tus materiales y comprueba tus vacíos. Si puedes usar IA en tu preparación, pídele preguntas de práctica de una en una. Responde sin mirar la solución y verifica la corrección con los apuntes. Termina repitiendo una pregunta similar sin ayuda.',
    'Puedes pedir: «Hazme una pregunta sobre rutas estáticas. Espera mi respuesta. Luego indica qué concepto debo repasar y hazme una pregunta nueva del mismo nivel».',
    'Hoy responde tres preguntas con el chat cerrado. Marca cuál pudiste explicar y cuál requiere volver a los apuntes.',
  ),
  ejercicios: guide(
    '¿Cómo hago ejercicios con IA sin copiar el procedimiento?',
    [[27,/\b(matem\w*|ejercicio\w*|ecuaci\w*|calculo|formula\w*|problema numerico)\b/]],
    'Anota los datos y qué te piden. Elige una estrategia y resuelve hasta el punto donde te trabes. Si puedes consultar IA, pide que revise ese paso, que sugiera cómo comprobarlo o que te dé un problema parecido. Resuelve el caso nuevo con el chat cerrado para ver qué parte ya dominas.',
    'Puedes pedir: «Llegué a este resultado de interés compuesto. Indica qué unidad o conversión debería comprobar y dame un ejemplo similar sin resolver».',
    'Cambia un dato del ejercicio y predice cómo debería cambiar el resultado antes de recalcular.',
  ),
  decidir: guide(
    '¿Cuándo me conviene usar IA y cuándo debería cerrar el chat?',
    [[26,/\b(cuando (conviene|me conviene|sirve|usar|debo usar|puedo usar|cerrar|dejar|deberia)|en que casos|vale la pena|necesito usar|deberia consultar|deberia usar|cerrar el chat)\b/]],
    'Antes de abrir la IA, revisa tres cosas: si la actividad lo permite, si tienes un objetivo concreto y si podrás verificar la ayuda. Si el objetivo es practicar una habilidad, intenta primero el paso principal. Cierra el chat cuando tengas una acción que puedas probar y vuelve solo con una duda concreta.',
    'En una exposición puedes organizar primero tus argumentos y usar la IA al final para simular preguntas del público. Durante una evaluación, sigue la consigna específica.',
    'Anota una regla para hoy: «Abriré la IA después de mi intento y solo para ______». Llena el espacio con una ayuda concreta.',
  ),
  prompts: guide(
    '¿Qué prompt uso para que la IA me ayude a aprender?',
    [[26,/\b(prompt\w*|instruccion\w*|como le pido|como preguntar|que le digo|que le escribo)\b/]],
    'Un pedido útil incluye tu objetivo, tu intento, tu bloqueo y el límite de la ayuda. Pide una acción concreta: una pregunta, una pista o un comentario. Decide con anticipación qué harás cuando recibas la respuesta.',
    'Plantilla: «Mi objetivo es [objetivo]. Ya intenté [intento]. Me trabé en [paso]. Ayúdame con [una pista / una pregunta / un comentario]. Espera a que pruebe tu sugerencia».',
    'Copia la plantilla y complétala con un problema real de clase. Borra nombres, datos privados y detalles innecesarios antes de compartirla.',
  ),
  revisar: guide(
    '¿Cómo pido retroalimentación sin que la IA rehaga mi trabajo?',
    [[30,/\b(retroalimentacion|feedback|comentarios sobre|comentarios sin|revisa mi|revisar mi|revise mi|sin reescribir|sin rehacer|que corrija|me corrija|critique mi)\b/]],
    'Entrega un borrador o un intento breve y señala el criterio que quieres revisar. Pide que identifique dos puntos concretos y explique por qué. Evalúa sus comentarios con la consigna, elige uno y realiza el cambio tú.',
    'Puedes pedir: «Revisa la claridad de mi argumento. Indica una idea que esté clara y otra que deba justificar mejor. Describe el problema y deja la corrección en mis manos».',
    'Elige un criterio de la consigna y revisa tu propio trabajo con él antes de pedir una segunda opinión.',
  ),
  comprobar: guide(
    '¿Cómo sé si realmente aprendí y puedo hacerlo sin IA?',
    [[28,/\b(realmente aprendi|si aprendi|si lo entendi|comprendi|domino|puedo hacerlo solo|puedo hacerlo sin|hacerlo por mi cuenta|aprendi de verdad|probarme|si se hacerlo)\b/]],
    'Cierra el chat y haz tres comprobaciones: explica la idea con tus palabras, resuelve un caso nuevo y justifica una decisión. Si solo puedes repetir lo que viste, cambia un dato o una condición y revisa qué harías diferente. Usa los errores para elegir qué repasar.',
    'Si la IA te ayudó con rutas estáticas, dibuja una topología distinta y explica qué red y próximo salto pondrías en cada router.',
    'Pide a un compañero que cambie una condición de tu ejercicio. Resuélvelo y explica qué cambiaste sin abrir la conversación.',
  ),
  entrega: guide(
    '¿Qué hago si siento que necesito IA por falta de tiempo?',
    [[28,/\b(falta de tiempo|poco tiempo|no tengo tiempo|voy tarde|para manana|debo entregar hoy|entrega hoy|contrarreloj|plazo corto|me queda poco)\b/]],
    'Identifica la parte indispensable de la entrega y reserva un bloque corto para tu propio intento. Si la consigna permite IA, úsala para revisar una sección concreta o preparar una lista de comprobación. Si el tiempo sigue sin alcanzar, consulta las opciones de la materia y prioriza lo que puedas justificar.',
    'Para un informe de mañana, escribe primero tu idea central, evidencia y conclusión. Pide a la IA que haga preguntas sobre puntos débiles. Corrige tú lo que realmente afecta el argumento.',
    'Haz una lista de tres puntos imprescindibles y empieza por el que puedes completar con lo que ya sabes.',
  ),
  alternativas: guide(
    '¿Qué puedo usar además de la IA cuando tengo una duda?',
    [[28,/\b(alternativa\w*|sin internet|recursos sin ia|que puedo usar ademas|reemplazar la ia|en vez de (usar )?(ia|chatgpt)|en lugar de (usar )?(ia|chatgpt)|que usar sin|que hago sin)\b/]],
    'Escoge el recurso según tu duda: apuntes y ejemplos de clase para recordar un procedimiento, documentación oficial para comprobar una función, un compañero para explicar el razonamiento en voz alta, o la tutoría docente cuando la consigna o el concepto sigan sin quedar claros.',
    'Para un error en C#, reduce el código hasta que quede el caso mínimo, lee el mensaje del compilador y consulta la documentación de la instrucción. Si consultas a alguien, muestra ese caso pequeño.',
    'Antes de abrir IA, elige un recurso y prueba una comprobación de 5 minutos. Anota qué quedó resuelto.',
  ),
  retomar: guide(
    '¿Qué hago si vuelvo a usar la IA para todo?',
    [[30,/\b(volvi a usar|vuelvo a usar|otra vez para todo|no cumpli|rompi mi rutina|me rendi|retomar|reca\w*)\b/]],
    'Revisa en qué momento volviste al hábito: al empezar, al trabarte o cerca de una entrega. Elige un ajuste pequeño para ese momento. Si abriste el chat demasiado pronto, mueve su acceso directo y deja lista una hoja de primer intento. Retoma en la siguiente actividad.',
    'Si ayer le pediste a la IA la respuesta completa, hoy prueba con una tarea corta: haz un intento propio, pide una pista si hace falta y resuelve un segundo caso sin chat.',
    'Escribe «Cuando pase ___, haré ___ antes de abrir la IA». Prueba esa regla en tu próxima tarea.',
  ),
};

export const topics = {
  ...coaching,
  tarea: {
    question: '¿Puedo usar IA para una tarea?',
    signals: [[32,/\b(plagio|autor[ií]a|trampear|hacerme la tarea|hazme|resuelve mi|evadir|detector)\b/], [3,/\b(tarea|tareas|examen|entrega|entregar|integridad|copiar|copia|declarar|declaraci[oó]n|permite|uso permitido)\b/]],
    answer: 'Primero revisa la consigna y pregunta al docente qué usos permite. Si puedes usar IA, pídele una pista, retroalimentación o preguntas de práctica. Elabora tu respuesta, comprueba que puedes explicarla y declara la ayuda recibida según la consigna.\n\nEjemplo de declaración: “Utilicé IA para generar preguntas de práctica. Revisé el resultado y elaboré mi propia respuesta”.',
    source: unesco,
  },
  fuentes: {
    question: '¿Cómo verifico una cita generada por IA?',
    signals: [[33,/\b(cita|citar|citas|doi|fuente|fuentes|referencia|referencias|bibliograf[ií]a|inventad[ao]s?)\b/], [2,/\b(verificar|comprobar|verifico|compruebo|alucinaci[oó]n|alucina|miente)\b/]],
    answer: 'Busca el título exacto en un catálogo académico o sitio editorial. Abre la fuente y confirma autor, fecha y DOI si corresponde. Luego lee el fragmento relevante y revisa si respalda tu afirmación. Si la obra o el fragmento no aparecen, elimina la cita o sustitúyela por una fuente que hayas leído.',
    source: nist,
  },
  privacidad: {
    question: '¿Qué datos debo evitar compartir?',
    signals: [[34,/\b(contrase[nñ]a|contrase[nñ]as|c[eé]dula|expediente|privacidad|personales|historia cl[ií]nica|datos sensibles|qu[eé] datos|lista de estudiantes|n[oó]mina)\b/], [3,/\b(subir|adjuntar|anonimi\w*|tel[eé]fono|correo|direcci[oó]n|confidencial)\b/]],
    answer: 'Evita ingresar contraseñas, cédulas, expedientes, listas identificables o trabajos ajenos sin autorización. Para practicar, crea un ejemplo ficticio que conserve solo la estructura del problema. Si la actividad requiere datos reales, consulta al docente qué herramienta y procedimiento están autorizados.',
    source: nist,
  },
  dependencia: {
    question: '¿Cómo reduzco mi dependencia de la IA?',
    signals: [[6,/\b(depend\w*|autonom[ií]a|sin ia|por mi cuenta|sobreuso|abuso|uso excesivo)\b/], [2,/\b(aprender|pista|practicar|estudiar|entender|aprender mejor)\b/]],
    answer: 'Intenta el problema durante 10 minutos y escribe dónde te trabaste. Si el uso está permitido, pide una sola pista. Cierra el asistente, resuelve un problema parecido y explica tu razonamiento en voz alta. Si todavía te cuesta, revisa tus apuntes o pide retroalimentación al docente.',
    source: bastani,
    example: 'Si pides a la IA que resuelva un ejercicio de vectores, prueba con uno similar y explícale a un compañero cómo cambia el resultado cuando cambias el tamaño del vector.',
    nextStep: 'Elige un ejercicio de hoy. Haz el primer intento en papel y abre el chat solo si ya puedes describir el punto exacto que te bloquea.',
  },
  desinformacion: {
    question: '¿Cómo detecto sesgos o desinformación?',
    signals: [[33,/\b(sesgo|sesgos|desinformaci[oó]n|deepfake|noticia falsa|video falso|manipulad[ao]|discriminaci[oó]n|viral)\b/], [2,/\b(difundir|publicar|estereotipo|imagen falsa|rumor)\b/]],
    answer: 'Identifica la afirmación, quién la publicó y en qué fecha. Busca el material original y contrástalo con fuentes independientes. Revisa si faltan voces o contexto y separa lo comprobado de lo dudoso. Si la evidencia no alcanza, evita compartirlo como un hecho.',
    source: nist,
  },
};

export const cases = [
  {
    prompt: 'Tu docente permite usar IA para estudiar. ¿Cómo la usas antes de entregar un ejercicio?',
    options: ['Pido la solución completa y cambio algunas palabras.', 'Resuelvo primero, pido una pista y explico mi solución.', 'Entrego el texto generado si coincide con el resultado.'],
    correct: 1, feedback: 'Una pista puede ayudarte a avanzar y te permite conservar tu razonamiento. Sigue también las reglas de declaración de la actividad.',
  },
  {
    prompt: 'Una IA te da un artículo con un DOI. ¿Qué haces antes de citarlo?',
    options: ['Abro el artículo y compruebo sus datos y lo que afirma.', 'Lo cito si el título suena académico.', 'Le pregunto a la misma IA si la referencia existe.'],
    correct: 0, feedback: 'Comprueba tanto la existencia del documento como el respaldo de la afirmación en el texto original.',
  },
  {
    prompt: 'Quieres practicar análisis de datos con una lista de notas que incluye nombres y cédulas.',
    options: ['Subo la lista completa y pido discreción.', 'Borro solo los nombres y conservo las cédulas.', 'Uso un conjunto ficticio con las mismas columnas relevantes.'],
    correct: 2, feedback: 'Un conjunto ficticio permite practicar sin exponer información identificable.',
  },
  {
    prompt: 'Un video viral parece mostrar una declaración polémica. ¿Qué haces?',
    options: ['Lo comparto con un signo de pregunta.', 'Busco la grabación original y contrasto el contexto.', 'Asumo que es verdadero porque tiene muchas vistas.'],
    correct: 1, feedback: 'La popularidad no verifica un video. Busca su origen y una confirmación independiente.',
  },
  {
    prompt: 'Puedes terminar los ejercicios con IA, pero te cuesta repetirlos por tu cuenta.',
    options: ['Practico sin ayuda, pido una pista si me bloqueo y repito un caso similar.', 'Memorizo las soluciones generadas.', 'Pido a la IA que haga más ejercicios por mí.'],
    correct: 0, feedback: 'Resolver un caso nuevo sin asistencia te ayuda a distinguir lo que entiendes de lo que solo reconoces.',
  },
  {
    prompt: 'Una respuesta de IA hace una generalización sobre estudiantes de una región.',
    options: ['La acepto si está redactada con seguridad.', 'La reescribo para que suene más neutral.', 'Busco evidencia y reviso a quiénes deja fuera la afirmación.'],
    correct: 2, feedback: 'El tono no corrige un sesgo. Revisa la evidencia, los supuestos y la diversidad de casos.',
  },
];

const fallback = {
  answer: 'Puedo ayudarte a usar menos IA, pedir pistas o practicar con autonomía. Prueba con «¿Cómo estudio para un examen sin depender de ChatGPT?» o indica si tu duda es sobre tareas, fuentes, privacidad o desinformación.',
};

const followUpQuestions = ['Dame un ejemplo', '¿Cómo empiezo?'];

export function topicReply(id, detail) {
  const topic = topics[id];
  const answer = detail === 'example' ? topic.example : detail === 'start' ? topic.nextStep : topic.answer;
  const suggestions = topic.example ? followUpQuestions.filter((_, index) =>
    index === 0 ? detail !== 'example' : detail !== 'start'
  ) : [];
  return {answer, source: topic.source, id, suggestions};
}

function normalize(text) {
  return text.toLocaleLowerCase('es').normalize('NFD').replace(/\p{M}/gu, '').replace(/\bc\s*#/g, 'c sharp').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function replyTo(text, previousTopic) {
  const normalized = normalize(text);
  if (/^(hola|buenas|buen dia|buenas tardes|buenas noches)$/.test(normalized)) {
    return {answer: '¡Hola! Dime en qué sueles pedirle ayuda a la IA. Podemos preparar un primer intento propio, una pregunta para pedir una pista o un plan de siete días.'};
  }

  if (previousTopic && topics[previousTopic]?.example) {
    if (/^(y )?(dame |muestrame |ponme |quiero |puedes darme )?(un |otro )?ejemplo( por favor)?$/.test(normalized)) {
      return topicReply(previousTopic, 'example');
    }
    if (/^(y )?(como (empiezo|comienzo|lo aplico|hago eso)|que hago (ahora|primero)|dame (un |otro )?consejo|otro consejo|siguiente paso)( por favor)?$/.test(normalized)) {
      return topicReply(previousTopic, 'start');
    }
  }

  let selected;
  let highestScore = 0;
  for (const [id, topic] of Object.entries(topics)) {
    const score = topic.signals.reduce((total, [weight, pattern]) => total + (pattern.test(normalized) ? weight : 0), 0);
    if (score > highestScore) {
      selected = id;
      highestScore = score;
    }
  }
  return selected ? topicReply(selected) : fallback;
}
