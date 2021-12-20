# Networking
Instead of accessing our website by IP, we can use a Custom Domain.
For the time being we will use Darien's domain `dpsi.jp`.

## Creating a new DNS Zone
`az network dns zone create -g MentorMeRG -n mentorme.dpsi.jp`
### Response
```json
{
  "etag": "00000002-0000-0000-8bbe-ae9a80dcd501",
  "id": "/subscriptions/5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664/resourceGroups/mentormerg/providers/Microsoft.Network/dnszones/mentorme.dpsi.jp",
  "location": "global",
  "maxNumberOfRecordSets": 10000,
  "name": "mentorme.dpsi.jp",
  "nameServers": [
    "ns1-05.azure-dns.com.",
    "ns2-05.azure-dns.net.",
    "ns3-05.azure-dns.org.",
    "ns4-05.azure-dns.info."
  ],
  "numberOfRecordSets": 2,
  "registrationVirtualNetworks": null,
  "resolutionVirtualNetworks": null,
  "resourceGroup": "mentormerg",
  "tags": {},
  "type": "Microsoft.Network/dnszones",
  "zoneType": "Public"
}
```
Take note of the `nameServers` array.

## Creating NS records
This step will vary depending on your DNS registrar or providor. You need to make NS records using the 4 nameServers Azure has given you.

Once you have created the NS records, we can verify by using the tool `dig`.
```console
$ dig mentorme.dpsi.jp ns

; <<>> DiG 9.14.10 <<>> mentorme.dpsi.jp ns
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 39197
;; flags: qr rd ra; QUERY: 1, ANSWER: 4, AUTHORITY: 0, ADDITIONAL: 8

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
; COOKIE: 0b6f09b31a9a04b62b4fd3fb5e3b58e0875a6947cc5c304b (good)
;; QUESTION SECTION:
;mentorme.dpsi.jp.              IN      NS

;; ANSWER SECTION:
mentorme.dpsi.jp.       900     IN      NS      ns3-05.azure-dns.org.
mentorme.dpsi.jp.       900     IN      NS      ns1-05.azure-dns.com.
mentorme.dpsi.jp.       900     IN      NS      ns2-05.azure-dns.net.
mentorme.dpsi.jp.       900     IN      NS      ns4-05.azure-dns.info.

;; ADDITIONAL SECTION:
ns1-05.azure-dns.com.   786     IN      A       40.90.4.5
ns2-05.azure-dns.net.   786     IN      A       64.4.48.5
ns3-05.azure-dns.org.   786     IN      A       13.107.24.5
ns4-05.azure-dns.info.  786     IN      A       13.107.160.5
ns1-05.azure-dns.com.   786     IN      AAAA    2603:1061::5
ns2-05.azure-dns.net.   786     IN      AAAA    2620:1ec:8ec::5
ns3-05.azure-dns.org.   786     IN      AAAA    2a01:111:4000::5

;; Query time: 78 msec
;; SERVER: 142.58.200.2#53(142.58.200.2)
;; WHEN: Wed Feb 05 16:07:59 Pacific Standard Time 2020
;; MSG SIZE  rcvd: 358
```
As you can see, in the `ANSWER SECTION` of the `dig` output, the 4 nameservers are listed.

## Creating an A record
Suppose we need to have a FQDN for a server at 10.11.22.33 to host our static assets. We can create an A record to the FQDN `static.mentorme.dpsi.jp` with this command:
```
az network dns record-set a add-record \
    --ipv4-address 10.11.22.33 --record-set-name static \
    --resource-group MentorMeRG --zone-name mentorme.dpsi.jp \
    --subscription 5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664 \
    --ttl 300
```

Notice that the `--record-set-name` option is relative to the `zone-name`.

Since everyone in the project has owner access to the Resource Group, feel free to create DNS records in the `mentorme.dpsi.jp` zone to give our project an extra level of polish.

## Creating a CNAME record
Instead of an A record, you could also use a CNAME record. ~~Suppose we have a component of our system hosted as an Azure Web App. I will use the Assignment 1 web app as an example.~~ Free plan does not allow Custom Domains for Web Apps, but does allow it for Functions.
```
az network dns record-set cname set-record \
    --cname cmpt474demoass1.azurewebsites.net \
    --record-set-name example --resource-group MentorMeRG \
    --zone-name mentorme.dpsi.jp \
    --subscription 5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664
```

CNAMEs do not have to be just for Azure resources:

`az network dns record-set cname set-record --cname www.sfu.ca --record-set-name sfu --resource-group MentorMeRG --zone-name mentorme.dpsi.jp --subscription 5f81f4a4-9ebd-4718-9c5f-8a7e3cfcc664`

As before, notice that the `--record-set-name` option is relative to the `zone-name`. Now when we visit `sfu.mentorme.dpsi.jp` we will get redirected to `www.sfu.ca`.
