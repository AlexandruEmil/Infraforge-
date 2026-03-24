from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

W, H = A4  # 595 x 842 pt

# ── Palette ──────────────────────────────────────────
INK     = HexColor("#0D0D0D")
PAPER   = HexColor("#F5F2EC")   # warm off-white, like newsprint
RED     = HexColor("#D93B2B")   # editorial red accent
CREAM   = HexColor("#EDE9E1")
MIDGREY = HexColor("#7A7A72")
LTGREY  = HexColor("#C8C5BC")
BLACK   = HexColor("#0D0D0D")

def new_page(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)

def rule(c, x, y, w, color=INK, thick=0.8):
    c.setStrokeColor(color)
    c.setLineWidth(thick)
    c.line(x, y, x + w, y)

def vrule(c, x, y1, y2, color=INK, thick=0.8):
    c.setStrokeColor(color)
    c.setLineWidth(thick)
    c.line(x, y1, x, y2)

def label(c, text, x, y, size=7, color=MIDGREY, font="Helvetica-Bold"):
    c.setFont(font, size)
    c.setFillColor(color)
    c.drawString(x, y, text)

def body_text(c, text, x, y, width, size=9.5, color=INK, leading=15):
    """Simple word-wrap body text."""
    c.setFont("Helvetica", size)
    c.setFillColor(color)
    words = text.split()
    line = ""
    cy = y
    for w_word in words:
        test = (line + " " + w_word).strip()
        if c.stringWidth(test, "Helvetica", size) <= width:
            line = test
        else:
            c.drawString(x, cy, line)
            cy -= leading
            line = w_word
    if line:
        c.drawString(x, cy, line)
    return cy - leading

def pill(c, x, y, w, h, color):
    c.setFillColor(color)
    c.setStrokeColor(color)
    c.roundRect(x, y, w, h, h / 2, fill=1, stroke=0)

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 1 — COVER
# ─────────────────────────────────────────────────────────────────────────────
def page_cover(c):
    new_page(c)

    # Left thick column — full height ink block
    c.setFillColor(INK)
    c.rect(0, 0, 52, H, fill=1, stroke=0)

    # Rotated label on left column
    c.saveState()
    c.setFillColor(PAPER)
    c.setFont("Helvetica-Bold", 7)
    c.translate(26, H / 2)
    c.rotate(90)
    c.drawCentredString(0, 0, "PORTFOLIO PROJECT  ·  CLOUD INFRASTRUCTURE  ·  2024")
    c.restoreState()

    # Top horizontal rule
    rule(c, 68, H - 48, W - 80, INK, 2.5)

    # Issue / date label row
    label(c, "INFRAFORGE", 68, H - 68, 8, INK, "Helvetica-Bold")
    label(c, "AI INFRASTRUCTURE GENERATOR", 68 + 80, H - 68, 8, MIDGREY)
    label(c, "LINKEDIN PORTFOLIO  ·  2024", W - 200, H - 68, 8, MIDGREY)

    rule(c, 68, H - 78, W - 80, LTGREY, 0.5)

    # Giant display title — very large, editorial
    c.setFont("Helvetica-Bold", 98)
    c.setFillColor(INK)
    c.drawString(68, H - 200, "Infra")

    c.setFont("Helvetica-Bold", 98)
    c.setFillColor(RED)
    c.drawString(68, H - 298, "Forge")

    # Thin rule below title
    rule(c, 68, H - 318, W - 80, RED, 2)

    # Tagline
    c.setFont("Helvetica-Bold", 15)
    c.setFillColor(INK)
    c.drawString(68, H - 348, "Describe infrastructure in plain English.")

    c.setFont("Helvetica", 13)
    c.setFillColor(MIDGREY)
    c.drawString(68, H - 368, "AI generates production-ready Terraform, Kubernetes & CI/CD.")

    # ── Big quote block ──────────────────────────────
    c.setFillColor(CREAM)
    c.rect(68, H - 490, W - 80, 95, fill=1, stroke=0)
    rule(c, 68, H - 395, 4, RED, 0)
    c.setFillColor(RED)
    c.rect(68, H - 490, 5, 95, fill=1, stroke=0)

    c.setFont("Helvetica-BoldOblique", 13)
    c.setFillColor(INK)
    c.drawString(85, H - 432, '"Deploy a scalable Node.js app on AWS with load')
    c.drawString(85, H - 450, 'balancer, auto-scaling, and RDS PostgreSQL."')

    c.setFont("Helvetica", 9)
    c.setFillColor(MIDGREY)
    c.drawString(85, H - 472, "→  Terraform HCL  +  Kubernetes YAML  +  Architecture Diagram  +  GitHub Actions")

    # ── Tech stack tags ──────────────────────────────
    tags = ["Terraform", "Kubernetes", "AWS", "Claude API", "GitHub Actions", "React"]
    tx = 68
    for tag in tags:
        tw = c.stringWidth(tag, "Helvetica-Bold", 8) + 16
        c.setFillColor(INK)
        c.roundRect(tx, H - 530, tw, 18, 4, fill=1, stroke=0)
        c.setFillColor(PAPER)
        c.setFont("Helvetica-Bold", 8)
        c.drawString(tx + 8, H - 520, tag)
        tx += tw + 6

    # ── Bottom grid: 3 stats ─────────────────────────
    rule(c, 68, 175, W - 80, INK, 1.5)

    stats = [
        ("< 10s", "Generation time"),
        ("4", "Output types"),
        ("100%", "Production-ready"),
    ]
    col_w = (W - 80) / 3
    for i, (val, sub) in enumerate(stats):
        x = 68 + i * col_w
        if i > 0:
            vrule(c, x, 80, 170, LTGREY, 0.8)
        c.setFont("Helvetica-Bold", 32)
        c.setFillColor(RED if i == 0 else INK)
        c.drawString(x + 12, 130, val)
        c.setFont("Helvetica", 8)
        c.setFillColor(MIDGREY)
        c.drawString(x + 12, 112, sub.upper())

    rule(c, 68, 80, W - 80, INK, 0.5)
    label(c, "BUILT WITH CLAUDE AI  ·  OPEN SOURCE  ·  github.com/yourhandle/infraforge", 68, 62, 7, MIDGREY)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 2 — THE PROBLEM + THE SOLUTION
