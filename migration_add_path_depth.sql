-- Add columns if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='path') THEN
        ALTER TABLE categories ADD COLUMN path text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='categories' AND column_name='depth') THEN
        ALTER TABLE categories ADD COLUMN depth integer;
    END IF;
END $$;

-- Backfill path and depth using a recursive CTE
WITH RECURSIVE cat_tree AS (
    -- Base case: Root categories
    SELECT id, parent_id, slug, name, 
           slug::text AS new_path, 
           0 AS new_depth
    FROM categories
    WHERE parent_id IS NULL

    UNION ALL

    -- Recursive step: Child categories
    SELECT c.id, c.parent_id, c.slug, c.name,
           ct.new_path || '/' || c.slug AS new_path,
           ct.new_depth + 1 AS new_depth
    FROM categories c
    INNER JOIN cat_tree ct ON c.parent_id = ct.id
)
UPDATE categories c
SET path = ct.new_path,
    depth = ct.new_depth
FROM cat_tree ct
WHERE c.id = ct.id;

-- Make path unique and add index
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'categories_path_key' AND n.nspname = 'public'
    ) THEN
        ALTER TABLE categories ADD CONSTRAINT categories_path_key UNIQUE (path);
    END IF;
END $$;


-- Create the RPC function get_category_context
CREATE OR REPLACE FUNCTION get_category_context(p_path text)
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
    v_current json;
    v_parent json;
    v_ancestors json;
    v_children json;
    v_siblings json;
    v_current_id uuid;
    v_parent_id uuid;
BEGIN
    -- 1. Get current category
    SELECT row_to_json(c) INTO v_current
    FROM categories c
    WHERE c.path = p_path AND c.is_active = true;

    IF v_current IS NULL THEN
        RETURN NULL;
    END IF;

    -- Extract IDs for further queries
    v_current_id := (v_current->>'id')::uuid;
    v_parent_id := (v_current->>'parent_id')::uuid;

    -- 2. Get parent category (if any)
    IF v_parent_id IS NOT NULL THEN
        SELECT row_to_json(p) INTO v_parent
        FROM categories p
        WHERE p.id = v_parent_id AND p.is_active = true;
    ELSE
        v_parent := NULL;
    END IF;

    -- 3. Get immediate children
    SELECT COALESCE(json_agg(row_to_json(ch)), '[]'::json) INTO v_children
    FROM (
        SELECT * FROM categories
        WHERE parent_id = v_current_id AND is_active = true
        ORDER BY order_index ASC
    ) ch;

    -- 4. Get siblings
    IF v_parent_id IS NOT NULL THEN
        SELECT COALESCE(json_agg(row_to_json(s)), '[]'::json) INTO v_siblings
        FROM (
            SELECT * FROM categories
            WHERE parent_id = v_parent_id AND id != v_current_id AND is_active = true
            ORDER BY order_index ASC
        ) s;
    ELSE
        -- If it's a root category, its siblings are other root categories
        SELECT COALESCE(json_agg(row_to_json(s)), '[]'::json) INTO v_siblings
        FROM (
            SELECT * FROM categories
            WHERE parent_id IS NULL AND id != v_current_id AND is_active = true
            ORDER BY order_index ASC
        ) s;
    END IF;

    -- 5. Get ancestors
    -- Reconstruct ancestors from the path segments
    -- E.g. vehicles/cars/toyota -> ancestors: vehicles, vehicles/cars
    WITH RECURSIVE ancestor_tree AS (
        SELECT * FROM categories WHERE id = v_parent_id AND is_active = true
        UNION ALL
        SELECT c.* FROM categories c
        INNER JOIN ancestor_tree a ON c.id = a.parent_id
        WHERE c.is_active = true
    )
    SELECT COALESCE(json_agg(row_to_json(a)), '[]'::json) INTO v_ancestors
    FROM (
        SELECT * FROM ancestor_tree
        ORDER BY depth ASC
    ) a;

    -- Construct and return the final JSON object
    RETURN json_build_object(
        'current', v_current,
        'parent', v_parent,
        'children', v_children,
        'siblings', v_siblings,
        'ancestors', v_ancestors
    );
END;
$$;
