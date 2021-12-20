# Kubernetes
Assumptions:
* You are already logged in using `az login`
* You have a subscription that is the default `az account set --subscription <name or id>`

_The Cluster for the project has already been created, do not run these commands._

## Create a new Resource Group called MentorMeRG
`az group create --name MentorMeRG --location westus2`

```json
{
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG",
  "location": "westus2",
  "managedBy": null,
  "name": "MentorMeRG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create an Azure Container Registry to host our custom containers
`az acr create --resource-group MentorMeRG  --name MentorMeACR --sku Basic`
### Response
```json
{
  "adminUserEnabled": false,
  "creationDate": "2020-02-05T21:20:24.521791+00:00",
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.ContainerRegistry/registries/MentorMeACR",
  "location": "westus2",
  "loginServer": "mentormeacr.azurecr.io",
  "name": "MentorMeACR",
  "networkRuleSet": null,
  "policies": {
    "quarantinePolicy": {
      "status": "disabled"
    },
    "retentionPolicy": {
      "days": 7,
      "lastUpdatedTime": "2020-02-05T21:20:26.325191+00:00",
      "status": "disabled"
    },
    "trustPolicy": {
      "status": "disabled",
      "type": "Notary"
    }
  },
  "provisioningState": "Succeeded",
  "resourceGroup": "MentorMeRG",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```

## Create a new Virtual Network called 474vNet and create a subnet called K8sSubnet
`az network vnet create --resource-group MentorMeRG --name 474vNet --address-prefixes 10.0.0.0/8 --subnet-name K8sSubnet --subnet-prefix 10.240.0.0/16`
### Response
```json
{
  "newVNet": {
    "addressSpace": {
      "addressPrefixes": [
        "10.0.0.0/8"
      ]
    },
    "bgpCommunities": null,
    "ddosProtectionPlan": null,
    "dhcpOptions": {
      "dnsServers": []
    },
    "enableDdosProtection": false,
    "enableVmProtection": false,
    "etag": "W/\"d38e4376-98a2-4603-bf5b-9351d44f973e\"",
    "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet",
    "location": "westus2",
    "name": "474vNet",
    "provisioningState": "Succeeded",
    "resourceGroup": "MentorMeRG",
    "resourceGuid": "0911815e-63dc-4db1-9664-2bad5d7108e8",
    "subnets": [
      {
        "addressPrefix": "10.240.0.0/16",
        "addressPrefixes": null,
        "delegations": [],
        "etag": "W/\"d38e4376-98a2-4603-bf5b-9351d44f973e\"",
        "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet",
        "ipConfigurationProfiles": null,
        "ipConfigurations": null,
        "name": "K8sSubnet",
        "natGateway": null,
        "networkSecurityGroup": null,
        "privateEndpointNetworkPolicies": "Enabled",
        "privateEndpoints": null,
        "privateLinkServiceNetworkPolicies": "Enabled",
        "provisioningState": "Succeeded",
        "purpose": null,
        "resourceGroup": "MentorMeRG",
        "resourceNavigationLinks": null,
        "routeTable": null,
        "serviceAssociationLinks": null,
        "serviceEndpointPolicies": null,
        "serviceEndpoints": null,
        "type": "Microsoft.Network/virtualNetworks/subnets"
      }
    ],
    "tags": {},
    "type": "Microsoft.Network/virtualNetworks",
    "virtualNetworkPeerings": []
  }
}
```

## Create another subnet in the 474vNet called VirtualNodesSubnet
`az network vnet subnet create --resource-group MentorMeRG --vnet-name 474vNet --name VirtualNodesSubnet --address-prefixes 10.241.0.0/16`
### Response
```json
{
  "addressPrefix": "10.241.0.0/16",
  "addressPrefixes": null,
  "delegations": [],
  "etag": "W/\"b20e2767-a12d-499c-a140-b229167a4975\"",
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/VirtualNodesSubnet",
  "ipConfigurationProfiles": null,
  "ipConfigurations": null,
  "name": "VirtualNodesSubnet",
  "natGateway": null,
  "networkSecurityGroup": null,
  "privateEndpointNetworkPolicies": "Enabled",
  "privateEndpoints": null,
  "privateLinkServiceNetworkPolicies": "Enabled",
  "provisioningState": "Succeeded",
  "purpose": null,
  "resourceGroup": "MentorMeRG",
  "resourceNavigationLinks": null,
  "routeTable": null,
  "serviceAssociationLinks": null,
  "serviceEndpointPolicies": null,
  "serviceEndpoints": null,
  "type": "Microsoft.Network/virtualNetworks/subnets"
}
```
## Creates some Azure AD stuff for authentication
`az ad sp create-for-rbac --skip-assignment`
### Response
```json
{
  "appId": "6c2425ef-93e3-4273-a7af-ce2a5d58f513",
  "displayName": "azure-cli-2020-02-05-21-22-58",
  "name": "http://azure-cli-2020-02-05-21-22-58",
  "password": "7199a016-ab19-4148-ae9b-e617ac6306c9",
  "tenant": "4a1e5cee-f43e-451d-b150-1486f954ef55"
}
```
We will need to use `appId` and `password` in a later step.
## Get the vNetID of 474vNet
`az network vnet show --resource-group MentorMeRG --name 474vNet --query id`
### Response
```json
"/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet"
```
We will need this for a later step.
## Create an account for the vNet
`az role assignment create --assignee 6c2425ef-93e3-4273-a7af-ce2a5d58f513 --scope /subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet --role Contributor`

The `--assignee` is the appId AKA Service Principal from earlier.
### Response
```json
{
  "canDelegate": null,
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/providers/Microsoft.Authorization/roleAssignments/853dbfaf-d3eb-4145-b047-75d417e08899",
  "name": "853dbfaf-d3eb-4145-b047-75d417e08899",
  "principalId": "8d142704-7c84-4d51-90f8-8654bf7e0349",
  "principalType": "ServicePrincipal",
  "resourceGroup": "MentorMeRG",
  "roleDefinitionId": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
  "scope": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet",
  "type": "Microsoft.Authorization/roleAssignments"
}
```
## Get the vNetID of the K8sSubnet
`az network vnet subnet show --resource-group MentorMeRG --vnet-name 474vNet --name K8sSubnet --query id`
### Response
```json
"/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet"
```
We will need this for the next step.
## Create the Kubernetes Cluster
`az aks create --enable-addons monitoring --resource-group MentorMeRG --name ProjectK8sCluster --node-count 1 --network-plugin azure --service-cidr 10.0.0.0/16 --dns-service-ip 10.0.0.10 --docker-bridge-address 172.17.0.1/16 --vnet-subnet-id /subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet --service-principal 6c2425ef-93e3-4273-a7af-ce2a5d58f513 --client-secret 7199a016-ab19-4148-ae9b-e617ac6306c9 --max-pods 250 --node-vm-size Standard_B2s --attach-acr MentorMeACR --load-balancer-sku basic --node-osdisk-size 30`
### Explanation of some of the flags
`--network-plugin azure` We need to use this instead of kubenet to use Azure Virtual Nodes.

`--service-cidr 10.0.0.0/16 --dns-service-ip 10.0.0.10 --docker-bridge-address 172.17.0.1/16` This is to setup the cluster to use the vNet we created.

`--vnet-subnet-id /subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet` From the previous step.

`--service-principal 6c2425ef-93e3-4273-a7af-ce2a5d58f513` Same as the appId from a few steps ago.

`--client-secret 7199a016-ab19-4148-ae9b-e617ac6306c9` The password from earlier.

`--max-pods 250` The default in this AKS config is 30. 

`--attach-acr MentorMeACR` This grants the 'acrpull' role assignment to the ACR that we host our container images in.

`--load-balancer-sku basic` We use the basic LB instead of standard to keep costs low.

`--node-osdisk-size 30` We set the Node OS disk to be the minimum permitted to keep costs low.

### Response
```json
{
  "aadProfile": null,
  "addonProfiles": {
    "omsagent": {
      "config": {
        "logAnalyticsWorkspaceResourceID": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourcegroups/defaultresourcegroup-wus2/providers/microsoft.operationalinsights/workspaces/defaultworkspace-5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664-wus2"
      },
      "enabled": true
    }
  },
  "agentPoolProfiles": [
    {
      "count": 1,
      "enableAutoScaling": null,
      "enableNodePublicIp": null,
      "maxCount": null,
      "maxPods": 250,
      "minCount": null,
      "name": "nodepool1",
      "orchestratorVersion": "1.14.8",
      "osDiskSizeGb": 30,
      "osType": "Linux",
      "provisioningState": "Succeeded",
      "scaleSetEvictionPolicy": null,
      "scaleSetPriority": null,
      "type": "VirtualMachineScaleSets",
      "vmSize": "Standard_B2s",
      "vnetSubnetId": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet"
    }
  ],
  "apiServerAccessProfile": null,
  "dnsPrefix": "ProjectK8s-MentorMeRG-5f81f4",
  "enablePodSecurityPolicy": null,
  "enableRbac": true,
  "fqdn": "projectk8s-mentormerg-5f81f4-5b1393bd.hcp.westus2.azmk8s.io",
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourcegroups/MentorMeRG/providers/Microsoft.ContainerService/managedClusters/ProjectK8sCluster",
  "identity": null,
  "kubernetesVersion": "1.14.8",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAgEAiM2WoE4uREVCBiozcmQISicu9ir88t/jJJm/fak1DqdtIzTVYhgEzNLEBveOZgSCzlxwkz3xoquCm50iVJ5y5w+vNuapoEXoEjzYa6SdFLm9Y3UJecdP5s57M7nIY3Va7LyTYs6zXZ42TVWFvOgU2vKqkol0Ib1DwTOkZhmmE6/8M4JHwehC9G5CbRx7v4rd1ZcS/LH3Li0kbQ+NUS3VmCl8H8lt6UxSSJue7BrAEoYEK05GFMBzGwweFY+11jMUlUMKrZdm/Fox1xg3wJdaF3f0GVI4WXFq9Od1YrQ7tIGsrJFLcEmcdLrqBXjCs1OZ6R2WMBsFBKGZoBERinWvgJ2GMuyHCUa0dyKHp9XH3b7ZDICk4mM7e2PoQ0m5/ig4cUxauHCbEgLZy/IeeIwYt2Hw2Jdk8qxooOJZZnT6aqYk34vLigtXXfbb/LgTuZ855S673+sHMwXgCt3md9SpAml+RcJ7P/2N0hpAu93EFXHaHf70kXHnG2VkJFmvUGTrljxfY3o3RpxP6XMHcCZVKrGPR6kmRU6lJyvCtsD23sGo5w7cyspLfQihIbZ1fbXuif2j5jz92o5VXgtNWa4g2VvOSlN7W+tTBBlUBI3U8j/IrwOMfsK8iVHY4D1Pn5fr+31vbtYbBWVyoxcZadZZGP1riiJOzxWnf7zBKpowW8U=\n"
        }
      ]
    }
  },
  "location": "westus2",
  "maxAgentPools": 8,
  "name": "ProjectK8sCluster",
  "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "loadBalancerProfile": null,
    "loadBalancerSku": "Basic",
    "networkPlugin": "azure",
    "networkPolicy": null,
    "outboundType": "loadBalancer",
    "podCidr": null,
    "serviceCidr": "10.0.0.0/16"
  },
  "nodeResourceGroup": "MC_MentorMeRG_ProjectK8sCluster_westus2",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "MentorMeRG",
  "servicePrincipalProfile": {
    "clientId": "6c2425ef-93e3-4273-a7af-ce2a5d58f513",
    "secret": null
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters",
  "windowsProfile": null
}
```
## Enable Virtual Node addon
`az aks enable-addons --resource-group MentorMeRG --name ProjectK8sCluster --addons virtual-node --subnet-name VirtualNodesSubnet`
### Response
```json
{
  "aadProfile": null,
  "addonProfiles": {
    "aciConnectorLinux": {
      "config": {
        "SubnetName": "VirtualNodesSubnet"
      },
      "enabled": true
    },
    "omsagent": {
      "config": {
        "logAnalyticsWorkspaceResourceID": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourcegroups/defaultresourcegroup-wus2/providers/microsoft.operationalinsights/workspaces/defaultworkspace-5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664-wus2"
      },
      "enabled": true
    }
  },
  "agentPoolProfiles": [
    {
      "count": 1,
      "enableAutoScaling": null,
      "enableNodePublicIp": null,
      "maxCount": null,
      "maxPods": 250,
      "minCount": null,
      "name": "nodepool1",
      "nodeTaints": null,
      "orchestratorVersion": "1.14.8",
      "osDiskSizeGb": 30,
      "osType": "Linux",
      "provisioningState": "Succeeded",
      "scaleSetEvictionPolicy": null,
      "scaleSetPriority": null,
      "type": "VirtualMachineScaleSets",
      "vmSize": "Standard_B2s",
      "vnetSubnetId": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/MentorMeRG/providers/Microsoft.Network/virtualNetworks/474vNet/subnets/K8sSubnet"
    }
  ],
  "apiServerAccessProfile": null,
  "dnsPrefix": "ProjectK8s-MentorMeRG-5f81f4",
  "enablePodSecurityPolicy": null,
  "enableRbac": true,
  "fqdn": "projectk8s-mentormerg-5f81f4-5b1393bd.hcp.westus2.azmk8s.io",
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourcegroups/MentorMeRG/providers/Microsoft.ContainerService/managedClusters/ProjectK8sCluster",
  "identity": null,
  "kubernetesVersion": "1.14.8",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "ssh-rsa AAAAB3NzaC1yc2EAAAABJQAAAgEAiM2WoE4uREVCBiozcmQISicu9ir88t/jJJm/fak1DqdtIzTVYhgEzNLEBveOZgSCzlxwkz3xoquCm50iVJ5y5w+vNuapoEXoEjzYa6SdFLm9Y3UJecdP5s57M7nIY3Va7LyTYs6zXZ42TVWFvOgU2vKqkol0Ib1DwTOkZhmmE6/8M4JHwehC9G5CbRx7v4rd1ZcS/LH3Li0kbQ+NUS3VmCl8H8lt6UxSSJue7BrAEoYEK05GFMBzGwweFY+11jMUlUMKrZdm/Fox1xg3wJdaF3f0GVI4WXFq9Od1YrQ7tIGsrJFLcEmcdLrqBXjCs1OZ6R2WMBsFBKGZoBERinWvgJ2GMuyHCUa0dyKHp9XH3b7ZDICk4mM7e2PoQ0m5/ig4cUxauHCbEgLZy/IeeIwYt2Hw2Jdk8qxooOJZZnT6aqYk34vLigtXXfbb/LgTuZ855S673+sHMwXgCt3md9SpAml+RcJ7P/2N0hpAu93EFXHaHf70kXHnG2VkJFmvUGTrljxfY3o3RpxP6XMHcCZVKrGPR6kmRU6lJyvCtsD23sGo5w7cyspLfQihIbZ1fbXuif2j5jz92o5VXgtNWa4g2VvOSlN7W+tTBBlUBI3U8j/IrwOMfsK8iVHY4D1Pn5fr+31vbtYbBWVyoxcZadZZGP1riiJOzxWnf7zBKpowW8U=\n"
        }
      ]
    }
  },
  "location": "westus2",
  "maxAgentPools": 8,
  "name": "ProjectK8sCluster",
  "networkProfile": {
    "dnsServiceIp": "10.0.0.10",
    "dockerBridgeCidr": "172.17.0.1/16",
    "loadBalancerProfile": null,
    "loadBalancerSku": "Basic",
    "networkPlugin": "azure",
    "networkPolicy": null,
    "outboundType": "loadBalancer",
    "podCidr": null,
    "serviceCidr": "10.0.0.0/16"
  },
  "nodeResourceGroup": "MC_MentorMeRG_ProjectK8sCluster_westus2",
  "privateFqdn": null,
  "provisioningState": "Succeeded",
  "resourceGroup": "MentorMeRG",
  "servicePrincipalProfile": {
    "clientId": "6c2425ef-93e3-4273-a7af-ce2a5d58f513",
    "secret": null
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters",
  "windowsProfile": null
}
```
