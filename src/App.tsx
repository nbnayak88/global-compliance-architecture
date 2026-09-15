import { lx } from '@leanix/reporting';
import { useEffect, useMemo, useState } from 'react';
import './App.css';

const FACT_SHEET_TYPE = 'Application';

const COMPLIANCE_FRAMEWORKS = [
  { key: 'GDPR', label: 'GDPR' },
  { key: 'PCIDSS', label: 'PCI-DSS' },
  { key: 'SOX', label: 'SOX' },
  { key: 'HIPAA', label: 'HIPAA' },
  { key: 'ISO27001', label: 'ISO 27001' }
] as const;

const COUNTRY_REGIONS: Record<'EMEA' | 'APAC' | 'AMERICAS', string[]> = {
  EMEA: [
    'Albania','Andorra','Austria','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Cyprus','Czechia','Denmark','Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Ukraine','United Kingdom','Vatican City','Armenia','Azerbaijan','Bahrain','Georgia','Iraq','Israel','Jordan','Kuwait','Lebanon','Oman','Palestine','Qatar','Saudi Arabia','Syria','Türkiye','United Arab Emirates','Yemen','Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroon','Central African Republic','Chad','Comoros','Congo','Democratic Republic of the Congo','Djibouti','Egypt','Equatorial Guinea','Eritrea','Eswatini','Ethiopia','Gabon','Gambia','Ghana','Guinea','Guinea-Bissau','Ivory Coast','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','Sao Tome and Principe','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan','Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe'
  ],
  APAC: [
    'Afghanistan','Bangladesh','Bhutan','Brunei','Cambodia','China','India','Indonesia','Iran','Japan','Kazakhstan','Kyrgyzstan','Laos','Malaysia','Maldives','Mongolia','Myanmar','Nepal','North Korea','Pakistan','Philippines','Singapore','South Korea','Sri Lanka','Tajikistan','Thailand','Timor-Leste','Turkmenistan','Uzbekistan','Vietnam','Australia','Fiji','Kiribati','Marshall Islands','Micronesia','Nauru','New Zealand','Palau','Papua New Guinea','Samoa','Solomon Islands','Tonga','Tuvalu','Vanuatu'
  ],
  AMERICAS: [
    'Antigua and Barbuda','Argentina','Bahamas','Barbados','Belize','Bolivia','Brazil','Canada','Chile','Colombia','Costa Rica','Cuba','Dominica','Dominican Republic','Ecuador','El Salvador','Grenada','Guatemala','Guyana','Haiti','Honduras','Jamaica','Mexico','Nicaragua','Panama','Paraguay','Peru','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Suriname','Trinidad and Tobago','United States','Uruguay','Venezuela'
  ]
};

const COUNTRY_REGIONS_ORDER = ['EMEA', 'APAC', 'AMERICAS'] as const;
const ALL_COUNTRIES = [
  ...COUNTRY_REGIONS.EMEA,
  ...COUNTRY_REGIONS.APAC,
  ...COUNTRY_REGIONS.AMERICAS
];

const COUNTRY_REGULATORY_LENSES: Record<string, {
  region: string;
  description: string;
  regulations: { name: string; scope: string; status: string }[];
  dataPoints: { label: string; value: string; significance: string }[];
}> = {};

ALL_COUNTRIES.forEach(country => {
  let region = 'GLOBAL';
  if (COUNTRY_REGIONS.EMEA.indexOf(country) >= 0) region = 'EMEA';
  else if (COUNTRY_REGIONS.APAC.indexOf(country) >= 0) region = 'APAC';
  else if (COUNTRY_REGIONS.AMERICAS.indexOf(country) >= 0) region = 'AMERICAS';

  COUNTRY_REGULATORY_LENSES[country] = {
    region,
    description: `${country} jurisdiction lens — identify and assess the privacy, cybersecurity, regulatory and sector obligations applicable to applications operating in or serving this jurisdiction.`,
    regulations: [
      { name: `${country} privacy / data protection requirements`, scope: 'Personal data / privacy', status: 'Not Assessed' },
      { name: `${country} cybersecurity / incident reporting requirements`, scope: 'Cybersecurity / incident response', status: 'Not Assessed' },
      { name: `${country} records / technology requirements`, scope: 'Information technology / records / retention', status: 'Not Assessed' },
      { name: `${country} financial / regulated-sector requirements`, scope: 'Financial and regulated industries — where applicable', status: 'Not Assessed' },
      { name: 'Sector-specific and contractual obligations', scope: 'Industry / service / customer specific', status: 'Not Assessed' }
    ],
    dataPoints: [
      { label: 'Regulatory domains', value: '5+', significance: 'Privacy, cybersecurity, records, sector and contractual obligations require jurisdiction-specific assessment.' },
      { label: 'Application assessment', value: 'Not Assessed', significance: 'The current LeanIX Application metamodel does not directly assign jurisdiction to an Application.' },
      { label: 'Control posture', value: 'To be assessed', significance: 'Controls and evidence should be mapped after jurisdiction applicability is established.' },
      { label: 'Portfolio linkage', value: 'Operating-model dependent', significance: 'Country-to-Application ownership should be governed through the portfolio operating model.' }
    ]
  }
});

