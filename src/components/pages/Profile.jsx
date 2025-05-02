import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8081/profile", { withCredentials: true })
      .then((response) => {
        console.log("✅ Profile response:", response.data);
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ Error fetching profile:", error);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:8081/logout", {}, { withCredentials: true })
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">Please log in to view your profile.</div>;

  const totalTutorials = 14; // Adjust based on your database/tutorial count
  const completed = user.quizzesTaken || 0;
  const progressPercentage = totalTutorials > 0 ? (completed / totalTutorials) * 100 : 0;
  const averageScore = isNaN(user.averageScore) ? "0.0" : parseFloat(user.averageScore).toFixed(1);

  return (
    <div className="profile-container">
      <header className="header">
        <h1>Your Profile</h1>
        <p>Track your learning journey with LearnJS.</p>
      </header>

      <section className="profile-section user-info">
        <div className="avatar-placeholder"></div>
        <h2>Welcome, {user.name}</h2>
        <p className="email">{user.email}</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </section>

      <section className="profile-section progress">
        <h2>Tutorial Progress</h2>
        <div className="progress-circle">
          <svg className="progress-ring" width="120" height="120">
            <circle
              className="progress-ring__track"
              cx="60"
              cy="60"
              r="54"
              strokeWidth="12"
            />
            <circle
              className="progress-ring__fill"
              cx="60"
              cy="60"
              r="54"
              strokeWidth="12"
              strokeDasharray="339.292"
              strokeDashoffset={339.292 * (1 - progressPercentage / 100)}
            />
          </svg>
          <div className="progress-text">
            <span>{progressPercentage.toFixed(0)}%</span>
            <p>Completed</p>
          </div>
        </div>
        <p>{completed} of {totalTutorials} tutorials completed</p>
      </section>

      <section className="profile-section score">
        <h2>Average Quiz Score</h2>
        <div className="score-card">
          <span className="score-value">{averageScore}%</span>
          <p>Keep up the great work!</p>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 LearnJS. All rights reserved.</p>
      </footer>
    </div>
  );
};
