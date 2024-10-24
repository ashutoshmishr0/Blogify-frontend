import "./settings.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import axios from "axios";

export default function Settings() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { user, dispatch } = useContext(Context);

  // Helper function to get the appropriate profile image URL
  const getProfileImageUrl = () => {
    if (file) {
      return URL.createObjectURL(file);
    }
    // Use secure URL if available, otherwise fallback to regular URL
    if (user.secure_profilePic) {
      return user.secure_profilePic;
    }
    if (user.profilePic) {
      return user.profilePic;
    }
    // Return a default avatar if no profile picture is set
    return "https://res.cloudinary.com/your-cloud-name/image/upload/v1/profile_photos/default-avatar.png";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    dispatch({ type: "UPDATE_START" });

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      
      if (username) formData.append("username", username);
      if (email) formData.append("email", email);
      if (password) formData.append("password", password);
      
      // If there's a new file, append it to formData
      if (file) {
        formData.append("profilePic", file);
      }

      const res = await axios.put("/users/" + user._id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(true);
      setUploading(false);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });

      // Clear form after successful update
      setUsername("");
      setEmail("");
      setPassword("");
      setFile(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      console.error("Error updating profile:", err);
      setUploading(false);
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };

  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle">Delete Account</span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              src={getProfileImageUrl()}
              alt="Profile"
              className="profileImage"
            />
            <label htmlFor="fileInput" className="uploadLabel">
              <i className="settingsPPIcon far fa-user-circle"></i>
              <span className="uploadText">Change Profile Picture</span>
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile && selectedFile.type.startsWith('image/')) {
                  setFile(selectedFile);
                } else {
                  alert("Please select an image file");
                }
              }}
            />
          </div>
          
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
          
          <button 
            className="settingsSubmit" 
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Updating..." : "Update"}
          </button>
          
          {success && (
            <span
              style={{ color: "green", textAlign: "center", marginTop: "20px" }}
            >
              Profile has been updated successfully!
            </span>
          )}
        </form>
      </div>
      <Sidebar />
    </div>
  );
}