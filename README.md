# Bakevans by Lina Bevans - Sitio Web

Sitio web profesional para Bakevans by Lina Bevans, negocio de repostería artesanal especializado en pasteles personalizados, galletas y productos de repostería para todo tipo de celebraciones.

## 🎂 Características

- **Diseño Moderno y Colorido**: Paleta vibrante con efectos glassmorphism y gradientes
- **Animaciones Interactivas**: Fondo de partículas (estrellas coloridas) que responden al cursor
- **Carrusel de Productos**: Galería animada con las creaciones de la pastelería
- **Formulario de Contacto**: Integrado con email y WhatsApp
- **Responsive**: Diseño adaptable a todos los dispositivos
- **Backend Node.js**: Manejo de formularios con almacenamiento en Excel

## 🚀 Instalación

### Requisitos Previos

- Node.js (versión 14 o superior)
- npm (Node Package Manager)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Copia el archivo `.env.example` a `.env`:
   ```bash
   copy .env.example .env
   ```
   
   Luego edita el archivo `.env` con tus configuraciones:
   
   - **SMTP_USER**: Tu correo electrónico (ej: tu-email@gmail.com)
   - **SMTP_PASS**: Contraseña de aplicación (ver instrucciones abajo)
   - **BUSINESS_EMAIL**: Email donde recibirás las notificaciones (linabevans@gmail.com)

### 📧 Configurar Email con Gmail

Para enviar emails desde Gmail, necesitas crear una "Contraseña de aplicación":

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Selecciona "Seguridad"
3. Activa la "Verificación en dos pasos" (si no la tienes)
4. Busca "Contraseñas de aplicaciones"
5. Selecciona "Correo" y "Windows PC"
6. Copia la contraseña generada (16 caracteres)
7. Pega esta contraseña en `SMTP_PASS` en tu archivo `.env`

**Nota**: Si no configuras el email, el sitio seguirá funcionando y guardará los datos en Excel, pero no enviará notificaciones por correo.

## ▶️ Uso

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará el servidor con auto-recarga en cambios.

### Modo Producción

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

## 📁 Estructura del Proyecto

```
bakevans-website/
├── index.html              # Página principal
├── server.js               # Servidor Node.js
├── package.json            # Dependencias del proyecto
├── .env.example            # Ejemplo de configuración
├── .gitignore             # Archivos ignorados por Git
│
├── css/
│   └── styles.css         # Estilos del sitio
│
├── js/
│   ├── particles.js       # Sistema de partículas interactivas
│   └── main.js            # Funcionalidad principal
│
└── images/
    ├── pd1.png            # Imagen producto 1
    ├── pd2.png            # Imagen producto 2
    ├── pd3.png            # Imagen producto 3
    └── pd4.png            # Imagen producto 4
```

## 📋 Funcionalidades del Formulario

Cuando un cliente envía el formulario de contacto:

1. ✅ Los datos se guardan en un archivo Excel (`submissions.xlsx`)
2. ✅ Se envía un email de notificación a `linabevans@gmail.com`
3. ✅ El cliente es redirigido a WhatsApp para contacto directo
4. ✅ Mensaje pre-llenado en WhatsApp con la información del pedido

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-pink: #FF6B9D;
    --primary-purple: #C44EFF;
    --primary-gold: #FFD93D;
    /* ... más colores */
}
```

### Cambiar Imágenes

Reemplaza las imágenes en la carpeta `images/` manteniendo los mismos nombres:
- `pd1.png` - `pd4.png`

### Modificar Contenido

Edita el texto directamente en `index.html` en las secciones correspondientes.

## 📱 Contacto del Negocio

- **Teléfono/WhatsApp**: +57 300 2326942
- **Email**: linabevans@gmail.com
- **Nombre del Negocio**: Bakevans by Lina Bevans

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express
- **Email**: Nodemailer
- **Almacenamiento**: XLSX (Excel)
- **Efectos**: Canvas API para partículas animadas

## 📝 Notas Importantes

- El archivo `submissions.xlsx` se crea automáticamente cuando se recibe el primer formulario
- Las partículas de fondo son optimizadas para rendimiento y no afectan la carga del sitio
- El sitio es completamente responsive y funciona en móviles, tablets y escritorio
- El carrusel de imágenes tiene auto-play cada 5 segundos

## 🐛 Solución de Problemas

**El email no se envía:**
- Verifica que `.env` tiene las credenciales correctas
- Asegúrate de usar una "Contraseña de aplicación" de Gmail
- Revisa que la verificación en dos pasos esté activada en tu cuenta de Google

**El servidor no inicia:**
- Verifica que Node.js esté instalado: `node --version`
- Asegúrate de haber ejecutado `npm install`
- Revisa que el puerto 3000 no esté en uso

**Las imágenes no se ven:**
- Verifica que las imágenes estén en la carpeta `images/`
- Asegúrate que los nombres sean exactamente: pd1.png, pd2.png, pd3.png, pd4.png

## 📄 Licencia

Este proyecto fue creado para Bakevans by Lina Bevans.

---

¡Hecho con 💖 y muchas 🎂 por Bakevans!
