# ADR 001: Keep the poll static with insert-only Supabase access

Date: 2026-09-13. Status: accepted for implementation.

## Context

The supplied ZIP already contains a complete static interface and SQL setup. The requested hosts are GitHub Pages and Supabase. Anonymous voting must work while results remain private.

## Decision and why

Keep the native HTML/CSS/JavaScript and call Supabase's Data API directly using a publishable key. Grant only column-level anonymous INSERT access, with RLS enforcing allowed choices. Use branch-based Pages deployment after PR review.

## Alternatives and tradeoffs

A frontend framework or Supabase SDK would add dependencies without simplifying this single POST. An Edge Function with CAPTCHA could control abuse, but adds a backend workflow outside the current informal-poll requirement. The chosen design does not enforce one-person-one-vote or rate limiting. A separate deployment action is unnecessary because Pages already supports static branch publishing.