// Named regulatory examples are shown where the report has an explicit jurisdiction lens.
COUNTRY_REGULATORY_LENSES.India = {
  region: 'APAC',
  description: 'India regulatory lens — concrete regulatory signals are shown below, while Application-level compliance remains Not Assessed until jurisdiction applicability and evidence are linked.',
  regulations: [
    { name: 'Digital Personal Data Protection Act, 2023 (DPDP Act)', scope: 'Personal data / privacy', status: 'Applicable if in scope — Not Assessed' },
    { name: 'Digital Personal Data Protection Rules, 2025', scope: 'DPDP implementation / operational requirements', status: 'Framework notified — Application Not Assessed' },
    { name: 'Information Technology Act, 2000', scope: 'Information technology / electronic records', status: 'Not Assessed' },
    { name: 'CERT-In Directions, 2022', scope: 'Cybersecurity incident reporting / logging', status: 'Not Assessed' },
    { name: 'RBI regulatory requirements', scope: 'Banking / financial services — where applicable', status: 'Not Assessed' }
  ],
  dataPoints: [
    { label: 'Privacy regime', value: 'DPDP Act 2023 + Rules 2025', significance: 'India has a dedicated digital personal-data protection framework.' },
    { label: 'Rules notification', value: '14 Nov 2025', significance: 'The DPDP Rules 2025 were notified with a phased commencement timeline.' },
    { label: 'CERT-In incident reporting', value: '6 hours', significance: 'Covered cyber incidents and data breaches are subject to the CERT-In reporting timeline.' },
    { label: 'ICT log retention', value: '180 days', significance: 'Covered entities must maintain ICT system logs securely for a rolling 180 days within Indian jurisdiction.' },
    { label: 'Application status', value: 'Not Assessed', significance: 'These are jurisdictional regulatory data points, not a claim that any LeanIX Application is compliant.' }
  ]
};

COUNTRY_REGULATORY_LENSES['United Kingdom'] = {
  region: 'EMEA',
  description: 'United Kingdom regulatory lens — use this view to identify the regulatory scope that must be assessed for applications operating in or serving the UK.',
  regulations: [
    { name: 'UK GDPR', scope: 'Personal data / privacy', status: 'Not Assessed' },
    { name: 'Data Protection Act 2018', scope: 'Data protection / privacy', status: 'Not Assessed' },
    { name: 'Network and Information Systems Regulations 2018', scope: 'Cybersecurity / essential services — where applicable', status: 'Not Assessed' },
    { name: 'FCA / PRA requirements', scope: 'Financial services — where applicable', status: 'Not Assessed' },
    { name: 'Sector-specific UK requirements', scope: 'Industry / service specific', status: 'Not Assessed' }
  ],
  dataPoints: [
    { label: 'Privacy regime', value: 'UK GDPR + DPA 2018', significance: 'Primary UK privacy/data-protection framework for in-scope processing.' },
    { label: 'Cybersecurity', value: 'NIS Regulations 2018', significance: 'Applies to relevant operators and digital service contexts where in scope.' },
    { label: 'Application status', value: 'Not Assessed', significance: 'Regulatory scope is identified; application evidence has not been asserted.' }
  ]
};

COUNTRY_REGULATORY_LENSES.Germany = {
  region: 'EMEA',
  description: 'Germany regulatory lens — combines EU GDPR requirements with Germany\'s Federal Data Protection Act (BDSG) and sector-specific obligations.',
  regulations: [
    { name: 'EU General Data Protection Regulation (GDPR)', scope: 'Personal data / privacy', status: 'Not Assessed' },
    { name: 'Federal Data Protection Act (BDSG)', scope: 'German national data-protection provisions', status: 'Not Assessed' },
    { name: 'BDSG §38 — Data Protection Officer requirement', scope: 'DPO governance — threshold and independent triggers', status: 'Applicability Not Assessed' },
    { name: 'GDPR Article 33 breach notification', scope: 'Personal-data breach response', status: 'Not Assessed' },
    { name: 'Sector-specific German / EU requirements', scope: 'Industry / service specific', status: 'Not Assessed' }
  ],
  dataPoints: [
    { label: 'Privacy regime', value: 'EU GDPR + BDSG', significance: 'Germany applies GDPR together with national provisions in the BDSG.' },
    { label: 'DPO threshold', value: '20 persons', significance: 'BDSG §38 generally requires a DPO where at least 20 persons are regularly involved in automated personal-data processing, with additional independent triggers.' },
    { label: 'GDPR breach notification', value: '72 hours', significance: 'Where applicable, GDPR Article 33 requires notification without undue delay and, where feasible, within 72 hours.' },
    { label: 'Supervisory model', value: 'Federal + Länder', significance: 'German data-protection supervision includes federal and state authorities depending on context.' },
    { label: 'Application status', value: 'Not Assessed', significance: 'These are jurisdictional regulatory data points, not a claim that any LeanIX Application is compliant.' }
  ]
};

COUNTRY_REGULATORY_LENSES.Global = {
  region: 'GLOBAL',
  description: 'Global baseline lens — cross-border and commonly used control frameworks. Applicability still requires assessment for each application and jurisdiction.',
  regulations: [
    { name: 'ISO/IEC 27001', scope: 'Information security management', status: 'Not Assessed' },
    { name: 'PCI DSS', scope: 'Payment card data — where applicable', status: 'Not Assessed' },
    { name: 'GDPR / privacy regimes', scope: 'Personal data — jurisdiction dependent', status: 'Not Assessed' },
    { name: 'SOC 2', scope: 'Service organization controls — where applicable', status: 'Not Assessed' },
    { name: 'Local / sector-specific obligations', scope: 'Jurisdiction and industry dependent', status: 'Not Assessed' }
  ],
    dataPoints: [
      { label: 'Baseline frameworks', value: '5', significance: 'ISO 27001, PCI DSS, privacy regimes, SOC 2 and local/sector obligations.' },
      { label: 'Jurisdiction assignment', value: 'Not modeled', significance: 'Application-level country is not directly exposed in the current workspace metamodel.' },
      { label: 'Assessment status', value: 'Not Assessed', significance: 'Global framework presence does not imply compliance.' }
    ]
};

type CountryLens = string;

interface RiskBreakdownRow {
  dimension: string;
  value: string;
  score: number | null;
  weight: number;
  contribution: number | null;
}

