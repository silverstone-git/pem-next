import { ExcalidrawPreview } from "./excalidraw-preview";
import { JupyterPreview } from "./jupyter-preview";

const FilePreview = (props: {filename: string}) => {
  const extension = props.filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'excalidraw':
      return <ExcalidrawPreview filename={props.filename} />;
    case 'html':
      return <JupyterPreview filename={props.filename} />;
    default:
      return <span className="text-red-500">Unsupported file type: {props.filename}</span>;
  }
};
