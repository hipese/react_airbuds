import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Reactquill({ id, value, setValue, isDisabled }) {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }, { 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'align',
    'color',
    'background',
  ];

  return (
    <div>
      <ReactQuill
        id={id}
        theme="snow"
        modules={modules}
        formats={formats}
        value={value || ''}
        onChange={(contents) => setValue(contents)}
        style={{ height: "325px", width: "100%" }}
        readOnly={isDisabled}
      />
    </div>
  );
}

export default Reactquill;