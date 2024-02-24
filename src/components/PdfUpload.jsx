import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";


const PdfUpload = ({onPdfChange, seleltedFile }) => {

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    onPdfChange(file)
  }, []);


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: [".pdf"], // Limit accepted file types to PDFs
  });

  return (
    <div className="grid grid-cols-2 py-4 px-4 ring-2 ring-accent-400">
      <div {...getRootProps()} className="flex items-center justify-center">
        <input {...getInputProps()} />
        <p className="text-center text-xs">
          NewChat
        </p>
      </div>
      {seleltedFile ? (
        <div className="mx-auto">
          <p className="mx-auto">{seleltedFile.name}</p>
        </div>
      ) : (
        <p className="mx-auto">----</p>
      )}
    </div>
  );
};

export default PdfUpload;
