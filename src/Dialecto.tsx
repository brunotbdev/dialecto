import {
  useContext,
  createContext,
  useState,
  createElement,
  ReactNode,
} from "react";
import {
  defaultConfig,
  defaultAttributeMap,
  defaultAllowedTags,
  configSchema,
} from "./configs.js";
import type { Config } from "./configs.js";

interface DialectoContextType {
  d: (path: string, vars?: Record<string, Record<string, string>>) => ReactNode;
  changeLang: (langCode: string) => void;
}

interface DialectoProps {
  children: ReactNode;
}

const DialectoContext = createContext<DialectoContextType | null>(null);

const config: Config = { ...defaultConfig };

/**
 * Set user configurations for Dialecto.
 *
 * @param userConfig - Object with user configurations.
 *
 * @see https://github.com/brunotbdev/dialecto?tab=readme-ov-file#-importing-and-configuration
 */
function dialectoConfig(userConfig: Config) {
  Object.assign(config, configSchema.parse(userConfig));
}

/**
 * Provider that enables translation in child components.
 *
 * Wrap your application with this component to use Dialecto.
 *
 * @see https://github.com/brunotbdev/dialecto?tab=readme-ov-file#-importing-and-configuration
 *
 * @example
 *
 * import { Dialecto } from "dialecto";
 *
 * <Dialecto>
 *   <App />
 * </Dialecto>
 */
const Dialecto = ({ children }: DialectoProps) => {
  function getLanguage(): Record<string, string> {
    const langBrowser = config.browserLanguage
      ? navigator.language.toLowerCase().split("-").join("")
      : null;
    const langStorage = config.localStorage
      ? localStorage.getItem("lang")
      : null;

    if (config.localStorage && localStorage.getItem("lang") === null) {
      localStorage.setItem("lang", langBrowser || config.defaultLanguage);
    }

    return (
      config.languages[langStorage ?? ""] ??
      config.languages[langBrowser ?? ""] ??
      config.languages[config.defaultLanguage]
    );
  }

  const [lang, setLang] = useState<Record<string, string>>(getLanguage());

  /**
   * Translate a string using the given path.
   * Support HTML tags and variables.
   *
   * @param path - Path to locate translation key.
   * @param vars - Optional variables.
   *
   * @see https://github.com/brunotbdev/dialecto?tab=readme-ov-file#-usage
   *
   * @example
   * <h1>{d("text", { count })}</h1>
   */
  function d(
    path: string,
    vars?: Record<string, Record<string, string>>
  ): ReactNode[] {
    const text = path.split(".").reduce((acc: any, key) => {
      return acc?.[key];
    }, lang) as string;

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    function convert(node: ChildNode, key: number | string): ReactNode {
      if (node.nodeType === Node.TEXT_NODE) {
        if (vars) {
          const keys = Object.keys(vars);
          const values = Object.values(vars);
          return new Function(...keys, `return \`${node.textContent}\`;`)(
            ...values
          );
        }

        return node.textContent;
      }

      const element = node as Element;
      const tag = element.tagName.toLowerCase();

      if (!config.allowAllTags) {
        if (
          (!config.allowedTags?.includes(tag) &&
            !defaultAllowedTags.includes(tag)) ||
          config.disableAllTags
        ) {
          return Array.from(node.childNodes).map((child, i) =>
            convert(child, `${key}-${i}`)
          );
        }
      }

      const childrenNodes = Array.from(node.childNodes).map((child, i) =>
        convert(child, `${key}-${i}`)
      );

      const props: Record<string, any> = { key };

      if (!config.disableAllAttributes) {
        for (const attr of element.attributes) {
          const attrName = attr.name.toLowerCase();
          const mappedName =
            (config.attributeMap && config.attributeMap[attrName]) ||
            defaultAttributeMap[attrName] ||
            attrName;

          if (
            (config.attributeMap &&
              Object.keys(config.attributeMap).includes(attrName)) ||
            Object.keys(defaultAttributeMap).includes(attrName)
          ) {
            props[mappedName] = attr.value;
          }
        }
      }

      return createElement(tag, props, ...childrenNodes);
    }

    return Array.from(doc.body.childNodes).map((node, i) => convert(node, i));
  }

  /**
   * Change the current language.
   *
   * @param langCode - The language code must match one from 'languages'.
   *
   * @see https://github.com/brunotbdev/dialecto?tab=readme-ov-file#-usage
   *
   * @example
   * <button onClick={() => changeLang("ptbr")}>Change Language</button>
   */
  function changeLang(langCode: string) {
    if (config.localStorage) {
      localStorage.setItem("lang", langCode);
    }
    setLang(config.languages[langCode]);
  }

  return (
    // @ts-ignore
    <DialectoContext.Provider value={{ d, changeLang }}>
      {children}
    </DialectoContext.Provider>
  );
};

/**
 * Hook to acess Dialecto functions.
 *
 * Must be used inside a <Dialecto> Provider.
 *
 * @see https://github.com/brunotbdev/dialecto?tab=readme-ov-file#-usage
 *
 * @example
 * import { useDialecto } from "dialecto";
 *
 * const { d, changeLang } = useDialecto();
 */
const useDialecto = (): DialectoContextType => {
  const context = useContext(DialectoContext);

  if (!context) {
    throw new Error("useDialecto must be used within a <Dialecto> Provider");
  }

  return context;
};

export { useDialecto, Dialecto, dialectoConfig };
