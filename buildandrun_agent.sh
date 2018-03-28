#!/bin/bash
# Configure Ports
CAS_PORT=8081

# constant strings for output
N_INF='\e[32m [INF] \e[0m \t'	
N_ERR='\e[31m [ERR] \e[0m \t'

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

echo -e "${N_INF} Initializing RPiaaS agent services"
echo -e "${N_INF} Creating log directories"
mkdir -p logs/compose/
echo -e "${N_INF} Building and starting containers (might take some time)"
sudo ARCH="$ARCH" docker-compose -f src/docker/rpiaas-agent.yml up -d --build --no-color >& logs/compose/rpiaas-agent.log
echo -e "${N_INF} Docker-compose logs written to logs/compose/rpiaas-agent.log"
echo -e "${N_INF} - Agent running at http://localhost:$CAS_PORT"


