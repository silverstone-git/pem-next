import { Renderer } from "marked";

const renderer = new Renderer();

renderer.heading = ( text: string, level: number, raw: string) => {
  const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

  /*
    * 
    */
  return `
          <hr style="visibility: hidden" id="checkpoint-${escapedText}">
          <a class="anchor" href="#checkpoint-${escapedText}" >
          <h${level}>
            ${text}
          </h${level}>
            </span>
          </a>`
          ;
}

renderer.image = (href: string, title: string, text: string) => {
  if(text.toLowerCase().includes('video')) {
    // after video found, render video tag instead
    console.log("returning video");
    return `<video alt=${title} src=${href}></video>`
  } else {
    console.log("returning image");
    return `<img alt=${title} src=${href}></img>`
  }
}


// Override the link renderer
renderer.link = (href, title, text) => {
    // Check if it's our special file link format
    console.log("yo we got a lonk: ", href)
    const fileMatch = text.match(/^!\[\[(.*?)\]\]$/);
    
    if (fileMatch) {
      const filename = fileMatch[1];
      // Return a placeholder that we can replace with React components
      return `__FILE_PREVIEW_${filename}__`;
    }
    
    // Default link rendering
    return `<a href="${href}" title="${title || ''}">${text}</a>`;
};


export default renderer;
