# Spotify Now Playing Widget 🎵

Widget self-hosted para mostrar a música que você está ouvindo no Spotify, direto no seu GitHub README.

## Setup

### 1. Criar App no Spotify

1. Acesse [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Clique em **Create App**
3. Preencha o nome e descrição
4. Em **Redirect URIs**, adicione: `http://localhost:3000/callback`
5. Anote o **Client ID** e **Client Secret**

### 2. Obter o Refresh Token

No terminal, substitua os valores e abra a URL no navegador:

```
https://accounts.spotify.com/authorize?client_id=SEU_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing user-read-playback-state
```

Após autorizar, você será redirecionado para uma URL como:
```
http://localhost:3000/callback?code=AQUI_O_CODE
```

Copie o `code` e execute (substitua os valores):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=SEU_CODE&redirect_uri=http://localhost:3000/callback" \
  -u "SEU_CLIENT_ID:SEU_CLIENT_SECRET"
```

Da resposta, copie o `refresh_token`.

### 3. Configurar e Subir

```bash
cp .env.example .env
# Edite o .env com seus valores

docker compose up -d
```

### 4. Testar

Acesse `http://seu-servidor:3005/api/spotify` — deve retornar um SVG com a música atual ou "Not playing".

### 5. Usar no README

```md
[![Spotify](https://seu-servidor.com/api/spotify)](https://open.spotify.com/user/22v4ehvqkto5wrftjyldjqeli)
```
