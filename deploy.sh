#!/bin/bash -i

shopt -s expand_aliases
DESTINATION="hosting@hosting"

podman build --pull --rm -f 'Dockerfile' -t 'dirt2-laptimes:latest' '.'
podman save dirt2-laptimes:latest -o dirt2-laptimes.tar

scp -r dirt2-laptimes.tar $DESTINATION:/opt/containers/dirt2-laptimes.tar

ssh $DESTINATION 'podman load -i /opt/containers/dirt2-laptimes.tar'

ssh $DESTINATION 'systemctl --user restart container-dirt2-laptimes'
