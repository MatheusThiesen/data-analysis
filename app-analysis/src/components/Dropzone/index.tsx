import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { DropContainer } from "./styles";

interface IHeaderProps {
  onFileUploaded: (file: File) => void;
}

export const Dropzone: React.FC<IHeaderProps> = ({ onFileUploaded }) => {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles.forEach((element: File) => {
        onFileUploaded(element);
      });
    },
    [onFileUploaded]
  );
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "text/csv": [".csv"],
      },
    });

  function rederDragMessage() {
    if (!isDragActive) return "Arraste os arquivos aqui...";

    if (isDragReject) return "Arquivo não suportado";

    return "Solte os arquivos aqui";
  }

  function styleBorder() {
    if (!isDragActive) return {};

    if (isDragReject) return { borderColor: "#cf1717" };

    return { borderColor: "#20c71a" };
  }

  return (
    <DropContainer style={styleBorder()} {...getRootProps()}>
      <input {...getInputProps()} accept={".csv"} />
      <span>{rederDragMessage()}</span>
    </DropContainer>
  );
};
