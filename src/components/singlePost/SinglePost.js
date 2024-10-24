import axios from "axios";
import { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import JoditEditor from "jodit-react";
import DOMPurify from 'dompurify';
import "./singlepost.css";

export default function SinglePost() {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const [post, setPost] = useState({});
  const { user } = useContext(Context);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const editor = useRef(null);

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

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await axios.get("/posts/" + path);
        console.log("Post data received:", res.data);
        setPost(res.data);
        setTitle(res.data.title);
        setDesc(res.data.desc);
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    getPost();
  }, [path]);

  // Handle file selection and preview
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFile(selectedFile);
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(newPreviewUrl);
      setImageError(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await axios.post("/api/upload", formData);
      console.log("Upload response:", res.data);
      return res.data.url;
    } catch (err) {
      console.error("Error uploading image:", err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${post._id}`, {
        data: { username: user.username },
      });
      window.location.replace("/");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      let updatedPost = {
        username: user.username,
        title,
        desc,
      };

      if (file) {
        const imageUrl = await uploadImage(file);
        console.log("New image URL:", imageUrl);
        updatedPost.photo = imageUrl;
      }

      const updateResponse = await axios.put(`/posts/${post._id}`, updatedPost);
      console.log("Update response:", updateResponse.data);
      
      setUpdateMode(false);
      // Refresh the post data
      const res = await axios.get("/posts/" + path);
      setPost(res.data);
      setFile(null);
      // Clean up preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleImageError = () => {
    console.log("Image failed to load:", post.photo);
    setImageError(true);
  };

  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {updateMode ? (
          <div className="imageUploadContainer">
            {(previewUrl || post.photo) && (
              <img 
                src={previewUrl || post.photo} 
                alt={previewUrl ? "Preview" : "Current"}
                className="singlePostImg"
                onError={handleImageError}
              />
            )}
            
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={handleFileSelect}
              className="imageUploadInput"
            />
            {uploading && <span className="uploadingMessage">Uploading...</span>}
          </div>
        ) : (
          post.photo && !imageError && (
            <div className="imageContainer">
              <img 
                src={post.photo} 
                alt="Post" 
                className="singlePostImg"
                onError={handleImageError}
              />
            </div>
          )
        )}
        
        {imageError && (
          <div className="imageError">
            Failed to load image. URL: {post.photo}
          </div>
        )}

        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon far fa-edit"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon far fa-trash-alt"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}

        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.username}`} className="link">
              <b> {post.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>

        {updateMode ? (
          <div className="editorContainer">
            <JoditEditor
              ref={editor}
              value={desc}
              config={config}
              tabIndex={1}
              onBlur={newContent => setDesc(newContent)}
            />
          </div>
        ) : (
          <div
            className="singlePostDesc"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }}
          />
        )}

        {updateMode && (
          <button 
            className="singlePostButton" 
            onClick={handleUpdate}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Update"}
          </button>
        )}
      </div>
    </div>
  );
}