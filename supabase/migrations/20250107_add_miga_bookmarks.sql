-- 🔖 MIGA Bookmarks System for Premium Users
-- Stores bookmarked content from MIGA Voice features

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS miga_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Content details
  feature_id TEXT NOT NULL, -- 'pdf', 'quiz', 'flashcards', etc.
  feature_name TEXT NOT NULL,
  topic TEXT NOT NULL,
  content JSONB NOT NULL, -- Stores the generated content
  metadata JSONB DEFAULT '{}', -- Additional metadata (params used, etc.)
  
  -- Bookmark details
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Usage tracking
  access_count INTEGER DEFAULT 0,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_user_bookmark UNIQUE(user_id, feature_id, topic)
);

-- Create indexes for performance
CREATE INDEX idx_miga_bookmarks_user_id ON miga_bookmarks(user_id);
CREATE INDEX idx_miga_bookmarks_feature_id ON miga_bookmarks(feature_id);
CREATE INDEX idx_miga_bookmarks_created_at ON miga_bookmarks(created_at DESC);
CREATE INDEX idx_miga_bookmarks_tags ON miga_bookmarks USING GIN(tags);

-- Row Level Security
ALTER TABLE miga_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON miga_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own bookmarks
CREATE POLICY "Users can create own bookmarks" ON miga_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks" ON miga_bookmarks
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON miga_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- 📊 Function to check bookmark limits
CREATE OR REPLACE FUNCTION check_bookmark_limit()
RETURNS TRIGGER AS $$
DECLARE
  user_tier TEXT;
  bookmark_count INTEGER;
  max_bookmarks INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM user_profiles
  WHERE id = NEW.user_id;
  
  -- Check if user can bookmark
  IF user_tier = 'free' THEN
    RAISE EXCEPTION 'Bookmarking is only available for Pro and Premium subscribers';
  END IF;
  
  -- Count existing bookmarks
  SELECT COUNT(*) INTO bookmark_count
  FROM miga_bookmarks
  WHERE user_id = NEW.user_id;
  
  -- Set limit based on tier
  IF user_tier = 'pro' THEN
    max_bookmarks := 10;
  ELSIF user_tier = 'premium' THEN
    max_bookmarks := 100;
  END IF;
  
  -- Check limit
  IF bookmark_count >= max_bookmarks THEN
    RAISE EXCEPTION 'Bookmark limit reached. % tier allows maximum % bookmarks', user_tier, max_bookmarks;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for bookmark limits
CREATE TRIGGER enforce_bookmark_limits
  BEFORE INSERT ON miga_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION check_bookmark_limit();

-- 📈 Function to get user's bookmarks with pagination
CREATE OR REPLACE FUNCTION get_user_bookmarks(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0,
  p_feature_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  feature_id TEXT,
  feature_name TEXT,
  topic TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  content JSONB,
  metadata JSONB,
  access_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE,
  last_accessed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.feature_id,
    b.feature_name,
    b.topic,
    b.title,
    b.description,
    b.tags,
    b.content,
    b.metadata,
    b.access_count,
    b.created_at,
    b.last_accessed
  FROM miga_bookmarks b
  WHERE b.user_id = p_user_id
    AND (p_feature_id IS NULL OR b.feature_id = p_feature_id)
  ORDER BY b.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 🔍 Function to search bookmarks
CREATE OR REPLACE FUNCTION search_bookmarks(
  p_user_id UUID,
  p_search_query TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  feature_id TEXT,
  feature_name TEXT,
  topic TEXT,
  title TEXT,
  description TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id,
    b.feature_id,
    b.feature_name,
    b.topic,
    b.title,
    b.description,
    b.tags,
    b.created_at,
    ts_rank(
      to_tsvector('english', b.title || ' ' || b.topic || ' ' || COALESCE(b.description, '')),
      plainto_tsquery('english', p_search_query)
    ) as relevance
  FROM miga_bookmarks b
  WHERE b.user_id = p_user_id
    AND (
      b.title ILIKE '%' || p_search_query || '%'
      OR b.topic ILIKE '%' || p_search_query || '%'
      OR b.description ILIKE '%' || p_search_query || '%'
      OR p_search_query = ANY(b.tags)
    )
  ORDER BY relevance DESC, b.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 📌 Function to add or update bookmark
CREATE OR REPLACE FUNCTION upsert_bookmark(
  p_user_id UUID,
  p_feature_id TEXT,
  p_feature_name TEXT,
  p_topic TEXT,
  p_title TEXT,
  p_content JSONB,
  p_description TEXT DEFAULT NULL,
  p_tags TEXT[] DEFAULT '{}',
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  bookmark_id UUID;
BEGIN
  -- Insert or update bookmark
  INSERT INTO miga_bookmarks (
    user_id,
    feature_id,
    feature_name,
    topic,
    title,
    description,
    content,
    tags,
    metadata
  ) VALUES (
    p_user_id,
    p_feature_id,
    p_feature_name,
    p_topic,
    p_title,
    p_description,
    p_content,
    p_tags,
    p_metadata
  )
  ON CONFLICT (user_id, feature_id, topic)
  DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    content = EXCLUDED.content,
    tags = EXCLUDED.tags,
    metadata = EXCLUDED.metadata,
    updated_at = NOW()
  RETURNING id INTO bookmark_id;
  
  RETURN bookmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 📊 Analytics: Most popular bookmarked topics
CREATE OR REPLACE VIEW popular_bookmarked_topics AS
SELECT 
  feature_id,
  feature_name,
  topic,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_bookmarks,
  AVG(access_count) as avg_access_count
FROM miga_bookmarks
GROUP BY feature_id, feature_name, topic
ORDER BY total_bookmarks DESC
LIMIT 50;