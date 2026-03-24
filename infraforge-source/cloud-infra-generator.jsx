import { useState, useRef, useEffect } from "react";

const PRESET_EXAMPLES = [
  "Deploy a scalable Node.js app on AWS with load balancer and auto-scaling",
  "Set up a microservices architecture with API Gateway, Lambda, and RDS PostgreSQL",
  "Create a high-availability Redis cluster on AWS with EKS and persistent storage",
  "Deploy a Next.js app with CloudFront CDN, S3 static assets, and RDS database",
];

const TABS = ["terraform", "kubernetes", "diagram", "pipeline"];
const TAB_LABELS = {
  terraform: "Terraform",
  kubernetes: "K8s Config",
  diagram: "Architecture",
  pipeline: "CI/CD Pipeline",
};
const TAB_ICONS = {
  terraform: "⬡",
  kubernetes: "☸",
  diagram: "⬡",
  pipeline: "⟳",
};

function TypingCursor() {
  return <span className="cursor">█</span>;
}

function parseSection(text, startTag, endTag) {
  const start = text.indexOf(startTag);
  const end = text.indexOf(endTag);
  if (start === -1) return null;
  const content = text.substring(
    start + startTag.length,
    end === -1 ? undefined : end
  );
  return content.trim();
}

function extractSections(raw) {
  return {
    terraform:
      parseSection(raw, "<TERRAFORM>", "</TERRAFORM>") ||
      parseSection(raw, "```hcl", "```") ||
      "",
    kubernetes:
      parseSection(raw, "<KUBERNETES>", "</KUBERNETES>") ||
      parseSection(raw, "```yaml", "```") ||
      "",
    diagram: parseSection(raw, "<DIAGRAM>", "</DIAGRAM>") || "",
    pipeline:
      parseSection(raw, "<PIPELINE>", "</PIPELINE>") ||
      parseSection(raw, "<CICD>", "</CICD>") ||
      "",
  };
}

function DiagramRenderer({ content }) {
  if (!content)
    return (
      <div className="empty-state">No diagram generated yet.</div>
    );

  // Parse the ASCII/text diagram from Claude
  const lines = content.split("\n");
  return (
    <div className="diagram-container">
      <pre className="diagram-text">{content}</pre>
    </div>
  );
}

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-header">
        <span className="lang-badge">{language}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre className="code-block">
        <code>{code || "Generating..."}</code>
      </pre>
    </div>
  );
}

