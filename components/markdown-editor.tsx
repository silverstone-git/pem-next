import React, { useEffect, useRef, useState } from 'react';
import EasyMDE from 'easymde';
import 'easymde/dist/easymde.min.css';

const MarkdownEditor = (props: {className?: string, markdownText: string, onChange: any}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const easyMDERef = useRef<EasyMDE>();


  useEffect(() => {

    if(!easyMDERef.current?.value()) {
      easyMDERef.current = new EasyMDE({
        element: editorRef.current ?? undefined,
        initialValue: props.markdownText,
        autoDownloadFontAwesome: true,
        indentWithTabs: false,
      });


    }
      easyMDERef.current.codemirror.on('change', () => {
        const curVal = easyMDERef?.current?.value();
        if(curVal) {
          props.onChange(curVal);
        }
      });

  }, [props.markdownText, props.onChange]);

  return <textarea className={props.className + ''} ref={editorRef} />;
};

export default MarkdownEditor;

