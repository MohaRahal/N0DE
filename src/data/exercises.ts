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
    <h1>Hello, I am Container 1</h1>
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
    <h1>Hello, I am Container 2</h1>
</body>
</html>` },
  ],
  beginnerSolution: [
    { title: 'Confirm Docker is running', description: 'Open a terminal in the folder where you want to create the lab. Continue if this command prints a version.', command: 'docker --version', output: 'Docker version 27.x.x, build ...' },
    { title: 'Create the project folders', description: 'Create the docker-lab folder and two subfolders. Then create the four files shown in the Files section.', command: `mkdir -p docker-lab/container1 docker-lab/container2
cd docker-lab`, output: 'You should now be inside the docker-lab folder.' },
    { title: 'Start recording the terminal', description: 'Use Bash, Git Bash, or WSL. Commands and responses will also be stored in terminal-evidence.txt.', command: `script -a terminal-evidence.txt
echo "Lab started: $(date)"`, output: 'Lab started: ...' },
    { title: 'Create the network', description: 'This network lets the containers find each other by name.', command: 'docker network create activity-network', output: 'Docker returns the network ID.' },
    { title: 'Create the volume', description: 'The volume continues to exist even if Container 1 is removed.', command: 'docker volume create site-volume', output: 'site-volume' },
    { title: 'Build both images', description: 'Run this inside docker-lab after saving the Dockerfiles and HTML files.', command: `docker build -t container1-image ./container1
docker build -t container2-image ./container2
docker images`, output: 'The list should include container1-image and container2-image.' },
    { title: 'Run Container 1', description: 'It joins the network, publishes port 8081, and mounts the named volume.', command: `docker run -d \\
  --name container1 \\
  --network activity-network \\
  -p 8081:80 \\
  -v site-volume:/usr/share/nginx/html \\
  container1-image`, output: 'Docker returns the new container ID.' },
    { title: 'Copy the page into the volume', description: 'An empty volume hides the image index.html, so copy the host file into the mounted volume.', command: 'docker cp ./container1/index.html container1:/usr/share/nginx/html/index.html', output: 'Successfully copied ... to container1:/usr/share/nginx/html/index.html' },
    { title: 'Run Container 2', description: 'It uses the same network with a different port and different content.', command: `docker run -d \\
  --name container2 \\
  --network activity-network \\
  -p 8082:80 \\
  container2-image`, output: 'Docker returns the second container ID.' },
    { title: 'Check both websites', description: 'Open the addresses in a browser or use curl. The responses must be different.', command: `curl -s http://localhost:8081
