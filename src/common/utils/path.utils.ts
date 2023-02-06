import {stringUtils} from "../utils";

export const templateToPath = (template: string, variables: Record<string, string | number>) => {
  const result = [];

  const normalisedVariables: Record<string, string | number> = {};

  for (const [key, value] of Object.entries(variables)) {
    normalisedVariables[stringUtils.normalize(key)] = value;
  }

  for (const pathPart of template.split("/")) {
    const normalisedPathPart = stringUtils.normalize(
      pathPart
        .replace(/^:/, "")
        .replace(/\?$/, ""),
    );

    result.push(
      normalisedVariables.hasOwnProperty(normalisedPathPart) ? normalisedVariables[normalisedPathPart] : pathPart,
    );
  }

  const resultingPath = result
    .filter(path => stringUtils.normalize(path) !== "")
    .join("/");

  return resultingPath.startsWith("/") ? resultingPath : "/" + resultingPath;
}
