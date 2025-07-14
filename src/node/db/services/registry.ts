// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (...args: any[]) => Promise<any>;
const REGISTRY = new Map<string, Map<string, Handler>>();

const classNameRegex = /^(.*?)(Service)$/;

export const DatasourceService = () => {
  return <T extends { constructor: { name: string } }>(
    target: T,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const className = target.constructor.name;
    if (!classNameRegex.test(className)) {
      return;
    }

    const provider = className.replace(classNameRegex, "$1");

    if (!REGISTRY.has(provider)) {
      REGISTRY.set(provider, new Map<string, Handler>());
    }

    REGISTRY.get(provider)!.set(String(propertyKey), descriptor.value);
  };
};

export const getRegisteredDatasourceServices = () => {
  return [...REGISTRY.entries()];
};

export const getRegisteredDatasourceServiceChannels = () => {
  return [...REGISTRY.keys()].map((provider) => ({
    provider,
    services: [...REGISTRY.get(provider)!.keys()],
  }));
};
