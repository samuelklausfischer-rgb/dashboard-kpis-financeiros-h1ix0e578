DO $$
DECLARE
  nova_unidade_id uuid;
  i int;
  tipo_unidade text;
  current_date_val date := CURRENT_DATE;
BEGIN
  -- Insert 100 new units and their respective daily KPIs
  FOR i IN 1..100 LOOP
    nova_unidade_id := gen_random_uuid();

    IF i <= 10 THEN
      tipo_unidade := 'matriz';
    ELSE
      tipo_unidade := 'filial';
    END IF;

    -- Insert unit
    INSERT INTO public.unidades (id, nome, tipo, ativa)
    VALUES (
      nova_unidade_id, 
      'Unidade ' || LPAD(i::text, 3, '0') || ' - ' || (CASE WHEN tipo_unidade = 'matriz' THEN 'Matriz Principal' ELSE 'Filial Regional' END), 
      tipo_unidade, 
      true
    );

    -- Insert KPIs for the current date
    INSERT INTO public.kpis_diarios (
      unidade_id, data, faturamento_bruto, custos_totais, despesas_totais,
      margem_contribuicao, resultado_financeiro, ebitda
    ) VALUES (
      nova_unidade_id,
      current_date_val,
      50000 + (random() * 50000),   -- Faturamento Bruto
      20000 + (random() * 15000),   -- Custos Totais
      10000 + (random() * 10000),   -- Despesas Totais
      20000 + (random() * 25000),   -- Margem de Contribuição
      1000 + (random() * 5000),     -- Resultado Financeiro
      15000 + (random() * 20000)    -- EBITDA
    );
  END LOOP;
END $$;
