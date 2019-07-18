# prometheus-test-project

on ubuntu 16.04

require
- docker
- npm
- node

run
- npm install
- edit targets in promotheus.yml to host-ip (hostname -I) 
- start promethus
- start grafana
- in localhost:3000 login with admin/admin
- import top-dashborad.json
- set dataset to localhost:9090
- node server.js
- try request to some API ex. /regester/success/200 -> /regester/{req_success?}/{status_code}

prometheus start command
- sudo docker run --name pro -p 9090:9090 -v "$(pwd)/prometheus.yml":/etc/prometheus/prometheus.yml prom/prometheus

grafana start command
- sudo docker run -d --name=grafana -p 3000:3000 grafana/grafana