# ─────────────────────────────────────────────────────────────────────────────
def page_problem_solution(c):
    new_page(c)

    # Top bar
    rule(c, 36, H - 36, W - 72, INK, 2)
    label(c, "INFRAFORGE", 36, H - 28, 7, INK, "Helvetica-Bold")
    label(c, "THE PROBLEM  &  THE SOLUTION", W / 2 - 60, H - 28, 7, MIDGREY)
    label(c, "02", W - 50, H - 28, 7, MIDGREY)
    rule(c, 36, H - 42, W - 72, LTGREY, 0.5)

    # ── LEFT HALF: Problem ───────────────────────────
    mid = W / 2 - 8

    # Section heading
    c.setFillColor(RED)
    c.rect(36, H - 90, 3, 34, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(INK)
    c.drawString(46, H - 70, "The Problem")

    c.setFont("Helvetica", 9)
    c.setFillColor(MIDGREY)
    c.drawString(46, H - 86, "Cloud infrastructure is painful by default.")

    problems = [
        ("01", "Hours of boilerplate",
         "Every new project starts with the same tedious ritual: VPC configs, security groups, IAM roles, Kubernetes manifests — all written from scratch, every single time."),
        ("02", "Error-prone by default",
         "Missing health checks, open security groups, no encryption at rest. These are the mistakes that end up in post-mortems and 3am pages."),
        ("03", "Steep learning curve",
         "AWS + Terraform + Kubernetes is three separate disciplines. Most devs know one well. Knowing all three takes years of dedicated practice."),
    ]

    py = H - 120
    for num, title, desc in problems:
        c.setFont("Helvetica-Bold", 36)
        c.setFillColor(CREAM)
        c.drawString(46, py - 14, num)

        rule(c, 46, py - 22, mid - 46, LTGREY, 0.5)

        c.setFont("Helvetica-Bold", 12)
        c.setFillColor(INK)
        c.drawString(46, py - 40, title)

        c.setFont("Helvetica", 9.5)
        c.setFillColor(MIDGREY)
        words = desc.split()
        line = ""
        cy2 = py - 56
        for wrd in words:
            test = (line + " " + wrd).strip()
            if c.stringWidth(test, "Helvetica", 9.5) <= (mid - 58):
                line = test
            else:
                c.drawString(46, cy2, line)
                cy2 -= 14
                line = wrd
        if line:
            c.drawString(46, cy2, line)
            cy2 -= 14
        py = cy2 - 32

    # Vertical divider
    vrule(c, mid, H - 60, 60, LTGREY, 0.8)

    # ── RIGHT HALF: Solution ─────────────────────────
    rx = mid + 20

    c.setFillColor(INK)
    c.rect(rx, H - 90, 3, 34, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 22)
    c.setFillColor(INK)
    c.drawString(rx + 10, H - 70, "The Solution")

    c.setFont("Helvetica", 9)
    c.setFillColor(MIDGREY)
    c.drawString(rx + 10, H - 86, "Plain English in. Production infra out.")

    # Flow diagram — hand-drawn feel with boxes and arrows
    fw = W - rx - 36
    box_h = 68
    items = [
        ("INPUT", "Describe your infra in plain English\n\"Scalable Node.js on AWS with RDS PostgreSQL,\nload balancer, and auto-scaling\"", RED),
        ("CLAUDE AI", "Interprets requirements, applies AWS and\nKubernetes best practices, generates all\nfour output artifacts simultaneously.", INK),
        ("OUTPUT", "Terraform HCL + Kubernetes YAML\n+ Architecture Diagram\n+ GitHub Actions CI/CD pipeline", HexColor("#1A6B3A")),
    ]

    fy = H - 115
    for i, (tag, desc, col) in enumerate(items):
        c.setFillColor(col)
        c.rect(rx + 10, fy - box_h, fw - 10, box_h, fill=1, stroke=0)

        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(white if col != CREAM else INK)
        c.drawString(rx + 18, fy - 14, tag)

        c.setFont("Helvetica", 8.5)
        c.setFillColor(HexColor("#FFFFFF") if col != CREAM else INK)
        lines = desc.split("\n")
        for j, ln in enumerate(lines):
            c.drawString(rx + 18, fy - 28 - j * 13, ln)

        fy -= box_h + 4

        if i < len(items) - 1:
            ax = rx + 10 + (fw - 10) / 2
            c.setStrokeColor(MIDGREY)
            c.setLineWidth(1)
            c.line(ax, fy, ax, fy - 10)
            c.setFillColor(MIDGREY)
            c.setStrokeColor(MIDGREY)
            p = c.beginPath()
            p.moveTo(ax, fy - 14)
            p.lineTo(ax - 5, fy - 7)
            p.lineTo(ax + 5, fy - 7)
            p.close()
            c.drawPath(p, fill=1, stroke=0)
            fy -= 18

    # Result callout
    fy -= 14
    c.setFillColor(CREAM)
    c.rect(rx + 10, fy - 62, fw - 10, 58, fill=1, stroke=0)
    c.setFillColor(RED)
    c.rect(rx + 10, fy - 62, 4, 58, fill=1, stroke=0)
    c.setFont("Helvetica-Bold", 11)
    c.setFillColor(INK)
    c.drawString(rx + 22, fy - 20, "Result: infra in seconds,")
    c.drawString(rx + 22, fy - 35, "not days.")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MIDGREY)
    c.drawString(rx + 22, fy - 50, "Zero YAML or HCL knowledge required.")

    # Extra note below
    fy -= 80
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(INK)
    c.drawString(rx + 10, fy, "Why this matters")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(MIDGREY)
    note = "Most AI tools that touch infrastructure generate pseudocode. InfraForge generates real, deployable configs — tested against actual AWS provider schemas."
    words = note.split()
    line = ""
    dy = fy - 14
    for wrd in words:
        test = (line + " " + wrd).strip()
        if c.stringWidth(test, "Helvetica", 8.5) <= fw - 10:
            line = test
        else:
            c.drawString(rx + 10, dy, line)
            dy -= 13
            line = wrd
    if line:
        c.drawString(rx + 10, dy, line)

    # Bottom editorial pull quote on left
    rule(c, 36, 160, mid - 36, LTGREY, 0.5)
    c.setFillColor(RED)
    c.rect(36, 75, 3, 80, fill=1, stroke=0)
    c.setFont("Helvetica-BoldOblique", 11)
    c.setFillColor(INK)
    c.drawString(46, 140, '"The average engineer spends')
    c.drawString(46, 126, '2–3 days per project writing')
    c.drawString(46, 112, 'infrastructure boilerplate."')
    c.setFont("Helvetica", 8)
    c.setFillColor(MIDGREY)
    c.drawString(46, 94, "InfraForge reduces this to under 10 seconds.")

    # Bottom rule
    rule(c, 36, 36, W - 72, LTGREY, 0.5)
    label(c, "INFRAFORGE  ·  AI CLOUD INFRASTRUCTURE GENERATOR", 36, 24, 7, MIDGREY)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 3 — TECH STACK + HOW IT WORKS
