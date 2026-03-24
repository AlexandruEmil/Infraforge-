# InfraForge — Source Code

## Fișiere incluse

### 1. `cloud-infra-generator.jsx` — Aplicația React
Interfața web principală. Apelează Claude API și generează Terraform, Kubernetes, Architecture Diagram și CI/CD pipeline.

**Cum rulezi:**
- Copiaz-o într-un proiect React (Vite sau CRA)
- Asigură-te că ai proxy-ul Anthropic configurat (sau backend care injectează API key-ul)
- `npm install && npm run dev`

**Stack:** React, hooks (useState, useRef, useEffect), Anthropic API (`claude-sonnet-4-20250514`)

---

### 2. `infraforge_pdf.py` — Prezentarea PDF (Python)
Generează PDF-ul editorial bold de 4 pagini pentru LinkedIn.

**Cum rulezi:**
```bash
pip install reportlab
python infraforge_pdf.py
# Output: InfraForge_LinkedIn.pdf
```

**Stack:** Python, ReportLab (canvas direct pentru control total al layout-ului)

---

### 3. `infra_pres.js` — Prezentarea PPTX (JavaScript)
Generează deck-ul PowerPoint de 8 slide-uri cu design dark navy + cyan.

**Cum rulezi:**
```bash
npm install pptxgenjs
node infra_pres.js
# Output: InfraForge_LinkedIn.pptx
```

**Stack:** Node.js, PptxGenJS

---

## Note

- În `cloud-infra-generator.jsx`, API key-ul Anthropic e injectat automat de platforma claude.ai. 
  Pentru uz propriu, adaugă header-ul `x-api-key` în fetch sau folosește un backend proxy.
- Fonturile din PDF/PPTX sunt sistem standard (Helvetica/Trebuchet MS) — nu necesită instalare.
