import { createElement, forwardRef, ReactNode, useEffect, useLayoutEffect, useRef } from "react";
import { compile, serialize, stringify } from "stylis";
import domElements from "../utils";

type ElementProps<Tag> = Tag extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[Tag] : any;

interface Props {
  [key: typeof domElements[number] | string]: (strings: TemplateStringsArray, ...args: any[]) => Function;
}

interface ChildrenProps {
  children: ReactNode;
  style: string[];
}
const changeCamel = (snake: string) => snake.replace(/-(\w)/g, (_, i) => i.toUpperCase());

const parsingStyle = (css: string) =>
  Object.fromEntries(
    css.split(";").reduce((result: any, element: string) => {
      const style = element.split(":").map((v: string) => v.trim());
      result.push([changeCamel(style[0]), style[1]]);
      return result;
    }, [])
  );

const constructWithTag = (tag: string) => {
  const CustomTag = `${tag}` as keyof JSX.IntrinsicElements;
  const construct =
    (strings: TemplateStringsArray, ...args: any[]): Function =>
    (props: ChildrenProps) => {
      const elementRef = useRef(null);

      const style = args.reduce((result, expr, index) => {
        const isFunc = typeof expr === "function";
        const value = isFunc ? expr(props) : expr;
        return result + value + strings[index + 1];
      }, strings[0]);

      const elementProps: ElementProps<typeof tag> = {
        ...props,
        style: {
          ...parsingStyle(style),
          ...props.style,
        },
        ref: elementRef,
      };

      return createElement(CustomTag, elementProps, props.children);
    };

  return construct;
};
const styled = domElements.reduce((tagObject: Props, tag) => {
  tagObject[tag] = constructWithTag(tag);
  return tagObject;
}, {});

export default styled;
