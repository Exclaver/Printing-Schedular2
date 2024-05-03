import React, { useState, useRef } from "react";
import axios from "axios";
import { Config } from "../config";
import { useNavigate } from "react-router-dom";
const styles = {
  uploadContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    // minHeight: "calc(100vh - 610px)",
    backgroundColor: "#121212",
    padding: "2rem 0",
  },
  uploadContent: {
    textAlign: "center",
    maxWidth: "500px",
    padding: "2rem",
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  },
  uploadHeading: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
    color: "white",
  },
  uploadDescription: {
    fontSize: "1.2rem",
    color: "#777",
    marginBottom: "2rem",
  },
  inputFileWrapper: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputFile: {
    display: "none",
  },
  inputFileButton: {
    display: "inline-block",
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  username: {
    margin: "1rem",
  },
  inputFileButtonText: {
    pointerEvents: "none",
  },
  selectedFile: {
    marginBottom: "1rem",
    color: "white",
  },
  errorText: {
    color: "red",
    marginTop: "1rem",
  },
  uploadButton: {
    display: "block",
    width: "100%",
    padding: "10px 20px",
    fontSize: "1.2rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  usernameWrapper: {
    marginBottom: "0.5rem", // Reduce bottom margin
  },
  usernameInput: {
    width: "100%",
    padding: "10px",
    fontSize: "1.2rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    transition: "border-color 0.3s ease",
    marginTop: "0.5rem", // Reduce top margin
  },
};
const Upload = () => {
  const history = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const inputFileRef = useRef(null);
  const [username, setUsername] = useState("");
  const [PrintType, setPrintType] = useState("");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.size <= 100 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      setUploadError("All files must be less than 100MB");
    } else {
      setSelectedFiles(validFiles);
      setUploadError(null);
    }
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0 && username) {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`file${index + 1}`, file);
      });
      formData.append("username", username);
      formData.append("PrintType", PrintType);
      axios
        .post(`${Config.API_URL}/upload`, formData)
        .then((response) => {
          // Assuming your API returns an array of fileIds
          const fileIds = response.data.fileIds;

          // Navigate to the view/fileId page for the first file
          history(`/view/${fileIds[0]}`);
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          setUploadError("Upload failed. Please try again.");
        });
    }
  };

  const handleChooseFileClick = () => {
    inputFileRef.current.click();
  };

  return (
    <div style={styles.uploadContainer}>
      <div style={styles.uploadContent}>
        <h1 style={styles.uploadHeading}>Upload Your Files</h1>
        <p style={styles.uploadDescription}>
          Select files to upload (each less than 100MB).
        </p>

        <div style={styles.uploadContainer}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.usernameInput}
          />
        </div>
        <div style={styles.uploadContainer}>
          <select
            value={PrintType}
            onChange={(e) => setPrintType(e.target.value)}
            style={styles.usernameInput}
          >
            <option value="Select Print Type">Select Print Type</option>
            <option value="Black and White (One Sided)">
              Black and White (One Sided)
            </option>
            <option value="Black and White (Both Sided)">
              Black and White (Both Sided)
            </option>
          </select>
        </div>
        <div style={styles.inputFileWrapper}>
          <input
            type="file"
            id="fileInput"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            ref={inputFileRef}
            style={styles.inputFile}
            multiple
          />
          <button
            type="button"
            style={styles.inputFileButton}
            onClick={handleChooseFileClick}
          >
            <span style={styles.inputFileButtonText}>Choose Files</span>
          </button>
        </div>
        {selectedFiles.map((file, index) => (
          <div key={index} style={styles.selectedFile}>
            Selected file: {file.name}
          </div>
        ))}
        {uploadError && <div style={styles.errorText}>{uploadError}</div>}
        <button
          type="button"
          style={styles.uploadButton}
          onClick={handleUpload}
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};
export default Upload;
