curl --request PUT \
  --url https://api.spotify.com/v1/me/player/play\?device_id\=249a1809f730284c221cf66639e8b2e6e6c0c1d1 \
  --header 'Authorization: Bearer BQBoUZXq24qQ25iJGs0FPxzE4qZ6eNVmwpI-umV7r0kuZPLNEjnn_Xyvv02hqmcDsscO5kK3OIKnhNLvP1TfRU6fT1B3a0RKktP2jJFMBVY4Vv6o6KMN6gfHEzZETyq_9zY_KVsPuO_NqLR9oltejCMlKWbTSidO1s63Xgw-avc2eO_fdzHXtMGDpk3Ydh8Uco2RyEjOoGBXqMAPUetgQf8AEk_ZZq-VbT64YUh2eR5S3J-6lsqw' \
  --header 'Content-Type: application/json' \
  --data '{
    "context_uri": "spotify:playlist:1Z9zjrl4VuAiaQGrh2hYbN",
    "offset": {
        "position": 10
    },
    "position_ms": 0
}'
