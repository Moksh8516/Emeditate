"use client";
import React from "react";
import { BsUpload } from "react-icons/bs";

function FileUpload({ uploadhandler }: { uploadhandler: () => void }) {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-2xl items-center align-middle rounded-lg p-4">
      <div className="flex flex-col items-center justify-center">
        <div
          className="flex flex-col items-center justify-center gap-2 cursor-pointer"
          onClick={uploadhandler}
        >
          <h1 className="text-2xl font-semibold mb-2">Upload your file</h1>
          <BsUpload className="text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
