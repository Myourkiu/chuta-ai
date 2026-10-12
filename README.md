# Chuta Aí

Wordle em português com **chutes ilimitados**, feito em React Native (Expo) e 100% offline.

- **Do dia:** todo mundo recebe a mesma palavra na mesma data. Ganha quem acertar com menos chutes.
- **Livre:** uma palavra nova sempre que quiser.
- Acentos e cedilha entram sozinhos (digite `PAO`, aparece `PÃO`).
- Resultado compartilhável com os quadradinhos 🟩🟨⬛.
- Estatísticas, sequência de dias, tema claro e escuro.

## Rodando em desenvolvimento

```bash
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go.

## Gerando o APK (Android)

Requer JDK 17 e Android SDK instalados (`JAVA_HOME` e `ANDROID_HOME` configurados).

```bash
npm run apk
```

O arquivo sai em `android/app/build/outputs/apk/release/app-release.apk`. É só mandar para os amigos e instalar (é preciso permitir a instalação de fontes desconhecidas).

O APK é assinado com a chave de debug da máquina. Para que atualizações instalem por cima da versão anterior, gere sempre no mesmo computador.

## iOS

O código é o mesmo, mas instalar em iPhone fora da App Store exige uma conta de desenvolvedor Apple (TestFlight) e um Mac ou build na nuvem.

## Estrutura

| Arquivo | O que faz |
| --- | --- |
| `src/words.ts` | Listas de palavras e normalização de acentos |
| `src/game.ts` | Pontuação dos chutes, palavra do dia, estatísticas e texto de compartilhamento |
| `src/components/` | Tabuleiro, peças animadas, teclado e janelas |
| `App.tsx` | Tela principal e estado do jogo |
