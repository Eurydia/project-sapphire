import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class NlWsAuthGuard implements CanActivate {
  constructor(
    @Inject("EXT_ID") private readonly extId: string,
    @Inject("CONN_TOKEN") private readonly connToken: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<Socket>();
    const { extensionId, connectToken } = client.handshake.query as Record<
      string,
      string
    >;

    if (extensionId !== this.extId) {
      throw new WsException("Invalid extensionId");
    }
    if (connectToken !== this.connToken) {
      throw new WsException("Invalid connectToken");
    }
    return true;
  }
}
