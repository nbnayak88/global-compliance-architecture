# Global Compliance Architecture

> Connecting portfolio risk, compliance readiness and governance signals into one executive view.

## Contest Submission Summary

**1.1 Relevance — Real EA Problem**  
Global Compliance Architecture addresses an Enterprise Architecture problem: compliance information is fragmented across regulations, applications, risk assessments, and governance. Executives need a connected view showing where regulatory exposure exists, why it matters, and what decision should follow.

**1.2 Value Beyond Out-of-the-Box Reports**  
The report goes beyond a conventional compliance dashboard by connecting portfolio risk, compliance readiness, regulatory scope, and governance in one experience. Its operating cycle — **Discover → Determine → Assess → Control → Evidence → Improve** — turns compliance from a static assessment into an architecture operating model. A 195-country jurisdiction catalogue provides a reusable global lens, with India and Germany data points.

**2.1 Execution — Reliable Reporting**  
The report runs as a deployable SAP LeanIX Custom Report in the shared **CustomCodeChallenge09** demo workspace. It uses the Standard V4 metamodel and live LeanIX application data. Risk and compliance signals are calculated from available workspace attributes rather than fabricated values. Missing risk dimensions are excluded from the denominator, preserving transparency.

**2.2 Execution — Readable Visualization**  
The experience provides KPIs, portfolio risk, application exposure, jurisdiction insights, operating-cycle visualization, and drill-down details. Users can inspect an application’s risk calculation, including weighted contributions, normalized score, classification, and data-quality coverage.

**2.3 Execution — Configurable and Adaptable**  
Reusable risk logic is separated from the jurisdiction lens, allowing the pattern to adapt to countries, regulations, stakeholders, and portfolio contexts without changing the workspace metamodel.

**3.1 Breadth — Broad EA Applicability**  
The pattern is relevant beyond compliance specialists. Enterprise Architects, security and risk teams, compliance leaders, application owners, transformation teams, and executives can connect regulatory obligations with portfolio decisions across geographies and industries.

**4. Adoption Potential — Customer Value**  
Other SAP LeanIX customers can use this as a bridge between regulatory awareness and architecture decisions: identifying exposure, explaining risk, and prioritizing action.

**AI-Assisted Development & Governance**  
Development followed the contest guidance through small, testable iterations, AI assistance, and live-data validation. We used a prototype-first approach: the **Compliance Security Risk Heatmap** was developed and validated as a pre-MVP and published in GitHub. After validating the risk and compliance signals with LeanIX application data, we evolved the concept into **Global Compliance Architecture**, scaling the validated foundation into an executive experience covering jurisdiction, regulation, controls, risk, evidence, and application exposure. This demonstrates MVP validation before scaling into a reusable global architecture pattern. The V4 metamodel and administrative settings were left unchanged.

### Pre-MVP

[Compliance Security Risk Heatmap](https://github.com/nbnayak88/compliance-security-risk-heatmap) — the validated first-stage MVP that established the risk/compliance foundation used to evolve this report.

## What the Report Provides

- Executive Summary and portfolio-level compliance signal
- Global regulatory lens across **195 countries**
- Concrete jurisdiction data points for selected countries including **India and Germany**
- Continuous compliance flywheel: **Discover → Determine → Assess → Control → Evidence → Improve**
- Portfolio risk distribution and application compliance exposure
- Explainable, weighted risk calculation with data-quality coverage
- Glossary and architecture traceability from jurisdiction to application
- Application drill-down for risk and compliance context

## Development

Install dependencies:

```bash
npm install
```

Authenticate with SAP LeanIX before starting development:

```bash
npx lxr login
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Upload to SAP LeanIX:

```bash
npm run upload
```

## Project Structure

```text
src/
├── App.tsx
├── App.css
└── main.tsx
```

## Design & Governance Notes

- Uses live LeanIX workspace application data.
- Does **not** modify the shared workspace metamodel or administrative settings.
- Regulatory information is presented as a jurisdiction lens; application-level compliance is not inferred where the workspace does not expose authoritative jurisdiction assignment.
- Missing assessment dimensions are treated as missing data rather than automatically as zero risk.

## Learn More

- [SAP LeanIX Reporting Documentation](https://help.sap.com/docs/leanix/ea/reporting-framework-and-cli)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
