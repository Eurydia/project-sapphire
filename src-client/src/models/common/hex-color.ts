const HEX_COLOR_REGEX = /#[0-9a-f]{6}/imsu
export const isHexColor = (arg: string) => HEX_COLOR_REGEX.test(arg)
