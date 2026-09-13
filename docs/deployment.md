# Deployment record

## Deployment configuration and verification

- Public repository created: https://github.com/joshpled/software-name-poll
- Publishing source: `main`, repository root; GitHub Pages branch deployment.
- Supabase project: `vujrrskdxtskmkldvnkj`, East US (North Virginia), free plan.
- Schema and insert-only permissions applied. Rollback-only database tests passed.
- Public HTTP read/update/delete requests and an invalid vote were denied; database error code `42501` confirms privilege enforcement with a valid key.
- Owner reported completing the browser test and approved merge on 2026-09-13. No additional agent test vote is needed.
- Site URL: https://joshpled.github.io/software-name-poll/
- Deployment status: https://github.com/joshpled/software-name-poll/actions (Pages publishes after merge).
- Deployment PR: https://github.com/joshpled/software-name-poll/pull/1
- Five page tests, syntax/whitespace checks and GitHub Checks pass. Browser rendering and missing-choice validation verified.
- `main` requires a PR and passing checks; automatic branch deletion is enabled.

## Before publishing

- Run `npm run lint` and `npm test` and confirm the GitHub Checks job is green.
- Run `tests/database.sql` in Supabase SQL Editor; it rolls back the inserted test row (identity sequence numbers can advance).
- Test the form in a browser, including invalid selections, successful submission and retry feedback.
- Verify public GET/PATCH/DELETE requests cannot access votes.
- Review the PR and confirm the owner understands why the public key cannot read results and why anonymous repeat voting is still possible.

## Rollback

If submissions fail after a page change, revert that PR through a new PR and let Pages republish `main`. Do not drop the votes table. If abuse requires stopping submissions, revoke INSERT on the five vote columns from `anon` in SQL Editor; record the change and restore the grant only after investigation. This stops new votes without deleting existing responses.
