const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Configuración de las variables de entorno para producción\n');

rl.question('URL de Supabase: ', (supabaseUrl) => {
  rl.question('Clave anónima de Supabase: ', (supabaseKey) => {
    // Crear archivo .env
    const envContent = `VITE_SUPABASE_URL=${supabaseUrl}\nVITE_SUPABASE_ANON_KEY=${supabaseKey}\nNODE_ENV=production`;
    
    // Actualizar env-config.js
    const envConfigPath = path.join(__dirname, 'public', 'env-config.js');
    let envConfigContent = fs.readFileSync(envConfigPath, 'utf8');
    
    envConfigContent = envConfigContent
      .replace("TU_URL_DE_SUPABASE", supabaseUrl)
      .replace("TU_CLAVE_ANONIMA_DE_SUPABASE", supabaseKey);
    
    // Escribir los archivos
    fs.writeFileSync('.env', envContent);
    fs.writeFileSync(envConfigPath, envConfigContent);
    
    console.log('\n✅ Configuración completada con éxito!');
    console.log('Ahora puedes construir la aplicación con: npm run build');
    
    rl.close();
  });
});
