import { ActionResult, StopActionParser } from "./llm-process";

// todo: factory with list of actions

export const stringActionParser: StopActionParser = (multilineString: string) => {
  const regex = /\*ACTION:\s+(SEARCH|ANSWER)\s+"?([^"\n]+)("|\n)/gm;

  let match = regex.exec(multilineString);
  const result: ActionResult[] = [];
  while (match !== null) {
    result.push({
      action: match[1],
      param: match[2]
    });
    match = regex.exec(multilineString);
  }
  return result[0];
}