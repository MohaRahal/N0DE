# NØDE

> Everything connects. One NØDE.

NØDE é um command center pessoal para desenvolvedores. A aplicação reúne comandos, exemplos de saída, playbooks e exercícios práticos em um único lugar, com foco em consulta rápida durante o trabalho.

O nome representa a proposta do projeto: conectar diferentes nós — ferramentas, comandos, serviços e fluxos — em uma interface central.

## Funcionalidades

- Biblioteca com comandos de Git, Docker, Linux, SSH, redes, bancos de dados, Node.js, React, Python, PowerShell, Kubernetes e utilitários.
- Busca por título, comando, descrição, categoria ou tag.
- Command Palette acessível com `Ctrl/Cmd + K`.
- Navegação pelos resultados usando `↑`, `↓` e `Enter`.
- Cópia de comandos com confirmação visual.
- Exemplos de saída do terminal em todos os cards.
- Favoritos, histórico recente e contador de uso.
- Filtros por favoritos, mais usados e recentemente utilizados.
- Cadastro, edição e exclusão de comandos personalizados.
- Comandos com múltiplas etapas e opção `Copy all`.
- Playbooks com sequências completas para tarefas recorrentes.
- Exercícios práticos com requisitos, arquivos, resolução e saídas esperadas.
- Persistência da navegação e dos dados no navegador.
- Interface responsiva para desktop, tablet e celular.

## Experiência visual

O NØDE utiliza uma estética inspirada em ferramentas como Raycast, Linear, terminais modernos e interfaces cyberpunk minimalistas.

O fluxo de entrada possui:

1. Tela inicial com uma rede de infraestrutura construída em binário.
2. Lente interativa que acompanha o cursor e revela a imagem com distorção digital.
3. Botão `ENTER NØDE`.
4. Loading screen onde diferentes nós se conectam ao núcleo central NØDE.
5. Transição para a biblioteca de comandos.

Depois da primeira entrada, a aplicação permanece no último local acessado. Para voltar à apresentação, clique no ícone ciano do NØDE na sidebar ou no cabeçalho mobile.

## Foco em Docker

A categoria Docker possui comandos, playbooks e um laboratório completo.

Entre os playbooks disponíveis estão:

- Construir e executar uma aplicação web em container.
- Operar uma stack com Docker Compose.
- Criar uma rede para dois containers.
- Testar comunicação e resolução DNS por nome.
- Conectar PostgreSQL e Adminer em uma rede privada.
- Adicionar containers existentes a uma rede.
- Isolar uma aplicação em redes frontend e backend.
- Diagnosticar problemas de conectividade.
- Fazer backup e restauração de volumes nomeados.

O exercício **Containers, Network & Persistence** contém duas resoluções:

- **Modo fácil:** execução guiada, comando por comando.
- **Modo robusto:** inicialização automática do conteúdo do volume.

O laboratório cobre duas imagens próprias, rede Docker, volume nomeado, páginas Nginx distintas, comunicação por nome, persistência após recriação e captura das saídas com `tee`.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Framer Motion
- Lucide React
- LocalStorage

Não existe backend nesta versão. Para uma biblioteca pessoal usada no mesmo navegador, o armazenamento local é suficiente. Um backend seria necessário para autenticação, sincronização entre dispositivos, colaboração ou backup remoto.

## Como executar

Requisitos:

- Node.js
- npm

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite informará o endereço local, normalmente `http://localhost:5173`.

## Build de produção

```bash
npm run build
```

Para visualizar o build localmente:

```bash
npm run preview
```

Os arquivos finais são gerados em `dist/`.

## Atalhos

| Atalho | Ação |
| --- | --- |
| `Ctrl/Cmd + K` | Abrir a Command Palette |
| `↑` / `↓` | Navegar pelos resultados |
| `Enter` | Copiar o comando selecionado |
| `Esc` | Fechar palette, menu ou modal |

## Persistência local

O NØDE salva no `localStorage`:

- Comandos personalizados
- Favoritos
- Histórico de comandos copiados
- Contadores de uso
- Categoria atual
- Aba atual (`Commands`, `Playbooks` ou `Exercises`)
- Filtro e pesquisa
- Posição de rolagem
- Estado de entrada na aplicação

Os dados pertencem ao navegador e à origem em que a aplicação está sendo executada. Limpar os dados do site também remove os comandos personalizados e o histórico.

## Estrutura do projeto

```text
src/
├── assets/
│   └── binary-command-network.png
├── components/
│   ├── CategoryArt.tsx
│   ├── CommandBlock.tsx
│   ├── CommandCard.tsx
│   ├── CommandModal.tsx
│   ├── CommandPalette.tsx
│   ├── ExerciseSection.tsx
│   ├── IntroScreen.tsx
│   ├── LoadingScreen.tsx
│   ├── Sidebar.tsx
│   └── WorkflowSection.tsx
├── data/
│   ├── commandOutputs.ts
│   ├── commands.ts
│   ├── exercises.ts
│   └── workflows.ts
├── hooks/
│   └── useCommandLibrary.ts
├── types/
│   └── command.ts
├── App.css
├── App.tsx
├── index.css
└── main.tsx
```

## Adicionando conteúdo padrão

### Comandos

Adicione novos comandos em `src/data/commands.ts`:

```ts
{
  id: 'docker-stats',
  title: 'Monitor container resources',
  command: 'docker stats',
  description: 'Displays a live stream of container resource usage.',
  category: 'docker',
  tags: ['docker', 'monitoring', 'resources'],
}
```

O exemplo de saída correspondente pode ser colocado em `src/data/commandOutputs.ts`.

### Playbooks

Os fluxos passo a passo ficam em `src/data/workflows.ts`. Cada playbook possui categoria, nível, resultado esperado e uma lista ordenada de etapas.

### Exercícios

Os laboratórios ficam em `src/data/exercises.ts`. Um exercício pode conter:

- Contexto e objetivo
- Requisitos
- Entregáveis
- Arquivos do projeto
- Resolução para iniciantes
- Resolução robusta
- Comandos e saídas esperadas

## Comandos personalizados

Também é possível cadastrar conteúdo diretamente pela interface:

1. Clique em `Add command`.
2. Informe título, categoria, comando e descrição.
3. Adicione tags e um exemplo de saída.
4. Clique em `Save command`.

Comandos criados pela interface podem ser editados ou excluídos e são armazenados somente no navegador.

## Identidade

**NØDE // Developer Command Center**

Uma biblioteca conectada para encontrar, entender, copiar e usar comandos sem interromper o fluxo de desenvolvimento.
