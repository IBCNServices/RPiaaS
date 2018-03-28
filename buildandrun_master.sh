#!/bin/bash
# Configure Ports
CAS_PORT=8081
CMS_PORT=8080

# constant strings for output
N_INF='\e[32m [INF] \e[0m \t'	
N_ERR='\e[31m [ERR] \e[0m \t'

# First, load NFS Modules before starting NFS container
sudo modprobe nfs
sudo modprobe nfsd

# Determine architecture using uname
echo -e "${N_INF} Detecting Architecture"
arch=$(uname -i)

if [ "$arch" == 'x86_64' ]; then 
	echo -e "${N_INF} x86 64bit Architecture detected" 
	ARCH=x86
elif [ "$arch" == 'x86_32' ];
then
	echo -e "${N_INF} x86 32bit Architecture detected"
	ARCH=x86
elif [ "$arch" == 'armv*' ];
then
	echo -e "${N_INF} ARM architecture detected"
	ARCH=armhf
elif [ "$arch" == 'unknown' ];
then
	echo -e "${N_INF} 'unknown' architecture, possibly raspbian on RPi, setting architecture to ARM"
	ARCH=armhf
else
	echo -e "${N_INF} Unknown architecture: $arch, setting architecture to x86"
	ARCH=x86
fi

# Check if config file exists
if [ ! -f config/config.json ]; then
    echo -e "${N_ERR} File config/config.json not found - please create a config file first!"
else
	echo -e "${N_INF} Creating log directories"
	mkdir -p logs/compose/
	mkdir -p logs/config/
	echo -e "${N_INF} Building and starting RPiaaS CMS container"
	cp config/config.json src/master/static/config.json
	sudo ARCH="$ARCH" docker-compose -f src/docker/rpiaas-master_cms.yml up -d --build --no-color >& logs/compose/rpiaas-master_cms.log
	echo -e "${N_INF} Docker-compose logs written to logs/compose/rpiaas-master_cms.log"
	echo -e "${N_INF} Generating config (based on config/config.json)"
	mkdir -p config/rpiaas-dnsmasq/
	wget --output-document=config/rpiaas-dnsmasq/dnsmasq.conf http://localhost:8080/conf/dnsmasq.conf >& logs/config/dnsmasq
	wget --output-document=config/rpiaas-dnsmasq/dnsmasq_static_hosts http://localhost:8080/conf/dnsmasq_static_hosts >& logs/config/dnsmasq_static_hosts
	mkdir -p config/rpiaas-nfs/
	wget --output-document=config/rpiaas-nfs/exports http://localhost:8080/conf/exports >& logs/config/exports
	echo -e "${N_INF} Logs written to logs/config/ directory"
	echo -e "${N_INF} Building and starting RPiaaS CAS container"
	sudo ARCH="$ARCH" docker-compose -f src/docker/rpiaas-agent.yml up -d --build --no-color >& logs/compose/rpiaas-agent.log
	echo -e "${N_INF} Docker-compose logs written to logs/compose/rpiaas-agent.log"
	echo -e "${N_INF} Building and starting other containers (might take some time)"
	sudo ARCH="$ARCH" docker-compose -f src/docker/rpiaas-master_others.yml up -d --build --no-color >& logs/compose/rpiaas-master_others.log
	echo -e "${N_INF} Docker-compose logs written to logs/compose/rpiaas-master_others.log"
	echo -e "${N_INF} - Agent running at http://localhost:$CAS_PORT"
	echo -e "${N_INF} - Master running at http://localhost:$CMS_PORT"
fi