export default function CloudInfraGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("terraform");
  const [sections, setSections] = useState({
    terraform: "",
    kubernetes: "",
    diagram: "",
    pipeline: "",
  });
  const [rawOutput, setRawOutput] = useState("");
  const [streamBuffer, setStreamBuffer] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | generating | done | error
  const [errorMsg, setErrorMsg] = useState("");
  const [dots, setDots] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (loading) {
      const iv = setInterval(
        () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
        400
      );
      return () => clearInterval(iv);
    }
  }, [loading]);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setPhase("generating");
    setRawOutput("");
    setStreamBuffer("");
    setSections({ terraform: "", kubernetes: "", diagram: "", pipeline: "" });
    setErrorMsg("");

    const systemPrompt = `You are an expert cloud infrastructure engineer. When given an infrastructure request, generate complete, production-ready infrastructure code.

ALWAYS respond with ALL FOUR sections in this EXACT format with these exact XML tags:

<TERRAFORM>
[Complete Terraform HCL code with provider configuration, all resources, variables, and outputs. Include AWS provider, VPC, security groups, and all necessary resources for the described architecture.]
</TERRAFORM>

<KUBERNETES>
[Complete Kubernetes YAML manifests including Deployment, Service, HorizontalPodAutoscaler, and Ingress. Separate multiple resources with --- . Include resource limits, health checks, and proper labels.]
</KUBERNETES>

<DIAGRAM>
[ASCII architecture diagram showing the infrastructure components and their connections. Use ASCII art boxes, arrows, and labels to illustrate the architecture clearly. Make it detailed and informative.]
</DIAGRAM>

<PIPELINE>
[Complete GitHub Actions CI/CD pipeline YAML with build, test, terraform plan/apply, and kubernetes deploy stages. Include proper secrets references and environment configuration.]
</PIPELINE>

Make all code production-ready with best practices: proper tagging, security groups, IAM roles, encryption at rest, multi-AZ where appropriate. Use realistic, working configurations.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      const fullText = data.content
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n");

      setRawOutput(fullText);
      const parsed = extractSections(fullText);
      setSections(parsed);
      setPhase("done");

      // Auto-switch to first populated tab
      for (const tab of TABS) {
        if (parsed[tab]) {
          setActiveTab(tab);
          break;
        }
      }
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
  };

  const hasOutput = phase === "done" || phase === "error";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #080c10;
          color: #c8d8e8;
          font-family: 'JetBrains Mono', monospace;
          min-height: 100vh;
        }

        .app {
          min-height: 100vh;
          background: #080c10;
          background-image:
            radial-gradient(ellipse at 20% 0%, rgba(0,180,120,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 100%, rgba(0,120,255,0.06) 0%, transparent 60%);
        }

        .header {
          border-bottom: 1px solid rgba(0,200,140,0.15);
          padding: 24px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          background: rgba(0,0,0,0.4);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #00c87a, #0080ff);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: #080c10;
          font-weight: 900;
        }

        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #e8f4ff;
          letter-spacing: -0.3px;
        }

        .logo-sub {
          font-size: 10px;
          color: #00c87a;
          letter-spacing: 3px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .header-badge {
          margin-left: auto;
          font-size: 10px;
          color: #00c87a;
          border: 1px solid rgba(0,200,122,0.3);
          padding: 4px 10px;
          border-radius: 20px;
          letter-spacing: 1px;
        }

        .main {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 40px;
        }

        .hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(28px, 4vw, 44px);
          font-weight: 800;
          color: #e8f4ff;
          line-height: 1.1;
          margin-bottom: 10px;
        }

        .hero h1 span {
          background: linear-gradient(90deg, #00c87a, #0080ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 13px;
          color: #607080;
          letter-spacing: 0.5px;
        }

        .input-section {
          background: rgba(10,18,28,0.8);
          border: 1px solid rgba(0,200,140,0.2);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 24px;
          transition: border-color 0.2s;
        }

        .input-section:focus-within {
          border-color: rgba(0,200,140,0.5);
          box-shadow: 0 0 0 3px rgba(0,200,140,0.06);
        }

        .input-label {
          padding: 12px 16px 0;
          font-size: 10px;
          color: #00c87a;
          letter-spacing: 2px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-label::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #00c87a;
          border-radius: 50%;
          display: inline-block;
        }

        .prompt-textarea {
          width: 100%;
          min-height: 100px;
          background: transparent;
          border: none;
          outline: none;
          color: #c8d8e8;
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          line-height: 1.7;
          padding: 12px 16px 16px;
          resize: vertical;
          caret-color: #00c87a;
        }

        .prompt-textarea::placeholder {
          color: #2a3a4a;
        }

        .input-footer {
          border-top: 1px solid rgba(0,200,140,0.08);
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .presets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .preset-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #405060;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .preset-btn:hover {
          color: #00c87a;
          border-color: rgba(0,200,122,0.3);
          background: rgba(0,200,122,0.05);
        }

        .generate-btn {
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #080c10;
          background: linear-gradient(135deg, #00c87a, #00a060);
          border: none;
          padding: 10px 24px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .generate-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,200,122,0.3);
        }

        .generate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .shortcut {
          font-size: 10px;
          opacity: 0.6;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 400;
        }

        /* Status bar */
        .status-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: rgba(0,200,122,0.06);
          border: 1px solid rgba(0,200,122,0.15);
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 12px;
          color: #00c87a;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,200,122,0.2);
          border-top-color: #00c87a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .error-bar {
          background: rgba(255,60,60,0.06);
          border-color: rgba(255,60,60,0.2);
          color: #ff6060;
        }

        /* Output section */
        .output-section {
          background: rgba(10,18,28,0.8);
          border: 1px solid rgba(0,200,140,0.15);
          border-radius: 12px;
          overflow: hidden;
        }

        .tab-bar {
          display: flex;
          background: rgba(0,0,0,0.3);
          border-bottom: 1px solid rgba(0,200,140,0.1);
        }

        .tab-btn {
          flex: 1;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #405060;
          background: transparent;
          border: none;
          border-right: 1px solid rgba(0,200,140,0.08);
          padding: 12px 8px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          letter-spacing: 0.5px;
          position: relative;
        }

        .tab-btn:last-child { border-right: none; }

        .tab-btn:hover { color: #c8d8e8; background: rgba(255,255,255,0.02); }

        .tab-btn.active {
          color: #00c87a;
          background: rgba(0,200,122,0.06);
        }

        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00c87a, #0080ff);
        }

        .tab-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.4;
        }

        .tab-btn.has-content .tab-dot { opacity: 1; }

        .tab-content {
          padding: 20px;
          min-height: 300px;
        }

        .code-block-wrapper {
          background: #050a0f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: rgba(255,255,255,0.03);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        .lang-badge {
          font-size: 10px;
          color: #00c87a;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .copy-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #405060;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 3px 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: 0.5px;
        }

        .copy-btn:hover { color: #00c87a; border-color: rgba(0,200,122,0.3); }

        .code-block {
          padding: 16px;
          overflow-x: auto;
          font-size: 12px;
          line-height: 1.7;
          color: #8ab4c8;
          white-space: pre;
          max-height: 520px;
          overflow-y: auto;
        }

        .code-block::-webkit-scrollbar { width: 6px; height: 6px; }
        .code-block::-webkit-scrollbar-track { background: transparent; }
        .code-block::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .diagram-container {
          background: #050a0f;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 24px;
          overflow: auto;
        }

        .diagram-text {
          font-size: 12px;
          line-height: 1.6;
          color: #7ab090;
          white-space: pre;
          font-family: 'JetBrains Mono', monospace;
        }

        .empty-state {
          color: #2a3a4a;
          font-size: 13px;
          text-align: center;
          padding: 80px 20px;
        }

        .placeholder-output {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 16px;
          color: #2a3a4a;
        }

        .placeholder-icon {
          font-size: 48px;
          opacity: 0.3;
        }

        .placeholder-output p {
          font-size: 13px;
          text-align: center;
          max-width: 360px;
          line-height: 1.7;
        }

        .placeholder-chips {
          display: flex;
          gap: 8px;
          margin-top: 8px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .chip {
          font-size: 10px;
          color: #304050;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 4px 12px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .cursor {
          animation: blink 1s step-end infinite;
          color: #00c87a;
        }
        @keyframes blink { 50% { opacity: 0; } }

        @media (max-width: 600px) {
          .main { padding: 20px 16px; }
          .header { padding: 16px; }
          .tab-btn { font-size: 9px; padding: 10px 4px; }
        }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">⬡</div>
            <div>
              <div className="logo-text">InfraForge</div>
              <div className="logo-sub">AI Infrastructure Generator</div>
            </div>
          </div>
          <div className="header-badge">POWERED BY CLAUDE</div>
        </header>

        <main className="main">
          <div className="hero">
            <h1>
              Describe your infra,<br />
              <span>ship it instantly.</span>
            </h1>
            <p>
              Terraform · Kubernetes · AWS · CI/CD — generated in seconds.
            </p>
          </div>

          <div className="input-section">
            <div className="input-label">Infrastructure Request</div>
            <textarea
              ref={textareaRef}
              className="prompt-textarea"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Describe your cloud infrastructure...\n\nExamples:\n  "Deploy a scalable Node.js API on AWS with load balancer and RDS"\n  "Kubernetes microservices with API Gateway and Redis cache"`}
              rows={5}
            />
            <div className="input-footer">
              <div className="presets">
                {PRESET_EXAMPLES.slice(0, 3).map((ex, i) => (
                  <button
                    key={i}
                    className="preset-btn"
                    title={ex}
                    onClick={() => setPrompt(ex)}
                  >
                    ↗ {ex.substring(0, 36)}…
                  </button>
                ))}
              </div>
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Generating{dots}
                  </>
                ) : (
                  <>
                    ⚡ Generate
                    <span className="shortcut">⌘↵</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {phase === "generating" && (
            <div className="status-bar">
              <div className="spinner" />
              Analyzing infrastructure requirements and generating configs
              {dots}
            </div>
          )}

          {phase === "error" && (
            <div className="status-bar error-bar">
              ✗ Error: {errorMsg}
            </div>
          )}

          <div className="output-section">
            <div className="tab-bar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : ""} ${sections[tab] ? "has-content" : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  <span>{TAB_ICONS[tab]}</span>
                  {TAB_LABELS[tab]}
                  <span className="tab-dot" />
                </button>
              ))}
            </div>

            <div className="tab-content">
              {!hasOutput && phase !== "generating" ? (
                <div className="placeholder-output">
                  <div className="placeholder-icon">☁</div>
                  <p>
                    Describe your infrastructure above and click Generate.
                    <br />
                    You'll get production-ready Terraform, Kubernetes configs,
                    an architecture diagram, and a CI/CD pipeline.
                  </p>
                  <div className="placeholder-chips">
                    <span className="chip">Terraform HCL</span>
                    <span className="chip">Kubernetes YAML</span>
                    <span className="chip">AWS Architecture</span>
                    <span className="chip">GitHub Actions</span>
                  </div>
                </div>
              ) : phase === "generating" && !sections[activeTab] ? (
                <div className="placeholder-output">
                  <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                  <p>Generating {TAB_LABELS[activeTab]}<TypingCursor /></p>
                </div>
              ) : activeTab === "diagram" ? (
                <DiagramRenderer content={sections.diagram} />
              ) : (
                <CodeBlock
                  code={sections[activeTab]}
                  language={
                    activeTab === "terraform"
                      ? "HCL"
                      : activeTab === "kubernetes"
                      ? "YAML"
                      : activeTab === "pipeline"
                      ? "YAML"
                      : "TEXT"
                  }
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
