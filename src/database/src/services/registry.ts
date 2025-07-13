// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handler = (...args: any[]) => Promise<any>;
const HANDLER_REGISTRY = new Map<string, Handler>();

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
    const serviceName = className.replace(classNameRegex, "$1");
    const channel = `${serviceName}:${String(propertyKey)}`;

    HANDLER_REGISTRY.set(channel, descriptor.value);
  };
};

export const getRegisteredDatasourceServices = () => {
  return [...HANDLER_REGISTRY.entries()];
};

export const getRegisteredDatasourceServiceChannels = () => {
  return [...HANDLER_REGISTRY.keys()];
};
