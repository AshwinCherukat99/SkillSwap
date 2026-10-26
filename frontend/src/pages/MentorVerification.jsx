import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import "./MentorVerification.css";

import { API_BASE_URL } from "../config";

function MentorVerification() {
    const { mentorId } = useParams();
    const navigate = useNavigate();

    const [mentor, setMentor] = useState(null);
    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const [notes, setNotes] = useState("");
    const [selectedDocument, setSelectedDocument] =
        useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchMentorDetails();
    }, [mentorId]);

    const fetchMentorDetails = async () => {
        setLoading(true);
        setError("");

        try {
            /*
             * Replace these with your actual admin endpoints.
             */
            const mentorResponse = await fetch(
                `${API_BASE_URL}/api/admin/mentors/${mentorId}/`
            );

            const documentsResponse = await fetch(
                `${API_BASE_URL}/api/admin/mentors/${mentorId}/documents/`
            );

            if (!mentorResponse.ok) {
                throw new Error(
                    "Unable to fetch mentor details."
                );
            }

            if (!documentsResponse.ok) {
                throw new Error(
                    "Unable to fetch mentor documents."
                );
            }

            const mentorData =
                await mentorResponse.json();

            const documentData =
                await documentsResponse.json();

            setMentor(mentorData);

            setDocuments(
                Array.isArray(documentData)
                    ? documentData
                    : documentData.results || []
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to load mentor verification."
            );
        } finally {
            setLoading(false);
        }
    };

    const updateDocumentStatus = async (
        documentId,
        status
    ) => {
        const rejectionReason =
            status === "REJECTED"
                ? window.prompt(
                      "Enter rejection reason:"
                  )
                : "";

        if (
            status === "REJECTED" &&
            !rejectionReason?.trim()
        ) {
            return;
        }

        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/mentors/${mentorId}/documents/${documentId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        status,
                        rejection_reason:
                            rejectionReason || "",
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to update document status."
                );
            }

            const updatedDocument =
                await response.json();

            setDocuments((previous) =>
                previous.map((document) =>
                    document.id === documentId
                        ? updatedDocument
                        : document
                )
            );

            setSelectedDocument(
                updatedDocument
            );

            setSuccess(
                `Document ${
                    status === "APPROVED"
                        ? "approved"
                        : "rejected"
                } successfully.`
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to update document."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const approveMentor = async () => {
        const confirmed =
            window.confirm(
                "Approve this mentor application?"
            );

        if (!confirmed) {
            return;
        }

        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/mentors/${mentorId}/approve/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        notes,
                    }),
                }
            );

            if (!response.ok) {
                const data =
                    await response
                        .json()
                        .catch(() => ({}));

                throw new Error(
                    data.detail ||
                        "Unable to approve mentor."
                );
            }

            const updatedMentor =
                await response.json();

            setMentor(updatedMentor);

            setSuccess(
                "Mentor approved successfully."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to approve mentor."
            );
        } finally {
            setActionLoading(false);
        }
    };

    const rejectMentor = async () => {
        const reason =
            window.prompt(
                "Enter the rejection reason:"
            );

        if (!reason?.trim()) {
            return;
        }

        setActionLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/mentors/${mentorId}/reject/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        rejection_reason:
                            reason,
                        notes,
                    }),
                }
            );

            if (!response.ok) {
                const data =
                    await response
                        .json()
                        .catch(() => ({}));

                throw new Error(
                    data.detail ||
                        "Unable to reject mentor."
                );
            }

            const updatedMentor =
                await response.json();

            setMentor(updatedMentor);

            setSuccess(
                "Mentor application rejected."
            );
        } catch (err) {
            console.error(err);

            setError(
                err.message ||
                    "Unable to reject mentor."
            );
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="verification-loading">
                <span className="material-symbols-outlined">
                    progress_activity
                </span>

                Loading mentor verification...
            </div>
        );
    }

    if (error && !mentor) {
        return (
            <div className="verification-error-page">
                <span className="material-symbols-outlined">
                    error
                </span>

                <p>{error}</p>

                <button
                    onClick={fetchMentorDetails}
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="mentor-verification-page">

            {/* ==========================================
                SIDEBAR
            =========================================== */}

            <aside className="verification-sidebar">

                <div className="verification-sidebar-brand">

                    <div className="verification-brand-icon">
                        <span className="material-symbols-outlined">
                            admin_panel_settings
                        </span>
                    </div>

                    <div>
                        <h2>
                            SkillSwap
                        </h2>

                        <span>
                            Enterprise Admin
                        </span>
                    </div>

                </div>

                <nav className="verification-sidebar-nav">

                    <SidebarItem
                        to="/admin/dashboard/"
                        icon="dashboard"
                        label="Dashboard"
                    />

                    <SidebarItem
                        to="/admin/users/"
                        icon="group"
                        label="Users"
                    />

                    <SidebarItem
                        to="/admin/mentors/"
                        icon="school"
                        label="Mentors"
                        active
                    />

                    <SidebarItem
                        to="/admin/sessions/"
                        icon="event_available"
                        label="Sessions"
                    />

                    <SidebarItem
                        to="/admin/payments/"
                        icon="payments"
                        label="Payments"
                    />

                    <SidebarItem
                        to="/admin/analytics/"
                        icon="analytics"
                        label="Analytics"
                    />

                    <SidebarItem
                        to="/admin/settings/"
                        icon="settings"
                        label="Settings"
                    />

                </nav>

                <div className="verification-sidebar-bottom">

                    <button className="support-button">
                        Support Portal
                    </button>

                    <Link to="#">
                        <span className="material-symbols-outlined">
                            help
                        </span>

                        Help Center
                    </Link>

                    <Link to="/admin/logout/">
                        <span className="material-symbols-outlined">
                            logout
                        </span>

                        Log Out
                    </Link>

                </div>

            </aside>

            {/* ==========================================
                MAIN
            =========================================== */}

            <main className="verification-main">

                {/* HEADER */}

                <header className="verification-topbar">

                    <div className="verification-breadcrumb">

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/mentors/"
                                )
                            }
                            className="back-button"
                        >
                            <span className="material-symbols-outlined">
                                arrow_back
                            </span>
                        </button>

                        <span>
                            Mentors
                        </span>

                        <span className="material-symbols-outlined">
                            chevron_right
                        </span>

                        <span>
                            Verification
                        </span>

                        <span className="material-symbols-outlined">
                            chevron_right
                        </span>

                        <strong>
                            {mentor?.full_name ||
                                mentor?.name ||
                                "Mentor"}
                        </strong>

                    </div>

                    <div className="verification-top-actions">

                        <button>
                            <span className="material-symbols-outlined">
                                notifications
                            </span>
                        </button>

                        <button>
                            <span className="material-symbols-outlined">
                                apps
                            </span>
                        </button>

                        <button>
                            <span className="material-symbols-outlined">
                                dark_mode
                            </span>
                        </button>

                        <div className="admin-avatar">
                            <span className="material-symbols-outlined">
                                person
                            </span>
                        </div>

                    </div>

                </header>

                {/* CONTENT */}

                <div className="verification-content">

                    {/* PAGE HEADER */}

                    <div className="verification-page-header">

                        <div>
                            <h1>
                                Mentor Verification
                            </h1>

                            <p>
                                Review submitted documents
                                and verify qualifications
                                for new mentor applicants.
                            </p>
                        </div>

                        <div className="applicant-navigation">

                            <button>
                                Previous Applicant
                            </button>

                            <button>
                                Next Applicant
                            </button>

                        </div>

                    </div>

                    {error && (
                        <div className="verification-alert error">
                            <span className="material-symbols-outlined">
                                error
                            </span>

                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="verification-alert success">
                            <span className="material-symbols-outlined">
                                check_circle
                            </span>

                            {success}
                        </div>
                    )}

                    {/* MAIN GRID */}

                    <div className="verification-grid">

                        {/* ==================================
                            LEFT COLUMN
                        =================================== */}

                        <div className="verification-left-column">

                            {/* MENTOR SUMMARY */}

                            <section className="verification-card mentor-summary-card">

                                <div className="mentor-summary-accent" />

                                <div className="mentor-summary-header">

                                    <div className="mentor-avatar-large">

                                        {mentor?.profile_image ? (
                                            <img
                                                src={
                                                    mentor.profile_image
                                                }
                                                alt={
                                                    mentor.full_name
                                                }
                                            />
                                        ) : (
                                            <span className="material-symbols-outlined">
                                                person
                                            </span>
                                        )}

                                    </div>

                                    <div>

                                        <h2>
                                            {mentor?.full_name ||
                                                mentor?.name ||
                                                "Mentor"}
                                        </h2>

                                        <p>
                                            {mentor?.profession ||
                                                mentor?.primary_skill ||
                                                "Mentor"}
                                        </p>

                                        <span
                                            className={`mentor-status ${
                                                mentor?.status
                                                    ?.toLowerCase() ||
                                                "pending"
                                            }`}
                                        >
                                            <span />

                                            {formatStatus(
                                                mentor?.status ||
                                                    "PENDING"
                                            )}
                                        </span>

                                    </div>

                                </div>

                                <div className="mentor-details">

                                    <DetailRow
                                        icon="work"
                                        label="Experience"
                                        value={
                                            mentor?.experience ||
                                            "—"
                                        }
                                    />

                                    <DetailRow
                                        icon="school"
                                        label="Education"
                                        value={
                                            mentor?.education ||
                                            "—"
                                        }
                                    />

                                    <DetailRow
                                        icon="location_on"
                                        label="Location"
                                        value={
                                            mentor?.location ||
                                            "—"
                                        }
                                    />

                                    <DetailRow
                                        icon="calendar_today"
                                        label="Applied"
                                        value={
                                            mentor?.created_at
                                                ? formatDate(
                                                      mentor.created_at
                                                  )
                                                : "—"
                                        }
                                    />

                                </div>

                            </section>

                            {/* VERIFICATION CHECKLIST */}

                            <section className="verification-card checklist-card">

                                <h3>
                                    <span className="material-symbols-outlined">
                                        fact_check
                                    </span>

                                    Verification Checklist
                                </h3>

                                <div className="verification-checklist">

                                    <ChecklistItem
                                        title="Identity Verification"
                                        description="Verify the applicant identity and submitted profile information."
                                    />

                                    <ChecklistItem
                                        title="Education / Qualification"
                                        description="Verify the submitted academic or professional qualification."
                                    />

                                    <ChecklistItem
                                        title="Certifications"
                                        description="Check relevant certifications and supporting credentials."
                                    />

                                    <ChecklistItem
                                        title="Portfolio Review"
                                        description="Review the applicant's supporting portfolio or proof of expertise."
                                    />

                                </div>

                                <div className="verification-notes">

                                    <label>
                                        Internal Verification Notes
                                    </label>

                                    <textarea
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Add notes about this verification..."
                                    />

                                </div>

                                <div className="decision-section">

                                    <h4>
                                        Final Decision
                                    </h4>

                                    <button
                                        className="approve-button"
                                        disabled={
                                            actionLoading
                                        }
                                        onClick={
                                            approveMentor
                                        }
                                    >
                                        <span className="material-symbols-outlined">
                                            check_circle
                                        </span>

                                        Approve Mentor
                                    </button>

                                    <div className="decision-secondary">

                                        <button
                                            className="request-button"
                                            onClick={() =>
                                                window.alert(
                                                    "Request Information action can be connected to your mentor revision endpoint."
                                                )
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                info
                                            </span>

                                            Request Info
                                        </button>

                                        <button
                                            className="reject-button"
                                            disabled={
                                                actionLoading
                                            }
                                            onClick={
                                                rejectMentor
                                            }
                                        >
                                            <span className="material-symbols-outlined">
                                                cancel
                                            </span>

                                            Reject
                                        </button>

                                    </div>

                                </div>

                            </section>

                        </div>

                        {/* ==================================
                            RIGHT COLUMN
                        =================================== */}

                        <div className="verification-right-column">

                            {/* DOCUMENT GALLERY */}

                            <section className="verification-card">

                                <div className="documents-header">

                                    <h3>
                                        Submitted Documents
                                    </h3>

                                    <span>
                                        {documents.length}
                                        {" "}
                                        Items
                                    </span>

                                </div>

                                <div className="documents-grid">

                                    {documents.length === 0 ? (
                                        <div className="empty-documents">
                                            <span className="material-symbols-outlined">
                                                description
                                            </span>

                                            <p>
                                                No documents
                                                submitted.
                                            </p>
                                        </div>
                                    ) : (
                                        documents.map(
                                            (
                                                document
                                            ) => (
                                                <DocumentCard
                                                    key={
                                                        document.id
                                                    }
                                                    document={
                                                        document
                                                    }
                                                    selected={
                                                        selectedDocument?.id ===
                                                        document.id
                                                    }
                                                    onSelect={() =>
                                                        setSelectedDocument(
                                                            document
                                                        )
                                                    }
                                                />
                                            )
                                        )
                                    )}

                                </div>

                            </section>

                            {/* DOCUMENT VIEWER */}

                            <section className="document-viewer">

                                <div className="document-viewer-toolbar">

                                    <div>

                                        <span className="material-symbols-outlined">
                                            description
                                        </span>

                                        <span>
                                            {selectedDocument?.document_type ||
                                                selectedDocument?.name ||
                                                "Select a document"}
                                        </span>

                                    </div>

                                    {selectedDocument && (
                                        <div className="viewer-controls">

                                            <button
                                                title="Zoom Out"
                                            >
                                                <span className="material-symbols-outlined">
                                                    zoom_out
                                                </span>
                                            </button>

                                            <span>
                                                100%
                                            </span>

                                            <button
                                                title="Zoom In"
                                            >
                                                <span className="material-symbols-outlined">
                                                    zoom_in
                                                </span>
                                            </button>

                                            <button
                                                title="Rotate"
                                            >
                                                <span className="material-symbols-outlined">
                                                    rotate_right
                                                </span>
                                            </button>

                                            <button
                                                title="Open"
                                                onClick={() =>
                                                    window.open(
                                                        getDocumentUrl(
                                                            selectedDocument
                                                        ),
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <span className="material-symbols-outlined">
                                                    open_in_new
                                                </span>
                                            </button>

                                        </div>
                                    )}

                                </div>

                                <div className="document-canvas">

                                    {!selectedDocument ? (
                                        <div className="viewer-empty">

                                            <span className="material-symbols-outlined">
                                                preview
                                            </span>

                                            <p>
                                                Select a document
                                                to preview it.
                                            </p>

                                        </div>
                                    ) : (
                                        <DocumentPreview
                                            document={
                                                selectedDocument
                                            }
                                        />
                                    )}

                                </div>

                            </section>

                        </div>

                    </div>

                    {/* ==================================
                        TIMELINE
                    =================================== */}

                    <section className="verification-card timeline-card">

                        <h3>
                            Activity Timeline
                        </h3>

                        <div className="timeline">

                            <TimelineItem
                                icon="pending"
                                type="pending"
                                title="Verification Started"
                                time="Today"
                                description="The administrator initiated the mentor verification process."
                            />

                            <TimelineItem
                                icon="upload_file"
                                type="default"
                                title="Documents Submitted"
                                time={
                                    mentor?.created_at
                                        ? formatDate(
                                              mentor.created_at
                                          )
                                        : "—"
                                }
                                description={`Mentor submitted ${documents.length} document(s) for verification.`}
                            />

                            <TimelineItem
                                icon="check"
                                type="success"
                                title="Documents Awaiting Review"
                                time="Pending"
                                description="Submitted documents are ready for administrative verification."
                            />

                        </div>

                    </section>

                </div>

            </main>
        </div>
    );
}

/* ==========================================
   SIDEBAR ITEM
========================================== */

function SidebarItem({
    to,
    icon,
    label,
    active = false,
}) {
    return (
        <Link
            to={to}
            className={`verification-sidebar-item ${
                active ? "active" : ""
            }`}
        >
            <span className="material-symbols-outlined">
                {icon}
            </span>

            {label}
        </Link>
    );
}

/* ==========================================
   DETAIL ROW
========================================== */

function DetailRow({
    icon,
    label,
    value,
}) {
    return (
        <div className="detail-row">

            <span>
                <span className="material-symbols-outlined">
                    {icon}
                </span>

                {label}
            </span>

            <strong>
                {value}
            </strong>

        </div>
    );
}

/* ==========================================
   CHECKLIST
========================================== */

function ChecklistItem({
    title,
    description,
}) {
    const [checked, setChecked] =
        useState(false);

    return (
        <label
            className={`checklist-item ${
                checked ? "checked" : ""
            }`}
        >
            <input
                type="checkbox"
                checked={checked}
                onChange={(event) =>
                    setChecked(
                        event.target.checked
                    )
                }
            />

            <div>
                <strong>
                    {title}
                </strong>

                <p>
                    {description}
                </p>
            </div>
        </label>
    );
}

/* ==========================================
   DOCUMENT CARD
========================================== */

function DocumentCard({
    document,
    selected,
    onSelect,
}) {
    const status =
        document.status ||
        "PENDING";

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`document-card ${
                selected ? "selected" : ""
            }`}
        >

            <div className="document-preview-thumbnail">

                {isImageDocument(document) ? (
                    <img
                        src={
                            getDocumentUrl(
                                document
                            )
                        }
                        alt={
                            document.document_type ||
                            "Document"
                        }
                    />
                ) : (
                    <span className="material-symbols-outlined">
                        description
                    </span>
                )}

            </div>

            <h4>
                {document.document_type ||
                    "Verification Document"}
            </h4>

            <p>
                {getFileExtension(
                    document.document
                )}

                {" • "}

                {document.file_size ||
                    "File"}
            </p>

            <div
                className={`document-status ${status.toLowerCase()}`}
            >
                <span className="material-symbols-outlined">
                    {getDocumentStatusIcon(
                        status
                    )}
                </span>

                {formatStatus(status)}
            </div>

        </button>
    );
}

