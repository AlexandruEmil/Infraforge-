const pptxgen = require("/home/claude/.npm-global/lib/node_modules/pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "InfraForge – AI Cloud Infrastructure Generator";

// Color palette: deep navy + electric cyan + white
const C = {
  navy:    "0B1628",
  navyMid: "0F2040",
  cyan:    "00C8A0",
  blue:    "0080FF",
  white:   "FFFFFF",
  offWhite:"E8F4FF",
  muted:   "4A6880",
  light:   "C8D8E8",
};

const makeShadow = () => ({ type: "outer", blur: 18, offset: 4, angle: 135, color: "000000", opacity: 0.22 });

// ─────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Left accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  // Decorative grid dots (right side atmosphere)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 6; col++) {
      s.addShape(pres.shapes.OVAL, {
        x: 6.8 + col * 0.5, y: 0.3 + row * 0.62,
        w: 0.07, h: 0.07,
        fill: { color: C.muted, transparency: 60 },
        line: { color: C.muted, width: 0 }
      });
    }
  }

  // Glowing circle bg behind icon
  s.addShape(pres.shapes.OVAL, {
    x: 0.6, y: 0.55, w: 1.1, h: 1.1,
    fill: { color: C.cyan, transparency: 82 },
    line: { color: C.cyan, transparency: 60, width: 1 }
  });

  // Icon placeholder hexagon
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.75, y: 0.7, w: 0.8, h: 0.8,
    fill: { color: C.cyan },
    line: { color: C.cyan, width: 0 },
    rectRadius: 0.15
  });
  s.addText("⬡", { x: 0.75, y: 0.68, w: 0.8, h: 0.85, fontSize: 28, color: C.navy, align: "center", valign: "middle", margin: 0 });

  // Tag line
  s.addText("PORTFOLIO PROJECT  •  2024", {
    x: 0.18, y: 1.7, w: 5, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });

  // Main title
  s.addText("InfraForge", {
    x: 0.18, y: 2.0, w: 9.3, h: 1.2,
    fontSize: 64, fontFace: "Trebuchet MS", bold: true,
    color: C.white
  });

  // Subtitle
  s.addText("AI-Powered Cloud Infrastructure Generator", {
    x: 0.18, y: 3.15, w: 9, h: 0.55,
    fontSize: 20, fontFace: "Trebuchet MS", color: C.light, italic: false
  });

  // Tech tags
  const tags = ["Terraform", "Kubernetes", "AWS", "Claude API"];
  tags.forEach((tag, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.18 + i * 1.6, y: 4.0, w: 1.45, h: 0.38,
      fill: { color: C.navyMid },
      line: { color: C.cyan, width: 1 }
    });
    s.addText(tag, {
      x: 0.18 + i * 1.6, y: 4.0, w: 1.45, h: 0.38,
      fontSize: 10, color: C.cyan, align: "center", valign: "middle",
      bold: true, charSpacing: 1, margin: 0
    });
  });

  // Bottom line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 5.1, w: 9.6, h: 0.02,
    fill: { color: C.muted, transparency: 50 },
    line: { color: C.muted, width: 0 }
  });
  s.addText("Describe infrastructure in plain English → Get production-ready Terraform, Kubernetes & CI/CD", {
    x: 0.18, y: 5.18, w: 9.2, h: 0.3,
    fontSize: 10, color: C.muted, italic: true
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 — The Problem
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("THE PROBLEM", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("Cloud infra is hard. Most developers waste days on it.", {
    x: 0.18, y: 0.6, w: 9.5, h: 0.85,
    fontSize: 26, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  const problems = [
    { icon: "⏱", title: "Hours of boilerplate", body: "Terraform configs, Kubernetes YAML, IAM roles — written from scratch every time." },
    { icon: "❌", title: "Error-prone by default", body: "Missing security groups, wrong resource limits, no health checks — bugs slip into prod." },
    { icon: "📚", title: "Steep learning curve", body: "AWS + K8s + Terraform = 3 different tools, docs, and mental models to juggle simultaneously." },
  ];

  problems.forEach((p, i) => {
    const x = 0.18 + i * 3.22;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.65, w: 3.0, h: 3.1,
      fill: { color: C.navyMid },
      line: { color: C.muted, width: 1 },
      shadow: makeShadow()
    });
    // top accent
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.65, w: 3.0, h: 0.06,
      fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
    });
    s.addText(p.icon, { x, y: 1.75, w: 3.0, h: 0.6, fontSize: 28, align: "center" });
    s.addText(p.title, {
      x: x + 0.15, y: 2.42, w: 2.7, h: 0.4,
      fontSize: 13, fontFace: "Trebuchet MS", bold: true, color: C.white, align: "center"
    });
    s.addText(p.body, {
      x: x + 0.18, y: 2.88, w: 2.65, h: 1.6,
      fontSize: 11, color: C.light, align: "center", valign: "top"
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3 — The Solution
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("THE SOLUTION", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("Type it. Deploy it.", {
    x: 0.18, y: 0.62, w: 9, h: 0.8,
    fontSize: 40, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  // Input box (left)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 1.6, w: 4.5, h: 3.5,
    fill: { color: "050A0F" },
    line: { color: C.cyan, width: 1 },
    shadow: makeShadow()
  });
  // top bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 1.6, w: 4.5, h: 0.32,
    fill: { color: "0A1420" }, line: { color: C.cyan, width: 0 }
  });
  s.addText("● ● ●", { x: 0.3, y: 1.62, w: 1, h: 0.28, fontSize: 10, color: C.muted });
  s.addText("infra-request.txt", { x: 0.18, y: 1.62, w: 4.5, h: 0.28, fontSize: 9, color: C.muted, align: "center" });

  s.addText(
    '> "Deploy a scalable Node.js\n   API on AWS with:\n   - Load balancer\n   - Auto-scaling group\n   - RDS PostgreSQL\n   - CloudFront CDN\n   - EKS cluster"\n\n█',
    {
      x: 0.35, y: 2.05, w: 4.15, h: 2.8,
      fontSize: 11, color: C.cyan, fontFace: "Courier New", valign: "top"
    }
  );

  // Arrow
  s.addShape(pres.shapes.LINE, {
    x: 4.88, y: 3.35, w: 0.5, h: 0,
    line: { color: C.cyan, width: 2 }
  });
  s.addText("→", { x: 5.0, y: 3.18, w: 0.5, h: 0.35, fontSize: 20, color: C.cyan, align: "center" });

  // Output tabs (right)
  const outputs = [
    { label: "Terraform HCL", color: C.cyan },
    { label: "Kubernetes YAML", color: "7C3AED" },
    { label: "Architecture Diagram", color: "0080FF" },
    { label: "GitHub Actions CI/CD", color: "F59E0B" },
  ];
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.5, y: 1.6, w: 4.28, h: 3.5,
    fill: { color: "050A0F" },
    line: { color: C.muted, width: 1 },
    shadow: makeShadow()
  });
  outputs.forEach((o, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.5, y: 1.6 + i * 0.86, w: 0.05, h: 0.84,
      fill: { color: o.color }, line: { color: o.color, width: 0 }
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 5.55, y: 1.6 + i * 0.86, w: 4.23, h: 0.84,
      fill: { color: "0A1420" }, line: { color: "111E2E", width: 1 }
    });
    s.addText(o.label, {
      x: 5.75, y: 1.72 + i * 0.86, w: 3.8, h: 0.3,
      fontSize: 11, color: C.white, bold: true, margin: 0
    });
    s.addText("Generated ✓", {
      x: 5.75, y: 2.0 + i * 0.86, w: 3.8, h: 0.22,
      fontSize: 9, color: o.color, margin: 0
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 — How It Works
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("HOW IT WORKS", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("4 steps from idea to production", {
    x: 0.18, y: 0.62, w: 9, h: 0.7,
    fontSize: 34, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  const steps = [
    { num: "01", title: "Describe", body: "User types infrastructure requirements in plain English — no YAML, no HCL syntax needed." },
    { num: "02", title: "AI Generates", body: "Claude AI interprets the request and crafts complete, best-practice infrastructure code." },
    { num: "03", title: "Review Output", body: "Terraform, K8s configs, architecture diagram, and CI/CD pipeline — all in one click." },
    { num: "04", title: "Deploy", body: "Copy the generated configs into your repo and push. The GitHub Actions pipeline does the rest." },
  ];

  steps.forEach((step, i) => {
    const x = 0.18 + (i % 2) * 4.85;
    const y = 1.55 + Math.floor(i / 2) * 1.78;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.55, h: 1.6,
      fill: { color: C.navyMid },
      line: { color: C.muted, width: 1 },
      shadow: makeShadow()
    });

    // Number badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: x + 0.15, y: y + 0.18, w: 0.55, h: 0.55,
      fill: { color: C.cyan },
      line: { color: C.cyan, width: 0 }
    });
    s.addText(step.num, {
      x: x + 0.15, y: y + 0.18, w: 0.55, h: 0.55,
      fontSize: 13, color: C.navy, bold: true, align: "center", valign: "middle", margin: 0
    });

    s.addText(step.title, {
      x: x + 0.85, y: y + 0.18, w: 3.5, h: 0.38,
      fontSize: 15, fontFace: "Trebuchet MS", bold: true, color: C.white
    });
    s.addText(step.body, {
      x: x + 0.85, y: y + 0.58, w: 3.5, h: 0.85,
      fontSize: 11, color: C.light
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 — Tech Stack
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("TECH STACK", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("Built with production-grade tools", {
    x: 0.18, y: 0.65, w: 9, h: 0.65,
    fontSize: 28, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  const techs = [
    { name: "Claude AI", role: "Intelligence Layer", desc: "Interprets natural language and generates accurate, best-practice infrastructure code via Anthropic API.", color: "7C3AED" },
    { name: "Terraform", role: "Infrastructure as Code", desc: "Generates complete HCL configs with providers, resources, variables, outputs, and remote state.", color: "5C4EE5" },
    { name: "Kubernetes", role: "Container Orchestration", desc: "Outputs Deployments, Services, HPAs, and Ingress manifests with resource limits and health checks.", color: "3B82F6" },
    { name: "AWS", role: "Cloud Platform", desc: "Targets VPC, EC2, EKS, RDS, Lambda, CloudFront, S3 — multi-AZ, encrypted, production-ready.", color: "F59E0B" },
    { name: "GitHub Actions", role: "CI/CD Pipeline", desc: "Auto-generates complete pipelines with build, test, terraform plan/apply, and kubernetes deploy stages.", color: "00C8A0" },
    { name: "React", role: "Frontend UI", desc: "Clean terminal-aesthetic interface with real-time streaming output and tabbed code display.", color: "0080FF" },
  ];

  techs.forEach((t, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.18 + col * 3.22;
    const y = 1.55 + row * 1.75;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 1.58,
      fill: { color: C.navyMid },
      line: { color: t.color, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 3.05, h: 0.05,
      fill: { color: t.color }, line: { color: t.color, width: 0 }
    });
    s.addText(t.name, {
      x: x + 0.15, y: y + 0.12, w: 2.75, h: 0.38,
      fontSize: 14, fontFace: "Trebuchet MS", bold: true, color: C.white
    });
    s.addText(t.role.toUpperCase(), {
      x: x + 0.15, y: y + 0.48, w: 2.75, h: 0.22,
      fontSize: 8, color: t.color, bold: true, charSpacing: 1
    });
    s.addText(t.desc, {
      x: x + 0.15, y: y + 0.7, w: 2.75, h: 0.78,
      fontSize: 10, color: C.light
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6 — Key Features
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("KEY FEATURES", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("Everything you need to ship infra fast", {
    x: 0.18, y: 0.62, w: 9.5, h: 0.7,
    fontSize: 30, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  const features = [
    { icon: "⚡", label: "Instant generation", detail: "Full Terraform + K8s + CI/CD in under 10 seconds" },
    { icon: "🔒", label: "Security built-in", detail: "IAM roles, encrypted storage, security groups by default" },
    { icon: "📐", label: "Architecture diagram", detail: "ASCII visual map of every component and its connections" },
    { icon: "☁", label: "Multi-service AWS", detail: "EKS, RDS, Lambda, CloudFront, S3, API Gateway and more" },
    { icon: "♻", label: "One-click CI/CD", detail: "GitHub Actions pipeline auto-generated with every request" },
    { icon: "📋", label: "Copy & deploy", detail: "Output is ready to paste directly into your repository" },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.18 + col * 4.88;
    const y = 1.5 + row * 1.25;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.6, h: 1.12,
      fill: { color: C.navyMid },
      line: { color: C.muted, width: 1 }
    });

    s.addText(f.icon, {
      x: x + 0.1, y: y + 0.12, w: 0.65, h: 0.65,
      fontSize: 26, align: "center"
    });
    s.addText(f.label, {
      x: x + 0.85, y: y + 0.12, w: 3.6, h: 0.38,
      fontSize: 13, bold: true, color: C.white, fontFace: "Trebuchet MS"
    });
    s.addText(f.detail, {
      x: x + 0.85, y: y + 0.5, w: 3.6, h: 0.45,
      fontSize: 11, color: C.light
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 — Impact & Results
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("IMPACT", {
    x: 0.18, y: 0.35, w: 9, h: 0.3,
    fontSize: 9, color: C.cyan, bold: true, charSpacing: 4
  });
  s.addText("From idea to infra in seconds, not days", {
    x: 0.18, y: 0.62, w: 9, h: 0.7,
    fontSize: 30, fontFace: "Trebuchet MS", bold: true, color: C.white
  });

  const stats = [
    { value: "< 10s", label: "Generation time", sub: "vs. hours of manual work" },
    { value: "4", label: "Outputs per request", sub: "Terraform, K8s, Diagram, CI/CD" },
    { value: "100%", label: "Production-ready", sub: "Best practices enforced by AI" },
    { value: "0", label: "Config experience needed", sub: "Plain English is enough" },
  ];

  stats.forEach((st, i) => {
    const x = 0.18 + i * 2.42;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.25, h: 2.4,
      fill: { color: C.navyMid },
      line: { color: C.cyan, width: 1 },
      shadow: makeShadow()
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.6, w: 2.25, h: 0.06,
      fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
    });
    s.addText(st.value, {
      x, y: 1.75, w: 2.25, h: 0.9,
      fontSize: 38, fontFace: "Trebuchet MS", bold: true, color: C.cyan, align: "center"
    });
    s.addText(st.label, {
      x, y: 2.65, w: 2.25, h: 0.45,
      fontSize: 12, bold: true, color: C.white, align: "center"
    });
    s.addText(st.sub, {
      x, y: 3.1, w: 2.25, h: 0.75,
      fontSize: 10, color: C.muted, align: "center"
    });
  });

  // Quote
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 4.2, w: 9.6, h: 1.0,
    fill: { color: "050A0F" },
    line: { color: C.muted, width: 1 }
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.18, y: 4.2, w: 0.06, h: 1.0,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });
  s.addText(
    '"Describe your cloud infrastructure and InfraForge handles the rest — Terraform, Kubernetes, CI/CD — all generated, all production-ready."',
    {
      x: 0.42, y: 4.3, w: 9.2, h: 0.8,
      fontSize: 13, color: C.light, italic: true, valign: "middle"
    }
  );
}

// ─────────────────────────────────────────────
// SLIDE 8 — Closing / CTA
// ─────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Large background hexagon texture
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 14; col++) {
      s.addShape(pres.shapes.OVAL, {
        x: col * 0.72, y: row * 0.93,
        w: 0.12, h: 0.12,
        fill: { color: C.muted, transparency: 80 },
        line: { color: C.muted, width: 0 }
      });
    }
  }

  // Center card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.2, y: 0.8, w: 7.6, h: 4.1,
    fill: { color: C.navyMid },
    line: { color: C.cyan, width: 1 },
    shadow: makeShadow()
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 1.2, y: 0.8, w: 7.6, h: 0.06,
    fill: { color: C.cyan }, line: { color: C.cyan, width: 0 }
  });

  s.addText("Let's connect", {
    x: 1.5, y: 1.1, w: 7, h: 0.7,
    fontSize: 42, fontFace: "Trebuchet MS", bold: true, color: C.white, align: "center"
  });

  s.addText("I'm open to opportunities in cloud engineering, full-stack development,\nand AI-powered developer tools.", {
    x: 1.5, y: 1.85, w: 7, h: 0.75,
    fontSize: 14, color: C.light, align: "center"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.3, y: 2.75, w: 3.4, h: 0.52,
    fill: { color: C.cyan },
    line: { color: C.cyan, width: 0 }
  });
  s.addText("View on GitHub  →", {
    x: 3.3, y: 2.75, w: 3.4, h: 0.52,
    fontSize: 14, bold: true, color: C.navy, align: "center", valign: "middle", margin: 0
  });

  s.addText("InfraForge • AI Cloud Infrastructure Generator • Built with Claude + Terraform + Kubernetes", {
    x: 1.5, y: 3.45, w: 7, h: 0.4,
    fontSize: 10, color: C.muted, align: "center"
  });

  // Tags
  const ctaTags = ["#CloudEngineering", "#AI", "#Terraform", "#Kubernetes", "#OpenToWork"];
  s.addText(ctaTags.join("   "), {
    x: 1.5, y: 3.95, w: 7, h: 0.4,
    fontSize: 11, color: C.cyan, align: "center", bold: true
  });
}

// Write
pres.writeFile({ fileName: "/home/claude/InfraForge_LinkedIn.pptx" })
  .then(() => console.log("✅ Done: InfraForge_LinkedIn.pptx"))
  .catch(e => { console.error("❌", e); process.exit(1); });