curl -s http://localhost:8082`, output: '<h1>Hello, I am Container 1</h1>\n<h1>Hello, I am Container 2</h1>' },
    { title: 'Test Container 1 → Container 2', description: 'wget runs inside Container 1 and accesses the other service using only the container2 name.', command: 'docker exec container1 wget -qO- http://container2', output: '<h1>Hello, I am Container 2</h1>' },
    { title: 'Test Container 2 → Container 1', description: 'Now test the opposite direction to prove bidirectional communication.', command: 'docker exec container2 wget -qO- http://container1', output: '<h1>Hello, I am Container 1</h1>' },
    { title: 'Inspect the network', description: 'Look for container1 and container2 in the Containers section.', command: 'docker network inspect activity-network', output: 'Both containers should appear connected to the network.' },
    { title: 'Create persistent data', description: 'This file is written inside the volume mounted by Container 1.', command: `docker exec container1 sh -c 'echo "Persistent file" > /usr/share/nginx/html/test.txt'
docker exec container1 cat /usr/share/nginx/html/test.txt`, output: 'Persistent file' },
    { title: 'Remove only Container 1', description: 'The container is deleted, but site-volume remains.', command: 'docker rm -f container1', output: 'container1' },
    { title: 'Recreate it with the same volume', description: 'Use the exact same volume name. The HTML does not need to be copied again because it is already persisted.', command: `docker run -d \\
  --name container1 \\
  --network activity-network \\
  -p 8081:80 \\
  -v site-volume:/usr/share/nginx/html \\
  container1-image` },
    { title: 'Prove persistence', description: 'If the text appears after recreation, the named volume worked correctly.', command: `docker exec container1 cat /usr/share/nginx/html/test.txt
curl -s http://localhost:8081/test.txt`, output: 'Persistent file\nPersistent file' },
    { title: 'Record the final result', description: 'Show the containers and volume, then finish the evidence recording.', command: `docker ps
docker volume inspect site-volume
echo "Lab completed: $(date)"

CTRL + D`, output: 'terminal-evidence.txt remains inside the docker-lab folder.' },
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
}, {
  id: 'docker-segmented-networks',
  category: 'docker',
  difficulty: 'intermediate',
  title: 'Isolation with separate Docker networks',
  subtitle: 'Connect a frontend, fake API, and simulated backend service using isolated networks.',
  context: 'This lab focuses only on Docker network isolation. The database is simulated by a lightweight Alpine HTTP container, so no real database configuration, credentials, or SQL tools are required.',
  objective: 'Create frontend-net and backend-net, connect each container only to the networks it needs, and use positive and negative tests to prove that the simulated database service is isolated from the frontend.',
  requirements: [
    'Create the frontend-net and backend-net networks.',
    'Run the front container only on frontend-net.',
    'Run a lightweight simulated database service only on backend-net.',
    'Run the api container initially on frontend-net.',
    'Connect the api container to backend-net afterward.',
    'Prove that front resolves and reaches api by name.',
    'Prove that api resolves and reaches database by name.',
    'Prove that front cannot resolve or reach database directly.',
    'Explain why the simulated backend service does not need a port published to the host.',
  ],
  deliverables: [
    'docker network inspect output for both networks.',
    'An API HTTP response obtained from front.',
    'A positive HTTP connectivity test between api and the simulated database service.',
    'A negative connectivity test between front and database.',
    'Evidence that the simulated database service has no port published to the host.',
    'A written explanation of segmentation and reduced attack surface.',
  ],
  files: [{
    name: 'architecture.txt', language: 'text', content: `HOST
  |
  | published port: 8080
  v
[ front ] -------- frontend-net -------- [ api ]
                                           |
                                           | also connected
                                           v
                                      backend-net
                                           |
                                           v
                                  [ fake database ]

EXPECTED RULES
front  -> api      : ALLOWED
api    -> database : ALLOWED
front  -> database : BLOCKED
host   -> database : NO PUBLISHED PORT`
  }],
  solution: [
    { title: 'Remove names left by an earlier attempt', description: 'Run this only if containers from a previous attempt may still use these names.', command: `docker rm -f front api database 2>/dev/null || true`, output: 'If the containers do not exist, the command simply continues.' },
    { title: 'Create both networks', description: 'Each network represents a different application zone.', command: `docker network create frontend-net
docker network create backend-net`, output: 'Docker returns the frontend-net ID followed by the backend-net ID.' },
    { title: 'Run the frontend only on the frontend network', description: 'Only the frontend port is published for browser access.', command: `docker run -d \\
  --name front \\
  --network frontend-net \\
  -p 8080:80 \\
  nginx:alpine`, output: 'Docker returns the front container ID.' },
    { title: 'Install test tools in the frontend', description: 'bind-tools provides nslookup and busybox-extras provides nc for DNS and port tests.', command: `docker exec front apk add --no-cache bind-tools busybox-extras`, output: 'OK: packages installed' },
    { title: 'Run a fake database service on the backend network', description: 'This is only an Alpine HTTP server used to test isolation. It is not a real database and publishes no host port.', command: `docker run -d \\
  --name database \\
  --network backend-net \\
  alpine:3.20 \\
  sh -c "mkdir -p /www && echo 'FAKE DATABASE SERVICE' > /www/index.html && httpd -f -p 9090 -h /www"`, output: 'Docker returns the fake database container ID.' },
    { title: 'Run the fake API on the frontend network first', description: 'This lightweight Alpine container serves a simple HTTP response on port 8080.', command: `docker run -d \\
  --name api \\
  --network frontend-net \\
  alpine:3.20 \\
  sh -c "mkdir -p /www && echo 'FAKE API ONLINE' > /www/index.html && httpd -f -p 8080 -h /www"`, output: 'Docker returns the fake api container ID.' },
    { title: 'Connect the API to the backend network', description: 'The API now joins both networks and becomes the only logical bridge between the frontend and database.', command: `docker network connect backend-net api`, output: 'No output means the connection succeeded.' },
    { title: 'Confirm the segmentation', description: 'frontend-net should list front and api. backend-net should list api and database.', command: `docker network inspect frontend-net --format '{{range .Containers}}{{.Name}} {{end}}'
docker network inspect backend-net --format '{{range .Containers}}{{.Name}} {{end}}'`, output: 'front api\napi database' },
    { title: 'Test DNS from the frontend to the API', description: 'Because both share frontend-net, the api name should resolve.', command: `docker exec front nslookup api`, output: 'Name: api\nAddress: 172.x.x.x' },
    { title: 'Test HTTP from the frontend to the API', description: 'This is the permitted path between the frontend and application tiers.', command: `docker exec front wget -qO- http://api:8080`, output: 'FAKE API ONLINE' },
    { title: 'Test DNS from the API to the fake database', description: 'Because both share backend-net, the API should resolve the database container name.', command: `docker exec api nslookup database`, output: 'Name: database\nAddress: 172.x.x.x' },
    { title: 'Test API access to the fake database', description: 'This HTTP request proves both name resolution and connectivity through backend-net.', command: `docker exec api wget -qO- http://database:9090`, output: 'FAKE DATABASE SERVICE' },
    { title: 'Prove the frontend cannot resolve the database', description: 'The correct result is OK. database is not on frontend-net, so its name must not exist there.', command: `docker exec front sh -c 'nslookup database >/dev/null 2>&1 && echo "ERROR: database is visible" || echo "OK: database is not resolved by front"'`, output: 'OK: database is not resolved by front' },
    { title: 'Prove the frontend cannot reach the service port', description: 'This second negative test confirms that the frontend cannot open a connection to the isolated service.', command: `docker exec front sh -c 'nc -zvw2 database 9090 >/dev/null 2>&1 && echo "ERROR: connection allowed" || echo "OK: front -> database blocked"'`, output: 'OK: front -> database blocked' },
    { title: 'Prove there is no published port', description: 'The fake database listens only inside backend-net and has no HostPort mapping.', command: `docker port database
docker inspect database --format '{{json .NetworkSettings.Ports}}'`, output: 'docker port prints no mapping\n{}' },
    { title: 'Record the conclusion', description: 'The simulated database needs no -p because the API reaches database:9090 internally through backend-net. Not publishing it reduces exposure and attack surface.', command: `echo "front -> api: allowed"
echo "api -> database: allowed"
echo "front -> database: blocked"
echo "database has no published port: backend-net access only"`, output: 'The architecture follows the principle of least exposure.' },
  ],
}]

export const exercisesFor = (category: string) => exercises.filter((exercise) => exercise.category === category)
