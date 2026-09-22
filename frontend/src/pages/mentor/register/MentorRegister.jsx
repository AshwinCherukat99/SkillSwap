import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./MentorRegister.css";

const API_BASE_URL="http://127.0.0.1:8000"

function MentorRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        username:"",
        email: "",
        phone_number: "",
        password: "",
        password2:"",
        experience_years: "",
        current_profession: "",
        organization: "", 
        professional_summary:"",
        teaching_niche: "",
    });

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [fieldErrors,setFieldErrors]=useState({})

    const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
        ...current,
        [name]: value,
    }));

    setFieldErrors((current) => ({
        ...current,
        [name]: undefined,
    }));
};

    const handleDocumentUpload = (
        event
    ) => {
        const files =
            Array.from(
                event.target.files || []
            );

        if (!files.length) {
            return;
        }

        const validFiles =
            files.filter((file) => {
                const validType =
                    [
                        "application/pdf",
                        "image/jpeg",
                        "image/png",
                    ].includes(
                        file.type
                    );

                const validSize =
                    file.size <=
                    20 * 1024 * 1024;

                return (
                    validType &&
                    validSize
                );
            });

        setDocuments((previous) => [
            ...previous,
            ...validFiles.map(
                (file) => ({
                    file,
                    category:
                        "Professional Certificate",
                    uploadProgress: 100,
                    uploaded: true,
                })
            ),
        ]);
    };

    const removeDocument = (
        index
    ) => {
        setDocuments((previous) =>
            previous.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );
    };

    const replaceDocument = (
        index
    ) => {
        document
            .getElementById(
                `mentor-document-${index}`
            )
            ?.click();
    };

    const handleReplaceFile = (
        index,
        event
    ) => {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
    ];

    const validType = validTypes.includes(file.type);

    const validSize =
        file.size <= 20 * 1024 * 1024;

    if (!validType) {
        setError(
            "Only PDF, JPEG and PNG files are allowed."
        );
        event.target.value = "";
        return;
    }

    if (!validSize) {
        setError(
            "Document size must not exceed 20 MB."
        );
        event.target.value = "";
        return;
    }

    setError("");

        setDocuments((previous) =>
            previous.map(
                (documentItem, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...documentItem,
                              file,
                              uploadProgress: 100,
                              uploaded: true,
                          }
                        : documentItem
            )
        );
        event.target.value=""
    };

    const updateDocumentCategory = (
        index,
        category
    ) => {
        setDocuments((previous) =>
            previous.map(
                (documentItem, itemIndex) =>
                    itemIndex === index
                        ? {
                              ...documentItem,
                              category,
                          }
                        : documentItem
            )
        );
    };

    const handlePreview = (
        documentItem
    ) => {
        if (
            documentItem?.file
        ) {
            const url =
                URL.createObjectURL(
                    documentItem.file
                );

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );
        }
    };

    const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        setLoading(true);
        setError("");
        setFieldErrors({});

        const formDataToSend = new FormData();

        formDataToSend.append(
            "full_name",
            formData.full_name
        );

        formDataToSend.append(
            "username",
            formData.username
        );

        formDataToSend.append(
            "email",
            formData.email
        );

        formDataToSend.append(
            "password",
            formData.password
        );

        formDataToSend.append(
            "password2",
            formData.password2
        );

        formDataToSend.append(
            "phone_number",
            formData.phone_number
        );

        formDataToSend.append(
            "current_profession",
            formData.current_profession
        );

        formDataToSend.append(
            "organization",
            formData.organization
        );

        if (formData.experience_years !== "") {
            formDataToSend.append(
                "experience_years",
                formData.experience_years
            );
        }

        formDataToSend.append(
            "professional_summary",
            formData.professional_summary
        );

        formDataToSend.append(
            "teaching_niche",
            formData.teaching_niche
        );

        documents.forEach((item) => {
            formDataToSend.append(
                "documents",
                item.file
            );

            formDataToSend.append(
                "document_types",
                item.category
            );
        });

        console.log("FORM DATA:", formData);

        console.log(
    "EMAIL BEING SENT:",
    formData.email
);

        const response = await fetch(
            `${API_BASE_URL}/api/mentors/register/`,
            {
                method: "POST",
                body: formDataToSend,
            }
        );

        const data = await response.json();

        console.log(
            "Mentor registration:",
            response.status,
            data
        );

        if (!response.ok) {
            throw new Error(
                data.detail ||
                data.error ||
                "Registration failed."
            );
        }

        navigate(
            `/mentor/verify-email/?email=${encodeURIComponent(
                formData.email
            )}`
        );

    } catch (err) {
        console.error(err);
        setError(
            err.message ||
            "Unable to register."
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="mentor-register-page">

            <div className="mentor-register-layout">

                {/* ====================================
                    LEFT SIDE
                ===================================== */}

                <aside className="mentor-register-left">

                    <div className="mentor-left-content">

                        <div>
                            <h1>
                                SkillSwap
                            </h1>

                            <p>
                                Empower others by sharing
                                your expertise in a global
                                network of professionals.
                            </p>
                        </div>

                        <div className="mentor-register-illustration">

                            <div className="mentor-illustration-inner">

                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5CzBeJJYpFc4wR_s1Al935vspH0HNTxSuCSO_-3fc0VP9gB2VG7kOUkwYZkAT3nUqsc25ULnb1jYvhmHqdcHiuOPFEU8oon6i3CNkAk1LSDB7meczgRacYIotOu3ivUA8lHSdSmvVmvFVnB7kYhK37C2iG75SyUCZa8z23pLaUbCp50B55WuXhqdbYNn3a7OiMInrwdnrHXJiAf4yR9LeeumfuoaZ4AX0nr0CI7dLqtj2JGZqCbhEZA"
                                    alt="SkillSwap mentor"
                                />

                                <span className="mentor-float-icon mentor-school">
                                    <span className="material-symbols-outlined">
                                        school
                                    </span>
                                </span>

                                <span className="mentor-float-icon mentor-award">
                                    <span className="material-symbols-outlined">
                                        emoji_events
                                    </span>
                                </span>

                                <span className="mentor-float-icon mentor-book">
                                    <span className="material-symbols-outlined">
                                        menu_book
                                    </span>
                                </span>

                                <span className="mentor-float-icon mentor-psychology">
                                    <span className="material-symbols-outlined">
                                        psychology
                                    </span>
                                </span>
                            </div>
                        </div>

                        <div className="mentor-top-rated-card">

                            <div className="mentor-top-rated-icon">
                                <span className="material-symbols-outlined">
                                    verified_user
                                </span>
                            </div>

                            <div>
                                <p>
                                    TOP RATED PLATFORM
                                </p>

                                <span>
                                    Join 50k+ verified
                                    mentors worldwide.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mentor-left-glow mentor-glow-one" />
                    <div className="mentor-left-glow mentor-glow-two" />

                </aside>

                {/* ====================================
                    RIGHT SIDE
                ===================================== */}

                <main className="mentor-register-right">

                    {/* MOBILE HEADER */}

                    <div className="mentor-mobile-header">

                        <Link to="/">
                            SkillSwap
                        </Link>

                        <span>
                            MENTOR REGISTRATION
                        </span>
                    </div>

                    {/* DESKTOP HEADER */}

                    <div className="mentor-desktop-header">

                        <div>
                            <div className="mentor-registration-label">
                                <span className="material-symbols-outlined">
                                    school
                                </span>

                                MENTOR REGISTRATION
                            </div>

                            <h2>
                                Become a Guide
                            </h2>
                        </div>

                        <div className="mentor-help">
                            <span className="material-symbols-outlined">
                                help_outline
                            </span>

                            Need help?
                        </div>
                    </div>

                    {/* REGISTRATION CARD */}

                    <div className="mentor-registration-card">

                        {/* TIMELINE */}

                        <div className="mentor-timeline">

                            <div className="timeline-background-line" />

                            <div className="timeline-progress-line" />

                            {[
                                [
                                    "person_add",
                                    "Register",
                                ],
                                [
                                    "rate_review",
                                    "Review",
                                ],
                                [
                                    "verified",
                                    "Verification",
                                ],
                                [
                                    "check_circle",
                                    "Approved",
                                ],
                                [
                                    "rocket_launch",
                                    "Access",
                                ],
                            ].map(
                                (
                                    step,
                                    index
                                ) => (
                                    <div
                                        key={
                                            step[1]
                                        }
                                        className={`mentor-timeline-step ${
                                            index ===
                                            0
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <div className="timeline-circle">
                                            <span className="material-symbols-outlined">
                                                {
                                                    step[0]
                                                }
                                            </span>
                                        </div>

                                        <span>
                                            {
                                                step[1]
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            {error && (
                                <div className="mentor-register-error">
                                    {error}
                                </div>
                            )}

                            {/* =================================
                                BASIC INFORMATION
                            ================================== */}

                            <section className="mentor-form-section">

                                <h3>
                                    <span className="material-symbols-outlined">
                                        badge
                                    </span>

                                    Basic Information
                                </h3>

                                <div className="mentor-form-grid">

                                    <div className="mentor-field">
                                        <label>
                                            Full Name
                                        </label>

                                        <input
                                            name="full_name"
                                            value={
                                                formData.full_name
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Dr. Jordan Vance"
                                            type="text"
                                            required
                                        />
                                    </div>

                                    <div className="mentor-field">
                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="jordan@university.edu"
                                            required
                                        />
                                    </div>

                                    <div className="mentor-field">
                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            name="phone_number"
                                            type="tel"
                                            value={
                                                formData.phone_number
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="+91 9876543210"
                                            required
                                        />
                                    </div>

                                    <div className="mentor-field">
                                        <label>
                                            Username
                                        </label>

                                        <input
                                            name="username"
                                            type="text"
                                            value={
                                                formData.username
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="GoodDoctor78"
                                            required
                                        />
                                    </div>


                                    <div className="mentor-field">
                                        <label>
                                            Create Password
                                        </label>

                                        <input
                                            name="password"
                                            type="password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="••••••••"
                                            required
                                        />

                                        <div className="mentor-password-meter">
                                            <div
                                                style={{
                                                    width: formData
                                                        .password
                                                        .length
                                                        ? "66%"
                                                        : "0%",
                                                }}
                                            />
                                        </div>

                                        {formData
                                            .password
                                            .length >
                                            0 && (
                                            <span>
                                                Strength:
                                                High
                                            </span>
                                        )}
                                    </div>

                                    <div className="mentor-field">
                                        <label>
                                            Confirm Password
                                        </label>

                                        <input
                                            name="password2"
                                            type="password"
                                            value={
                                                formData.password2
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="••••••••"
                                            required
                                        />

                                        {formData
                                            .password2
                                            .length >
                                            0 && (
                                            <span>
                                                Strength:
                                                High
                                            </span>
                                        )}
                                    </div>

                                </div>
                            </section>

                            {/* =================================
                                EXPERTISE
                            ================================== */}

                            <section className="mentor-form-section">

                                <h3>
                                    <span className="material-symbols-outlined">
                                        psychology
                                    </span>

                                    Expertise & Background
                                </h3>

                                <div className="mentor-form-grid">

                                    <div className="mentor-field">

                                        <label>
                                            Years of Experience
                                        </label>

                                        <select
                                            name="experience_years"
                                            value={
                                                formData.experience_years
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >
                                            <option value="">
                                                Select experience
                                            </option>

                                            <option value="2">
                                                2 Years
                                            </option>

                                            <option value="3">
                                                3 Years
                                            </option>

                                            <option value="4">
                                                4 Years
                                            </option>

                                            <option value="5">
                                                5 Years
                                            </option>

                                            <option value="6">
                                                6 Years
                                            </option>

                                            <option value="7">
                                                7 Years
                                            </option>

                                            <option value="8">
                                                8 Years
                                            </option>

                                            <option value="9">
                                                9 Years
                                            </option>

                                            <option value="10">
                                                10+ Years
                                            </option>
                                        </select>
                                    </div>

                                    <div className="mentor-field">

                                        <label>
                                            Current Profession
                                        </label>

                                        <input
                                            name="current_profession"
                                            value={
                                                formData.current_profession
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            type='text'
                                            placeholder="e.g. Senior Software Architect"
                                            required
                                        />
                                    </div>

                                    <div className="mentor-field full-width">

                                        <label>
                                            Organization /
                                            University
                                        </label>

                                        <input
                                            name="organization"
                                            value={
                                                formData.organization
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Google, Stanford University"
                                            type="text"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* =================================
                                DOCUMENTS
                            ================================== */}

                            <section className="mentor-form-section documents-section">

                                <div className="documents-heading">

                                    <div>
                                        <h3>
                                            <span className="material-symbols-outlined">
                                                workspace_premium
                                            </span>

                                            Professional
                                            Verification
                                            Documents
                                        </h3>

                                        <p>
                                            Upload documents
                                            that verify your
                                            professional
                                            expertise
                                            (PDF, JPG, PNG up
                                            to 20MB).
                                        </p>
                                    </div>
                                </div>

                                {/* FILE INPUT */}

                                <input
                                    id="mentor-document-input"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    multiple
                                    hidden
                                    onChange={
                                        handleDocumentUpload
                                    }
                                />

                                <label
                                    htmlFor="mentor-document-input"
                                    className="document-upload-zone"
                                >
                                    <div className="document-upload-icon">
                                        <span className="material-symbols-outlined">
                                            cloud_upload
                                        </span>
                                    </div>

                                    <p>
                                        Upload Certificates,
                                        Awards or Supporting
                                        Documents
                                    </p>

                                    <span>
                                        Upload documents that
                                        verify your expertise.
                                        At least one document
                                        is required before
                                        submitting your mentor
                                        application.
                                    </span>

                                    <span className="document-browse-button">
                                        Browse Files
                                    </span>
                                </label>

                                {/* DOCUMENT LIST */}

                                <div className="mentor-document-list">

                                    {documents.map(
                                        (
                                            documentItem,
                                            index
                                        ) => (
                                            <div
                                                key={`${documentItem.file.name}-${index}`}
                                                className="mentor-document-card"
                                            >
                                                <div className="mentor-document-main">

                                                    <div className="document-icon">
                                                        <span className="material-symbols-outlined">
                                                            workspace_premium
                                                        </span>
                                                    </div>

                                                    <div className="document-info">

                                                        <p>
                                                            {
                                                                documentItem
                                                                    .file
                                                                    .name
                                                            }
                                                        </p>

                                                        <div className="document-meta">

                                                            <span>
                                                                {documentItem.file.type ===
                                                                "application/pdf"
                                                                    ? "PDF"
                                                                    : "IMAGE"}
                                                                {" • "}
                                                                {(
                                                                    documentItem
                                                                        .file
                                                                        .size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2
                                                                )}{" "}
                                                                MB
                                                            </span>

                                                            <span className="document-upload-success">
                                                                <span className="material-symbols-outlined">
                                                                    check_circle
                                                                </span>

                                                                Uploaded
                                                                Successfully
                                                            </span>
                                                        </div>

                                                        <label className="document-category-label">
                                                            Document
                                                            Category

                                                            <select
                                                                value={
                                                                    documentItem.category
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    updateDocumentCategory(
                                                                        index,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option>
                                                                    Professional
                                                                    Certificate
                                                                </option>

                                                                <option>
                                                                    University
                                                                    Degree
                                                                </option>

                                                                <option>
                                                                    Diploma
                                                                </option>

                                                                <option>
                                                                    Award
                                                                </option>

                                                                <option>
                                                                    Competition
                                                                    Achievement
                                                                </option>

                                                                <option>
                                                                    Industry
                                                                    Certification
                                                                </option>

                                                                <option>
                                                                    Government
                                                                    License
                                                                </option>

                                                                <option>
                                                                    Portfolio
                                                                </option>

                                                                <option>
                                                                    Other
                                                                </option>
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="document-actions">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handlePreview(
                                                                documentItem
                                                            )
                                                        }
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            visibility
                                                        </span>

                                                        Preview
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            replaceDocument(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            sync
                                                        </span>

                                                        Replace
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-document"
                                                        onClick={() =>
                                                            removeDocument(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            delete
                                                        </span>

                                                        Delete
                                                    </button>

                                                    <input
                                                        id={`mentor-document-${index}`}
                                                        type="file"
                                                        accept=".pdf,.jpg,.jpeg,.png"
                                                        hidden
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            handleReplaceFile(
                                                                index,
                                                                event
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* VERIFICATION MESSAGE */}

                                <div className="verification-info">

                                    <div className="verification-icon">
                                        <span className="material-symbols-outlined">
                                            verified_user
                                        </span>
                                    </div>

                                    <div>
                                        <h4>
                                            🛡 Verification
                                            Process
                                        </h4>

                                        <p>
                                            Our administrators
                                            will manually review
                                            every uploaded
                                            document before
                                            approving your mentor
                                            account.
                                        </p>
                                    </div>
                                </div>

                                {documents.length ===
                                    0 && (
                                    <div className="document-warning">
                                        <div>
                                            <span className="material-symbols-outlined">
                                                warning
                                            </span>
                                        </div>

                                        <div>
                                            <h4>
                                                ⚠ Supporting
                                                Documents Needed
                                            </h4>

                                            <p>
                                                At least one
                                                supporting
                                                document is
                                                required.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* =================================
                                PROFESSIONAL SUMMARY
                            ================================== */}

                            <section className="mentor-form-section">

                                <h3>
                                    <span className="material-symbols-outlined">
                                        description
                                    </span>

                                    Professional Summary
                                </h3>

                                <div className="mentor-summary-fields">

                                    <div className="mentor-field">

                                        <label>
                                            About Your
                                            Expertise
                                        </label>

                                        <textarea
                                            name="professional_summary"
                                            value={
                                                formData.professional_summary
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength={500}
                                            rows={4}
                                            placeholder="Briefly describe your core competencies and professional journey..."
                                        />

                                        <div className="character-count">
                                            {
                                                formData
                                                    .professional_summary
                                                    .length
                                            }{" "}
                                            / 500 characters
                                        </div>
                                    </div>

                                    <div className="mentor-field">

                                        <label>
                                            Why Should Learners
                                            Choose You?
                                        </label>

                                        <textarea
                                            name="teaching_niche"
                                            value={
                                                formData.teaching_niche
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength={500}
                                            rows={4}
                                            placeholder="What is your unique teaching style or industry insight?"
                                        />

                                        <div className="character-count">
                                            {
                                                formData
                                                    .teaching_niche
                                                    .length
                                            }{" "}
                                            / 500 characters
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ACTIONS */}

                            <div className="mentor-register-actions">

                                <button
                                    type="submit"
                                    className="mentor-submit-button"
                                    disabled={
                                        loading 
                                    }
                                >
                                    <span className="material-symbols-outlined">
                                        school
                                    </span>

                                    {loading
                                        ? "Submitting..."
                                        : "Submit Mentor Application"}
                                </button>

                                <button
                                    type="button"
                                    className="mentor-cancel-button"
                                    onClick={() =>
                                        navigate("/")
                                    }
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    <footer className="mentor-register-footer">

                        <p>
                            © 2024 SkillSwap Professional
                            Network. Secure 256-bit SSL
                            Encrypted.
                        </p>

                        <div>
                            <a href="#">
                                Privacy Policy
                            </a>

                            <a href="#">
                                Terms of Service
                            </a>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}

export default MentorRegister;