function getRiskBreakdown(app: ApplicationData): {
  rows: RiskBreakdownRow[];
  weightedTotal: number;
  availableWeight: number;
  normalizedScore: number;
} {
  const rows: RiskBreakdownRow[] = [
    { dimension: 'Business Criticality', value: app.businessCriticality || 'Not Assessed', score: scoreBusinessCriticality(app.businessCriticality), weight: 25, contribution: null },
    { dimension: 'Functional Suitability', value: app.functionalSuitability || 'Not Assessed', score: scoreFunctional(app.functionalSuitability), weight: 10, contribution: null },
    { dimension: 'Technical Suitability', value: app.technicalSuitability || 'Not Assessed', score: scoreTechnical(app.technicalSuitability), weight: 15, contribution: null },
    { dimension: 'Obsolescence', value: app.aggregatedObsolescenceRisk || 'Not Assessed', score: scoreObsolescence(app.aggregatedObsolescenceRisk), weight: 20, contribution: null },
    { dimension: 'SixR', value: app.lxSixRClassification || app.lxSixRRiskClassification || app.lxSixRTimePriority || 'Not Assessed', score: scoreSixR(app.lxSixRRiskClassification, app.lxSixRTimePriority), weight: 15, contribution: null },
    { dimension: 'AI Risk', value: app.lxAiRisk || 'Not Assessed', score: scoreAiRisk(app.lxAiRisk), weight: 10, contribution: null },
    { dimension: 'SSO', value: app.lxStatusSSO || 'Not Assessed', score: scoreSso(app.lxStatusSSO), weight: 5, contribution: null }
  ];

  const populated = rows.filter(row => row.score !== null);
  const availableWeight = populated.reduce((sum, row) => sum + row.weight, 0);
  const weightedTotal = populated.reduce((sum, row) => sum + (row.score as number) * row.weight, 0);
  const normalizedScore = availableWeight ? weightedTotal / availableWeight : 0;

  rows.forEach(row => {
    if (row.score !== null) row.contribution = row.score * row.weight;
  });

  return { rows, weightedTotal, availableWeight, normalizedScore };
}

interface ApplicationData {
  id: string;
  displayName: string;
  businessCriticality?: string;
  functionalSuitability?: string;
  technicalSuitability?: string;
  aggregatedObsolescenceRisk?: string;
  lxSixRClassification?: string;
  lxSixRRiskClassification?: string;
  lxSixRTimePriority?: string;
  lxAiRisk?: string;
  lxStatusSSO?: string;
  lxHostingType?: string;
  GDPR?: string;
  PCIDSS?: string;
  SOX?: string;
  HIPAA?: string;
  ISO27001?: string;
}

interface RiskResult {
  score: number;
  level: string;
  dimensions: number;
}

