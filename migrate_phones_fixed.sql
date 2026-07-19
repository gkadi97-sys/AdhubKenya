DO $$
DECLARE
    brand_record RECORD;
    new_series_id UUID;
    model_record RECORD;
    migrated_count INT := 0;
BEGIN
    FOR brand_record IN 
        SELECT b.id, b.value, 
               (SELECT COUNT(*) FROM lookup_values s WHERE s.lookup_type = 'phones_series' AND s.parent_id = b.id) as series_count
        FROM lookup_values b
        WHERE b.lookup_type = 'phones_brand'
    LOOP
        IF brand_record.series_count = 0 THEN
            -- Create a dummy series
            new_series_id := gen_random_uuid();
            INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
            VALUES (new_series_id, 'phones_series', brand_record.id, 'Standard', '{}'::jsonb, 0);
            
            -- Find models from phones_tablets_model where the parent brand has the same value (case insensitive)
            FOR model_record IN
                SELECT m.value
                FROM lookup_values m
                JOIN lookup_values tb ON tb.id = m.parent_id
                WHERE m.lookup_type = 'phones_tablets_model' 
                  AND tb.lookup_type = 'phones_tablets_brand'
                  AND lower(trim(tb.value)) = lower(trim(brand_record.value))
            LOOP
                -- Insert into phones_model
                INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
                VALUES (gen_random_uuid(), 'phones_model', new_series_id, model_record.value, '{}'::jsonb, 0);
                migrated_count := migrated_count + 1;
            END LOOP;
        END IF;
    END LOOP;
    
    -- Second pass: What about legacy brands that are COMPLETELY missing from phones_brand?
    -- Let's add them to phones_brand, add a Standard series, and link their models.
    FOR brand_record IN
        SELECT tb.id, tb.value
        FROM lookup_values tb
        WHERE tb.lookup_type = 'phones_tablets_brand'
          AND NOT EXISTS (
              SELECT 1 FROM lookup_values b 
              WHERE b.lookup_type = 'phones_brand' 
                AND lower(trim(b.value)) = lower(trim(tb.value))
          )
    LOOP
        -- 1. Insert into phones_brand
        DECLARE
            new_brand_id UUID := gen_random_uuid();
        BEGIN
            INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
            VALUES (new_brand_id, 'phones_brand', NULL, brand_record.value, '{}'::jsonb, 0);
            
            -- 2. Insert dummy series
            new_series_id := gen_random_uuid();
            INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
            VALUES (new_series_id, 'phones_series', new_brand_id, 'Standard', '{}'::jsonb, 0);
            
            -- 3. Insert models
            FOR model_record IN
                SELECT m.value
                FROM lookup_values m
                WHERE m.lookup_type = 'phones_tablets_model' 
                  AND m.parent_id = brand_record.id
            LOOP
                INSERT INTO lookup_values (id, lookup_type, parent_id, value, metadata, order_index)
                VALUES (gen_random_uuid(), 'phones_model', new_series_id, model_record.value, '{}'::jsonb, 0);
                migrated_count := migrated_count + 1;
            END LOOP;
        END;
    END LOOP;
    
    RAISE NOTICE 'Migrated % missing models to phones_model', migrated_count;
END $$;
