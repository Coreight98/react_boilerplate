import { ReactNode, useLayoutEffect } from "react";
import { compile, serialize, stringify } from "stylis";
import domElements from "../utils";
interface Props {
  [key: typeof domElements[number] | string]: (
    strings: TemplateStringsArray,
    ...args: any[]
  ) => Function;
}
interface ChildrenProps {
  children: ReactNode;
}
const stylis = (tag: string, content: string) =>
  serialize(compile(`.${tag}{${content}}`), stringify);

const constructWithTag = (tag: string) => {
  const CustomTag = `${tag}` as keyof JSX.IntrinsicElements;
  const construct =
    (strings: TemplateStringsArray, ...args: any[]): Function =>
    (props: ChildrenProps) => {
      useLayoutEffect(() => {
        const css = strings
          .map((string, i) => {
            let arg = args[i] ?? "";
            if (arg instanceof Function) {
              console.log(arg, props);
              arg = arg(props);
            }
            return `${string}${arg}`;
          })
          .join("");
        const classString = stylis(tag, css);
        const $style = document.createElement("style");
        $style.innerHTML = classString;
        document.querySelector("head")?.appendChild($style);
        return () => {
          $style.remove();
        };
      }, []);
      return <CustomTag {...props}>{props.children}</CustomTag>;
    };

  return construct;
};
const styled = domElements.reduce((tagObject: Props, tag) => {
  tagObject[tag] = constructWithTag(tag);
  return tagObject;
}, {});
export default styled;
