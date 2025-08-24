-- =====================================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE PARA LISTA DE COMPRAS
-- =====================================================
-- Ejecuta estos comandos en el SQL Editor de tu proyecto de Supabase
-- en el orden especificado

-- =====================================================
-- 1. CREAR TABLA ITEMS
-- =====================================================

CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  text text NOT NULL DEFAULT '',
  elisa_active boolean DEFAULT false,
  jorge_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =====================================================
-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREAR POLÍTICAS DE SEGURIDAD
-- =====================================================

-- Política para usuarios autenticados ver sus propios items
CREATE POLICY "Authenticated users can view their own items"
  ON items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para usuarios autenticados insertar sus propios items
CREATE POLICY "Authenticated users can insert their own items"
  ON items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Política para usuarios autenticados actualizar sus propios items
CREATE POLICY "Authenticated users can update their own items"
  ON items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Política para usuarios autenticados borrar sus propios items
CREATE POLICY "Authenticated users can delete their own items"
  ON items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =====================================================
-- 4. AÑADIR COLUMNA ORDER
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'items' AND column_name = 'order'
  ) THEN
    ALTER TABLE items ADD COLUMN "order" float DEFAULT 0.0;
    RAISE NOTICE '✅ Columna "order" añadida a la tabla items';
  ELSE
    RAISE NOTICE 'ℹ️ La columna "order" ya existe en la tabla items';
  END IF;
END $$;

-- =====================================================
-- 5. HABILITAR REALTIME
-- =====================================================

-- Crear publicación si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
        RAISE NOTICE '✅ Publicación supabase_realtime creada';
    ELSE
        RAISE NOTICE 'ℹ️ La publicación supabase_realtime ya existe';
    END IF;
EXCEPTION WHEN others THEN
    RAISE NOTICE '⚠️ No se pudo crear la publicación: %', SQLERRM;
END $$;

-- Añadir tabla items a la publicación
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'items'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE items;
        RAISE NOTICE '✅ Tabla items añadida a la publicación supabase_realtime';
    ELSE
        RAISE NOTICE 'ℹ️ La tabla items ya está en la publicación supabase_realtime';
    END IF;
EXCEPTION WHEN others THEN
    RAISE NOTICE '⚠️ No se pudo añadir la tabla a la publicación: %', SQLERRM;
END $$;

-- =====================================================
-- 6. VERIFICAR CONFIGURACIÓN
-- =====================================================

-- Verificar que la tabla existe
SELECT 
    'Tabla items' as elemento,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'items') 
        THEN '✅ Existe' 
        ELSE '❌ No existe' 
    END as estado;

-- Verificar que RLS está habilitado
SELECT 
    'RLS habilitado' as elemento,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'items' AND rowsecurity = true) 
        THEN '✅ Habilitado' 
        ELSE '❌ No habilitado' 
    END as estado;

-- Verificar que la columna order existe
SELECT 
    'Columna order' as elemento,
    CASE 
        WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'order') 
        THEN '✅ Existe' 
        ELSE '❌ No existe' 
    END as estado;

-- Verificar que la tabla está en la publicación realtime
SELECT 
    'Realtime habilitado' as elemento,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' 
            AND tablename = 'items'
        ) 
        THEN '✅ Habilitado' 
        ELSE '❌ No habilitado' 
    END as estado;

-- =====================================================
-- 7. INSTRUCCIONES IMPORTANTES
-- =====================================================

/*
IMPORTANTE: Para que la sincronización en tiempo real funcione completamente,
necesitas verificar que el WAL Level esté configurado como "logical" en tu proyecto.

1. Ve a "Settings" > "Database" en tu dashboard de Supabase
2. Busca "WAL Level" 
3. Debe estar configurado como "logical"
4. Si no puedes cambiarlo, contacta al soporte de Supabase

Una vez ejecutados estos comandos, tu aplicación debería funcionar con
sincronización en tiempo real entre los dos móviles.
*/
