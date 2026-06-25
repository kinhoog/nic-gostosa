# nic-gostosa

Mini site estatico, mobile-first e animado para perguntar:

> oi a gente pode dar uns beijinhos nic?

## Como abrir localmente

Abra o arquivo `index.html` diretamente no navegador.

O site usa apenas HTML, CSS e JavaScript puro. Os assets locais ficam em `assets/`, com caminhos relativos para funcionar tanto via arquivo local quanto no GitHub Pages.

## GitHub Pages

O deploy esta configurado em `.github/workflows/deploy.yml` usando GitHub Actions.

Para publicar:

1. Acesse `Settings > Pages` no repositorio.
2. Em `Build and deployment`, selecione `GitHub Actions`.
3. Faca push na branch `main` ou rode o workflow `Deploy GitHub Pages` manualmente.

URL esperada:

https://kinhoog.github.io/nic-gostosa/
