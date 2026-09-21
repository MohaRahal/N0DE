export type ExerciseFile = { name: string; language: string; content: string }
export type ExerciseStep = { title: string; description: string; command: string; output?: string }
export type Exercise = {
  id: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  title: string
  subtitle: string
  context: string
  objective: string
  requirements: string[]
  deliverables: string[]
  beginnerFiles?: ExerciseFile[]
  beginnerSolution?: ExerciseStep[]
  files: ExerciseFile[]
  solution: ExerciseStep[]
}

export const exercises: Exercise[] = [{
  id: 'docker-network-volume-lab',
  category: 'docker',
  difficulty: 'intermediate',
  title: 'Containers, Network & Persistence',
  subtitle: 'Build two custom services that communicate and preserve data.',
  context: 'This practical activity brings together containerization, custom Docker images, isolated networks, named volumes, service discovery, and terminal evidence collection.',
  objective: 'Build two containers from your own Dockerfiles. They must serve different web content, communicate by container name over a network you created, and preserve data in a named volume after recreation.',
  requirements: [
    'Create a user-defined Docker network with docker network create.',
    'Create one named volume with docker volume create.',
    'Build at least two custom images, each from its own Dockerfile.',
    'Connect both containers to the same network and give each a fixed name.',
    'Serve distinct, identifiable web content from each container.',
    'Mount the named volume in at least one container.',
    'Access one container from the other by its container name.',
    'Remove and recreate the volume-backed container without losing persisted data.',
    'Record terminal output in a text file with tee.',
  ],
  deliverables: [
    'Two Dockerfiles and their web content files.',
    'The terminal-evidence.txt file containing commands and outputs.',
    'Proof of name resolution between web-a and web-b.',
    'Proof that the two HTTP responses are different.',
    'Proof that persistencia.txt survives container recreation.',
  ],
  beginnerFiles: [
    { name: 'container1/Dockerfile', language: 'dockerfile', content: `FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html` },
    { name: 'container1/index.html', language: 'html', content: `<!DOCTYPE html>
<html>
<head>
    <title>Container 1</title>
</head>
<body>
    <h1>Olá, sou o Container 1</h1>
</body>
</html>` },
    { name: 'container2/Dockerfile', language: 'dockerfile', content: `FROM nginx:alpine

COPY index.html /usr/share/nginx/html/index.html` },
    { name: 'container2/index.html', language: 'html', content: `<!DOCTYPE html>
<html>
<head>
    <title>Container 2</title>
</head>
<body>
    <h1>Olá, sou o Container 2</h1>
</body>
</html>` },
  ],
  beginnerSolution: [
    { title: 'Confira se o Docker está funcionando', description: 'Abra um terminal na pasta onde você quer criar a atividade. Se este comando mostrar a versão, pode continuar.', command: 'docker --version', output: 'Docker version 27.x.x, build ...' },
    { title: 'Crie as pastas do projeto', description: 'Crie a pasta atividade e duas subpastas. Depois, crie os quatro arquivos mostrados na seção Arquivos.', command: `mkdir -p atividade/container1 atividade/container2
cd atividade`, output: 'Você deve estar dentro da pasta atividade.' },
    { title: 'Comece a gravar o terminal', description: 'Use Bash, Git Bash ou WSL. A partir daqui, comandos e respostas também serão salvos em terminal-evidence.txt.', command: `script -a terminal-evidence.txt
echo "Início da atividade: $(date)"`, output: 'Início da atividade: ...' },
    { title: 'Crie a rede', description: 'Essa rede permitirá que os containers encontrem um ao outro pelo nome.', command: 'docker network create rede-atividade', output: 'Uma sequência grande de letras e números representa o ID da rede.' },
    { title: 'Crie o volume', description: 'O volume continuará existindo mesmo que o Container 1 seja removido.', command: 'docker volume create volume-site', output: 'volume-site' },
    { title: 'Construa as duas imagens', description: 'Execute dentro da pasta atividade, depois de salvar os Dockerfiles e arquivos HTML.', command: `docker build -t imagem-container1 ./container1
docker build -t imagem-container2 ./container2
docker images`, output: 'A lista deve mostrar imagem-container1 e imagem-container2.' },
    { title: 'Execute o Container 1', description: 'Ele usa a rede, publica a porta 8081 e monta o volume nomeado.', command: `docker run -d \\
  --name container1 \\
  --network rede-atividade \\
  -p 8081:80 \\
  -v volume-site:/usr/share/nginx/html \\
  imagem-container1`, output: 'Docker retorna o ID longo do novo container.' },
    { title: 'Copie a página para o volume', description: 'Um volume vazio esconde o index.html da imagem. Por isso copiamos o HTML do computador para dentro do volume montado.', command: 'docker cp ./container1/index.html container1:/usr/share/nginx/html/index.html', output: 'Successfully copied ... to container1:/usr/share/nginx/html/index.html' },
    { title: 'Execute o Container 2', description: 'Ele usa a mesma rede, mas outra porta e outro conteúdo.', command: `docker run -d \\
  --name container2 \\
  --network rede-atividade \\
  -p 8082:80 \\
  imagem-container2`, output: 'Docker retorna o ID longo do segundo container.' },
    { title: 'Confira os dois sites', description: 'Abra os endereços no navegador ou use curl. As respostas precisam ser diferentes.', command: `curl -s http://localhost:8081
curl -s http://localhost:8082`, output: '<h1>Olá, sou o Container 1</h1>\n<h1>Olá, sou o Container 2</h1>' },
    { title: 'Teste Container 1 → Container 2', description: 'wget roda dentro do Container 1 e acessa o outro serviço usando somente o nome container2.', command: 'docker exec container1 wget -qO- http://container2', output: '<h1>Olá, sou o Container 2</h1>' },
    { title: 'Teste Container 2 → Container 1', description: 'Agora faça o caminho contrário. Isso prova a comunicação nos dois sentidos.', command: 'docker exec container2 wget -qO- http://container1', output: '<h1>Olá, sou o Container 1</h1>' },
    { title: 'Confira a rede', description: 'Na saída, procure container1 e container2 dentro da seção Containers.', command: 'docker network inspect rede-atividade', output: 'Os dois containers devem aparecer conectados à rede.' },
    { title: 'Crie um arquivo persistente', description: 'Este arquivo será escrito dentro do volume do Container 1.', command: `docker exec container1 sh -c 'echo "Arquivo persistente" > /usr/share/nginx/html/teste.txt'
docker exec container1 cat /usr/share/nginx/html/teste.txt`, output: 'Arquivo persistente' },
    { title: 'Remova somente o Container 1', description: 'O container será apagado, mas o volume-site não será removido.', command: 'docker rm -f container1', output: 'container1' },
    { title: 'Recrie usando o mesmo volume', description: 'Use exatamente o mesmo nome de volume. Não é necessário copiar o HTML novamente, pois ele já está persistido.', command: `docker run -d \\
  --name container1 \\
  --network rede-atividade \\
  -p 8081:80 \\
  -v volume-site:/usr/share/nginx/html \\
  imagem-container1` },
    { title: 'Comprove a persistência', description: 'Se o texto aparecer depois da recriação, o volume funcionou corretamente.', command: `docker exec container1 cat /usr/share/nginx/html/teste.txt
curl -s http://localhost:8081/teste.txt`, output: 'Arquivo persistente\nArquivo persistente' },
    { title: 'Registre o resultado final', description: 'Mostre os containers, o volume e finalize o arquivo de evidências.', command: `docker ps
docker volume inspect volume-site
echo "Atividade concluída: $(date)"

CNTRL + D`, output: 'O arquivo terminal-evidence.txt ficará dentro da pasta atividade.' },
  ],
  files: [
    { name: 'service-a/Dockerfile', language: 'dockerfile', content: `FROM nginx:alpine

RUN apk add --no-cache curl
COPY index.html /opt/initial-content/index.html
COPY 10-seed-volume.sh /docker-entrypoint.d/10-seed-volume.sh
RUN chmod +x /docker-entrypoint.d/10-seed-volume.sh

EXPOSE 80` },
    { name: 'service-a/10-seed-volume.sh', language: 'shell', content: `#!/bin/sh
set -e

# A named volume starts empty. Seed it only on its first run.
if [ ! -f /usr/share/nginx/html/index.html ]; then
  cp /opt/initial-content/index.html /usr/share/nginx/html/index.html
fi` },
    { name: 'service-a/index.html', language: 'html', content: `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Service A</title></head>
  <body style="font-family: sans-serif; background: #071713; color: #00f5d4">
    <h1>Service A — persistent content</h1>
    <p>This page is served from a named Docker volume.</p>
  </body>
</html>` },
    { name: 'service-b/Dockerfile', language: 'dockerfile', content: `FROM nginx:alpine

RUN apk add --no-cache curl
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80` },
    { name: 'service-b/index.html', language: 'html', content: `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Service B</title></head>
  <body style="font-family: sans-serif; background: #101426; color: #8b5cf6">
    <h1>Service B — independent content</h1>
    <p>This response is different from Service A.</p>
  </body>
</html>` },
  ],
  solution: [
    { title: 'Create the project structure', description: 'Create one build context for each custom image.', command: `mkdir -p docker-lab/service-a docker-lab/service-b
cd docker-lab` },
    { title: 'Start evidence collection', description: 'In Bash, this duplicates every following stdout and stderr line to the screen and the evidence file.', command: `exec > >(tee -a terminal-evidence.txt) 2>&1
echo "=== Docker lab started at $(date) ==="`, output: '=== Docker lab started at ... ===' },
    { title: 'Build both custom images', description: 'Run this after creating the files shown in the Files section.', command: `docker build -t lab/service-a:1.0 ./service-a
docker build -t lab/service-b:1.0 ./service-b`, output: '[+] Building ... FINISHED\n=> naming to docker.io/lab/service-a:1.0\n=> naming to docker.io/lab/service-b:1.0' },
    { title: 'Create network and volume', description: 'These resources are managed independently from the containers.', command: `docker network create lab-network
docker volume create lab-content`, output: 'lab-network\nlab-content' },
    { title: 'Run both services', description: 'Service A mounts the named volume; both join the same user-defined network.', command: `docker run -d --name web-a --network lab-network -p 8081:80 -v lab-content:/usr/share/nginx/html lab/service-a:1.0
docker run -d --name web-b --network lab-network -p 8082:80 lab/service-b:1.0` },
    { title: 'Validate distinct web content', description: 'Both endpoints must respond, but their page headings must be different.', command: `curl -s http://localhost:8081 | grep '<h1>'
curl -s http://localhost:8082 | grep '<h1>'`, output: '<h1>Service A — persistent content</h1>\n<h1>Service B — independent content</h1>' },
    { title: 'Validate container-to-container DNS', description: 'Docker resolves web-b to its container IP because both containers share lab-network.', command: `docker exec web-a curl -s http://web-b | grep '<h1>'`, output: '<h1>Service B — independent content</h1>' },
    { title: 'Write persistent data', description: 'Create a new file inside the mounted volume and read it through Nginx.', command: `docker exec web-a sh -c 'echo "Data survived the container" > /usr/share/nginx/html/persistencia.txt'
curl -s http://localhost:8081/persistencia.txt`, output: 'Data survived the container' },
    { title: 'Remove and recreate Service A', description: 'The container is disposable; the named volume remains.', command: `docker rm -f web-a
docker run -d --name web-a --network lab-network -p 8081:80 -v lab-content:/usr/share/nginx/html lab/service-a:1.0` },
    { title: 'Prove persistence', description: 'The file created before removal must still be served by the new container.', command: `curl -s http://localhost:8081/persistencia.txt
docker volume inspect lab-content
docker network inspect lab-network`, output: 'Data survived the container' },
    { title: 'Finish the evidence log', description: 'Record the final state. Exit the shell when finished to close tee cleanly.', command: `docker ps --filter network=lab-network
echo "=== Lab completed at $(date) ==="
exit` },
  ],
}]

export const exercisesFor = (category: string) => exercises.filter((exercise) => exercise.category === category)
