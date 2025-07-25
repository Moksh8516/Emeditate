"use client";
import { API_URL } from "@/lib/config";
import React from "react";
import { BsUpload } from "react-icons/bs";

function FileUpload() {
  const handleFileUploadComponent = async() => {
    const el = document.createElement("input");
    el.setAttribute("type", "file");
    el.setAttribute("accept", ".pdf");

    el.addEventListener("change", async() => {
      if (el.files && el.files.length > 0) {
        const file = el.files.item(0);
        if(file){
          const formData = new FormData();
          formData.append("pdf", file); 
          await fetch(`${API_URL}/upload`,{
            method: "POST",
            body:formData
          }
          )
          console.log("file uploaded")        }
      }
    });
    el.click();
  };

  return (
    <div className="bg-slate-500 text-white shadow-2xl items-center align-middle rounded-lg p-4">
      <div className="flex flex-col items-center justify-center">
        <div
          className="flex flex-col items-center justify-center gap-2 cursor-pointer"
          onClick={handleFileUploadComponent}
        >
          <h1 className="text-2xl font-semibold mb-2">Upload your file</h1>
          <BsUpload className="text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
