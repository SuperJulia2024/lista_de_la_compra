# 🧪 Pruebas de Sincronización en Tiempo Real

## 📋 Lista de Verificación

Para verificar que la sincronización en tiempo real funciona correctamente entre los dos móviles:

### 1. Configuración Inicial ✅
- [ ] Ambos móviles tienen la app instalada
- [ ] Ambos móviles están conectados a internet
- [ ] Ambos móviles han iniciado sesión con la misma cuenta
- [ ] Las credenciales de Supabase están configuradas correctamente

### 2. Pruebas de Sincronización

#### 🆕 Añadir Items
1. **Móvil A**: Añade un nuevo item
2. **Móvil B**: Verifica que aparece automáticamente
3. **Tiempo esperado**: < 2 segundos

#### ✏️ Editar Items
1. **Móvil A**: Edita el texto de un item
2. **Móvil B**: Verifica que el cambio se refleja
3. **Tiempo esperado**: < 2 segundos

#### 👥 Seleccionar/Deseleccionar Jorge/Elisa
1. **Móvil A**: Haz clic en "Jorge" o "Elisa" para un item
2. **Móvil B**: Verifica que el botón cambia de estado
3. **Tiempo esperado**: < 2 segundos

#### 🔄 Reordenar Items
1. **Móvil A**: Arrastra un item para cambiar su posición
2. **Móvil B**: Verifica que el orden se actualiza
3. **Tiempo esperado**: < 2 segundos

#### 🗑️ Borrar Items
1. **Móvil A**: Borra un item
2. **Móvil B**: Verifica que desaparece
3. **Tiempo esperado**: < 2 segundos

#### 🗑️ Borrar Lista Completa
1. **Móvil A**: Haz clic en "Borrar Lista de la compra"
2. **Móvil B**: Verifica que todos los items desaparecen
3. **Tiempo esperado**: < 2 segundos

## 🔍 Verificación en Consola

En ambos móviles, abre la consola del navegador y verifica que aparezcan estos mensajes:

```
=== SETUP REALTIME SUBSCRIPTION ===
User ID: [tu-user-id]
Creating realtime channel: items-[tu-user-id]
✅ Successfully subscribed to realtime updates
```

Cuando se hagan cambios, deberías ver:

```
=== REALTIME UPDATE RECEIVED ===
Event Type: INSERT/UPDATE/DELETE
🆕 New item added, re-rendering list...
Re-rendering list after realtime update...
List re-rendered due to changes
```

## 🚨 Problemas Comunes

### No aparece "Successfully subscribed to realtime updates"
- Verifica que WAL Level esté configurado como "logical" en Supabase
- Revisa que las migraciones SQL se hayan ejecutado
- Verifica la conexión a internet

### Los cambios no se sincronizan
- Verifica que ambos móviles usen la misma cuenta
- Revisa la consola para errores
- Asegúrate de que las credenciales de Supabase sean correctas

### Sincronización lenta (> 5 segundos)
- La app tiene polling de respaldo cada 10 segundos
- Verifica la conexión WebSocket en la consola
- Revisa que no haya restricciones de firewall

## 📱 Simulación de Móviles

Si no tienes dos móviles físicos, puedes probar con:

1. **Navegador móvil** + **Navegador de escritorio**
2. **Pestaña normal** + **Pestaña privada/incógnito**
3. **Diferentes navegadores** (Chrome, Firefox, Safari)

## 🎯 Métricas de Rendimiento

- **Tiempo de sincronización**: < 2 segundos (WebSocket) / < 10 segundos (polling)
- **Tasa de éxito**: > 99%
- **Reconexión automática**: < 5 segundos después de pérdida de conexión

## 📞 Reporte de Problemas

Si encuentras problemas, incluye:
1. Screenshots de la consola del navegador
2. Tipo de dispositivo y navegador
3. Pasos para reproducir el problema
4. Mensajes de error específicos