# ─────────────────────────────────────────────────────────────────────────────
def page_tech(c):
    new_page(c)

    rule(c, 36, H - 36, W - 72, INK, 2)
    label(c, "INFRAFORGE", 36, H - 28, 7, INK, "Helvetica-Bold")
    label(c, "TECH STACK  &  HOW IT WORKS", W / 2 - 60, H - 28, 7, MIDGREY)
    label(c, "03", W - 50, H - 28, 7, MIDGREY)
    rule(c, 36, H - 42, W - 72, LTGREY, 0.5)

    # ── TECH STACK ───────────────────────────────────
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(INK)
    c.drawString(36, H - 76, "Tech Stack")

    rule(c, 36, H - 84, W - 72, INK, 1)

    techs = [
        ("Claude AI",        "Intelligence",       "Anthropic's Claude Sonnet interprets natural language infrastructure requests and generates complete, accurate configs with best practices applied automatically."),
        ("Terraform",        "Infrastructure as Code", "Generates complete HCL: provider config, VPC, subnets, security groups, IAM roles, EC2/EKS/RDS resources, variables, and remote state."),
        ("Kubernetes",       "Orchestration",      "Outputs production-ready YAML: Deployments, Services, HorizontalPodAutoscalers, Ingress rules, resource limits, and liveness probes."),
        ("AWS",              "Cloud Platform",     "Targets the full AWS ecosystem — VPC, EKS, RDS, Lambda, CloudFront, S3, API Gateway — with multi-AZ and encryption by default."),
        ("GitHub Actions",   "CI/CD",              "Auto-generates full pipeline: build, test, terraform plan/apply, and kubectl deploy stages with secret references included."),
        ("React",            "Frontend",           "Terminal-aesthetic UI with real-time output, tabbed code display, and one-click copy for every generated artifact."),
    ]

    col_w = (W - 72) / 2 - 8
    ty = H - 100
    for i, (name, role, desc) in enumerate(techs):
        col = i % 2
        row = i // 2
        tx = 36 + col * (col_w + 16)
        ry = ty - row * 130

        c.setFillColor(CREAM)
        c.rect(tx, ry - 115, col_w, 110, fill=1, stroke=0)

        col_mark = RED if col == 0 else INK
        c.setFillColor(col_mark)
        c.rect(tx, ry - 115, 3, 110, fill=1, stroke=0)

        c.setFont("Helvetica-Bold", 7)
        c.setFillColor(MIDGREY)
        c.drawString(tx + 11, ry - 16, role.upper())

        c.setFont("Helvetica-Bold", 14)
        c.setFillColor(INK)
        c.drawString(tx + 11, ry - 33, name)

        c.setFont("Helvetica", 8.5)
        c.setFillColor(MIDGREY)
        words = desc.split()
        line = ""
        dy = ry - 50
        max_w = col_w - 20
        for wrd in words:
            test = (line + " " + wrd).strip()
            if c.stringWidth(test, "Helvetica", 8.5) <= max_w:
                line = test
            else:
                if dy < ry - 112:
                    break
                c.drawString(tx + 11, dy, line)
                dy -= 13
                line = wrd
        if line and dy >= ry - 113:
            c.drawString(tx + 11, dy, line)

    # ── HOW IT WORKS — 4-step numbered list ──────────
    steps_y = H - 100 - 3 * 130 - 24

    rule(c, 36, steps_y, W - 72, INK, 1)
    c.setFont("Helvetica-Bold", 28)
    c.setFillColor(INK)
    c.drawString(36, steps_y - 34, "How It Works")

    steps = [
        ("01  Describe", "User types a plain-English infrastructure request — no YAML, no HCL knowledge needed. Just describe what you want."),
        ("02  Generate", "Claude AI parses the request, applies AWS and K8s best practices, and generates all four outputs simultaneously in under 10 seconds."),
        ("03  Review", "Outputs appear in tabbed panels: Terraform HCL, Kubernetes YAML, ASCII architecture diagram, and GitHub Actions pipeline."),
        ("04  Deploy",  "Copy configs into your repository and push. The generated GitHub Actions pipeline handles terraform plan, apply, and kubectl deploy automatically."),
    ]

    sx = 36
    sw = (W - 72 - 18) / 4
    for i, (title, desc) in enumerate(steps):
        x = sx + i * (sw + 6)
        if i > 0:
            vrule(c, x - 3, steps_y - 45, steps_y - 200, LTGREY, 0.5)

        c.setFont("Helvetica-Bold", 10)
        c.setFillColor(RED if i == 0 else INK)
        c.drawString(x, steps_y - 58, title)

        c.setFont("Helvetica", 8)
        c.setFillColor(MIDGREY)
        words = desc.split()
        line = ""
        dy = steps_y - 74
        for wrd in words:
            test = (line + " " + wrd).strip()
            if c.stringWidth(test, "Helvetica", 8) <= sw - 4:
                line = test
            else:
                c.drawString(x, dy, line)
                dy -= 13
                line = wrd
        if line:
            c.drawString(x, dy, line)

    rule(c, 36, 36, W - 72, LTGREY, 0.5)
    label(c, "INFRAFORGE  ·  AI CLOUD INFRASTRUCTURE GENERATOR", 36, 24, 7, MIDGREY)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# PAGE 4 — IMPACT + CONTACT
