# Apple Human Interface Guidelines — Evidence Corpus

This directory contains the **Step 1 Structured Evidence Corpus** generated from the official [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines).

## Corpus Statistics
- **Total Discovered Pages**: 99
- **Successfully Ingested Pages**: 18
- **Atomic Evidence Records**: 125
- **Numerical Measurements**: 37
- **Cross-Reference Links**: 169
- **Ingestion Date**: 2026-09-17

## Directory Layout
- `sitemap.json`: Full hierarchical site map of Apple HIG documentation.
- `source.json`: Authoritative source provenance metadata.
- `pages/`: Individual scraped page documents in JSON format.
- `evidence/`: Atomic evidence records classified by claim type, qualifier, and platform.
- `measurements/measurements.json`: Physical and pixel dimensions, hit target sizes, and contrast ratios.
- `relationships/relationships.json`: Cross-references between HIG sections.
- `coverage_report.json`: Quality and completeness audit report.

## Quality Controls
- **100% Traceable**: Every evidence item links to its original Apple Developer URL and section path.
- **Qualifier Preserved**: Exact modal verbs (`should`, `must`, `avoid`, `may`) retained.
- **Zero Hallucination**: No rules, scoring formulas, or fabricated numbers added.
