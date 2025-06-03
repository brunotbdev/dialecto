import { z } from "zod/v4";

export type Config = {
  /**
   * All available languages.
   *
   * Each key must be a valid BCP 47 language tag in lowercase.
   *
   * You can use objects or import JSON files.
   *
   * @example {
   *    ptbr: { text: "text pt-br" },
   *    enus: { text: "text en-us" }
   * }
   */
  languages: Record<string, Record<string, string>>;
  /**
   * The default language to use when no language is selected.
   *
   * The value needs to be the name of the object in 'languages'.
   */
  defaultLanguage: string;
  /**
   * Whether to detect the browser's language on first load.
   *
   * Defaults to true.
   */
  browserLanguage?: boolean;
  /**
   * Whether to persist the selected language using localStorage.
   *
   * If true, the selected language is saved and reused on future visits.
   *
   * Defaults to true.
   */
  localStorage?: boolean;
  /**
   * List of additional allowed HTML tags.
   *
   * @example ["img","p"]
   */
  allowedTags?: string[];
  /**
   * Custom mapping for HTML attributes to React props.
   *
   * @example {
   *    classname: "className",
   *    for: "htmlFor"
   * }
   */
  attributeMap?: Record<string, string>;
  /**
   * If true, all HTML tags will be allowed.
   *
   * Defaults to false.
   */
  allowAllTags?: boolean;
  /**
   * If true, all HTML tags will be disabled.
   *
   * Defaults to false.
   */
  disableAllTags?: boolean;
  /**
   * If true all HTML attributes will be disabled.
   *
   * Defaults to false.
   */
  disableAllAttributes?: boolean;
};

export const configSchema: z.ZodType<Config> = z.object({
  languages: z.record(z.string(), z.record(z.string(), z.string())),
  defaultLanguage: z.string(),
  browserLanguage: z.optional(z.boolean()),
  localStorage: z.optional(z.boolean()),
  allowedTags: z.optional(z.array(z.string())),
  attributeMap: z.optional(z.record(z.string(), z.string())),
  allowAllTags: z.optional(z.boolean()),
  disableAllTags: z.optional(z.boolean()),
  disableAllAttributes: z.optional(z.boolean()),
});

export const defaultConfig: Config = {
  languages: {},
  defaultLanguage: "",
  browserLanguage: true,
  localStorage: true,
  allowedTags: [],
  attributeMap: {},
  allowAllTags: false,
  disableAllTags: false,
  disableAllAttributes: false,
};

export const defaultAllowedTags: string[] = [
  "a",
  "abbr",
  "b",
  "br",
  "code",
  "del",
  "dfn",
  "em",
  "i",
  "ins",
  "kbd",
  "mark",
  "q",
  "s",
  "small",
  "span",
  "strong",
  "sub",
  "sup",
  "time",
  "u",
  "var",
  "wbr",
];

export const defaultAttributeMap: Record<string, string> = {
  classname: "className",
  id: "id",
  style: "style",
  title: "title",
  href: "href",
  target: "target",
  rel: "rel",
};
