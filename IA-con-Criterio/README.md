# IA con Criterio
Aplicación local para materias de Proyecto Integrador de UNIFRANZ. La página principal reúne metas, bitácora y evaluación antes/después. La página de práctica contiene el asistente por reglas, los tres juegos y el cuestionario. Los datos se guardan en IndexedDB, separados por perfil y origen.
## Instalar en Chrome
Descomprime el archivo de extensión, abre chrome://extensions, activa Modo de desarrollador y pulsa Cargar descomprimida. Selecciona la carpeta que contiene manifest.json. En el menú de la extensión elige Abrir mi cuaderno.
## Trabajar con el código
Sirve dist con un servidor estático en localhost o HTTPS. Para desarrollo local ejecuta python -m http.server 8000 --bind 127.0.0.1 --directory dist y abre http://127.0.0.1:8000. Ejecuta node --test tests/*.test.mjs para probar las reglas del asistente, los juegos, los registros y el servicio de concentración simulado. Python 3 y Node.js solo son necesarios para estas tareas de desarrollo.
Después de editar dist o extension, ejecuta python empaquetar.py para generar dist/Extension-IA-con-Criterio.zip. Extrae el ZIP y recarga la extensión desde Chrome.

## Automatización para TQA

Desde la raíz ejecuta `node scripts/run-ci.mjs` con Node.js 22 o superior. El comando muestra los resultados en la consola y genera `reports/junit.xml`. Un fallo devuelve un código de salida distinto de cero.

En Jenkins crea un proyecto de tipo Pipeline y elige **Pipeline script from SCM**. Selecciona Git, indica la URL del repositorio, usa `*/main` como rama y `Jenkinsfile` como ruta del script. Para un repositorio privado selecciona una credencial Git guardada en Jenkins. El agente necesita Git y Node.js en su PATH, además de los complementos Pipeline, Git y JUnit.

La suite comprueba el asistente, los juegos, los registros y la lógica de concentración con una API Chrome simulada. El bloqueo real de navegación y el flujo completo del cuaderno se pueden demostrar aparte en Chrome.
