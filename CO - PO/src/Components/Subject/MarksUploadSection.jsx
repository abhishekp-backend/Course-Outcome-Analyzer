import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadExcel } from "../../store/slices/studentSlice";
import { useParams } from "react-router-dom";

export default function MarksUploadSection({ subjectId }) {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { id } = useParams();

  const fileRef = useRef();

  const validateClientSide = (f) => {
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
    ];

    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(f.type)) {
      alert("Invalid file type. Only Excel/CSV files are allowed.");
      return false;
    }

    if (f.size > maxSize) {
      alert("File too large. Maximum size is 10MB.");
      return false;
    }

    return true;
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const droppedFile = e.dataTransfer?.files?.[0];

    if (droppedFile && validateClientSide(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const upload = async () => {
    if (!file) return;
    
    try {
        await dispatch(
            uploadExcel({
                file,
                classId: id,
            }),
        ).unwrap();
        console.log("Uploading file!")

      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="mb-6 flex w-full h-full"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {dragActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none">
          <p className="text-white text-xl font-semibold animate-pulse">
            Drop Excel file here
          </p>
        </div>
      )}

      <div
        className={`border-2 flex flex-col border-dashed w-full rounded-lg p-6 transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="flex gap-4">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 mx-auto py-2 outline-none bg-gray-300 hover:bg-gray-400 text-white rounded"
          >
            Choose File
          </button>

          {file && (
            <span className="text-gray-700 mx-auto font-medium">
              {file.name}
            </span>
          )}

          {file && (
            <button
              onClick={upload}
              className="px-4 py-2 bg-green-600 mx-auto text-white rounded hover:bg-green-700"
            >
              Upload Marks
            </button>
          )}
        </div>

        <p className="mt-3 text-sm text-gray-500 mx-auto">
          Drag & drop an Excel/CSV file here or click "Choose File"
        </p>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0];

          if (!selectedFile) return;

          if (validateClientSide(selectedFile)) {
            setFile(selectedFile);
          }
        }}
      />
    </div>
  );
}
