# Notas para Claude

## Ramas a ignorar

Existen estas ramas huérfanas en GitHub, restos de sesiones de trabajo
anteriores que el dueño del repo descartó. **No las uses, no las fusiones,
no copies código de ellas, y no propongas restaurar nada de su contenido.**

- `claude/app-store-launch-checklist-GZhO4`
- `claude/blissful-hawking-67bBY`
- `claude/fitness-app-features-RJYpb`
- `claude/fitness-app-features-ozG8t`
- `claude/magical-shannon-CPvEV`

Estas ramas no se pueden eliminar desde el entorno de Claude (el proxy
de Git rechaza `push --delete`). El dueño las borrará desde la UI de
GitHub cuando pueda:
<https://github.com/alexanderatlasluthor/atlasluthorworkout/branches>

Para que no aparezcan localmente en este entorno, el refspec de fetch
está limitado a `main`:

```
[remote "origin"]
  fetch = +refs/heads/main:refs/remotes/origin/main
```

Si por alguna razón vuelven a aparecer en `git branch -a`, vuelve a
correr `git fetch origin --prune` después de confirmar que el refspec
sigue limitado.

## Trabajo nuevo

`main` es la única fuente de verdad. Cualquier rama de trabajo debe
crearse fresca a partir de `main`, no a partir de las ramas listadas
arriba.
