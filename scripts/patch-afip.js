import fs from 'fs';
import path from 'path';

const targetPath = path.resolve(process.cwd(), 'node_modules', '@arcasdk', 'core', 'lib', 'infrastructure', 'soap', 'engines', 'node-security.engine.js');

if (fs.existsSync(targetPath)) {
  let content = fs.readFileSync(targetPath, 'utf8');
  if (content.includes('DEFAULT@SECLEVEL=1')) {
    content = content.replace(/DEFAULT@SECLEVEL=1/g, 'DEFAULT@SECLEVEL=0');
    fs.writeFileSync(targetPath, content, 'utf8');
    console.log('✅ Patched @arcasdk/core to use SECLEVEL=0 for AFIP compatibility on Node 18+');
  } else {
    console.log('⚠️ @arcasdk/core already patched or pattern not found.');
  }
} else {
  console.log('⚠️ @arcasdk/core not found. Patch skipped.');
}
