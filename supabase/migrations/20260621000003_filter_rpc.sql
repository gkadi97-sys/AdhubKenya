-- ============================================================
-- AdHub Kenya - Dynamic Filter Parity Phase 2
-- RPCs for aggregations and search ranking
-- ============================================================

-- 1. Aggregation RPC for dynamic filter options
CREATE OR REPLACE FUNCTION get_filter_aggregates(
    p_category text, 
    p_aggregate_field text, 
    p_filters jsonb
)
RETURNS jsonb AS $$
DECLARE
    v_result jsonb;
    v_query text;
    v_where text := ' WHERE status = ''active'' AND category = $1 ';
    v_key text;
    v_val text;
BEGIN
    -- Build dynamic WHERE clause based on p_filters
    IF p_filters IS NOT NULL THEN
        FOR v_key, v_val IN SELECT * FROM jsonb_each_text(p_filters) LOOP
            IF v_val <> '' THEN
                IF v_key = 'make' THEN
                    v_where := v_where || format(' AND (make ILIKE %L OR specs->>''make'' ILIKE %L)', '%' || v_val || '%', '%' || v_val || '%');
                ELSIF v_key = 'location' THEN
                    v_where := v_where || format(' AND location ILIKE %L', '%' || v_val || '%');
                ELSE
                    v_where := v_where || format(' AND specs->>%I ILIKE %L', v_key, '%' || v_val || '%');
                END IF;
            END IF;
        END LOOP;
    END IF;

    -- If aggregate field is 'make', coalesce top-level make and specs->'make'
    IF p_aggregate_field = 'make' THEN
        v_query := format('
            SELECT jsonb_object_agg(val, count)
            FROM (
                SELECT COALESCE(NULLIF(make, ''''), specs->>''make'') AS val, count(*) as count
                FROM listings
                %s
                GROUP BY 1
            ) sub WHERE val IS NOT NULL AND val <> ''''
        ', v_where);
    ELSE
        v_query := format('
            SELECT jsonb_object_agg(val, count)
            FROM (
                SELECT specs->>%L AS val, count(*) as count
                FROM listings
                %s
                GROUP BY 1
            ) sub WHERE val IS NOT NULL AND val <> ''''
        ', p_aggregate_field, v_where);
    END IF;

    EXECUTE v_query INTO v_result USING p_category;
    
    RETURN COALESCE(v_result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Ranked Search RPC
CREATE OR REPLACE FUNCTION search_listings_ranked(
    p_keyword text,
    p_category text DEFAULT NULL,
    p_filters jsonb DEFAULT NULL,
    p_limit int DEFAULT 12,
    p_offset int DEFAULT 0
)
RETURNS TABLE (
    id uuid,
    title text,
    description text,
    price numeric,
    category text,
    location text,
    images text[],
    make text,
    year int,
    condition text,
    status text,
    seller_id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    specs jsonb,
    relevance_score int,
    total_count bigint
) AS $$
DECLARE
    v_where text := ' WHERE status = ''active'' ';
    v_key text;
    v_val text;
    v_query text;
BEGIN
    IF p_category IS NOT NULL AND p_category <> '' THEN
        v_where := v_where || format(' AND category = %L ', p_category);
    END IF;

    IF p_filters IS NOT NULL THEN
        FOR v_key, v_val IN SELECT * FROM jsonb_each_text(p_filters) LOOP
            IF v_val <> '' THEN
                IF v_key = 'make' THEN
                    v_where := v_where || format(' AND (make ILIKE %L OR specs->>''make'' ILIKE %L)', '%' || v_val || '%', '%' || v_val || '%');
                ELSIF v_key = 'location' THEN
                    v_where := v_where || format(' AND location ILIKE %L', '%' || v_val || '%');
                ELSE
                    v_where := v_where || format(' AND specs->>%I ILIKE %L', v_key, '%' || v_val || '%');
                END IF;
            END IF;
        END LOOP;
    END IF;

    v_query := format('
        WITH ranked AS (
            SELECT 
                l.*,
                (
                    -- Exact/partial model match gets highest weight
                    CASE WHEN specs->>''model'' ILIKE %L THEN 100 ELSE 0 END +
                    -- Exact/partial series/type match
                    CASE WHEN specs->>''series'' ILIKE %L OR specs->>''subcategory'' ILIKE %L THEN 50 ELSE 0 END +
                    -- Exact/partial brand match
                    CASE WHEN COALESCE(make, specs->>''make'') ILIKE %L THEN 30 ELSE 0 END +
                    -- Text search in title and description
                    CASE WHEN title ILIKE %L THEN 20 ELSE 0 END +
                    CASE WHEN description ILIKE %L THEN 10 ELSE 0 END +
                    -- Search anywhere inside the structured specs JSONB (OEM parts, engines, generations, etc.)
                    CASE WHEN specs::text ILIKE %L THEN 40 ELSE 0 END
                ) as relevance_score
            FROM listings l
            %s
        ),
        filtered_ranked AS (
            SELECT * FROM ranked 
            WHERE relevance_score > 0
        )
        SELECT 
            *,
            (SELECT count(*) FROM filtered_ranked) as total_count
        FROM filtered_ranked
        ORDER BY relevance_score DESC, created_at DESC
        LIMIT %L OFFSET %L
    ', 
    '%'||p_keyword||'%', '%'||p_keyword||'%', '%'||p_keyword||'%', '%'||p_keyword||'%', '%'||p_keyword||'%', '%'||p_keyword||'%', '%'||p_keyword||'%',
    v_where, p_limit, p_offset);

    RETURN QUERY EXECUTE v_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
