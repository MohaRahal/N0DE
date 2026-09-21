export type WorkflowStep = {
  title: string
  command: string
  description: string
}

export type Workflow = {
  id: string
  category: string
  level: 'basic' | 'advanced'
  title: string
  description: string
  result: string
  steps: WorkflowStep[]
}

export const workflows: Workflow[] = [
  {
    id: 'git-publish-folder', category: 'git', level: 'basic', title: 'Publish a local folder to GitHub',
    description: 'Turn an existing project folder into a repository and publish its first version.', result: 'Your local main branch will be connected and pushed to GitHub.',
    steps: [
      { title: 'Initialize Git', command: 'git init', description: 'Creates the local .git repository.' },
      { title: 'Stage the project', command: 'git add .', description: 'Adds the current files to the first snapshot.' },
      { title: 'Create the first commit', command: 'git commit -m "Initial commit"', description: 'Records the initial version locally.' },
      { title: 'Rename the main branch', command: 'git branch -M main', description: 'Uses the current standard main branch name.' },
      { title: 'Connect GitHub', command: 'git remote add origin https://github.com/<user>/<repository>.git', description: 'Links the local folder to the empty GitHub repository.' },
      { title: 'Publish', command: 'git push -u origin main', description: 'Uploads the project and tracks the remote branch.' },
    ],
  },
  {
    id: 'git-feature-flow', category: 'git', level: 'advanced', title: 'Feature branch workflow',
    description: 'Create a focused branch, commit the work, and prepare it for a pull request.', result: 'A remote feature branch ready to open as a pull request.',
    steps: [
      { title: 'Update main', command: 'git switch main && git pull origin main', description: 'Starts from the latest shared version.' },
      { title: 'Create a feature branch', command: 'git switch -c feat/<feature-name>', description: 'Keeps the new work isolated.' },
      { title: 'Stage and commit', command: 'git add . && git commit -m "feat: describe the change"', description: 'Creates a conventional feature commit.' },
      { title: 'Publish the branch', command: 'git push -u origin feat/<feature-name>', description: 'Makes the branch available for a pull request.' },
      { title: 'Open a pull request', command: 'gh pr create --fill', description: 'Creates a PR using the GitHub CLI.' },
    ],
  },
  {
    id: 'docker-run-web', category: 'docker', level: 'basic', title: 'Containerize and run a web app',
    description: 'Build an image, run it locally, inspect it, and follow its logs.', result: 'A named web container available on localhost:3000.',
    steps: [
      { title: 'Build the image', command: 'docker build -t my-web-app .', description: 'Builds the Dockerfile in the current folder.' },
      { title: 'Run the container', command: 'docker run -d --name my-web-app -p 3000:3000 my-web-app', description: 'Runs the app in the background and publishes its port.' },
      { title: 'Confirm it is running', command: 'docker ps --filter name=my-web-app', description: 'Shows the container status and mapped port.' },
      { title: 'Follow the logs', command: 'docker logs -f my-web-app', description: 'Streams application output for troubleshooting.' },
    ],
  },
  {
    id: 'docker-compose-stack', category: 'docker', level: 'advanced', title: 'Operate a Compose stack',
    description: 'Validate, build, start, inspect, and safely stop a multi-service project.', result: 'The complete stack running in detached mode.',
    steps: [
      { title: 'Validate configuration', command: 'docker compose config', description: 'Checks the merged Compose configuration.' },
      { title: 'Build services', command: 'docker compose build', description: 'Builds every service that has a build context.' },
      { title: 'Start the stack', command: 'docker compose up -d', description: 'Starts all services in the background.' },
      { title: 'Check services', command: 'docker compose ps', description: 'Displays health, state, and exposed ports.' },
      { title: 'Follow all logs', command: 'docker compose logs -f', description: 'Streams combined service logs.' },
      { title: 'Stop when finished', command: 'docker compose down', description: 'Stops the stack while preserving named volumes.' },
    ],
  },
  {
    id: 'docker-network-two-services', category: 'docker', level: 'basic', title: 'Create a network for two containers',
    description: 'Create a user-defined bridge network, start two web services, and prove that Docker DNS resolves container names.', result: 'Two isolated services communicating through app-network by name.',
    steps: [
      { title: 'Create the network', command: 'docker network create app-network', description: 'Creates a user-defined bridge with automatic DNS between members.' },
      { title: 'Start the first service', command: 'docker run -d --name web-api --network app-network nginx:alpine', description: 'Connects the API placeholder directly to the new network.' },
      { title: 'Start the second service', command: 'docker run -d --name web-client --network app-network -p 8080:80 nginx:alpine', description: 'Connects the client and publishes only its port to the host.' },
      { title: 'Resolve by container name', command: 'docker exec web-client getent hosts web-api', description: 'Asks Docker DNS for the IP associated with web-api.' },
      { title: 'Test the HTTP connection', command: 'docker exec web-client wget -qO- http://web-api', description: 'Calls the first service from inside the second container.' },
      { title: 'Inspect membership', command: 'docker network inspect app-network', description: 'Shows both containers, their aliases, and network IPs.' },
    ],
  },
  {
    id: 'docker-postgres-adminer', category: 'docker', level: 'basic', title: 'Connect PostgreSQL and Adminer',
    description: 'Run a database and a browser-based database manager on the same Docker network.', result: 'Adminer available on localhost:8080 and able to reach PostgreSQL as database:5432.',
    steps: [
      { title: 'Create the network', command: 'docker network create database-network', description: 'Provides private name resolution for both services.' },
      { title: 'Create persistent storage', command: 'docker volume create postgres-data', description: 'Keeps database files outside the container lifecycle.' },
      { title: 'Start PostgreSQL', command: 'docker run -d --name database --network database-network -e POSTGRES_USER=app -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=appdb -v postgres-data:/var/lib/postgresql/data postgres:16-alpine', description: 'Starts PostgreSQL without exposing its port to the host.' },
      { title: 'Start Adminer', command: 'docker run -d --name adminer --network database-network -p 8080:8080 adminer', description: 'Publishes Adminer while keeping database traffic inside Docker.' },
      { title: 'Check both containers', command: 'docker ps --filter network=database-network', description: 'Confirms that both services are running on the network.' },
      { title: 'Open the interface', command: 'curl -I http://localhost:8080', description: 'Adminer login uses server database, user app, password devpass, and database appdb.' },
    ],
  },
  {
    id: 'docker-connect-existing', category: 'docker', level: 'basic', title: 'Connect existing containers to a network',
    description: 'Attach already-running containers to a shared network without recreating them.', result: 'Existing containers gain name-based communication on shared-network.',
    steps: [
      { title: 'See the running containers', command: 'docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Networks}}"', description: 'Finds the exact container names and their current networks.' },
      { title: 'Create a shared network', command: 'docker network create shared-network', description: 'Creates the destination network.' },
      { title: 'Connect the first container', command: 'docker network connect shared-network <container-one>', description: 'A container may be connected to more than one network.' },
      { title: 'Connect the second container', command: 'docker network connect shared-network <container-two>', description: 'Both containers now share the same DNS domain.' },
      { title: 'Confirm membership', command: 'docker network inspect shared-network', description: 'Lists both names under the Containers section.' },
      { title: 'Disconnect when needed', command: 'docker network disconnect shared-network <container-one>', description: 'Removes only this network attachment; the container keeps running.' },
    ],
  },
  {
    id: 'docker-three-tier-networks', category: 'docker', level: 'advanced', title: 'Isolate a three-tier application',
    description: 'Use separate public and private networks so the proxy cannot directly access the database.', result: 'Proxy → API → database communication with the database isolated from the public tier.',
    steps: [
      { title: 'Create the public network', command: 'docker network create frontend-network', description: 'Carries traffic between the reverse proxy and API.' },
      { title: 'Create the private network', command: 'docker network create backend-network', description: 'Carries traffic between the API and database.' },
      { title: 'Start the database privately', command: 'docker run -d --name database --network backend-network -e POSTGRES_PASSWORD=devpass postgres:16-alpine', description: 'The database joins only backend-network and exposes no host port.' },
      { title: 'Start the API on the backend', command: 'docker run -d --name api --network backend-network -e DATABASE_URL=postgresql://postgres:devpass@database:5432/postgres my-api:latest', description: 'The hostname database resolves through Docker DNS.' },
      { title: 'Add the API to the frontend', command: 'docker network connect frontend-network api', description: 'The API becomes the controlled bridge between both tiers.' },
      { title: 'Start the proxy publicly', command: 'docker run -d --name proxy --network frontend-network -p 80:80 my-proxy:latest', description: 'Only the proxy publishes a host port.' },
      { title: 'Verify isolation', command: 'docker network inspect frontend-network && docker network inspect backend-network', description: 'Proxy and database should never appear together on one network.' },
    ],
  },
  {
    id: 'docker-network-debug', category: 'docker', level: 'advanced', title: 'Debug container connectivity',
    description: 'Follow a reliable sequence when one container cannot reach another.', result: 'Evidence showing whether the problem is process health, network membership, DNS, or the application port.',
    steps: [
      { title: 'Check container state', command: 'docker ps -a --filter name=<container>', description: 'A stopped or restarting container cannot serve requests.' },
      { title: 'Read recent logs', command: 'docker logs --tail 100 <container>', description: 'Looks for startup errors and the actual listening port.' },
      { title: 'List network attachments', command: 'docker inspect -f "{{json .NetworkSettings.Networks}}" <container>', description: 'Confirms which networks and IP addresses Docker assigned.' },
      { title: 'Test DNS from the network', command: 'docker run --rm --network <network> busybox nslookup <target-container>', description: 'Uses a temporary diagnostic container to test name resolution.' },
      { title: 'Test the service port', command: 'docker run --rm --network <network> curlimages/curl -v http://<target-container>:<port>', description: 'Separates an HTTP or port problem from a DNS problem.' },
      { title: 'Review the full network', command: 'docker network inspect <network>', description: 'Checks driver, scope, subnet, gateways, and connected containers.' },
    ],
  },
  {
    id: 'docker-volume-backup', category: 'docker', level: 'advanced', title: 'Back up and restore a named volume',
    description: 'Export a named volume to a compressed archive and restore it into a new volume.', result: 'A portable volume-backup.tar.gz plus a restored Docker volume.',
    steps: [
      { title: 'Stop writers first', command: 'docker stop <container-using-volume>', description: 'Prevents files from changing during the backup.' },
      { title: 'Create the backup', command: 'docker run --rm -v <volume>:/source:ro -v "${PWD}":/backup alpine tar czf /backup/volume-backup.tar.gz -C /source .', description: 'Uses a temporary Alpine container to archive the volume.' },
      { title: 'Create a restore target', command: 'docker volume create <restored-volume>', description: 'Keeps the original volume untouched.' },
      { title: 'Restore the archive', command: 'docker run --rm -v <restored-volume>:/target -v "${PWD}":/backup alpine tar xzf /backup/volume-backup.tar.gz -C /target', description: 'Extracts all archived files into the new volume.' },
      { title: 'Inspect restored files', command: 'docker run --rm -v <restored-volume>:/data:ro alpine ls -la /data', description: 'Verifies the restored content without modifying it.' },
      { title: 'Start the original service', command: 'docker start <container-using-volume>', description: 'Returns the stopped application to service.' },
    ],
  },
  {
    id: 'linux-nginx-site', category: 'linux', level: 'advanced', title: 'Validate and reload Nginx',
    description: 'Check a site configuration and apply it without interrupting active connections.', result: 'A validated Nginx configuration reloaded safely.',
    steps: [
      { title: 'Check service status', command: 'sudo systemctl status nginx', description: 'Confirms whether Nginx is currently healthy.' },
      { title: 'Validate configuration', command: 'sudo nginx -t', description: 'Detects syntax or file reference errors.' },
      { title: 'Reload gracefully', command: 'sudo systemctl reload nginx', description: 'Applies changes without a hard restart.' },
      { title: 'Inspect recent logs', command: 'sudo journalctl -u nginx -n 50 --no-pager', description: 'Shows the latest service events.' },
    ],
  },
  {
    id: 'ssh-key-access', category: 'ssh', level: 'basic', title: 'Configure passwordless SSH access',
    description: 'Generate a secure key, install it on a server, and test the connection.', result: 'Secure key-based access to the remote host.',
    steps: [
      { title: 'Generate a key', command: 'ssh-keygen -t ed25519 -C "you@example.com"', description: 'Creates a modern public/private key pair.' },
      { title: 'Install the public key', command: 'ssh-copy-id user@host', description: 'Adds the key to the remote authorized keys.' },
      { title: 'Test access', command: 'ssh user@host', description: 'Connects using the key instead of a password.' },
    ],
  },
  {
    id: 'node-api-start', category: 'node', level: 'basic', title: 'Start a TypeScript Node project',
    description: 'Create a project, install TypeScript tooling, and prepare a source folder.', result: 'A minimal Node.js TypeScript workspace ready for code.',
    steps: [
      { title: 'Create the project', command: 'mkdir my-api && cd my-api && npm init -y', description: 'Creates the folder and package.json.' },
      { title: 'Install TypeScript tools', command: 'npm install -D typescript tsx @types/node', description: 'Adds the compiler, runner, and Node types.' },
      { title: 'Create a config', command: 'npx tsc --init', description: 'Generates the initial tsconfig.json.' },
      { title: 'Create the entry file', command: 'mkdir src && echo "console.log(\'API ready\')" > src/index.ts', description: 'Adds a minimal TypeScript entry point.' },
      { title: 'Run it', command: 'npx tsx watch src/index.ts', description: 'Starts the process with automatic reload.' },
    ],
  },
  {
    id: 'react-vite-app', category: 'react', level: 'basic', title: 'Create a React + TypeScript app',
    description: 'Scaffold the app, install dependencies, and start the development server.', result: 'A React app running locally with hot reload.',
    steps: [
      { title: 'Scaffold with Vite', command: 'npm create vite@latest my-app -- --template react-ts', description: 'Creates a React and TypeScript project.' },
      { title: 'Enter the project', command: 'cd my-app', description: 'Moves into the new application folder.' },
      { title: 'Install packages', command: 'npm install', description: 'Installs the generated dependencies.' },
      { title: 'Start development', command: 'npm run dev', description: 'Starts Vite with hot module replacement.' },
    ],
  },
  {
    id: 'python-project', category: 'python', level: 'basic', title: 'Create an isolated Python project',
    description: 'Create and activate a virtual environment before installing dependencies.', result: 'An isolated Python workspace with reproducible dependencies.',
    steps: [
      { title: 'Create a folder', command: 'mkdir my-project && cd my-project', description: 'Creates an isolated project directory.' },
      { title: 'Create the environment', command: 'python -m venv .venv', description: 'Creates a local virtual environment.' },
      { title: 'Activate on Windows', command: '.venv\\Scripts\\Activate.ps1', description: 'Activates the environment in PowerShell.' },
      { title: 'Install a package', command: 'python -m pip install requests', description: 'Installs into the active environment.' },
      { title: 'Lock dependencies', command: 'python -m pip freeze > requirements.txt', description: 'Records exact package versions.' },
    ],
  },
  {
    id: 'k8s-deploy-debug', category: 'kubernetes', level: 'advanced', title: 'Deploy and debug an application',
    description: 'Apply manifests, follow rollout status, and inspect a failing workload.', result: 'A verified deployment with a repeatable debugging path.',
    steps: [
      { title: 'Apply manifests', command: 'kubectl apply -f k8s/', description: 'Creates or updates declared resources.' },
      { title: 'Watch the rollout', command: 'kubectl rollout status deployment/<name>', description: 'Waits for the deployment to become ready.' },
      { title: 'Inspect pods', command: 'kubectl get pods -o wide', description: 'Shows scheduling, readiness, and node placement.' },
      { title: 'Describe a pod', command: 'kubectl describe pod <pod-name>', description: 'Shows events and container state details.' },
      { title: 'Read recent logs', command: 'kubectl logs <pod-name> --tail=100', description: 'Displays the latest application output.' },
    ],
  },
  {
    id: 'postgres-backup-restore', category: 'databases', level: 'advanced', title: 'Back up and restore PostgreSQL',
    description: 'Create a compressed database backup and restore it into another database.', result: 'A portable backup plus a tested restore command.',
    steps: [
      { title: 'Create the backup', command: 'pg_dump -U <user> -Fc <database> -f backup.dump', description: 'Exports a compressed custom-format dump.' },
      { title: 'Inspect its contents', command: 'pg_restore --list backup.dump', description: 'Lists objects stored in the backup.' },
      { title: 'Create the target database', command: 'createdb -U <user> <new-database>', description: 'Prepares an empty restore destination.' },
      { title: 'Restore', command: 'pg_restore -U <user> -d <new-database> backup.dump', description: 'Restores the objects and data.' },
    ],
  },
  {
    id: 'network-diagnose', category: 'networking', level: 'basic', title: 'Diagnose a connection problem',
    description: 'Check DNS, reachability, route, and the final HTTP response in order.', result: 'Enough evidence to identify where a connection is failing.',
    steps: [
      { title: 'Resolve DNS', command: 'nslookup <domain>', description: 'Verifies that the hostname resolves.' },
      { title: 'Test reachability', command: 'ping <domain>', description: 'Checks basic network reachability and latency.' },
      { title: 'Trace the route', command: 'traceroute <domain>', description: 'Locates slow or failing network hops.' },
      { title: 'Inspect HTTP', command: 'curl -vI https://<domain>', description: 'Shows connection, TLS, and response headers.' },
    ],
  },
  {
    id: 'network-inventory', category: 'networking', level: 'basic', title: 'Inspect a Linux network',
    description: 'Collect the essential interface, address, gateway, DNS, neighbor, and port information.', result: 'A complete snapshot of the machine network configuration.',
    steps: [
      { title: 'Show interface summary', command: 'ip -br link', description: 'Displays every interface and whether its link is UP or DOWN.' },
      { title: 'Show assigned addresses', command: 'ip -br address', description: 'Lists IPv4 and IPv6 addresses in a compact view.' },
      { title: 'Find the default gateway', command: 'ip route show default', description: 'Shows where traffic leaves the local network.' },
      { title: 'Inspect all routes', command: 'ip route show', description: 'Lists connected, static, and default routes.' },
      { title: 'Inspect DNS', command: 'resolvectl status', description: 'Shows the DNS server selected for each link.' },
      { title: 'Show nearby devices', command: 'ip neighbor show', description: 'Displays known IPv4 and IPv6 neighbors.' },
      { title: 'Show listening services', command: 'sudo ss -tulpn', description: 'Maps listening ports to their processes.' },
    ],
  },
  {
    id: 'network-netplan-static', category: 'networking', level: 'advanced', title: 'Configure a static IP with Netplan',
    description: 'Safely configure a persistent address, gateway, and DNS on Ubuntu.', result: 'A persistent static address validated with rollback protection.',
    steps: [
      { title: 'Identify the interface', command: 'ip -br link && ip -br address', description: 'Replace enp0s3 below with the real interface name.' },
      { title: 'List Netplan files', command: 'ls -la /etc/netplan', description: 'Finds the active YAML filename before making changes.' },
      { title: 'Create a backup', command: 'sudo cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.bak', description: 'Adjust the filename to match the previous command. Never edit without a backup.' },
      { title: 'Write the static configuration', command: `sudo tee /etc/netplan/01-netcfg.yaml > /dev/null <<'EOF'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: false
      addresses:
        - 192.168.1.50/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
EOF`, description: 'Change the interface, address, prefix, gateway, and DNS values for your network.' },
      { title: 'Protect the configuration', command: 'sudo chmod 600 /etc/netplan/01-netcfg.yaml', description: 'Netplan expects configuration files to have restricted permissions.' },
      { title: 'Validate YAML and backend', command: 'sudo netplan generate', description: 'Stops here if indentation, keys, or values are invalid.' },
      { title: 'Test with automatic rollback', command: 'sudo netplan try', description: 'Confirm only if connectivity still works. It rolls back after the timeout otherwise.' },
      { title: 'Apply permanently', command: 'sudo netplan apply', description: 'Makes the validated configuration active.' },
      { title: 'Verify everything', command: 'ip -br address && ip route && resolvectl status', description: 'Confirms the address, gateway, and DNS configuration.' },
    ],
  },
  {
    id: 'network-netplan-dhcp', category: 'networking', level: 'basic', title: 'Configure DHCP with Netplan',
    description: 'Return an Ubuntu interface to automatic IP, gateway, and DNS configuration.', result: 'The interface receives its network settings automatically through DHCP.',
    steps: [
      { title: 'Find the interface name', command: 'ip -br link', description: 'Use the real interface name instead of enp0s3.' },
      { title: 'Back up the current file', command: 'sudo cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.bak', description: 'Adjust the filename if your Netplan file has another name.' },
      { title: 'Write the DHCP configuration', command: `sudo tee /etc/netplan/01-netcfg.yaml > /dev/null <<'EOF'
network:
  version: 2
  renderer: networkd
  ethernets:
    enp0s3:
      dhcp4: true
EOF`, description: 'This minimal configuration asks the network DHCP server for settings.' },
      { title: 'Set safe permissions', command: 'sudo chmod 600 /etc/netplan/01-netcfg.yaml', description: 'Prevents Netplan permission warnings.' },
      { title: 'Validate the configuration', command: 'sudo netplan generate', description: 'Checks YAML and generates the networkd configuration.' },
      { title: 'Test before committing', command: 'sudo netplan try', description: 'Accept the settings only after confirming connectivity.' },
      { title: 'Check the DHCP result', command: 'ip -br address && ip route show default', description: 'Shows the leased address and gateway.' },
    ],
  },
  {
    id: 'network-temporary-static', category: 'networking', level: 'advanced', title: 'Set a temporary static IP',
    description: 'Configure an address and route immediately with iproute2 without changing Netplan.', result: 'A working temporary configuration that disappears after reboot.',
    steps: [
      { title: 'Enable the interface', command: 'sudo ip link set enp0s3 up', description: 'Replace enp0s3 with the real interface name.' },
      { title: 'Add the address', command: 'sudo ip address add 192.168.1.50/24 dev enp0s3', description: 'Adds an address without modifying persistent configuration.' },
      { title: 'Add the default route', command: 'sudo ip route add default via 192.168.1.1 dev enp0s3', description: 'Directs non-local traffic through the gateway.' },
      { title: 'Set temporary DNS', command: 'sudo resolvectl dns enp0s3 1.1.1.1 8.8.8.8', description: 'Assigns DNS servers to this link until restart or reconfiguration.' },
      { title: 'Validate local connectivity', command: 'ping -c 3 192.168.1.1', description: 'Tests whether the configured gateway is reachable.' },
      { title: 'Validate DNS and internet', command: 'ping -c 3 1.1.1.1 && resolvectl query example.com', description: 'Separates basic internet connectivity from DNS resolution.' },
    ],
  },
  {
    id: 'network-dns-troubleshoot', category: 'networking', level: 'advanced', title: 'Troubleshoot DNS resolution',
    description: 'Determine whether a failure comes from connectivity, the resolver, or a specific DNS server.', result: 'A clear diagnosis of the active DNS path and failing layer.',
    steps: [
      { title: 'Confirm raw connectivity', command: 'ping -c 3 1.1.1.1', description: 'If this fails, solve routing or connectivity before DNS.' },
      { title: 'Check resolver state', command: 'resolvectl status', description: 'Shows active DNS servers, protocols, and search domains.' },
      { title: 'Query through the system', command: 'resolvectl query example.com', description: 'Tests the same resolution path applications normally use.' },
      { title: 'Query a known server', command: 'nslookup example.com 1.1.1.1', description: 'Bypasses the configured resolver to compare results.' },
      { title: 'Clear the local cache', command: 'sudo resolvectl flush-caches', description: 'Removes stale cached answers.' },
      { title: 'Restart the resolver', command: 'sudo systemctl restart systemd-resolved', description: 'Restarts the local DNS resolver if its state is unhealthy.' },
      { title: 'Review resolver logs', command: 'sudo journalctl -u systemd-resolved -n 50 --no-pager', description: 'Displays recent errors and server changes.' },
    ],
  },
]

export const workflowsFor = (category: string) => workflows.filter((workflow) => workflow.category === category)
