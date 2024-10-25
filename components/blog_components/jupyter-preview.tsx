export const JupyterPreview = (props: {filename: string}) => (
  <div className="border rounded p-4 my-2 bg-blue-50">
    <p className="font-medium text-blue-700">Jupyter Notebook: {props.filename}</p>
    {/* Add your Jupyter notebook rendering logic here */}
  </div>
);

