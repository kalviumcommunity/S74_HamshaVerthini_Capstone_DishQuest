import { useState } from "react";
import "./Auth.css"; // optional, for styling

const ProfileSetup = () => {
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile setup saved successfully!");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Complete Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Profile Picture URL</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div className="form-group">
              <label>Short Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself..."
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
