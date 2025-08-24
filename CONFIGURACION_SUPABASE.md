# Configuración de Supabase para Sincronización en Tiempo Real

## 🚀 Configuración Inicial

Para que la sincronización en tiempo real funcione correctamente entre los dos móviles, necesitas configurar Supabase:

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
```

### 2. Obtener credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un nuevo proyecto
2. En la configuración del proyecto, ve a "Settings" > "API"
3. Copia la "Project URL" y la "anon public" key
4. Pégala en tu archivo `.env`

### 3. Configurar la base de datos

Ejecuta las migraciones SQL en tu proyecto de Supabase:

1. Ve a "SQL Editor" en tu dashboard de Supabase
2. Ejecuta cada archivo de migración en orden:
   - `create_items_table.sql`
   - `add_item_order_column.sql`
   - `20240824_enable_realtime_for_items.sql`

### 4. Habilitar Realtime en Supabase

**IMPORTANTE**: Para que la sincronización en tiempo real funcione, necesitas habilitar el nivel WAL lógico:

1. Ve a "Settings" > "Database" en tu dashboard de Supabase
2. Busca "WAL Level" y asegúrate de que esté configurado como "logical"
3. Si no puedes cambiarlo, contacta al soporte de Supabase

## 🔄 Cómo funciona la sincronización

La aplicación ya está configurada para:

- ✅ **Añadir items**: Se sincroniza automáticamente
- ✅ **Borrar items**: Se sincroniza automáticamente  
- ✅ **Editar items**: Se sincroniza automáticamente
- ✅ **Seleccionar/deseleccionar Jorge/Elisa**: Se sincroniza automáticamente
- ✅ **Reordenar items**: Se sincroniza automáticamente
- ✅ **Borrar lista completa**: Se sincroniza automáticamente

## 🛠️ Solución de problemas

### La sincronización no funciona

1. **Verifica la consola del navegador** para errores
2. **Asegúrate de que las credenciales de Supabase sean correctas**
3. **Verifica que WAL Level esté configurado como "logical"**
4. **Revisa que las migraciones SQL se hayan ejecutado correctamente**

### Errores de conexión

1. **Verifica tu conexión a internet**
2. **Asegúrate de que el proyecto de Supabase esté activo**
3. **Revisa que no haya restricciones de firewall**

### Sincronización lenta

La aplicación tiene un sistema de polling como respaldo que se ejecuta cada 10 segundos si WebSocket falla.

## 📱 Uso en móviles

1. **Instala la app** en ambos móviles
2. **Inicia sesión** con la misma cuenta en ambos
3. **Los cambios se sincronizarán automáticamente** en tiempo real
4. **Si un móvil pierde conexión**, se reconectará automáticamente

## 🔧 Configuración avanzada

### Personalizar intervalos de polling

Puedes modificar los intervalos de polling en `main.js`:

```javascript
// Polling cada 10 segundos (por defecto)
pollInterval = setInterval(pollForChanges, 10000);

// Polling más frecuente en caso de error
pollInterval = setInterval(pollForChanges, 5000);
```

### Logs de depuración

La aplicación incluye logs detallados en la consola del navegador para ayudar con la depuración.

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
1. Los logs en la consola del navegador
2. La configuración de tu proyecto de Supabase
3. Que todas las migraciones SQL se hayan ejecutado correctamente
