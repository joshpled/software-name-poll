# Software Company Name Poll

A static ranked-choice poll hosted on GitHub Pages, with votes stored privately in Supabase. No build step or runtime dependencies.

## Run locally

Run `python3 -m http.server 8000` and open http://localhost:8000. Run `npm run lint` and `npm test` with Node 22 or newer. There is no TypeScript, so a separate typecheck does not apply. Tests execute the actual inline page script with a small DOM fixture; browser and database checks are also required before launch.

## Configuration and deployment

1. Create a Supabase project with the Data API enabled. Disable automatic table exposure and enable automatic RLS if available.
2. Run `supabase_setup.sql` in the project's SQL Editor. Run `tests/database.sql` to check permissions and validation in a transaction that rolls back its test vote.
3. Set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `index.html` to the project's URL and publishable key. These are browser-visible configuration; never use a secret or service-role key. No environment variables are required.
4. Review and squash-merge the deployment PR after checks pass.
5. In GitHub Settings → Pages, choose Deploy from a branch, `main`, `/ (root)`. `.nojekyll` serves the static files directly.
6. Open the published page and verify a successful submission and that anonymous API requests cannot read, update, or delete votes.

Intended public URL: https://joshpled.github.io/software-name-poll/

## Results and limitations

Use Supabase's authenticated Table Editor for `public.name_poll_votes`. The query at the end of `supabase_setup.sql` awards 3/2/1 points to first/second/third choices. Results are never exposed on the poll page. Comments are optional and limited to 240 characters.

Repeat voting is not prevented; “one response per browser” is a request, not an enforcement mechanism. There is no CAPTCHA or rate limiter. This is suitable for a small informal naming poll, not a verified election. Protecting results does not prevent someone from submitting many valid votes.

See [ARCHITECTURE.md](ARCHITECTURE.md) and [deployment notes](docs/deployment.md).
