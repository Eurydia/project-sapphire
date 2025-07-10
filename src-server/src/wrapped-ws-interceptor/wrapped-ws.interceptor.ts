import { v4 as uuidv4 } from "uuid";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { WsException, WsResponse } from "@nestjs/websockets";
import { map, Observable } from "rxjs";

@Injectable()
export class WrappedWsInterceptor implements NestInterceptor {
  constructor(@Inject("TOKEN") private readonly accessToken: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== "ws") {
      throw new WsException(
        "WrapWsResponseInterceptor can only be used for WebSocket handlers",
      );
    }
    return next.handle().pipe(
      map((response: WsResponse<any>) => ({
        uuid: uuidv4,
        accessToken: this.accessToken,
        method: "app.broadcast",
        data: response,
      })),
    );
  }
}