# ─────────────────────────────────────────────────────────────────────────────
def page_impact(c):
    new_page(c)

    rule(c, 36, H - 36, W - 72, INK, 2)
    label(c, "INFRAFORGE", 36, H - 28, 7, INK, "Helvetica-Bold")
    label(c, "IMPACT  &  CONTACT", W / 2 - 60, H - 28, 7, MIDGREY)
    label(c, "04", W - 50, H - 28, 7, MIDGREY)
    rule(c, 36, H - 42, W - 72, LTGREY, 0.5)

    # Big heading
    c.setFont("Helvetica-Bold", 42)
    c.setFillColor(INK)
    c.drawString(36, H - 100, "From idea")
    c.setFillColor(RED)
    c.drawString(36, H - 145, "to infra")
    c.setFillColor(INK)
    c.drawString(36, H - 190, "in seconds.")

    # Subtext right of heading
    rx = 260
    c.setFont("Helvetica", 10)
    c.setFillColor(MIDGREY)
    lines = [
        "InfraForge eliminates the most painful part",
        "of cloud engineering: writing the same",
        "boilerplate configs from scratch, every time.",
        "",
        "With one sentence, engineers get a complete,",
        "production-hardened infrastructure stack.",
    ]
    for j, ln in enumerate(lines):
        c.drawString(rx, H - 90 - j * 15, ln)

    # ── Stats row ────────────────────────────────────
    rule(c, 36, H - 220, W - 72, INK, 2)

    stats = [
        ("< 10s",  "to generate full infra stack"),
        ("4",      "production outputs per request"),
        ("100%",   "best-practice compliance, by default"),
        ("0",      "YAML or HCL knowledge required"),
    ]

    sw = (W - 72) / 4
    for i, (val, sub) in enumerate(stats):
        x = 36 + i * sw
        if i > 0:
            vrule(c, x, H - 230, H - 300, LTGREY, 0.5)

        c.setFont("Helvetica-Bold", 30)
        c.setFillColor(RED if i % 2 == 0 else INK)
        c.drawString(x + 8, H - 262, val)

        c.setFont("Helvetica", 8)
        c.setFillColor(MIDGREY)
        words = sub.split()
        line2 = ""
        dy = H - 278
        for wrd in words:
            test = (line2 + " " + wrd).strip()
            if c.stringWidth(test, "Helvetica", 8) <= sw - 16:
                line2 = test
            else:
                c.drawString(x + 8, dy, line2)
                dy -= 11
                line2 = wrd
        if line2:
            c.drawString(x + 8, dy, line2)

    rule(c, 36, H - 308, W - 72, LTGREY, 0.5)

    # ── What I built section ──────────────────────────
    c.setFont("Helvetica-Bold", 14)
    c.setFillColor(INK)
    c.drawString(36, H - 338, "What makes this project stand out")

    features = [
        "Full-stack AI integration — not a wrapper, but a thoughtfully architected pipeline from NLP input to deployable IaC output. Every layer was designed intentionally.",
        "Real output, not mockups — every Terraform and K8s config is syntactically correct and immediately usable in production without modification.",
        "Security-first generation — IAM least-privilege, encrypted RDS, private subnets, and TLS termination are applied automatically to every generated stack.",
        "Multi-output coherence — Terraform, Kubernetes, diagram, and CI/CD pipeline are generated as a consistent, cross-referencing set that deploys cleanly together.",
    ]

    fy = H - 368
    for feat in features:
        c.setFillColor(RED)
        c.circle(44, fy + 3, 2.5, fill=1, stroke=0)
        c.setFont("Helvetica", 9.5)
        c.setFillColor(INK)
        words = feat.split()
        line3 = ""
        dy = fy
        for wrd in words:
            test = (line3 + " " + wrd).strip()
            if c.stringWidth(test, "Helvetica", 9.5) <= W - 36 - 60:
                line3 = test
            else:
                c.drawString(54, dy, line3)
                dy -= 14
                line3 = wrd
        if line3:
            c.drawString(54, dy, line3)
        fy = dy - 28

    # ── Contact / CTA ─────────────────────────────────
    rule(c, 36, 200, W - 72, INK, 2)

    c.setFont("Helvetica-Bold", 32)
    c.setFillColor(INK)
    c.drawString(36, 162, "Let's connect.")

    c.setFont("Helvetica", 11)
    c.setFillColor(MIDGREY)
    c.drawString(36, 142, "Open to roles in cloud engineering, AI tooling, and full-stack development.")

    # Tags
    hashtags = ["#CloudEngineering", "#AI", "#Terraform", "#Kubernetes", "#OpenToWork"]
    tx2 = 36
    for tag in hashtags:
        tw = c.stringWidth(tag, "Helvetica-Bold", 8) + 14
        c.setFillColor(CREAM)
        c.roundRect(tx2, 115, tw, 17, 3, fill=1, stroke=0)
        c.setStrokeColor(LTGREY)
        c.setLineWidth(0.5)
        c.roundRect(tx2, 115, tw, 17, 3, fill=0, stroke=1)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(INK)
        c.drawString(tx2 + 7, 123, tag)
        tx2 += tw + 6

    # GitHub / LinkedIn links
    c.setFont("Helvetica-Bold", 9)
    c.setFillColor(INK)
    c.drawString(36, 94, "github.com/yourhandle/infraforge")
    c.setFont("Helvetica", 9)
    c.setFillColor(MIDGREY)
    c.drawString(36, 80, "linkedin.com/in/yourprofile")

    # Big red bottom rule
    rule(c, 36, 60, W - 72, RED, 3)
    rule(c, 36, 36, W - 72, LTGREY, 0.5)
    label(c, "INFRAFORGE  ·  AI CLOUD INFRASTRUCTURE GENERATOR  ·  2024", 36, 24, 7, MIDGREY)

    c.showPage()

# ─────────────────────────────────────────────────────────────────────────────
# BUILD
# ─────────────────────────────────────────────────────────────────────────────
out = "/home/claude/InfraForge_LinkedIn.pdf"
c = canvas.Canvas(out, pagesize=A4)
c.setTitle("InfraForge — AI Cloud Infrastructure Generator")
c.setAuthor("Portfolio")
c.setSubject("LinkedIn Portfolio Project")

page_cover(c)
page_problem_solution(c)
page_tech(c)
page_impact(c)

c.save()
print(f"✅ PDF saved: {out}")
