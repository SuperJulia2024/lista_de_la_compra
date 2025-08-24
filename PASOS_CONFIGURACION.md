# 🚀 Configuración Paso a Paso de Supabase

## ✅ **PASO 1: Credenciales Configuradas**
Ya he configurado tu archivo `public/env-config.js` con tus credenciales reales de Supabase.

## 🔧 **PASO 2: Ejecutar SQL en Supabase**

### 2.1 Ir al SQL Editor
1. Ve a tu [dashboard de Supabase](https://supabase.com/dashboard)
2. Selecciona tu proyecto `qnkidhrwadquqwglwrlh`
3. Haz clic en **"SQL Editor"** en el menú lateral

### 2.2 Ejecutar el SQL completo
1. Haz clic en **"New query"**
2. Copia y pega **TODO** el contenido del archivo `SUPABASE_SETUP.sql`
3. Haz clic en **"Run"** (botón azul)

### 2.3 Verificar resultados
Deberías ver mensajes como:
- ✅ Tabla items creada
- ✅ RLS habilitado
- ✅ Políticas creadas
- ✅ Columna order añadida
- ✅ Realtime habilitado

## ⚠️ **PASO 3: Verificar WAL Level (IMPORTANTE)**

### 3.1 Ir a configuración de base de datos
1. En tu dashboard de Supabase, ve a **"Settings"**
2. Haz clic en **"Database"**
3. Busca **"WAL Level"**

### 3.2 Verificar configuración
- **Debe estar configurado como "logical"**
- Si está como "replica", contacta al soporte de Supabase
- Este paso es **CRÍTICO** para que funcione la sincronización

## 🧪 **PASO 4: Probar la Aplicación**

### 4.1 Ejecutar la app
1. Ejecuta `npm run dev` en tu terminal
2. Abre la aplicación en tu navegador
3. Abre la consola del navegador (F12)

### 4.2 Verificar conexión
Deberías ver en la consola:
```
✅ Configuración de Supabase cargada correctamente
=== SETUP REALTIME SUBSCRIPTION ===
User ID: [tu-user-id]
✅ Successfully subscribed to realtime updates
```

## 📱 **PASO 5: Probar Sincronización**

### 5.1 Simular dos móviles
1. **Móvil A**: Abre la app en una pestaña normal
2. **Móvil B**: Abre la app en una pestaña privada/incógnito
3. Inicia sesión con la misma cuenta en ambos

### 5.2 Hacer cambios
- **Móvil A**: Añade un item
- **Móvil B**: Verifica que aparece automáticamente (< 2 segundos)

## 🚨 **Si algo no funciona:**

### Problema: "Error: Credenciales de Supabase no configuradas"
- Verifica que el archivo `public/env-config.js` tenga tus credenciales
- Recarga la página

### Problema: "No se pudo crear la publicación"
- Ejecuta solo la parte de realtime del SQL
- Verifica que tienes permisos de administrador

### Problema: No aparece "Successfully subscribed"
- Verifica que WAL Level sea "logical"
- Revisa la consola para errores específicos

## 🎯 **Resultado Esperado:**
Una vez configurado, deberías tener:
- ✅ Sincronización en tiempo real entre móviles
- ✅ Todos los cambios se reflejan automáticamente
- ✅ Reconexión automática si se pierde conexión
- ✅ Sistema de polling de respaldo

## 📞 **Soporte:**
Si tienes problemas, comparte:
1. Screenshots de la consola del navegador
2. Mensajes de error específicos
3. Resultados de la verificación SQL

¡Con estos pasos tendrás la sincronización funcionando perfectamente! 🎉
