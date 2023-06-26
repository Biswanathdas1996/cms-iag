import React from "react";
import { get, post } from "../helper/apiHelper";
import swal from "sweetalert";

function Home() {
  const handleFileUpload = async () => {
    const fileInput = document.getElementById("fileInput");
    const formdata = new FormData();
    formdata.append("file", fileInput.files[0]);
    try {
      const response = await post("/api/upload-csv", formdata);
      console.log("response======>", response);
      swal("Uploaded!", "Uploaded successfully!", "success");
    } catch (error) {
      console.log("error======>", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "30vh",
        alignItems: "center",
      }}
    >
      <input
        type="file"
        id="fileInput"
        style={{
          padding: 6,
          width: "30rem",
          border: "1px solid",
        }}
      />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
}

export default Home;
