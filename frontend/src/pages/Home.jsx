import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

import "./Home.css";

function Home() {
    const navigate = useNavigate();
    const navRef = useRef(null);

    useEffect(() => {
        const elements =
            document.querySelectorAll(".reveal");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        elements.forEach((element) => {
            observer.observe(element);
        });

        const handleScroll = () => {
            if (!navRef.current) {
                return;
            }

            if (window.scrollY > 20) {
                navRef.current.classList.add(
                    "home-nav-scrolled"
                );
            } else {
                navRef.current.classList.remove(
                    "home-nav-scrolled"
                );
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener(
                "scroll",
                handleScroll
            );
        };
    }, []);

    const categories = [
        {
            icon: "code",
            name: "Programming",
            mentors: "1.2k Mentors",
            type: "primary",
        },
        {
            icon: "brush",
            name: "Design",
            mentors: "850 Mentors",
            type: "secondary",
        },
        {
            icon: "music_note",
            name: "Music",
            mentors: "540 Mentors",
            type: "neutral",
        },
        {
            icon: "cooking",
            name: "Cooking",
            mentors: "420 Mentors",
            type: "neutral",
        },
        {
            icon: "photo_camera",
            name: "Photography",
            mentors: "610 Mentors",
            type: "neutral",
        },
        {
            icon: "translate",
            name: "Languages",
            mentors: "980 Mentors",
            type: "neutral",
        },
        {
            icon: "fitness_center",
            name: "Fitness",
            mentors: "330 Mentors",
            type: "neutral",
        },
        {
            icon: "query_stats",
            name: "Business",
            mentors: "760 Mentors",
            type: "neutral",
        },
    ];

    const mentors = [
        {
            name: "Elena Rodriguez",
            role: "Senior UX Designer",
            skills: ["Figma", "User Research"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAmQ5hMfvC7IXYB0k5M8xKCizYwrW--gRc1X2J_HHX2OewrWW1cm2gnLjWciUdPRvne_F5TJlH6i6Jsj8R3C_1LBoEJSeyV49j-XakqIO-7eWsUm8VE3s_yJKhMP6z-D0QCx9Bzvd7DFgOR18ch8IYt_266Mc2yZsQT_oupwB8A7RdqDvDUymfubqfSql_hY0xDbV-d-AlgkQ5uV2o9CuR4yvs-0tFkJxAzFNCjMIgJFi9DwsuQm_3M9w",
            featured: false,
        },
        {
            name: "Marcus Thorne",
            role: "Full Stack Architect",
            skills: ["Python", "React"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuD7o0ez8RZ6jUeky_Sxw6XIMeUCGKxIM6mHIUpw_v_q5kmzJBZj1zRGF2gzZyv3F6b166bqWlQETWxFibLruVHJIrWXJwv0pIWL2vc0PNHG3SPKeqkokbk0xvK4-iootiAbH9IeIJeeX3-3fr3BOBJSdFhH4AQzvRSLEVTnbNHmCuRcesgpDnpHv5UxjHX5q0mwCO_0rqLYhkQooFgi77LT2ZNO784v_GXV5Ny--wJ5UjB0diHxITWoVg",
            featured: true,
        },
        {
            name: "Sarah Jenkins",
            role: "Executive Coach",
            skills: ["Leadership", "Negotiation"],
            image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCkrROrVh25EAuv_11FdyEvVhooybgH-gxjMiejnEHwoGzHmUOuuvqYfcgtfHPfpXbV2NrbsolXEP_qXGjrrZEN2sCcP1m-4pyK-KoX_2n86-G0976MjkEznzN0u9r5-QVdNfg4J-E1RmckNWdsxrrfcz6htlv6DW1dti70XICtl25yNxF0dJSd0J4X1Gqz_-YMcg3W5ggCiCLtKEO_GaJPtKndH1hcA4r7AT02F9-czzEHk4z0Cbyzmg",
            featured: false,
        },
    ];

    return (
        <div className="home-page">

            {/* NAVBAR */}

            <nav
                ref={navRef}
                className="home-navbar"
            >
                <div className="home-navbar-inner">

                    <Link
                        to="/"
                        className="home-brand"
                    >
                        SkillSwap
                    </Link>

                    <div className="home-nav-links">
                        <a
                            href="#home"
                            className="active"
                        >
                            Home
                        </a>

                        <a href="#skills">
                            Discover Skills
                        </a>

                        <a href="#how-it-works">
                            How It Works
                        </a>

                        <a href="#success-stories">
                            Success Stories
                        </a>

                        <a href="#about">
                            About
                        </a>
                    </div>

                    <div className="home-nav-actions">

                        <button
                            type="button"
                            className="home-icon-button"
                            onClick={() => {
                                document.documentElement.classList.toggle(
                                    "dark-mode"
                                );
                            }}
                        >
                            <span className="material-symbols-outlined">
                                dark_mode
                            </span>
                        </button>

                        <button
                            type="button"
                            className="home-login-button"
                            onClick={() =>
                                navigate("/login/")
                            }
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className="home-signup-button"
                            onClick={() =>
                                navigate("/register/")
                            }
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            <main className="home-main">

                {/* HERO */}

                <section
                    id="home"
                    className="home-hero"
                >
                    <div className="home-hero-grid">

                        <div className="reveal">
                            <span className="home-eyebrow">
                                NEW: VIRTUAL CO-LEARNING SPACES
                            </span>

                            <h1>
                                Learn Skills.
                                <br />

                                <span>
                                    Share Knowledge.
                                </span>

                                <br />

                                Grow Together.
                            </h1>

                            <p>
                                Join a global ecosystem of
                                lifelong learners and industry
                                experts. Exchange what you know
                                for what you want to learn in a
                                premium, glassmorphic
                                collaborative environment.
                            </p>

                            <div className="home-hero-buttons">

                                <button
                                    type="button"
                                    className="home-primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/register/"
                                        )
                                    }
                                >
                                    Start Learning
                                </button>

                                <button
                                    type="button"
                                    className="home-outline-button"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                "skills"
                                            )
                                            ?.scrollIntoView({
                                                behavior:
                                                    "smooth",
                                            })
                                    }
                                >
                                    Explore Skills
                                </button>
                            </div>

                            <div className="home-stats">
                                <div>
                                    <strong>
                                        20,000+
                                    </strong>

                                    <span>
                                        Active Learners
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        5,000+
                                    </strong>

                                    <span>
                                        Skills
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        100+
                                    </strong>

                                    <span>
                                        Countries
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="home-hero-visual reveal">
                            <img
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_z7NTRvMz_Q1g25E_PH7IcUO48akq4NUxtoO64nSYJUeM6s8Cx4LFbtu6d6CZpyifXmMeD2R5eE0wsVqUZyVOVETtih0a-vw26HS_zzgqXjvZjRzf5n-SK0U12DyPZzz0vDJL6TJXyL-_t3wQbHWHkz3W5ds4s3c6cMTjI-tTsYdTCmHnv15tsw7-Myfwl21zcf2kANDipw_Zny0k3kRFM1gmQUl3ALeKENeKqzUSoJSc_TGTegxtOQ"
                                alt="SkillSwap community"
                            />

                            <div className="home-hero-glow" />
                        </div>
                    </div>
                </section>

                {/* FEATURED CATEGORIES */}

                <section
                    id="skills"
                    className="home-section"
                >
                    <div className="home-section-container">

                        <div className="home-section-heading reveal">
                            <h2>
                                Master Any Craft
                            </h2>

                            <p>
                                From creative arts to technical
                                wizardry, find the perfect mentor
                                for your journey.
                            </p>
                        </div>

                        <div className="category-grid reveal">
                            {categories.map(
                                (category) => (
                                    <button
                                        type="button"
                                        className="category-card"
                                        key={category.name}
                                    >
                                        <div
                                            className={`category-icon ${category.type}`}
                                        >
                                            <span className="material-symbols-outlined">
                                                {
                                                    category.icon
                                                }
                                            </span>
                                        </div>

                                        <h3>
                                            {
                                                category.name
                                            }
                                        </h3>

                                        <p>
                                            {
                                                category.mentors
                                            }
                                        </p>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}

                <section
                    id="how-it-works"
                    className="home-how-section"
                >
                    <div className="home-section-container">

                        <div className="home-section-heading reveal">
                            <h2>
                                How It Works
                            </h2>

                            <p>
                                Your journey to mastery in
                                four simple steps.
                            </p>
                        </div>

                        <div className="timeline reveal">

                            <div className="timeline-line" />

                            {[
                                [
                                    "1",
                                    "Create Profile",
                                    "Tell us about your expert skills and what you're eager to learn.",
                                ],
                                [
                                    "2",
                                    "Add Skills",
                                    "List your proficiencies to attract the right knowledge partners.",
                                ],
                                [
                                    "3",
                                    "Get Matched",
                                    "Our smart AI finds the perfect exchange based on mutual interests.",
                                ],
                                [
                                    "4",
                                    "Learn & Share",
                                    "Schedule flexible sessions and grow through peer-to-peer sharing.",
                                ],
                            ].map(
                                (step) => (
                                    <div
                                        key={step[0]}
                                        className="timeline-step"
                                    >
                                        <div className="timeline-number">
                                            {
                                                step[0]
                                            }
                                        </div>

                                        <h4>
                                            {
                                                step[1]
                                            }
                                        </h4>

                                        <p>
                                            {
                                                step[2]
                                            }
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* WHY CHOOSE */}

                <section
                    id="about"
                    className="home-section home-why-section"
                >
                    <div className="home-section-container">

                        <div className="home-why-grid">

                            <div className="reveal">
                                <h2>
                                    Designed for Seamless
                                    Collaboration
                                </h2>

                                <p className="home-why-intro">
                                    We've built the ultimate
                                    platform for skill exchange,
                                    removing friction so you can
                                    focus on the learning itself.
                                </p>

                                <div className="why-feature-grid">

                                    <div className="why-feature">
                                        <span className="material-symbols-outlined primary">
                                            auto_awesome
                                        </span>

                                        <h4>
                                            Smart Matching
                                        </h4>

                                        <p>
                                            AI-driven discovery
                                            based on learning
                                            velocity and skill
                                            relevance.
                                        </p>
                                    </div>

                                    <div className="why-feature">
                                        <span className="material-symbols-outlined secondary">
                                            chat
                                        </span>

                                        <h4>
                                            Real-Time Chat
                                        </h4>

                                        <p>
                                            Secure, integrated
                                            messaging to discuss
                                            goals before
                                            scheduling.
                                        </p>
                                    </div>

                                    <div className="why-feature">
                                        <span className="material-symbols-outlined primary">
                                            calendar_month
                                        </span>

                                        <h4>
                                            Easy Scheduling
                                        </h4>

                                        <p>
                                            Sync with your
                                            calendar for
                                            seamless
                                            timezone-aware
                                            sessions.
                                        </p>
                                    </div>

                                    <div className="why-feature">
                                        <span className="material-symbols-outlined secondary">
                                            military_tech
                                        </span>

                                        <h4>
                                            Achievements
                                        </h4>

                                        <p>
                                            Earn verified badges
                                            as you master new
                                            crafts and mentor
                                            others.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="home-why-visual reveal">
                                <div className="why-backdrop" />

                                <div className="why-image">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5kQmN0s3IL6DEskeOH5i8PEFdwVXZC0WBRIqRaSm2FYwKeffgG-wDfa82kmKey2RYpXP1xo23TESHeU3igywX6-4JYZzw_XvRypcFT-65fSLc3PTr3n2LY2IZ-5skdebW5i-ttwi27BOKsQ_P76KMx3lJF-TZuLA54bFA-_VjtzzQtZrYQZPX8k0wHvj0755EOz7ccFwwbrlos43KO3CG_weIK8P-450zW2Ke6e7rQPFgZ_7cYOKzQ"
                                        alt="SkillSwap collaboration"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FEATURED MENTORS */}

                <section className="home-featured-section">
                    <div className="home-section-container">

                        <div className="featured-header reveal">
                            <div>
                                <h2>
                                    Featured Mentors
                                </h2>

                                <p>
                                    Learn from the top 1% of
                                    our community.
                                </p>
                            </div>

                            <div className="featured-controls">
                                <button type="button">
                                    <span className="material-symbols-outlined">
                                        arrow_back
                                    </span>
                                </button>

                                <button type="button">
                                    <span className="material-symbols-outlined">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>

                        <div className="mentor-grid reveal">

                            {mentors.map(
                                (mentor) => (
                                    <div
                                        key={
                                            mentor.name
                                        }
                                        className={`mentor-card ${
                                            mentor.featured
                                                ? "featured"
                                                : ""
                                        }`}
                                    >
                                        {mentor.featured && (
                                            <div className="top-rated-badge">
                                                Top Rated
                                            </div>
                                        )}

                                        <div className="mentor-image">
                                            <img
                                                src={
                                                    mentor.image
                                                }
                                                alt={
                                                    mentor.name
                                                }
                                            />
                                        </div>

                                        <h3>
                                            {
                                                mentor.name
                                            }
                                        </h3>

                                        <p className="mentor-role">
                                            {
                                                mentor.role
                                            }
                                        </p>

                                        <div className="mentor-skills">
                                            {mentor.skills.map(
                                                (
                                                    skill
                                                ) => (
                                                    <span
                                                        key={
                                                            skill
                                                        }
                                                    >
                                                        {
                                                            skill
                                                        }
                                                    </span>
                                                )
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            className={
                                                mentor.featured
                                                    ? "mentor-view-button filled"
                                                    : "mentor-view-button"
                                            }
                                        >
                                            View Profile
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </section>

                {/* SUCCESS STORIES */}

                <section
                    id="success-stories"
                    className="home-section"
                >
                    <div className="home-section-container">

                        <div className="home-section-heading reveal">
                            <h2>
                                Real Success, Real People
                            </h2>

                            <p>
                                Hear from learners who
                                transformed their careers on
                                SkillSwap.
                            </p>
                        </div>

                        <div className="testimonial-grid reveal">

                            <div className="testimonial-card">
                                <span className="quote-icon material-symbols-outlined">
                                    format_quote
                                </span>

                                <div className="testimonial-person">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgalpEkhBmiq9T7SGRwf_Vobd4pK1BLJfScyr4shLmKdsysHqhmZjyUwN7WUcU4tY1gWD9DXpQjc23TfU2fq6uxvjZeUUCg6QzD6vgVY8J7MiL0w8qNMIsWbl2B6n-uQILZaqupDs_DRTec5euKNLHOukD9LW5-cUJnQ9m8KCghdqM9MLQ_X35283KKJkgK-9GX_VuiQaN6DwFmEIh8tVq-3WApEKAixmCTGh0oE0eI6Fqcq8YSKO93A"
                                        alt="Julianne Moore"
                                    />

                                    <div>
                                        <h4>
                                            Julianne Moore
                                        </h4>

                                        <p>
                                            Swapped: Branding for
                                            Web3 Dev
                                        </p>

                                        <div className="rating">
                                            {[1, 2, 3, 4, 5].map(
                                                (item) => (
                                                    <span
                                                        key={
                                                            item
                                                        }
                                                        className="material-symbols-outlined"
                                                    >
                                                        star
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="testimonial-text">
                                    "SkillSwap is more than a
                                    platform; it's a movement.
                                    I traded my brand strategy
                                    expertise for Solidity
                                    coding lessons. Within 4
                                    months, I secured my first
                                    blockchain role. The
                                    community support is
                                    incredible."
                                </p>
                            </div>

                            <div className="testimonial-card">
                                <span className="quote-icon material-symbols-outlined">
                                    format_quote
                                </span>

                                <div className="testimonial-person">
                                    <img
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTF6zEVAtL6cae7EB98V4NF14tE1NdPRmlv53S6nZVslXNukBeb0vxXB0rZCpIv3f5yT4KPn2my8WFwSh4j4get1NR_7Dqy3KwuZPrJm4caxnqF0sHIoNhE9Rxf9mhjmhE2xVUHvz0MCWHNgqJE5K3nCUOEzECeklY9p9EoZUIU-2uM_Z2P9q0d5EoSzlbEiez7dr6Cww8PgardvOgBgnnpePVTJSX2--bPxLJzQt1nGyp6nG0eG4rxA"
                                        alt="Liam O'Connell"
                                    />

                                    <div>
                                        <h4>
                                            Liam O'Connell
                                        </h4>

                                        <p>
                                            Swapped: Spanish for
                                            Analytics
                                        </p>

                                        <div className="rating">
                                            {[1, 2, 3, 4, 5].map(
                                                (item) => (
                                                    <span
                                                        key={
                                                            item
                                                        }
                                                        className="material-symbols-outlined"
                                                    >
                                                        star
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <p className="testimonial-text">
                                    "The scheduling is so
                                    effortless. I spend an hour
                                    a week teaching Spanish to a
                                    Data Scientist, and in return,
                                    he helped me master Tableau.
                                    It's the most efficient and
                                    social way to learn I've ever
                                    experienced."
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COMMUNITY STATS */}

                <section className="community-stats">
                    <div className="home-section-container">
                        <div className="community-stats-grid reveal">

                            <div>
                                <strong>
                                    20K+
                                </strong>

                                <span>
                                    Learners
                                </span>
                            </div>

                            <div>
                                <strong>
                                    5K+
                                </strong>

                                <span>
                                    Skills
                                </span>
                            </div>

                            <div>
                                <strong>
                                    100K+
                                </strong>

                                <span>
                                    Sessions
                                </span>
                            </div>

                            <div>
                                <strong>
                                    95%
                                </strong>

                                <span>
                                    Perfect Matches
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}

                <section className="home-cta">

                    <div className="home-cta-background" />

                    <div className="home-section-container">
                        <div className="reveal home-cta-content">

                            <h2>
                                Your Next Skill Is Just
                                One Connection Away
                            </h2>

                            <p>
                                Join the premium community where
                                knowledge flows freely. Start your
                                journey today as a learner or a
                                mentor.
                            </p>

                            <div className="home-cta-buttons">

                                <button
                                    type="button"
                                    className="home-primary-button"
                                    onClick={() =>
                                        navigate(
                                            "/register/"
                                        )
                                    }
                                >
                                    Start Learning Now
                                </button>

                                <button
                                    type="button"
                                    className="home-glass-button"
                                    onClick={() =>
                                        navigate(
                                            "/mentor/apply/"
                                        )
                                    }
                                >
                                    Become a Mentor
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}

            <footer className="home-footer">
                <div className="home-footer-main">

                    <div className="footer-brand-block">
                        <div className="home-footer-brand">
                            SkillSwap
                        </div>

                        <p>
                            Empowering lifelong learners to
                            share knowledge, master new crafts,
                            and build meaningful professional
                            connections globally.
                        </p>
                    </div>

                    <div>
                        <h5>
                            Company
                        </h5>

                        <ul>
                            <li>
                                <a href="#about">
                                    About
                                </a>
                            </li>

                            <li>
                                <a href="#">
                                    Careers
                                </a>
                            </li>

                            <li>
                                <a href="#success-stories">
                                    Success Stories
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5>
                            Resources
                        </h5>

                        <ul>
                            <li>
                                <a href="#">
                                    Help Center
                                </a>
                            </li>

                            <li>
                                <a href="#">
                                    Community Hub
                                </a>
                            </li>

                            <li>
                                <a href="#skills">
                                    Skills Directory
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h5>
                            Legal
                        </h5>

                        <ul>
                            <li>
                                <a href="#">
                                    Privacy Policy
                                </a>
                            </li>

                            <li>
                                <a href="#">
                                    Terms of Service
                                </a>
                            </li>

                            <li>
                                <a href="#">
                                    Cookie Settings
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="home-footer-bottom">

                    <p>
                        © 2024 SkillSwap. Empowering lifelong
                        learners everywhere.
                    </p>

                    <div>
                        <a href="#">
                            <span className="material-symbols-outlined">
                                share
                            </span>
                        </a>

                        <a href="#">
                            <span className="material-symbols-outlined">
                                group
                            </span>
                        </a>

                        <a href="#">
                            <span className="material-symbols-outlined">
                                language
                            </span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;