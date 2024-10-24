import React, { useContext, useState, useRef } from "react";
import "./write.css";
import axios from "axios";
import { Context } from "../../context/Context";
import JoditEditor from "jodit-react";
import { useNavigate } from "react-router-dom";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user } = useContext(Context);
  const editor = useRef(null);
  const navigate = useNavigate();

  const config = {
    readonly: false,
    height: 400,
    uploader: {
      insertImageAsBase64URI: true
    },
    controls: {
      image: {
        uploader: {
          insertImageAsBase64URI: true
        }
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload only image files (JPG, PNG, or GIF)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("title", title);
      formData.append("desc", desc);
  
      if (file) {
        formData.append("file", file);
      }
  
      console.log("Sending post data with image...");
      const res = await axios.post("/posts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Post created successfully:", res.data);
      navigate(`/post/${res.data._id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      
      // Handle duplicate title error
      if (err.response?.data?.code === 11000) {
        setError("A post with this title already exists. Please choose a different title.");
      } else {
        setError(err.response?.data?.message || "Failed to publish post. Please try again.");
      }
      
      if (err.response) {
        console.error("Server response:", err.response.data);
        console.error("Status code:", err.response.status);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Error setting up request:", err.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="write">
      {file && (
        <div className="writeImgContainer">
          <img 
            className="writeImg" 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
          />
          <button 
            className="removeImg" 
            onClick={() => setFile(null)}
          >
            Remove
          </button>
        </div>
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fas fa-plus"></i>
          </label>
          <input
            type="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <JoditEditor
            ref={editor}
            value={desc}
            config={config}
            tabIndex={1}
            onBlur={newContent => setDesc(newContent)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button 
          className="writeSubmit" 
          type="submit"
          disabled={uploading}
        >
          {uploading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}