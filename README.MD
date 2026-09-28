# MAPFIX

CLI para configurar projetos Expo/React Native com suporte ao Google Maps.

## Requisitos

- Node.js
- npm
- Projeto Expo
- Android Studio para executar no Android

## Uso

Dentro de um projeto Expo, execute:

```bash
npx mapfix setup
```

O setup configura automaticamente:

- Java 17
- react-native-maps
- .env
- app.config.js
- Plugin do react-native-maps
- Google Maps
- Expo Prebuild

Configure a chave no arquivo .env:

EXPO_PUBLIC_KEY_GOOGLE_MAPS=SUA_CHAVE


# Como pegar a chave ?

ENTRE EM: https://console.cloud.google.com/
- CRIE UM NOVO PROJETO
- SELECIONE O PROJETO
- VÁ EM APIs e serviços -> Biblioteca -> Maps SDK for Android -> Ativar 
- CASO APAREÇA PARA COMPRAR, SÓ VOLTAR A PÁGINA
- VÁ EM APIs e serviços -> Credenciais -> Criar Credenciais -> Chave de API -> Selecionar Restrições de API -> Maps SDK for Android -> Criar
- Copie a chave da api
- Cole no .env   

A chave será utilizada na configuração do Google Maps para Android.

## Android

Depois de executar o setup:

```bash
npx mapfix android
```
Esse comando executa o projeto Android utilizando o Java 17 configurado pelo mapfix.

## Prebuild

Para executar somente o Expo Prebuild:

```bash
npx mapfix prebuild
```
Para executar o Prebuild com limpeza:


```bash
npx mapfix prebuild --clean
```

# Comandos

- mapfix setup	Configura o projeto Expo
- mapfix prebuild	Executa o Expo Prebuild
- mapfix prebuild --clean	Executa o Expo Prebuild limpando os arquivos nativos
- mapfix android	Executa o projeto Android com o Java 17 no cache

Caso o Java 17 não esteja instalado, o mapfix realiza o download e mantém uma cópia no cache da máquina.

O Java utilizado pelo projeto não altera a instalação global do Java do sistema.

# Projeto

O mapfix foi criado para facilitar a configuração e corrigir o bug de projetos Expo/React Native que utilizam Google Maps no Android.