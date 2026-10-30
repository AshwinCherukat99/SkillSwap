import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./profile.css";
import { BACKEND_ORIGIN, API_BASE_URL } from "../../../config";

function Profile() {
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [skillsOffer, setSkillsOffer] = useState([]);
  const [skillsWant, setSkillsWant] = useState([]);

  const getMediaUrl = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `${BACKEND_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fetchProfile = async () => {
    if (!accessToken) {
      navigate("/login/");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.error || "Unable to load profile");
      }
      setProfile(data);
    } catch (err) {
      setError(err.message || "Unable to load your profile");
    }
  };

  const fetchSkills = async () => {
    if (!accessToken) return;
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      const [offerResponse, wantResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/skills/offer/`, { method: "GET", headers }),
        fetch(`${API_BASE_URL}/skills/want/`, { method: "GET", headers }),
      ]);
      const offerData = await offerResponse.json();
      const wantData = await wantResponse.json();

      if (offerResponse.ok) {
        setSkillsOffer(
          Array.isArray(offerData) ? offerData : offerData.results || []
        );
      }
      if (wantResponse.ok) {
        setSkillsWant(
          Array.isArray(wantData) ? wantData : wantData.results || []
        );
      }
    } catch (err) {
      setError((current) => current || err.message || "Unable to load skills");
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/login/");
      return;
    }
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      await Promise.all([fetchProfile(), fetchSkills()]);
      setLoading(false);
    };
    loadProfile();
  }, []);

  const formatJoinedDate = (date) => {
    if (!date) return "Recently joined";
    return `Joined ${new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}`;
  };

  const profileImage = getMediaUrl(profile?.profile_image);
  const displayName =
    profile?.full_name || profile?.username || "SkillSwap User";

  if (loading) {
    return (
      <div className="profile-loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mt-2 small">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page py-4">
      <main className="container profile-container">
        {error && (
          <div className="alert alert-danger mb-4 shadow-sm">{error}</div>
        )}

        {/* HERO CARD */}
        <div className="profile-header-card shadow-sm mb-4">
          {/* Blue banner with centered circular avatar */}
          <div className="profile-cover">
            {profileImage ? (
              <img
                src={profileImage}
                alt={displayName}
                className="profile-cover-avatar"
              />
            ) : (
              <div className="profile-cover-avatar profile-avatar-fallback">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* White region: symmetrically centered under the avatar */}
          <div className="profile-header-body p-4 position-relative text-center">
            {/* Name / Username */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <h2 className="profile-name mb-0">
                {profile?.full_name?.trim() ? profile.full_name : `@${profile?.username || "user"}`}
              </h2>

              {profile?.role && (
                <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                  {profile.role === "USER" ? "MEMBER" : profile.role}
                </span>
              )}
            </div>

            {/* Sub-username if full name is provided */}
            {profile?.full_name?.trim() && (
              <p className="text-muted small mb-2">@{profile?.username}</p>
            )}

            {/* Location & Joining Date (Location always visible with fallback) */}
            <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 text-muted small mt-2">
              <span className="d-flex align-items-center gap-1">
                <span className="material-symbols-outlined fs-6 text-primary">
                  location_on
                </span>
                <span>{profile?.location || "No location set"}</span>
              </span>

              <span className="d-flex align-items-center gap-1">
                <span className="material-symbols-outlined fs-6 text-primary">
                  calendar_today
                </span>
                <span>{formatJoinedDate(profile?.date_joined)}</span>
              </span>
            </div>

            {/* Edit Profile Button */}
            <div className="profile-action-btn-wrap">
              <button
                type="button"
                className="btn btn-primary px-4 fw-semibold rounded-pill shadow-sm"
                onClick={() => navigate("/profile/edit/")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <span className="stat-label">Skills Teaching</span>
              <span className="stat-value text-primary">
                {profile?.skills_teaching ?? skillsOffer.length ?? 0}
              </span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <span className="stat-label">Skills Learning</span>
              <span className="stat-value text-success">
                {profile?.skills_learning ?? skillsWant.length ?? 0}
              </span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <span className="stat-label">Average Rating</span>
              <span className="stat-value text-warning">
                ⭐ {profile?.average_rating != null ? Number(profile.average_rating).toFixed(1) : "0.0"}
              </span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-card">
              <span className="stat-label">Sessions Held</span>
              <span className="stat-value text-indigo">
                {profile?.session_count ?? 0}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="row g-4">
          {/* LEFT: Skills & Bio */}
          <div className="col-12 col-lg-8">
            <div className="d-flex flex-column gap-4">
              {/* Bio */}
              <div className="card surface-card shadow-sm border-0 p-4">
                <h5 className="section-title mb-3">About</h5>
                <p className="bio-text mb-0">
                  {profile?.bio ||
                    "No bio provided yet. Add a short bio to let others know what you are passionate about!"}
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact & Details */}
          <div className="col-12 col-lg-4">
            <div className="card surface-card shadow-sm border-0 p-4">
              <h5 className="section-title mb-4">Contact & Information</h5>
              <div className="d-flex flex-column gap-3">
                <div className="info-row">
                  <span className="material-symbols-outlined text-primary">
                    mail
                  </span>
                  <div>
                    <span className="info-label">Email</span>
                    <p className="info-value mb-0">
                      {profile?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="material-symbols-outlined text-primary">
                    call
                  </span>
                  <div>
                    <span className="info-label">Phone</span>
                    <p className="info-value mb-0">
                      {profile?.phone_number || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="material-symbols-outlined text-primary">
                    location_on
                  </span>
                  <div>
                    <span className="info-label">Location</span>
                    <p className="info-value mb-0">
                      {profile?.location || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="info-row">
                  <span className="material-symbols-outlined text-primary">
                    badge
                  </span>
                  <div>
                    <span className="info-label">Username</span>
                    <p className="info-value mb-0">@{profile?.username}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;