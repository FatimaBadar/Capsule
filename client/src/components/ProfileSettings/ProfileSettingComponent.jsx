import React, { useState } from "react";
import "./Profile.css";

export default function ProfileSettingsComponent() {
  const [name, setName] = useState("Abid Malik Sami");
  const [email, setEmail] = useState("abid@example.com");
  const [profileImg, setProfileImg] = useState("https://via.placeholder.com/110");
  const [message, setMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const changeName = () => {
    const newName = prompt("Enter your new name");
    if (newName && newName.trim() !== "") {
      setName(newName.trim());
      showMessage("Name updated successfully!");
    }
  };

  const updateEmail = () => {
    const newEmail = prompt("Enter your new email");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      alert("Please enter a valid email address.");
      return;
    }
    setEmail(newEmail);
    showMessage("Email updated successfully!");
  };

  const confirmDelete = () => {
    if (
      window.confirm(
        "⚠️ Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      alert("Your account has been deleted.");
    }
  };

  const showMessage = (text) => {
    setMessage("✅ " + text);
    setTimeout(() => setMessage(""), 2500);
  };

  return (
    <div className="profile-container">
  
      <div className="profile-content">
        {/* Profile Picture */}
        <div className="profile-section picture-section">
          <div className="label">Profile Picture</div>
          <div className="profile-picture">
            <img src={profileImg} alt="Profile" className="profile-img" />
            <div>
              <input
                type="file"
                accept="image/*"
                id="imageUpload"
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
              <button
                className="btn"
                onClick={() => document.getElementById("imageUpload").click()}
              >
                Change Picture
              </button>
            </div>
          </div>
        </div>

        {/* Name */}
        <div className="profile-section">
          <div className="label">Name</div>
          <div className="value">{name}</div>
          <button className="btn" onClick={changeName}>
            Change Name
          </button>
        </div>

        {/* Email */}
        <div className="profile-section">
          <div className="label">Email</div>
          <div className="value">{email}</div>
          <button className="btn" onClick={updateEmail}>
            Update Email
          </button>
        </div>

        {/* Password */}
        <div className="profile-section">
          <div className="label">Password</div>
          <div className="value">********</div>
          <button
            className="btn"
            onClick={() => {
              // TODO: Implement change password functionality
              alert('Change password functionality coming soon!');
            }}
          >
            Change Password
          </button>
        </div>

        {/* Delete Account */}
        <div className="profile-section">
          <div className="label danger">Danger Zone</div>
          <button className="btn btn-danger" onClick={confirmDelete}>
            Delete Account
          </button>
        </div>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}
