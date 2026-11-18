"""Genera la extensión instalable, con su propia copia offline del cuaderno."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parent
site = root / 'dist'
with ZipFile(site / 'Extension-IA-con-Criterio.zip', 'w', ZIP_DEFLATED) as archive:
    for path in sorted((root / 'extension').iterdir()):
        if path.is_file():
            archive.write(path, path.name)
    for path in sorted(site.iterdir()):
        if path.is_file() and path.suffix != '.zip':
            archive.write(path, 'app/' + path.name)
