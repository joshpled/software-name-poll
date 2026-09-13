# Architecture

GitHub Pages serves `index.html` directly. Browser JavaScript validates choices and sends a POST to Supabase's REST API. Supabase writes to `public.name_poll_votes`; the owner views results in the Supabase dashboard.

There is no application server, authentication UI, or build pipeline. Keeping native HTML and fetch preserves the supplied design and avoids a framework or SDK dependency for one request.

## Security boundary

The browser is untrusted. Database role grants allow `anon` to insert only the five vote fields; it cannot supply IDs or timestamps, read results, or update/delete rows. Row Level Security additionally requires three distinct allowed names, an optional rejected name outside the top three, and a comment of at most 240 characters. Client validation provides feedback, but database rules enforce validity when the page is bypassed.

The publishable key belongs in the browser's `apikey` header. It is not a user JWT and is not sent as a Bearer token. `Prefer: return=minimal` avoids requiring read access after an insert. Administrative keys and database passwords never belong in the repository.

## Files

- `index.html`: supplied design, browser configuration, validation and submission.
- `supabase_setup.sql`: atomic schema/permissions/policy setup plus an owner-only results query.
- `tests/poll.test.cjs`: page-script behavior and request contract checks using Node's built-in test runner.
- `tests/database.sql`: rollback-only database checks against the real anonymous role.
- `.github/workflows/checks.yml`: syntax/whitespace and page behavior checks for PRs.
- `.nojekyll`: static Pages publishing without Jekyll processing.

See [ADR 001](docs/001-static-poll.md) for the deployment decision.
