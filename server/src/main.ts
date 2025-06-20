import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const config = app.get(ConfigService);
  const host = config.get<string>("SERVER_HOST", "0.0.0.0");
  const port = config.get<string>("SERVER_PORT", "3000");

  await app.listen(port, host);
}
bootstrap();
