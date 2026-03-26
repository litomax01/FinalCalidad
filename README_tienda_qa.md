# Proyecto QA Shop en Angular

## Flujo de la aplicación
1. Login
2. Register
3. Catálogo de productos
4. Agregar productos al carrito
5. Ver carrito

## Usuario por defecto
- usuario: admin
- contraseña: 12345

## Comandos principales
```powershell
npm install
npm start
```

## Pruebas Selenium
1. Ejecuta la app Angular en `http://localhost:4200`
2. Coloca `msedgedriver.exe` en la misma carpeta del script Python
3. Instala Selenium:
```powershell
pip install selenium
```
4. Ejecuta:
```powershell
python selenium_test_edge.py
```

## Despliegue a GitHub Pages
```powershell
ng build --base-href="/NOMBRE-DEL-REPO/"
npx angular-cli-ghpages --dir=dist/tienda-qa/browser
```

Si tu salida de build no genera la carpeta `browser`, revisa `dist/tienda-qa` y ajusta `--dir`.
