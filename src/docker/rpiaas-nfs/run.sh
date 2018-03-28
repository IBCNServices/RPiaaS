#!/bin/bash
set -e

export_base="/exports/"

### Handle `docker stop` for graceful shutdown
function shutdown {
    echo "- Shutting down nfs-server.."
    service nfs-kernel-server stop
    echo "- Nfs server is down"
    exit 0
}

trap "shutdown" SIGTERM
####

# echo "Export points:"
# echo "$export_base *(rw,sync,insecure,fsid=0,no_subtree_check,no_root_squash)" | tee /etc/exports

# read -a exports <<< "${@}"
# for export in "${exports[@]}"; do
#     src=`echo "$export" | sed 's/^\///'` # trim the first '/' if given in export path
#     src="$export_base$src"
#     mkdir -p $src
#     chmod 777 $src
#     echo "$src *(rw,sync,insecure,no_subtree_check,no_root_squash)" | tee -a /etc/exports
# done

# Source:https://wiki.debian.org/SecuringNFS
echo -e "\n- Configuring ports for statd, mountd and quotad RPC services"
echo "STATDOPTS=\"--port 32765 --outgoing-port 32766\" " > /etc/default/nfs-common
echo "RPCMOUNTDOPTS=\"-p 32767\" " > /etc/default/nfs-kernel-server
echo "RPCRQUOTADOPTS=\"-p 32769\" " > /etc/default/quota
echo "fs.nfs.nfs_callback_tcpport = 32764" >> /etc/sysctl.conf
echo "fs.nfs.nlm_tcpport = 32768" >> /etc/sysctl.conf
echo "fs.nfs.nlm_udpport = 32768" >> /etc/sysctl.conf
sysctl --system
echo -e "\n- Initializing nfs server.."
rpcbind
service nfs-kernel-server start
echo "- Nfs server is up and running.."
## Run forever
sleep infinity