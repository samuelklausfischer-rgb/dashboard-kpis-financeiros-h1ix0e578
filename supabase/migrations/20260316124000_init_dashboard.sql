CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT,
  role TEXT CHECK (role IN ('admin', 'viewer')) NOT NULL DEFAULT 'viewer',
  ativo BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('matriz', 'filial')) NOT NULL,
  ativa BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE kpis_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  data DATE NOT NULL,
  faturamento_bruto NUMERIC NOT NULL DEFAULT 0,
  custos_totais NUMERIC NOT NULL DEFAULT 0,
  despesas_totais NUMERIC NOT NULL DEFAULT 0,
  margem_contribuicao NUMERIC NOT NULL DEFAULT 0,
  resultado_financeiro NUMERIC NOT NULL DEFAULT 0,
  ebitda NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unidade_id UUID REFERENCES unidades(id) ON DELETE CASCADE,
  tipo_alerta TEXT CHECK (tipo_alerta IN ('receita', 'despesa')) NOT NULL,
  percentual_variacao NUMERIC NOT NULL,
  data_alerta TIMESTAMP NOT NULL DEFAULT NOW(),
  enviado BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all authenticated users on usuarios" ON usuarios FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users on unidades" ON unidades FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users on kpis_diarios" ON kpis_diarios FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all authenticated users on alertas" ON alertas FOR ALL TO authenticated USING (true);

DO $$
DECLARE
  new_user_id uuid;
  unidade1_id uuid;
  i int;
  current_date_val date;
BEGIN
  -- Create seed user
  new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
    is_super_admin, role, aud,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current,
    phone, phone_change, phone_change_token, reauthentication_token
  ) VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@example.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"name": "Admin"}',
    false, 'authenticated', 'authenticated',
    '', '', '', '', '',
    NULL,
    '', '', ''
  );

  INSERT INTO public.usuarios (id, email, senha_hash, role, ativo)
  VALUES (new_user_id, 'admin@example.com', '', 'admin', true);

  -- Create seed units and daily KPIs
  unidade1_id := gen_random_uuid();
  INSERT INTO public.unidades (id, nome, tipo, ativa)
  VALUES (unidade1_id, 'Matriz SP', 'matriz', true);

  current_date_val := CURRENT_DATE - 60;

  FOR i IN 0..60 LOOP
    INSERT INTO public.kpis_diarios (
      unidade_id, data, faturamento_bruto, custos_totais, despesas_totais, 
      margem_contribuicao, resultado_financeiro, ebitda
    ) VALUES (
      unidade1_id, 
      current_date_val + i,
      30000 + (random() * 5000),
      15000 + (random() * 2000),
      10000 + (random() * 1000),
      15000 + (random() * 3000),
      1000 + (random() * 500),
      14000 + (random() * 2500)
    );
  END LOOP;
END $$;
