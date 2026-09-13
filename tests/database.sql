-- Run as the dashboard owner after supabase_setup.sql.
-- Test rows are rolled back. Sequence IDs can advance; gaps are normal.
begin;
set local role anon;

insert into public.name_poll_votes
  (first_choice, second_choice, third_choice, reject_choice, comment)
values ('Protean', 'Manifold', 'Morphic', 'Liminal', 'ROLLBACK ONLY: deployment check');

do $$
declare
  attempt text;
begin
  foreach attempt in array array[
    $q$select * from public.name_poll_votes$q$,
    $q$update public.name_poll_votes set comment = 'forbidden'$q$,
    $q$delete from public.name_poll_votes$q$,
    $q$insert into public.name_poll_votes (id, first_choice, second_choice, third_choice) values (999999, 'Protean', 'Manifold', 'Morphic')$q$,
    $q$insert into public.name_poll_votes (first_choice, second_choice, third_choice) values ('Protean', 'Protean', 'Morphic')$q$,
    $q$insert into public.name_poll_votes (first_choice, second_choice, third_choice) values ('Unknown', 'Manifold', 'Morphic')$q$,
    $q$insert into public.name_poll_votes (first_choice, second_choice, third_choice, reject_choice) values ('Protean', 'Manifold', 'Morphic', 'Protean')$q$,
    $q$insert into public.name_poll_votes (first_choice, second_choice, third_choice, comment) values ('Protean', 'Manifold', 'Morphic', repeat('x', 241))$q$
  ] loop
    begin
      execute attempt;
      raise exception 'Permission/validation check unexpectedly succeeded: %', attempt;
    exception when insufficient_privilege then
      null; -- Expected table privilege or RLS rejection.
    end;
  end loop;
end $$;
rollback;
select 'PASS: valid insert allowed; reads, edits, deletes and invalid votes denied; test vote rolled back' as result;
