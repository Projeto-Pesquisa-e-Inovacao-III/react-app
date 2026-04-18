FROM nginx:alpine
# Local setup and build (PowerShell)
# 1) Install dependencies:
#    npm install
# 2) Set frontend env var used by Vite:
#    $env:VITE_BASE_URL=""
# 3) Generate production files (dist/):
#    npm run build
# 4) Build Docker image with generated dist/:
#    docker build -t react-app:local .
# 5) Run container locally:
#    docker run --rm -p 8080:80 react-app:local
COPY dist/ /usr/share/nginx/html
COPY nginx/default.conf.template /etc/nginx/conf.d/default.conf
