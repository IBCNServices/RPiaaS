# RPiaaS - Raspberry Pi as a Service
A Raspberry Pi Cloud Testbed 

- [Introduction](#introduction)
- [Overview](#overview)
- [Source Code](#source-code)
- [Getting Started](#getting-started)
- [Disclaimer](#disclaimer)
- [License](#license)

## Introduction

Raspberry Pi as a Service (**RPiaaS**) is a low-cost and energy-efficient cloud testbed built using [Raspberry Pi's](https://www.raspberrypi.org). The testbed consists of multiple worker nodes, which can be aggregated in small clusters. Every node in the cluster is interconnected, and there is a master node managing the whole testbed. This master node can be a Raspberry Pi or any device running a Linux distribution.

RPiaaS provides an easy-to-use cloud environment for experimentation and validation of resource management experiments, and is initially designed to facilitate the step from simulations towards experimental evaluations on larger cloud testbeds. The developed software however is easy to extend and/or customize, for example to use it for managing a classroom environment or to build a multimedia streaming cluster.

## Source Code will be released soon

We just received permission to publish the code, and are now cleaning up the source code and finishing all documentation. 
All code and documentation will be released very soon, so please come back to this page in a few weeks.


## Overview

### Containers
RPiaaS is developed using a microservice architecture, and consists of 5 different Docker containers:
- **rpiaas-cas**: container running the client agent service (CAS)
- **rpiaas-cms**: container running the cluster master service (CMS)
- **rpiaas-mongo**: container running a *mongodb* instance, for storing all historical usage data, used by the rpiaas-cms container
- **rpiaas-dnsmasq**: container running an *dnsmasq* instance, and is used for providing DNS, DHCP and TFTP towards all worker nodes in the cluster(s)
- **rpiaas-nfs**: container running a *nfs-kernel-server* instance, providing the NFS root file system towards all worker nodes

On the master node (= the node managing the cluster(s)), all containers should be deployed.
On the worker nodes (= all other nodes), only the **rpiaas-cas** container should be deployed.

### Source code
All source code can be found inside the *src/* folder. The *agent/* and *master/* subfolders contain the source code of the client agent service (CAS) and cluster master service (CMS) respectively, and the *docker/* subfolder contains the Docker-compose files and the docker files for the different containers.

## Getting Started
To facilitate the installation, two bash scripts are provided:
- **buildandrun_agent.sh** should be executed on the worker nodes, this script launches the **rpiaas-cas** container
- **buildandrun_master.sh** should be executed on the master node, this script launches all containers

The configuration files required for the different containers are automatically generated during startup.

**Important:** Before deploying the services, a *config.json* needs to be created inside the *config/* folder. In this file, the interface of the master node used for communication with the cluster(s), and an overview of the different cluster nodes have to be added. The *config.example.json* file inside this folder can be used as a template for creating this file. In this example, the master node communicates with the cluster nodes on *eth0* and their are two clusters defined, each consisting of 2 worker nodes. The *config.json* file needs to be created before launching the containers, as during startup the configuration files for the services are automatically generated using this configuration file.

## Disclaimer

RPiaaS is developed at [Ghent University](https://www.ugent.be/en) - [IDLab](https://www.ugent.be/ea/idlab/en). 
We strongly encourage fellow researchers within the field to try out and customize the code for their own research projects. 
If you use this code for your own projects, please give credit to the original authors, for example by citing the following publication:

> Pieter-Jan Maenhaut, Hendrik Moens, Bruno Volckaert, Veerle Ongenae, Filip De Turck. Resource Allocation in the Cloud: From Simulation to Experimental Validation . In proceedings of the 2017 IEEE 10th International Conference on Cloud Computing (CLOUD 2017), Honolulu, Hawaii, USA, 2017

## License

Copyright 2017-2018 Ghent University - imec - IDLab

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
