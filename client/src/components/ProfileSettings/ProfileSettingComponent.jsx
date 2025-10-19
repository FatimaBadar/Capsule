import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
const API_URL = "http://localhost:3000/api/auth";

export default function ProfileSettingsComponent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImg, setProfileImg] = useState(
    "https://via.placeholder.com/110"
  );
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState("");
  const [isNameChange, setIsNameChange] = useState(false);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [isPasswordChange, setIsPasswordChange] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const fetchUserDetails = async () => {
      try {
        setLoader(true);
        console.log("Fetching user details");
        const response = await axios.get(`${API_URL}/user-details`);
        if (response.data.statusCode === 200) {
          console.log("Response:", response);
          setName(response.data.user.username);
          setEmail(response.data.user.email);
          setLoader(false);
          setProfileImg(response.data.user.profileImg);
        }
      } catch (err) {
        showMessage("Failed to fetch user details. Please try again.", "error");
      }
    };

    fetchUserDetails();
  }, [user, navigate]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfileImg(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const changeName = () => {
    if(isNameChange) {
      setIsNameChange(false);
      return;
    }
    else {
    setIsNameChange(true);
  }
  };

  const changeEmail = () => {
    if(isEmailChange) {
      setIsEmailChange(false);
      return;
    }
    else {
      setIsEmailChange(true);
    }
  };

  const changePassword = () => {
    if(isPasswordChange) {
      setIsPasswordChange(false);
      return;
    }
    else {
      setIsPasswordChange(true);
    }
  };

  const showMessage = (text) => {
    setMessage("✅ " + text);
    setTimeout(() => setMessage(""), 2500);
  };

  const updateValues = async (e) => {
    e.preventDefault();
    setIsNameChange(false);
    setIsEmailChange(false);
    setIsPasswordChange(false);

    // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      console.log("Updating user details");
      const response = await axios.put(`${API_URL}/update-user-details`, { username: name, email: email, password: password });
      if (response.data.statusCode === 200) {
        showMessage("Values updated successfully!");
        navigate("/account/dashboard");
      } else {
        showMessage("Failed to update values. Please try again.");
      }
    } catch (err) {
      showMessage("Failed to update values. Please try again.");
    }
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
          {!isNameChange ? (
          <button className="btn" onClick={changeName}>
            Change Name
          </button>
          ) : (
            <div>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="btn" onClick={updateValues}>
                Update Name
              </button>
              <button className="btn m-2" onClick={changeName}>Cancel</button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="profile-section">
          <div className="label">Email</div>
          <div className="value">{email}</div>
          {!isEmailChange ? (
            <button className="btn" onClick={changeEmail}>
              Change Email
            </button>
          ) : (
            <div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button className="btn" onClick={updateValues}>
                Update Email
              </button>
              <button className="btn m-2" onClick={changeEmail}>Cancel</button>
            </div>
          )}
        </div>

        {/* Password */}
        <div className="profile-section">
          <div className="label">Password</div>
          <div className="value">{password? password : "********" }</div>
          {/* <div className="value">********</div> */}
          {!isPasswordChange ? (
            <button className="btn" onClick={changePassword}>
              Change Password
            </button>
          ) : (
            <div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button className="btn" onClick={updateValues}>
                Update Password
              </button>
              <button className="btn m-2" onClick={changePassword}>Cancel</button>
            </div>
          )}
        </div>

        {/* Delete Account */}
        {/* <div className="profile-section">
          <div className="label danger">Danger Zone</div>
          {isDeleteAccount ? (
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete Account
            </button>
          ) : (
            <div>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Confirm Delete
              </button>
              <button className="btn btn-danger m-2" onClick={confirmDelete}>Cancel</button>
            </div>
          )}
        
        </div> */}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}
