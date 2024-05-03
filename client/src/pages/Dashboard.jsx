import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa"; // Import the eye icon
import { Config } from "../config";

const ITEMS_PER_PAGE = 2; // Number of items per page
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
  },
  card: {
    padding: "2rem",
    borderRadius: "10px",
    backgroundColor: "#1e1e1e",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    color: "white",
    width: "80%",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
  },
  actionButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  pagination: {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "center",
  },
  paginationButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "0 0.5rem",
  },
};
const Dashboard = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const history = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      return result;
    }, {});
  };

  const fetchData = useCallback(
    async (page) => {
      try {
        const response = await axios.post(
          `${Config.API_URL}/dashboard?page=${page}`,
          {
            username,
            password,
          }
        );
        setMediaFiles(groupBy(response.data.mediaFiles, "username"));
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    [username, password]
  );

  useEffect(() => {
    if (!username || !password) {
      history("/adminpanel/login");
    } else {
      fetchData(currentPage);
    }
  }, [currentPage, history, username, password, fetchData]);

  const handleViewFile = (file) => {
    window.open(`/view/${file._id}`, "_blank");
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchData(newPage);
  };

  const handleCheckboxChange = (file) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(file._id)) {
        return prevSelectedFiles.filter(
          (selectedFile) => selectedFile !== file._id
        );
      } else {
        return [...prevSelectedFiles, file._id];
      }
    });
  };

  const handleDelete = async () => {
    try {
      await axios.post(`${Config.API_URL}/delete`, {
        filesToDelete: selectedFiles,
      });
      // After successful deletion, fetch data again
      fetchData(currentPage);
      // Clear selectedFiles state
      setSelectedFiles([]);
    } catch (error) {
      console.error("Error deleting files:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Dashboard</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}> Print Type</th>
              <th style={styles.th}>Filename</th>
              <th style={styles.th}>Filesize</th>
              <th style={styles.th}>Actions</th>
              <th style={styles.th}>Delete</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(mediaFiles).map(([username, files]) => (
              <React.Fragment key={username}>
                {files.map((file, index) => (
                  <tr key={file._id}>
                    {index === 0 && (
                      <td rowSpan={files.length} style={styles.td}>
                        {username}{" "}
                      </td>
                    )}
                    <td style={styles.td}> {file.PrintType}</td>
                    <td style={styles.td}>{file.filename}</td>
                    <td style={styles.td}>{file.filesize}</td>
                    <td>
                      <button
                        style={styles.actionButton}
                        onClick={() => handleViewFile(file)}
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="ui-checkbox"
                        checked={selectedFiles.includes(file._id)}
                        onChange={() => handleCheckboxChange(file)}
                      />
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div style={{ ...styles.pagination, textAlign: "right" }}>
          <button
            className=""
            style={styles.paginationButton}
            onClick={handleDelete}
          >
            Delete Selected
          </button>
        </div>
        <div style={styles.pagination}>
          {currentPage > 1 && (
            <button
              style={styles.paginationButton}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          )}
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              style={{
                ...styles.paginationButton,
                backgroundColor:
                  index + 1 === currentPage ? "#007bff" : "#343a40",
              }}
            >
              {index + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              style={styles.paginationButton}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
