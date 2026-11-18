# IA con Criterio en Jenkins y GitHub

Este avance de TQA corresponde a las pruebas automatizadas de IA con Criterio. La carpeta IA-con-Criterio contiene la aplicación y el Jenkinsfile. La carpeta Evidencia contiene la salida local y el XML que produjo esa ejecución.

## Publicar en GitHub

1. En GitHub crea un repositorio vacío llamado IA-con-Criterio desde tu cuenta. Si lo dejas privado, concede acceso de lectura a la docente por GitHub según lo que pida la materia. Omite la creación de README para que el primer push parta de un repositorio vacío.
2. Extrae el ZIP. Abre PowerShell **dentro de IA-con-Criterio**, donde están Jenkinsfile y README.md.
3. Ejecuta estos comandos. Si tu cuenta es distinta de TotiPrime, cambia el usuario en la URL. Git puede abrir una ventana para iniciar sesión.

    git init -b main
    git add .
    git commit -m "Agregar IA con Criterio y pipeline de pruebas TQA"
    git remote add origin https://github.com/TotiPrime/IA-con-Criterio.git
    git push -u origin main

4. Abre GitHub y comprueba que en la rama main aparecen Jenkinsfile, dist, extension, scripts y tests.

## Ejecutar desde Jenkins

1. Confirma que Git y Node.js 22 o superior estén en el PATH del agente. En Windows, si Jenkins funciona como servicio y acabas de instalar Node.js, reinicia el servicio para que tome el PATH actualizado. El proyecto usa el ejecutor que ya incluye Node.js.
2. En Jenkins, crea **New Item**, escribe IA-con-Criterio-TQA y elige **Pipeline**.
3. En **Pipeline**, configura **Definition → Pipeline script from SCM**. En **SCM** pon **Git**, pega la URL real del repositorio y usa ***/main** como rama. En **Script Path** escribe **Jenkinsfile**. Si el repositorio es privado, selecciona una credencial de lectura configurada en Jenkins.
4. Guarda y pulsa **Build Now**. Revisa las etapas **Descargar código**, **Verificar Node.js** y **Ejecutar pruebas**. Abre el build y entra en **Console Output**, **Test Result** y el artefacto **reports/junit.xml**.
5. Si aparece un error de paso desconocido para checkout o junit, revisa los complementos Pipeline, Git y JUnit. Si no encuentra node, revisa el PATH de la cuenta que ejecuta el agente. Si no encuentra Jenkinsfile, comprueba que esté en la raíz de la rama configurada.

Guías oficiales de Jenkins

- https://www.jenkins.io/doc/book/pipeline/getting-started/
- https://www.jenkins.io/doc/pipeline/tour/tests-and-artifacts/

## Qué mostrar a la docente

1. Abre GitHub y señala el commit, el Jenkinsfile y la carpeta tests.
2. Pulsa **Build Now** y muestra el resultado asociado a ese commit. Captura las tres etapas y el resumen de pruebas.
3. Explica un caso de la suite. Por ejemplo, una partida admite una sola pista después de un intento, aunque el estudiante avance de ronda. También puedes mostrar cómo se comparan las dos mediciones del piloto y cómo se rechaza una copia con datos inválidos.
4. Si preguntan por la pausa de IA, explica que la prueba automatizada simula la API de Chrome para verificar el inicio, la cancelación y el vencimiento. La prueba de bloqueo real se hace instalando la extensión y verificando en Chrome que el acceso se recupera al terminar el minuto.

La evidencia incluida corresponde a **9 pruebas aprobadas y 0 fallos en una ejecución local**. Las capturas de Jenkins se obtienen después de configurar y ejecutar el job.
