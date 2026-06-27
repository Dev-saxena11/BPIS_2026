import React from "react";
import { Link } from "react-router-dom";
import {
  GitBranch,
  Globe2,
  ShieldCheck,
} from "lucide-react";

const adminLinks = [
  { label: "Home", to: "/overview" },
  { label: "District Comparison", to: "/district-comparison" },
  { label: "Analytics Dashboard", to: "/analytics" },
];

const policyLinks = [
  { label: "Policy Advisor", to: "/policy-advisor" },
  { label: "Explainability", to: "/district-explainability" },
  { label: "Scheme Repo", to: "/scheme-repository" },
  { label: "Anomaly Tracker", to: "/district-alerts" },
];

const resourceLinks = [
  { label: "Government NDAP", href: "https://ndap.niti.gov.in/" },
  { label: "U-DISE+ Data", href: "https://udiseplus.gov.in/" },
  { label: "Notes", to: "/district-notes" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/devsaxena1109" },
  { label: "GitHub", href: "https://github.com/Neetu-Sahu", icon: GitBranch },
  { label: "Government Portal", href: "https://www.india.gov.in/", icon: Globe2 },
];

function XLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="bpis-xLogo"
    >
      <path
        d="M4 3h4.3l5.1 6.96L18.8 3H21l-6.15 8.32L21 21h-4.3l-5.4-7.38L6.2 21H4l6.5-8.86L4 3zm4.52 1.5H6.96l12.05 16h1.56l-12.05-16z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="bpis-linkedinLogo"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" fill="#0A66C2" />
      <circle cx="7.1" cy="7.2" r="1.8" fill="#ffffff" />
      <path
        d="M6 10.2h2.9V18H6v-7.8zm1.45-4.1c-.93 0-1.45.6-1.45 1.37s.53 1.35 1.44 1.35h.02c.95 0 1.45-.6 1.45-1.35-.02-.77-.5-1.37-1.46-1.37zM10.6 10.2h2.79V11.3c.4-.74 1.4-1.3 2.83-1.3 2.16 0 3.78 1.35 3.78 4.24V18h-2.9v-3.37c0-1.48-.56-2.49-1.96-2.49-1.07 0-1.71.72-1.99 1.42-.1.25-.12.6-.12.96V18h-2.93v-7.8z"
        fill="#ffffff"
      />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="bpis-githubLogo"
    >
      <circle cx="12" cy="12" r="12" fill="#0b0f14" />
      <path
        d="M12 3.5c-4.7 0-8.5 3.8-8.5 8.5 0 3.8 2.5 7 5.9 8.1.4.1.6-.2.6-.4v-1.4c-2.4.5-2.9-1-2.9-1-.4-1-.9-1.3-.9-1.3-.8-.6.1-.6.1-.6.9.1 1.4.9 1.4.9.8 1.4 2 .9 2.4.7.1-.6.3-1 .6-1.2-2.1-.2-4.3-1.1-4.3-4.9 0-1.1.4-2 1.1-2.7-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1 .8-.2 1.7-.4 2.6-.4s1.8.1 2.6.4c2-.8 2.9-1 2.9-1 .6 1.5.2 2.5.1 2.8.7.7 1.1 1.6 1.1 2.7 0 3.8-2.2 4.7-4.3 4.9.3.3.6.8.6 1.6v2.3c0 .2.2.5.6.4 3.4-1.1 5.9-4.3 5.9-8.1 0-4.7-3.8-8.5-8.5-8.5z"
        fill="#ffffff"
      />
    </svg>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div className="bpis-footer-column">
      <h3 className="bpis-footer-heading">{title}</h3>
      <div className="bpis-footer-linkList">
        {links.map((link) =>
          link.to ? (
            <Link key={link.label} to={link.to} className="bpis-footer-link">
              <span className="bpis-footer-dot" />
              <span>{link.label}</span>
            </Link>
          ) : (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="bpis-footer-link"
            >
              <span className="bpis-footer-dot" />
              <span>{link.label}</span>
            </a>
          ),
        )}
      </div>
    </div>
  );
}

