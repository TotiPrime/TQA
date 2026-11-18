import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const report = 'reports/junit.xml';
mkdirSync('reports', { recursive: true });
rmSync(report, { force: true });

const major = Number(process.versions.node.split('.')[0]);
if (major < 22) {
  console.error('Instala Node.js 22 o superior en el agente de Jenkins.');
  process.exit(1);
}

const testFiles = readdirSync('tests')
  .filter(name => name.endsWith('.test.mjs'))
  .sort()
  .map(name => 'tests/' + name);

if (testFiles.length === 0) {
  console.error('No se encontraron pruebas en tests/.');
  process.exit(1);
}

const run = spawnSync(process.execPath, [
  '--test',
  '--test-reporter=spec',
  '--test-reporter-destination=stdout',
  '--test-reporter=junit',
  '--test-reporter-destination=' + report,
  ...testFiles,
], { stdio: 'inherit' });

if (run.error) console.error(run.error.message);
process.exitCode = run.status ?? 1;