/* ==========================================
   DOCUMENT PREVIEW
========================================== */

function DocumentPreview({
    document,
}) {
    const url =
        getDocumentUrl(document);

    if (!url) {
        return (
            <div className="viewer-empty">
                <span className="material-symbols-outlined">
                    broken_image
                </span>

                <p>
                    Document preview
                    unavailable.
                </p>
            </div>
        );
    }

    if (isImageDocument(document)) {
        return (
            <img
                className="document-preview-image"
                src={url}
                alt={
                    document.document_type ||
                    "Mentor document"
                }
            />
        );
    }

    return (
        <iframe
            src={url}
            title="Document Preview"
            className="document-preview-frame"
        />
    );
}

/* ==========================================
   TIMELINE ITEM
========================================== */

function TimelineItem({
    icon,
    type,
    title,
    time,
    description,
}) {
    return (
        <div className="timeline-item">

            <div
                className={`timeline-icon ${type}`}
            >
                <span className="material-symbols-outlined">
                    {icon}
                </span>
            </div>

            <div className="timeline-content">

                <div>
                    <strong>
                        {title}
                    </strong>

                    <time>
                        {time}
                    </time>
                </div>

                <p>
                    {description}
                </p>

            </div>

        </div>
    );
}

/* ==========================================
   HELPERS
========================================== */

function formatStatus(status) {
    return status
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) =>
            char.toUpperCase()
        );
}

function formatDate(dateString) {
    if (!dateString) {
        return "—";
    }

    const date =
        new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function getDocumentUrl(document) {
    return (
        document?.document_url ||
        document?.document ||
        document?.file ||
        ""
    );
}

function getFileExtension(file) {
    if (!file) {
        return "FILE";
    }

    const cleanFile =
        file.split("?")[0];

    const parts =
        cleanFile.split(".");

    return parts.length > 1
        ? parts.pop().toUpperCase()
        : "FILE";
}

function isImageDocument(document) {
    const url =
        getDocumentUrl(document)
            .toLowerCase();

    return (
        url.endsWith(".jpg") ||
        url.endsWith(".jpeg") ||
        url.endsWith(".png") ||
        url.endsWith(".webp") ||
        url.endsWith(".gif")
    );
}

function getDocumentStatusIcon(status) {
    switch (
        status.toUpperCase()
    ) {
        case "APPROVED":
            return "verified";

        case "REJECTED":
            return "cancel";

        default:
            return "pending";
    }
}

export default MentorVerification;