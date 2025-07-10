backlog;

- convert nest controllers into web socket
- implement initial handshake to bootstrap nestjs websocket

Response structure needs NL_TOKEN

```
{
  id: uuidv4,
  method: string,
  accessToken: NL_TOKEN,
  data: {
    event: string,
    data: any
  }
}
```
