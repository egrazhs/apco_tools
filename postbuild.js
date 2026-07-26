// postbuild.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Iniciando post-procesamiento de compilación...');

try {
    // 1. Eliminar stub conflictivo de firebase-functions
    const functionsStubPath = path.join(__dirname, '.output/server/node_modules/firebase-functions');
    if (fs.existsSync(functionsStubPath)) {
        fs.rmSync(functionsStubPath, { recursive: true, force: true });
        console.log('✅ Stub conflictivo de firebase-functions eliminado.');
    } else {
        console.log('⏭️  Stub de firebase-functions no encontrado (esperado en primera compilación).');
    }

    // 2. Limpiar Sharp binarios de Windows
    const packageJsonPath = path.join(__dirname, '.output/server/package.json');
    if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const sharpDeps = ['@img/sharp-win32-x64', '@img/sharp-win32-ia32'];
        
        if (pkg.dependencies) {
            sharpDeps.forEach(dep => {
                if (pkg.dependencies[dep]) {
                    delete pkg.dependencies[dep];
                    console.log(`  ✓ Removido: ${dep}`);
                }
            });
            fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf8');
            console.log('✅ Package.json actualizado (Sharp binarios removidos).');
        }
    } else {
        console.log('⚠️  Package.json no encontrado en .output/server');
    }

    console.log('✨ Post-procesamiento completado.\n');
} catch (error) {
    console.error('❌ Error en post-build:', error.message);
    process.exit(1);
}