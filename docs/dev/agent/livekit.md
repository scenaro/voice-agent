# Livekit

## Questions ?

- Le front se connecte directement sur LIVEKIT_URL, est-ce utile pour le back ?
  - Il faut que le back monitore les conversations mais ça rajoutera de la latence de faire proxy par le back.

## Self-hosted

Default configuration for Livekit:

```bash
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_URL=http://127.0.0.1:7880
```
