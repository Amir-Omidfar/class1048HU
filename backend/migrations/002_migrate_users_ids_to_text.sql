-- Step 1: Drop old foreign key constraints
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;

-- Step 2: Convert columns from INT to TEXT
ALTER TABLE users ALTER COLUMN id TYPE TEXT USING id::TEXT;
ALTER TABLE posts ALTER COLUMN author_id TYPE TEXT USING author_id::TEXT;
ALTER TABLE comments ALTER COLUMN user_id TYPE TEXT USING user_id::TEXT;

-- Step 3: Recreate foreign key constraints (optional but recommended)
ALTER TABLE posts
  ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id)
  REFERENCES users(id)
  ON DELETE SET NULL;

ALTER TABLE comments
  ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id)
  REFERENCES users(id)
  ON DELETE SET NULL;

-- Step 4: Verify changes
-- (you can check manually after running this)
