-- Fix attribution on the seeded quotes.
--
-- Several lines seeded as "own words" (author_name null) were actually
-- collected from other people, and a few attributed lines used surnames only
-- or credited the wrong person. Match on body text so this is safe to re-run.

update public.quotes set author_name = v.author
from (values
  ('He who has a why to live can bear almost any how.', 'Friedrich Nietzsche'),
  ('The obstacle is the way.', 'Ryan Holiday, after Marcus Aurelius'),
  ('The world breaks everyone, and afterward, some are strong at the broken places.', 'Ernest Hemingway'),
  ('Man is condemned to be free.', 'Jean-Paul Sartre'),
  ('If you are going through hell, keep going.', 'Winston Churchill'),
  ('To live is to suffer, to survive is to find some meaning in the suffering.', 'Gordon W. Allport, paraphrasing Viktor Frankl'),
  ('No one is coming to save you. Build yourself.', 'Nathaniel Branden'),
  ('Become so capable that your absence becomes a problem.', 'Unknown'),
  ('You don''t need motivation when you''ve decided.', 'Unknown'),
  ('Build a life you don''t need to escape from.', 'Ryan Holiday'),
  ('The pain of discipline is nothing compared to the pain of regret.', 'Jim Rohn'),
  ('One day, you''ll look back and realize you were building the life you thought you were only surviving.', 'Unknown')
) as v(body, author)
where public.quotes.body = v.body
  and public.quotes.source = 'owner';
