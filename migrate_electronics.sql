DO $$
DECLARE
    brand_record RECORD;
    new_series_id UUID;
    migrated_count INT := 0;
BEGIN
    FOR brand_record IN 
        SELECT b.id, b.value, 
               (SELECT COUNT(*) FROM lookup_values s WHERE s.lookup_type = 'electronics_series' AND s.parent_id = b.id) as series_count
        FROM lookup_values b
        WHERE b.lookup_type = 'electronics_brand'
    LOOP
        IF brand_record.series_count = 0 THEN
            -- Create a dummy series
            new_series_id := gen_random_uuid();
            INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
            VALUES (new_series_id, 'electronics_series', brand_record.id, 'Standard', '{}'::jsonb, 0);
            migrated_count := migrated_count + 1;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Created dummy series for % electronics brands', migrated_count;
END $$;
