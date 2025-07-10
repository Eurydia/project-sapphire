import { Global, Module } from "@nestjs/common";

export interface CredentialConfig {
  extId: string;
  token: string;
  cToken: string;
}

@Global()
@Module({})
export class NlCredentialModuleModule {
  static forRoot(config: CredentialConfig) {
    return {
      module: NlCredentialModuleModule,
      providers: [
        { provide: "EXT_ID", useValue: config.extId },
        { provide: "TOKEN", useValue: config.token },
        { provide: "CONN_TOKEN", useValue: config.cToken },
      ],
      exports: ["EXT_ID", "TOKEN", "CONN_TOKEN"],
    };
  }
}
