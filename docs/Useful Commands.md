# Useful Commands

## Use docker without sudo on Linux
```
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker 
```

### Can't read config file?
If you initially ran Docker CLI commands using sudo before adding your user to the docker group, you may see the following error, which indicates that your ~/.docker/ directory was created with incorrect permissions due to the sudo commands.
```console
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
```
To fix this problem, either remove the ~/.docker/ directory (it is recreated automatically, but any custom settings are lost), or change its ownership and permissions using the following commands:
```console
sudo chown "$USER":"$USER" /home/"$USER"/.docker -R
sudo chmod g+rwx "$HOME/.docker" -R
```

## Get the credentials from Azure for kubectl
`az aks get-credentials --name ProjectK8sCluster --resource-group MentorMeRG --subscription 5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664`

## Build a docker container
Make sure you are in the directory of the Dockerfile
`docker build -t my/image-name:my-tag .`
