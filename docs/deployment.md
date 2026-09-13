# Deployment record

## Current status

- Public repository created: https://github.com/joshpled/software-name-poll
- Feature branch: `feature/deploy-poll`.
- Supabase provisioning: free slot available; creation form prepared, awaiting owner password entry and submission.
- Production site: not yet published.
- Draft PR: https://github.com/joshpled/software-name-poll/pull/1
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