function normalize(value?: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function scoreBusinessCriticality(value?: string): number | null {
  const scores: Record<string, number> = {
    administrativeService: 10,
    businessOperational: 30,
    businessCritical: 70,
    missionCritical: 100
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function scoreFunctional(value?: string): number | null {
  const scores: Record<string, number> = {
    perfect: 0,
    appropriate: 25,
    insufficient: 70,
    unreasonable: 100
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function scoreTechnical(value?: string): number | null {
  const scores: Record<string, number> = {
    fullyAppropriate: 0,
    adequate: 30,
    unreasonable: 70,
    inappropriate: 100
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function scoreObsolescence(value?: string): number | null {
  const scores: Record<string, number> = {
    unaddressedEndOfLife: 100,
    unaddressedPhaseOut: 90,
    missingLifecycle: 70,
    missingItComponent: 60,
    riskAccepted: 40,
    riskAddressed: 10,
    noRisk: 0
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function scoreSixR(
  risk?: string,
  priority?: string
): number | null {
  const riskScores: Record<string, number> = {
    low: 10,
    medium: 40,
    high: 70,
    veryHigh: 100
  };

  const priorityScores: Record<string, number> = {
    wave1: 100,
    wave2: 60,
    wave3: 20
  };

  const values: number[] = [];

  if (risk && riskScores[risk] !== undefined) {
    values.push(riskScores[risk]);
  }

  if (priority && priorityScores[priority] !== undefined) {
    values.push(priorityScores[priority]);
  }

  return values.length ? Math.max(...values) : null;
}

function scoreAiRisk(value?: string): number | null {
  const scores: Record<string, number> = {
    minimal: 0,
    limited: 30,
    high: 70,
    unacceptable: 100
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function scoreSso(value?: string): number | null {
  const scores: Record<string, number> = {
    supported: 0,
    notSupported: 100
  };

  return value && scores[value] !== undefined ? scores[value] : null;
}

function calculateRisk(app: ApplicationData): RiskResult {
  const dimensions = [
    {
      value: scoreBusinessCriticality(app.businessCriticality),
      weight: 25
    },
    {
      value: scoreFunctional(app.functionalSuitability),
      weight: 10
    },
    {
      value: scoreTechnical(app.technicalSuitability),
      weight: 15
    },
    {
      value: scoreObsolescence(app.aggregatedObsolescenceRisk),
      weight: 20
    },
    {
      value: scoreSixR(
        app.lxSixRRiskClassification,
        app.lxSixRTimePriority
      ),
      weight: 15
    },
    {
      value: scoreAiRisk(app.lxAiRisk),
      weight: 10
    },
    {
      value: scoreSso(app.lxStatusSSO),
      weight: 5
    }
  ].filter(
    item => item.value !== null
  ) as { value: number; weight: number }[];

  if (!dimensions.length) {
    return {
      score: 0,
      level: 'Not Assessed',
      dimensions: 0
    };
  }

  const weightedScore = dimensions.reduce(
    (sum, item) => sum + item.value * item.weight,
    0
  );

  const totalWeight = dimensions.reduce(
    (sum, item) => sum + item.weight,
    0
  );

  const score = Math.round(weightedScore / totalWeight);

  let level = 'Low';

  if (score >= 75) {
    level = 'Critical';
  } else if (score >= 50) {
    level = 'High';
  } else if (score >= 25) {
    level = 'Medium';
  }

  return {
    score,
    level,
    dimensions: dimensions.length
  };
}

function complianceStatus(
  app: ApplicationData,
  key: string
): string {
  const value = app[key as keyof ApplicationData];

  if (!value) {
    return 'Not Assessed';
  }

  return String(value);
}

function complianceClass(value: string): string {
  return normalize(value);
}

function riskClass(level: string): string {
  return normalize(level);
}

function App() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [selected, setSelected] = useState<ApplicationData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryLens>('India');

  useEffect(() => {
    const initReport = async () => {
      await lx.init();

      lx.ready({
        reportViewFactSheetType: FACT_SHEET_TYPE,
        facets: [
          {
            key: 'main',
            fixedFactSheetType: FACT_SHEET_TYPE,
            attributes: [
              'id',
              'displayName',
              'businessCriticality',
              'functionalSuitability',
              'technicalSuitability',
              'aggregatedObsolescenceRisk',
              'lxSixRClassification',
              'lxSixRRiskClassification',
              'lxSixRTimePriority',
              'lxAiRisk',
              'lxHostingType',
              'lxStatusSSO',
              'GDPR',
              'PCIDSS',
              'SOX',
              'HIPAA',
              'ISO27001'
            ],
            defaultFilters: [
              {
                facetKey: 'lxState',
                keys: []
              }
            ],
            callback: data => {
              setApplications(
                (data || []) as unknown as ApplicationData[]
              );
            }
          }
        ]
      });
    };

    initReport();
  }, []);

  const enrichedApplications = useMemo(
    () =>
      applications.map(app => ({
        app,
        risk: calculateRisk(app)
      })),
    [applications]
  );

  const metrics = useMemo(() => {
    const total = applications.length;

    const assessed = enrichedApplications.filter(
      item => item.risk.dimensions > 0
    ).length;

    const highRisk = enrichedApplications.filter(
      item =>
        item.risk.level === 'High' ||
        item.risk.level === 'Critical'
    ).length;

    const critical = enrichedApplications.filter(
      item => item.risk.level === 'Critical'
    ).length;

    let compliantSignals = 0;
    let assessedSignals = 0;

    applications.forEach(app => {
      COMPLIANCE_FRAMEWORKS.forEach(framework => {
        const status = complianceStatus(app, framework.key);

        if (status !== 'Not Assessed') {
          assessedSignals += 1;

          if (
            normalize(status) === 'compliant'
          ) {
            compliantSignals += 1;
          }
        }
      });
    });

    const complianceCoverage =
      assessedSignals > 0
        ? Math.round(
            (compliantSignals / assessedSignals) * 100
          )
        : 0;

    return {
      total,
      assessed,
      highRisk,
      critical,
      complianceCoverage
    };
  }, [applications, enrichedApplications]);

  const frameworkSummary = useMemo(() => {
    return COMPLIANCE_FRAMEWORKS.map(framework => {
      let compliant = 0;
      let partial = 0;
      let nonCompliant = 0;
      let notApplicable = 0;
      let notAssessed = 0;

      applications.forEach(app => {
        const status = normalize(
          complianceStatus(app, framework.key)
        );

        if (status === 'compliant') {
          compliant += 1;
        } else if (
          status === 'partially-compliant'
        ) {
          partial += 1;
        } else if (
          status === 'non-compliant'
        ) {
          nonCompliant += 1;
        } else if (
          status === 'not-applicable'
        ) {
          notApplicable += 1;
        } else {
          notAssessed += 1;
        }
      });

      return {
        ...framework,
        compliant,
        partial,
        nonCompliant,
        notApplicable,
        notAssessed
      };
    });
  }, [applications]);

  const riskDistribution = useMemo(() => {
    return ['Critical', 'High', 'Medium', 'Low'].map(level => ({
      level,
      count: enrichedApplications.filter(
        item => item.risk.level === level
      ).length
    }));
  }, [enrichedApplications]);

  return (
    <div className="global-compliance">
      <header className="hero">
        <div>
          <div className="eyebrow">
            ENTERPRISE ARCHITECTURE • COMPLIANCE INTELLIGENCE
          </div>

          <h1>Global Compliance Architecture</h1>

          <p>
            Connecting portfolio risk, compliance readiness
            and governance signals into one executive view.
          </p>
        </div>

        <div className="hero-badge">
          LEANIX PORTFOLIO
          <strong>{metrics.total}</strong>
          APPLICATIONS
        </div>
      </header>

      <section className="section" style={{ marginTop: 18 }}>
        <div className="section-heading">
          <div><span className="section-number">00</span><h2>Global Compliance Flywheel</h2></div>
          <p>Continuous governance from jurisdiction discovery to portfolio improvement</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 18 }}>
          <div style={{ minHeight: 430, border: '1px solid #bbf7d0', borderRadius: 16, background: 'linear-gradient(145deg, #f7fee7 0%, #ecfccb 48%, #dcfce7 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 320, height: 320, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '12px solid transparent', background: 'linear-gradient(135deg, #bef264, #84cc16, #22c55e, #15803d) border-box', WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', zIndex: 1 }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 255, height: 255, transform: 'translate(-50%, -50%)', borderRadius: '50%', border: '3px dashed #65a30d', boxShadow: '0 0 0 10px rgba(132,204,22,.08)', zIndex: 1 }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 145, height: 145, borderRadius: '50%', background: 'linear-gradient(145deg, #a3e635 0%, #22c55e 100%)', border: '5px solid #f0fdf4', boxShadow: '0 14px 40px rgba(22,101,52,.28)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', zIndex: 4, color: '#fff' }}>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.2 }}>PORTFOLIO</span>
              <strong style={{ fontSize: 34, lineHeight: 1.05, margin: '3px 0' }}>{metrics.total ? `${metrics.complianceCoverage}%` : '—'}</strong>
              <span style={{ fontSize: 10, fontWeight: 700 }}>COMPLIANCE SIGNAL</span>
            </div>
            <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>DISCOVER</strong><small>Jurisdiction</small></div>
            <div style={{ position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)', minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>DETERMINE</strong><small>Applicability</small></div>
            <div style={{ position: 'absolute', bottom: 16, right: 28, minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>ASSESS</strong><small>Controls</small></div>
            <div style={{ position: 'absolute', bottom: 16, left: 28, minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>CONTROL</strong><small>Risk</small></div>
            <div style={{ position: 'absolute', top: '50%', left: 12, transform: 'translateY(-50%)', minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>EVIDENCE</strong><small>Assurance</small></div>
            <div style={{ position: 'absolute', top: 72, right: 38, minWidth: 118, padding: '9px 12px', borderRadius: 12, background: 'linear-gradient(135deg, #d9f99d, #86efac)', border: '1px solid #65a30d', textAlign: 'center', zIndex: 5 }}><strong style={{ display: 'block', fontSize: 12 }}>IMPROVE</strong><small>Remediation</small></div>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}><div style={{ width: 215, height: 215, borderRadius: '50%', border: '5px solid #22c55e', borderTopColor: '#84cc16', borderRightColor: '#16a34a', borderBottomColor: '#65a30d', transform: 'rotate(-28deg)' }} /></div>
            <div style={{ position: 'absolute', bottom: 7, left: 0, right: 0, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#166534', zIndex: 6 }}>↻ CONTINUOUS COMPLIANCE OPERATING CYCLE</div>
          </div>
          <div style={{ border: '1px solid #d8dee8', borderRadius: 16, background: '#fff', padding: 20 }}>
            <span className="eyebrow">HOW TO READ THE FLYWHEEL</span>
            <h3 style={{ margin: '8px 0 14px' }}>Compliance is an operating cycle, not a one-time assessment</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0', borderBottom: '1px solid #eef2f7' }}><strong style={{ color: '#65a30d' }}>01</strong><strong style={{ fontSize: 12 }}>DISCOVER</strong><span style={{ color: '#64748b', fontSize: 13 }}>Identify jurisdiction, regulation and regulatory scope.</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0', borderBottom: '1px solid #eef2f7' }}><strong style={{ color: '#65a30d' }}>02</strong><strong style={{ fontSize: 12 }}>DETERMINE</strong><span style={{ color: '#64748b', fontSize: 13 }}>Decide whether the requirement applies to the application or service.</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0', borderBottom: '1px solid #eef2f7' }}><strong style={{ color: '#65a30d' }}>03</strong><strong style={{ fontSize: 12 }}>ASSESS</strong><span style={{ color: '#64748b', fontSize: 13 }}>Evaluate controls, risk and current compliance evidence.</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0', borderBottom: '1px solid #eef2f7' }}><strong style={{ color: '#65a30d' }}>04</strong><strong style={{ fontSize: 12 }}>CONTROL</strong><span style={{ color: '#64748b', fontSize: 13 }}>Assign ownership and manage control gaps and remediation.</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0', borderBottom: '1px solid #eef2f7' }}><strong style={{ color: '#65a30d' }}>05</strong><strong style={{ fontSize: 12 }}>EVIDENCE</strong><span style={{ color: '#64748b', fontSize: 13 }}>Maintain auditable evidence and assurance signals.</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '34px 92px 1fr', gap: 10, padding: '9px 0' }}><strong style={{ color: '#65a30d' }}>06</strong><strong style={{ fontSize: 12 }}>IMPROVE</strong><span style={{ color: '#64748b', fontSize: 13 }}>Close gaps, reassess risk and feed improvements back into discovery.</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">00A</span>
            <h2>Executive Summary</h2>
          </div>
          <p>Decision-oriented view of portfolio exposure, compliance signals and governance gaps</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
          {[
            ['Portfolio', `${metrics.total}`, 'applications in scope'],
            ['Risk coverage', `${metrics.assessed}/${metrics.total}`, `${metrics.total ? Math.round((metrics.assessed / metrics.total) * 100) : 0}% of applications have scored risk dimensions`],
            ['High / Critical', `${metrics.highRisk}`, 'applications requiring attention'],
            ['Compliance signal', `${metrics.complianceCoverage}%`, 'of assessed framework signals are compliant']
          ].map(([label, value, note]) => (
            <div key={label} style={{ padding: 16, border: '1px solid #d8dee8', borderRadius: 12, background: '#fff' }}>
              <span style={{ display: 'block', color: '#64748b', fontSize: 11, letterSpacing: .8, textTransform: 'uppercase' }}>{label}</span>
              <strong style={{ display: 'block', fontSize: 27, marginTop: 5 }}>{value}</strong>
              <small style={{ color: '#64748b' }}>{note}</small>
            </div>
          ))}
        </div>

        <div style={{ padding: 18, borderRadius: 12, background: '#f8fafc', border: '1px solid #d8dee8', lineHeight: 1.6 }}>
          <strong>Executive interpretation</strong>
          <p style={{ margin: '7px 0' }}>
            The portfolio contains <strong>{metrics.total}</strong> applications, with <strong>{metrics.assessed}</strong> having enough populated architecture dimensions to calculate risk. <strong>{metrics.highRisk}</strong> applications are currently High or Critical risk, including <strong>{metrics.critical}</strong> Critical applications.
          </p>
          <p style={{ margin: '7px 0' }}>
            Across the five configured compliance signals, <strong>{metrics.complianceCoverage}%</strong> of assessed signals are marked Compliant. Unassessed signals remain explicit data-quality gaps rather than being interpreted as compliant or non-compliant.
          </p>
          <p style={{ margin: '7px 0 0' }}>
            The selected <strong>{selectedCountry}</strong> jurisdiction establishes the regulatory lens. Application-level jurisdiction is not inferred because the current workspace does not expose a direct Application country field; applicability and evidence therefore remain governance actions.
          </p>
        </div>

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff', border: '1px solid #d8dee8' }}>
            <strong>Priority 1 — Close data gaps</strong>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>Increase risk and compliance assessment coverage so executive signals represent a larger share of the portfolio.</p>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff', border: '1px solid #d8dee8' }}>
            <strong>Priority 2 — Establish applicability</strong>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>Link jurisdictions and regulatory requirements to applications through the portfolio operating model.</p>
          </div>
          <div style={{ padding: 14, borderRadius: 10, background: '#fff', border: '1px solid #d8dee8' }}>
            <strong>Priority 3 — Evidence controls</strong>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13 }}>Move from regulatory scope to control ownership, evidence, remediation and continuous assurance.</p>
          </div>
        </div>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <span>APPLICATIONS</span>
          <strong>{metrics.total}</strong>
          <small>Portfolio in scope</small>
        </div>

        <div className="kpi-card">
          <span>RISK ASSESSED</span>
          <strong>{metrics.assessed}</strong>
          <small>
            {metrics.total
              ? Math.round(
                  (metrics.assessed / metrics.total) * 100
                )
              : 0}
            % coverage
          </small>
        </div>

        <div className="kpi-card risk-kpi">
          <span>HIGH / CRITICAL</span>
          <strong>{metrics.highRisk}</strong>
          <small>Applications requiring attention</small>
        </div>

        <div className="kpi-card critical-kpi">
          <span>CRITICAL</span>
          <strong>{metrics.critical}</strong>
          <small>Immediate architecture attention</small>
        </div>

        <div className="kpi-card">
          <span>COMPLIANCE SIGNAL</span>
          <strong>{metrics.complianceCoverage}%</strong>
          <small>Assessed signals marked compliant</small>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">01</span>
            <h2>Compliance Landscape</h2>
          </div>
          <p>
            Framework-level readiness across the application
            portfolio
          </p>
        </div>

        <div className="framework-grid">
          {frameworkSummary.map(framework => (
            <div
              className="framework-card"
              key={framework.key}
            >
              <div className="framework-title">
                <strong>{framework.label}</strong>
                <span>
                  {framework.compliant} compliant
                </span>
              </div>

              <div className="framework-bar">
                <div
                  className="bar-compliant"
                  style={{
                    width: `${
                      applications.length
                        ? (framework.compliant /
                            applications.length) *
                          100
                        : 0
                    }%`
                  }}
                />
                <div
                  className="bar-partial"
                  style={{
                    width: `${
                      applications.length
                        ? (framework.partial /
                            applications.length) *
                          100
                        : 0
                    }%`
                  }}
                />
                <div
                  className="bar-noncompliant"
                  style={{
                    width: `${
                      applications.length
                        ? (framework.nonCompliant /
                            applications.length) *
                          100
                        : 0
                    }%`
                  }}
                />
              </div>

              <div className="framework-stats">
                <span>
                  ✓ {framework.compliant}
                </span>
                <span>
                  ◐ {framework.partial}
                </span>
                <span>
                  ✕ {framework.nonCompliant}
                </span>
                <span>
                  — {framework.notAssessed}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">02</span>
            <h2>Country & Regulatory Lens</h2>
          </div>
          <p>Choose a jurisdiction to see the regulatory scope that should be assessed</p>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 700 }}>Jurisdiction</label>
          <select value={selectedCountry} onChange={event => setSelectedCountry(event.target.value as CountryLens)} style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: 8, background: '#fff', fontWeight: 700, minWidth: 260 }}>
            <option value="Global">GLOBAL — Cross-border baseline</option>
            {COUNTRY_REGIONS_ORDER.map(region => (
              <optgroup key={region} label={`${region} — ${COUNTRY_REGIONS[region].length} countries`}>
                {COUNTRY_REGIONS[region].map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <span style={{ color: '#64748b' }}>Regulatory applicability and assessment remain application-specific.</span>
        </div>

        <div style={{ padding: 18, borderRadius: 12, background: '#f8fafc', border: '1px solid #d8dee8', marginBottom: 14 }}>
          <strong>{selectedCountry} compliance scope</strong>
          <p style={{ margin: '6px 0 0', color: '#64748b' }}>{COUNTRY_REGULATORY_LENSES[selectedCountry].description}</p>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="status-pill assessment-in-progress">REGION: {COUNTRY_REGULATORY_LENSES[selectedCountry].region}</span>
            <span className="status-pill not-assessed">COUNTRY COVERAGE: {ALL_COUNTRIES.length}+</span>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead><tr><th>Regulation / Requirement</th><th>Scope</th><th>Regulatory Signal</th><th>Application Assessment</th></tr></thead>
            <tbody>
              {COUNTRY_REGULATORY_LENSES[selectedCountry].regulations.map(regulation => {
                const signal = regulation.status;
                const applicationAssessment = signal.includes('Not Assessed') || signal.includes('Applicability Not Assessed')
                  ? 'Not Assessed — evidence required'
                  : 'Regulatory baseline identified';
                return (
                  <tr key={regulation.name}>
                    <td><strong>{regulation.name}</strong></td>
                    <td>{regulation.scope}</td>
                    <td><span className="status-pill assessment-in-progress">{signal.replace(' — Not Assessed', '').replace(' — Application Not Assessed', '').replace('Not Assessed', 'Regulatory scope identified')}</span></td>
                    <td><span className="status-pill not-assessed">{applicationAssessment}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 18 }}>
          <div className="section-heading" style={{ marginBottom: 10 }}>
            <div><h3 style={{ margin: 0 }}>Jurisdiction Data Points</h3></div>
            <p>Concrete regulatory signals for the selected country</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 10 }}>
            {COUNTRY_REGULATORY_LENSES[selectedCountry].dataPoints.map(point => (
              <div key={point.label} style={{ padding: 14, border: '1px solid #d8dee8', borderRadius: 10, background: '#fff' }}>
                <span style={{ display: 'block', fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.7 }}>{point.label}</span>
                <strong style={{ display: 'block', marginTop: 6, fontSize: 18 }}>{point.value}</strong>
                <small style={{ display: 'block', marginTop: 8, color: '#64748b', lineHeight: 1.45 }}>{point.significance}</small>
              </div>
            ))}
          </div>
        </div>

        <p style={{ marginTop: 12, color: '#64748b' }}>Architecture path: Country → Regulation → Requirement → Control → Assessment → Risk → Application. The workspace does not expose a direct Application country field. Country selection therefore establishes the regulatory assessment lens; application-level jurisdiction assignment must be governed through the portfolio operating model rather than inferred.</p>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">03</span>
            <h2>Portfolio Risk</h2>
          </div>
          <p>
            Explainable risk signals derived from LeanIX
            application attributes
          </p>
        </div>

        <div className="risk-layout">
          <div className="risk-distribution">
            {riskDistribution.map(item => (
              <div
                className="risk-row"
                key={item.level}
              >
                <div className="risk-label">
                  <span
                    className={`risk-dot ${riskClass(
                      item.level
                    )}`}
                  />
                  {item.level}
                </div>

                <div className="risk-track">
                  <div
                    className={`risk-fill ${riskClass(
                      item.level
                    )}`}
                    style={{
                      width: `${
                        metrics.total
                          ? (item.count /
                              metrics.total) *
                            100
                          : 0
                      }%`
                    }}
                  />
                </div>

                <strong>{item.count}</strong>
              </div>
            ))}
          </div>

          <div className="strategy-card">
            <span>PORTFOLIO STRATEGY LENS</span>

            <div className="strategy-grid">
              <div>
                <strong>INVEST</strong>
                <small>
                  High business value + manageable risk
                </small>
              </div>

              <div>
                <strong>MODERNIZE</strong>
                <small>
                  Strategic applications with elevated risk
                </small>
              </div>

              <div>
                <strong>TOLERATE</strong>
                <small>
                  Acceptable risk with limited intervention
                </small>
              </div>

              <div>
                <strong>RETIRE</strong>
                <small>
                  Low strategic value + high exposure
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">04</span>
            <h2>Application Compliance Exposure</h2>
          </div>
          <p>
            Select an application to inspect its compliance
            and architecture risk profile
          </p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Application</th>
                <th>Risk</th>

                {COMPLIANCE_FRAMEWORKS.map(
                  framework => (
                    <th key={framework.key}>
                      {framework.label}
                    </th>
                  )
                )}

                <th>Coverage</th>
              </tr>
            </thead>

            <tbody>
              {enrichedApplications
                .sort(
                  (a, b) =>
                    b.risk.score - a.risk.score
                )
                .slice(0, 30)
                .map(({ app, risk }) => {
                  const assessedCompliance =
                    COMPLIANCE_FRAMEWORKS.filter(
                      framework =>
                        complianceStatus(
                          app,
                          framework.key
                        ) !== 'Not Assessed'
                    ).length;

                  return (
                    <tr
                      key={app.id}
                      onClick={() => setSelected(app)}
                      className="application-row"
                    >
                      <td className="application-name">
                        {app.displayName}
                      </td>

                      <td>
                        <span
                          className={`risk-pill ${riskClass(
                            risk.level
                          )}`}
                        >
                          {risk.score}
                          {' '}
                          {risk.level}
                        </span>
                      </td>

                      {COMPLIANCE_FRAMEWORKS.map(
                        framework => {
                          const status =
                            complianceStatus(
                              app,
                              framework.key
                            );

                          return (
                            <td key={framework.key}>
                              <span
                                className={`status-pill ${complianceClass(
                                  status
                                )}`}
                              >
                                {status}
                              </span>
                            </td>
                          );
                        }
                      )}

                      <td>
                        {assessedCompliance}/
                        {COMPLIANCE_FRAMEWORKS.length}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">05</span>
            <h2>Risk Calculation Method</h2>
          </div>
          <p>Transparent, weighted and normalized using only populated LeanIX dimensions</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 10 }}>
          {[
            ['Business Criticality', '25%'],
            ['Functional Suitability', '10%'],
            ['Technical Suitability', '15%'],
            ['Obsolescence', '20%'],
            ['SixR', '15%'],
            ['AI Risk', '10%'],
            ['SSO', '5%']
          ].map(([name, weight]) => (
            <div key={name} style={{ padding: 14, border: '1px solid #d8dee8', borderRadius: 10, background: '#fff' }}>
              <strong style={{ display: 'block', fontSize: 13 }}>{name}</strong>
              <span style={{ color: '#64748b' }}>{weight} weight</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, padding: 16, borderRadius: 10, background: '#f8fafc', border: '1px solid #d8dee8' }}>
          <strong>Formula</strong>
          <p style={{ margin: '6px 0', color: '#475569' }}>Final Risk Score = Σ(score × weight) ÷ Σ(available weights).</p>
          <p style={{ margin: 0, color: '#475569' }}>Missing dimensions are excluded from both numerator and denominator; they are not treated as zero risk. Classification: 0–24 Low, 25–49 Medium, 50–74 High, 75–100 Critical.</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-number">06</span>
            <h2>Glossary</h2>
          </div>
          <p>Common terms used throughout the Global Compliance Architecture report</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
          {[
            ['Jurisdiction', 'Country or legal territory whose regulatory requirements form the assessment lens.'],
            ['Applicability', 'Decision that a regulation or requirement applies to a specific application, service or processing activity.'],
            ['Compliance Signal', 'LeanIX application-level compliance status captured for a configured framework.'],
            ['Risk Score', 'Normalized 0–100 application risk score calculated from populated architecture dimensions.'],
            ['Data Quality', 'Degree to which required risk or compliance dimensions contain usable values.'],
            ['Control', 'A policy, process or technical safeguard designed to address a regulatory requirement or risk.'],
            ['Evidence', 'Auditable information demonstrating that a control exists and operates as intended.'],
            ['Remediation', 'Action taken to close a control, compliance or architecture gap.'],
            ['SixR', 'Application transformation classification used as one of the portfolio risk dimensions.'],
            ['High / Critical', 'Risk classifications indicating applications that warrant increased architecture and governance attention.'],
            ['Not Assessed', 'No authoritative application-level assessment is currently available; it is not interpreted as compliant.'],
            ['Operating Model', 'Governance mechanism that assigns jurisdiction, ownership, applicability, controls and evidence to portfolio objects.']
          ].map(([term, definition]) => (
            <div key={term} style={{ padding: 15, border: '1px solid #d8dee8', borderRadius: 10, background: '#fff' }}>
              <strong style={{ display: 'block', fontSize: 13 }}>{term}</strong>
              <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>{definition}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="architecture-chain">
        <span>COMPLIANCE ARCHITECTURE TRACEABILITY</span>

        <div className="chain">
          <strong>COUNTRY</strong>
          <i>→</i>
          <strong>REGULATION</strong>
          <i>→</i>
          <strong>REQUIREMENT</strong>
          <i>→</i>
          <strong>CONTROL</strong>
          <i>→</i>
          <strong>ASSESSMENT</strong>
          <i>→</i>
          <strong>RISK</strong>
          <i>→</i>
          <strong>APPLICATION</strong>
        </div>

        <p>
          The MVP uses the LeanIX application portfolio as
          the implementation anchor while establishing the
          extensible global compliance architecture model.
        </p>
      </section>

      {selected && (
        <div
          className="detail-overlay"
          onClick={() => setSelected(null)}
        >
          <aside
            className="detail-panel"
            onClick={event => event.stopPropagation()}
          >
            <button
              className="close-button"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <span className="eyebrow">
              APPLICATION COMPLIANCE PROFILE
            </span>

            <h2>{selected.displayName}</h2>

            <div className="detail-risk">
              <strong>
                {calculateRisk(selected).score}
              </strong>

              <span>
                {calculateRisk(selected).level} RISK
              </span>
            </div>

            <h3>Compliance Readiness</h3>

            <div className="detail-compliance">
              {COMPLIANCE_FRAMEWORKS.map(
                framework => {
                  const status =
                    complianceStatus(
                      selected,
                      framework.key
                    );

                  return (
                    <div
                      key={framework.key}
                      className="detail-compliance-row"
                    >
                      <span>{framework.label}</span>

                      <span
                        className={`status-pill ${complianceClass(
                          status
                        )}`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <h3>Architecture Signals</h3>

            <div className="signal-grid">
              <div>
                <span>Business Criticality</span>
                <strong>
                  {selected.businessCriticality ||
                    'Not Assessed'}
                </strong>
              </div>

              <div>
                <span>Functional Suitability</span>
                <strong>
                  {selected.functionalSuitability ||
                    'Not Assessed'}
                </strong>
              </div>

              <div>
                <span>Technical Suitability</span>
                <strong>
                  {selected.technicalSuitability ||
                    'Not Assessed'}
                </strong>
              </div>

              <div>
                <span>Obsolescence</span>
                <strong>
                  {selected.aggregatedObsolescenceRisk ||
                    'Not Assessed'}
                </strong>
              </div>

              <div>
                <span>AI Risk</span>
                <strong>
                  {selected.lxAiRisk || 'Not Assessed'}
                </strong>
              </div>

              <div>
                <span>SSO</span>
                <strong>
                  {selected.lxStatusSSO ||
                    'Not Assessed'}
                </strong>
              </div>
            </div>

            {(() => {
              const breakdown = getRiskBreakdown(selected);
              return (
                <div style={{ marginTop: 20 }}>
                  <h3>Risk Calculation Breakdown</h3>
                  <p style={{ margin: '4px 0 10px', color: '#64748b', fontSize: 13 }}>Weighted score = Σ(score × weight) ÷ Σ(available weights). Missing dimensions are excluded, not treated as zero.</p>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: 8, border: '1px solid #cbd5e1' }}>Dimension</th>
                          <th style={{ textAlign: 'left', padding: 8, border: '1px solid #cbd5e1' }}>LeanIX Value</th>
                          <th style={{ padding: 8, border: '1px solid #cbd5e1' }}>Score</th>
                          <th style={{ padding: 8, border: '1px solid #cbd5e1' }}>Weight</th>
                          <th style={{ padding: 8, border: '1px solid #cbd5e1' }}>Contribution</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.rows.map(row => (
                          <tr key={row.dimension}>
                            <td style={{ padding: 8, border: '1px solid #cbd5e1' }}>{row.dimension}</td>
                            <td style={{ padding: 8, border: '1px solid #cbd5e1' }}>{row.value}</td>
                            <td style={{ padding: 8, border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.score === null ? '—' : row.score}</td>
                            <td style={{ padding: 8, border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.score === null ? 'Excluded' : `${row.weight}%`}</td>
                            <td style={{ padding: 8, border: '1px solid #cbd5e1', textAlign: 'center' }}>{row.contribution === null ? 'Excluded' : row.contribution}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8, color: '#475569' }}>
                    <div><strong>Weighted total:</strong> {breakdown.weightedTotal}</div>
                    <div><strong>Available weight:</strong> {breakdown.availableWeight}%</div>
                    <div><strong>Normalized score:</strong> {breakdown.availableWeight ? `${breakdown.weightedTotal} ÷ ${breakdown.availableWeight} = ${breakdown.normalizedScore.toFixed(1)}` : 'Not Assessed'}</div>
                    <div><strong>Final score:</strong> {calculateRisk(selected).score}</div>
                    <div><strong>Risk classification:</strong> {calculateRisk(selected).level}</div>
                  </div>
                </div>
              );
            })()}

            <div className="explain-box">
              <strong>Why this matters</strong>

              <p>
                This application combines business,
                technology, transformation and compliance
                signals. The risk score is calculated only
                from populated dimensions; missing data is
                not treated as zero risk.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;