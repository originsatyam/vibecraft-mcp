# Step 3: Deterministic Rule Engineering

This directory contains the **Step 3 Deterministic Executable Rules** for VibeCraft / AI Slope.

## Core Properties
- **Zero Runtime LLM Dependency**: Executed purely via AST regex, DOM property checking, and mathematical logic.
- **Identical Results**: Identical inputs + identical context = identical output every time.
- **Traceable Provenance**: Every rule maps directly to Step 2 Knowledge entities and Step 1 evidence records.

## Directory Structure
- `taxonomy.json`: Rule types, severity levels, and precedence rankings.
- `precedence_model.json`: Deterministic conflict resolution hierarchy.
- `rules/`: Individual executable rule specifications (JSON).
- `rule_test_suite.json`: Comprehensive test cases (Positive, Negative, Boundary, Exception).
- `audit_report.json`: Audit verification report.
