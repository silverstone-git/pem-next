import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sepFiles = async (htmlString: string) => {
  // seperates blog string by files
  var res = "";
  var i = 0;
  const htmlSectionsSeppedByFiles: string[] = [];
  while (i < htmlString.length - 1) {
    if (
      htmlString[i] == "!" &&
      htmlString[i + 1] == "[" &&
      htmlString[i + 2] == "["
    ) {
      htmlSectionsSeppedByFiles.push(res);
      res = "";
      var filename = "";
      while (
        !(htmlString[i] === "]" && htmlString[i + 1] === "]") &&
        i < htmlString.length - 2
      ) {
        filename = filename + htmlString[i];
        i++;
      }

      const placeholderText = `<div data-filename="${filename.slice(3)}"></div>`;
      htmlSectionsSeppedByFiles.push(placeholderText);
      i++;
    } else {
      res += htmlString[i];
    }
    i++;
  }
  htmlSectionsSeppedByFiles.push(res);
  return htmlSectionsSeppedByFiles;
};




