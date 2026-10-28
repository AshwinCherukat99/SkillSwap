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
          <div className="profile-cover"></div>

          <div className="profile-header-body px-4 pb-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end gap-3">
              {/* Avatar & User Details */}
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3 text-center text-md-start">
                <div className="profile-avatar-wrap">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar profile-avatar-fallback">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                    <h2 className="profile-name mb-0">{displayName}</h2>
                    <span className="text-muted small">
                      @{profile?.username}
                    </span>
                    {profile?.role && (
                      <span className="badge rounded-pill bg-primary-subtle text-primary border border-primary-subtle px-2 py-1">
                        {profile.role === "USER"
                          ? "MEMBER"
                          : profile.role}
                      </span>
                    )}
                  </div>
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 text-muted small">
                    {profile?.location && (
                      <span className="d-flex align-items-center gap-1">
                        <span className="material-symbols-outlined fs-6">
                          location_on
                        </span>
                        {profile.location}
                      </span>
                    )}
                    <span className="d-flex align-items-center gap-1">
                      <span className="material-symbols-outlined fs-6">
                        calendar_today
                      </span>
                      {formatJoinedDate(profile?.date_joined)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
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

              {/* Teaching Skills */}
              <div className="card surface-card shadow-sm border-0 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="section-title mb-0">Skills I Teach</h5>
                  <Link
                    to="/my-skills"
                    className="small text-primary text-decoration-none fw-semibold"
                  >
                    Manage Skills
                  </Link>
                </div>
                {skillsOffer.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {skillsOffer.map((item, idx) => (
                      <span key={item.id || idx} className="skill-pill teach">
                        {item.skill?.name || item.name || item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small mb-0">
                    You haven&apos;t added any teaching skills yet.
                  </p>
                )}
              </div>

              {/* Learning Skills */}
              <div className="card surface-card shadow-sm border-0 p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="section-title mb-0">Skills I Want to Learn</h5>
                  <Link
                    to="/my-skills"
                    className="small text-success text-decoration-none fw-semibold"
                  >
                    Explore Skills
                  </Link>
                </div>
                {skillsWant.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {skillsWant.map((item, idx) => (
                      <span key={item.id || idx} className="skill-pill learn">
                        {item.skill?.name || item.name || item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted small mb-0">
                    You haven&apos;t added any learning goals yet.
                  </p>
                )}
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