import { applyDecorators, UseGuards, UseInterceptors } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets";
import { NlWsAuthGuard } from "src/nl-ws-auth/nl-ws-auth.guard";
import { WrappedWsInterceptor } from "src/wrapped-ws-interceptor/wrapped-ws.interceptor";

export const SecureGateway = <T extends Record<string, any>>(
  port?: number,
  options?: T,
) => {
  return applyDecorators(
    WebSocketGateway(port, options),
    UseGuards(NlWsAuthGuard),
    UseInterceptors(WrappedWsInterceptor),
  );
};