function ProjectFooter() {
  return (
    <footer className="bpis-footer">
      <div className="bpis-footer-topGlow" />
      <div className="bpis-footer-inner">
        <section className="bpis-footer-left">
          <Link to="/overview" className="bpis-footer-brandLink">
            <div className="bpis-footer-brandMark">B</div>
            <div>
              <div className="bpis-footer-brandTitle">
                <span className="bpis-orange">BPIS</span>{" "}
                <span className="bpis-green">2026</span>
              </div>
              <div className="bpis-footer-brandSub">
                Bharat Policy Intelligence System
              </div>
            </div>
          </Link>

          <p className="bpis-footer-copy">
            India&apos;s first AI-powered policy intelligence platform for real-time
            administrative oversight. Empowering smarter governance through decision
            intelligence.
          </p>

          <div className="bpis-footer-socialRow">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="bpis-footer-socialBtn"
              >
                {label === "X" ? <XLogo /> : label === "LinkedIn" ? <LinkedInLogo /> : label === "GitHub" ? <GitHubLogo /> : <Icon size={16} />}
              </a>
            ))}
          </div>

          <Link to="/policy-advisor" className="bpis-footer-quoteCard">
            <div className="bpis-footer-quoteText">
              पारदर्शिता, जवाबदेही और त्वरित निर्णय
            </div>
            <div className="bpis-footer-quoteSub">प्रशासनिक सुशासन का आधार</div>
          </Link>
        </section>

        <section className="bpis-footer-middle">
          <FooterColumn title="ADMIN PANEL" links={adminLinks} />
          <FooterColumn title="POLICY TOOLS" links={policyLinks} />
          <FooterColumn title="RESOURCES" links={resourceLinks} />
        </section>

        <section className="bpis-footer-right">
          <div className="bpis-footer-rightTop">
            <Link to="/analytics" className="bpis-footer-actionBtn">
              <ShieldCheck size={16} />
              AI Advisor
            </Link>
          </div>

          <Link to="/district-comparison" className="bpis-footer-spotlight">
            <div className="bpis-footer-spotlightTag">Governance at a glance</div>
            <div className="bpis-footer-spotlightTitle">
              Policy readiness, analytics, and alerts in one place.
            </div>
            <div className="bpis-footer-spotlightCopy">
              Track district signals, compare outcomes, and surface the next best
              action without leaving the dashboard.
            </div>
          </Link>
        </section>
      </div>

      <div className="bpis-footer-bottom">
        <div className="bpis-footer-bottomRule" />
        <div className="bpis-footer-bottomRow">
          <Link to="/overview" className="bpis-footer-bottomText">
            © 2026 BPIS — Built by Team DNS Fusion
          </Link>
          <span className="bpis-footer-bottomText bpis-footer-bottomMuted">
            Real-time administrative intelligence for district governance.
          </span>
        </div>
      </div>

      <style>{`
        .bpis-footer {
          position: relative;
          margin-top: 40px;
          background: #0f1110;
          color: #e5e7eb;
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .bpis-footer-topGlow {
          position: absolute;
          inset: 0 0 auto 0;
          height: 10px;
          background: linear-gradient(90deg, transparent, rgba(255, 153, 51, 0.7), rgba(18, 136, 7, 0.7), transparent);
          box-shadow: 0 0 24px rgba(255, 153, 51, 0.22);
        }

        .bpis-footer-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 34px 28px 28px;
          display: grid;
          gap: 22px;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr) minmax(280px, 0.95fr);
          align-items: start;
        }

        .bpis-footer-left,
        .bpis-footer-middle,
        .bpis-footer-right {
          min-width: 0;
        }

        .bpis-footer-left {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .bpis-footer-brandLink {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
        }

        .bpis-footer-brandMark {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 1.6rem;
          font-weight: 900;
          color: #ff9933;
        }

        .bpis-footer-brandTitle {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 1;
        }

        .bpis-orange {
          color: #ff9933;
        }

        .bpis-green {
          color: #128807;
        }

        .bpis-footer-brandSub {
          margin-top: 6px;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 700;
        }

        .bpis-footer-copy {
          margin: 18px 0 0;
          max-width: 37ch;
          text-align: center;
          color: #cbd5e1;
          line-height: 1.7;
          font-size: 0.96rem;
        }

        .bpis-footer-socialRow {
          margin-top: 18px;
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .bpis-footer-socialBtn {
          width: 42px;
          height: 42px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: #f3f4f6;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }

        .bpis-xLogo {
          width: 16px;
          height: 16px;
          display: block;
        }

        .bpis-linkedinLogo {
          width: 16px;
          height: 16px;
          display: block;
        }

        .bpis-githubLogo {
          width: 16px;
          height: 16px;
          display: block;
        }

        .bpis-footer-socialBtn:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 153, 51, 0.4);
          color: #ff9933;
        }

        .bpis-footer-quoteCard {
          display: block;
          margin-top: 18px;
          width: 100%;
          max-width: 340px;
          text-decoration: none;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid rgba(255, 153, 51, 0.2);
          background: rgba(255, 255, 255, 0.035);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .bpis-footer-quoteCard:hover {
          transform: translateY(-1px);
          border-color: rgba(255, 153, 51, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }

        .bpis-footer-quoteText {
          color: #ffb347;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1.55;
        }

        .bpis-footer-quoteSub {
          margin-top: 6px;
          font-size: 0.75rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #9ca3af;
        }

        .bpis-footer-middle {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .bpis-footer-heading {
          margin: 0;
          font-size: 0.82rem;
          font-weight: 900;
          letter-spacing: 0.34em;
          text-transform: uppercase;
          color: white;
        }

        .bpis-footer-linkList {
          margin-top: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bpis-footer-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #cbd5e1;
          font-size: 0.92rem;
          font-weight: 600;
          padding: 9px 10px;
          border-radius: 14px;
          transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
        }

        .bpis-footer-link:hover {
          background: rgba(255, 255, 255, 0.07);
          color: white;
          transform: translateX(2px);
        }

        .bpis-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #ff9933;
          flex-shrink: 0;
        }

        .bpis-footer-right {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bpis-footer-rightTop {
          display: flex;
          justify-content: flex-end;
        }

        .bpis-footer-actionBtn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.92rem;
          background: #ff9933;
          color: #0f1110;
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .bpis-footer-actionBtn:hover {
          transform: translateY(-1px);
          background: #ffae5c;
        }

        .bpis-footer-spotlight {
          display: block;
          text-decoration: none;
          color: inherit;
          padding: 18px 20px;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.04);
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .bpis-footer-spotlight:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .bpis-footer-spotlightTag {
          font-size: 0.72rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: #9ca3af;
          font-weight: 800;
        }

        .bpis-footer-spotlightTitle {
          margin-top: 10px;
          color: white;
          font-size: 1.12rem;
          font-weight: 800;
          line-height: 1.45;
        }

        .bpis-footer-spotlightCopy {
          margin-top: 8px;
          color: #cbd5e1;
          font-size: 0.93rem;
          line-height: 1.75;
        }

        .bpis-footer-bottom {
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 28px 24px;
        }

        .bpis-footer-bottomRule {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin-bottom: 16px;
        }

        .bpis-footer-bottomRow {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 0.88rem;
          color: #9ca3af;
        }

        .bpis-footer-bottomText {
          color: inherit;
          text-decoration: none;
        }

        .bpis-footer-bottomMuted {
          color: #64748b;
        }

        @media (max-width: 1100px) {
          .bpis-footer-inner {
            grid-template-columns: 1fr;
          }

          .bpis-footer-middle {
            grid-template-columns: 1fr;
          }

          .bpis-footer-rightTop {
            justify-content: flex-start;
          }
        }

        @media (max-width: 640px) {
          .bpis-footer-inner,
          .bpis-footer-bottom {
            padding-left: 18px;
            padding-right: 18px;
          }

          .bpis-footer-left {
            align-items: flex-start;
            text-align: left;
          }

          .bpis-footer-copy {
            text-align: left;
          }

          .bpis-footer-socialRow {
            justify-content: flex-start;
          }

          .bpis-footer-quoteCard {
            max-width: 100%;
          }
        }
      `}</style>
    </footer>
  );
}

export default ProjectFooter;
