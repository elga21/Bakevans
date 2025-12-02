// ========================================
// SERVIDOR NODE.JS PARA BAKEVANS WEBSITE
// ========================================

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const EXCEL_FILE = 'submissions.xlsx';

// ========================================
// MIDDLEWARE
// ========================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// ========================================
// CONFIGURACIÓN DE NODEMAILER
// ========================================
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verificar conexión de email (opcional)
transporter.verify((error, success) => {
    if (error) {
        console.warn('⚠️  Advertencia: No se pudo verificar la configuración de email.');
        console.warn('   Los datos se guardarán en Excel, pero no se enviarán emails.');
        console.warn('   Error:', error.message);
    } else {
        console.log('✅ Servidor de email listo para enviar mensajes');
    }
});

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Guardar datos en archivo Excel
 */
function saveToExcel(data) {
    let workbook;
    let worksheet;

    // Verificar si el archivo Excel existe
    if (fs.existsSync(EXCEL_FILE)) {
        // Leer archivo existente
        workbook = XLSX.readFile(EXCEL_FILE);
        worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir a JSON para agregar nueva fila
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        jsonData.push(data);

        // Crear nueva hoja con los datos actualizados
        worksheet = XLSX.utils.json_to_sheet(jsonData);
    } else {
        // Crear nuevo archivo
        worksheet = XLSX.utils.json_to_sheet([data]);
    }

    // Actualizar workbook
    if (!workbook) {
        workbook = XLSX.utils.book_new();
    }

    // Reemplazar o agregar la hoja
    workbook.SheetNames = ['Contactos'];
    workbook.Sheets['Contactos'] = worksheet;

    // Guardar archivo
    XLSX.writeFile(workbook, EXCEL_FILE);
    console.log('✅ Datos guardados en Excel:', EXCEL_FILE);
}

/**
 * Enviar email de notificación
 */
async function sendEmail(data) {
    const mailOptions = {
        from: `"${process.env.BUSINESS_NAME || 'Bakevans'}" <${process.env.SMTP_USER}>`,
        to: process.env.BUSINESS_EMAIL || 'linabevans@gmail.com',
        subject: `Nuevo pedido de ${data.nombre} - ${data.evento || 'Consulta'}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    .header {
                        background: linear-gradient(135deg, #FF6B9D 0%, #C44EFF 100%);
                        color: white;
                        padding: 30px;
                        text-align: center;
                        border-radius: 10px 10px 0 0;
                    }
                    .content {
                        background: #fff;
                        padding: 30px;
                        border: 1px solid #eee;
                    }
                    .field {
                        margin-bottom: 20px;
                        padding: 15px;
                        background: #f9f9f9;
                        border-left: 4px solid #FF6B9D;
                        border-radius: 5px;
                    }
                    .field-label {
                        font-weight: bold;
                        color: #FF6B9D;
                        text-transform: uppercase;
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                    .field-value {
                        color: #333;
                        font-size: 16px;
                    }
                    .footer {
                        background: #f5f5f5;
                        padding: 20px;
                        text-align: center;
                        border-radius: 0 0 10px 10px;
                        color: #666;
                        font-size: 14px;
                    }
                    .whatsapp-btn {
                        display: inline-block;
                        background: #25D366;
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 25px;
                        margin-top: 20px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🎂 Nuevo Pedido Recibido</h1>
                    <p>Bakevans by Lina Bevans</p>
                </div>
                <div class="content">
                    <div class="field">
                        <div class="field-label">Nombre del Cliente</div>
                        <div class="field-value">${data.nombre}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">Teléfono / WhatsApp</div>
                        <div class="field-value">${data.telefono}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">Email</div>
                        <div class="field-value">${data.email}</div>
                    </div>
                    
                    ${data.evento ? `
                    <div class="field">
                        <div class="field-label">Tipo de Evento</div>
                        <div class="field-value">${data.evento}</div>
                    </div>
                    ` : ''}
                    
                    ${data.fecha ? `
                    <div class="field">
                        <div class="field-label">Fecha del Evento</div>
                        <div class="field-value">${data.fecha}</div>
                    </div>
                    ` : ''}
                    
                    <div class="field">
                        <div class="field-label">Mensaje</div>
                        <div class="field-value">${data.mensaje}</div>
                    </div>
                    
                    <div class="field">
                        <div class="field-label">Fecha de Solicitud</div>
                        <div class="field-value">${data.timestamp}</div>
                    </div>
                    
                    <center>
                        <a href="https://wa.me/${data.telefono.replace(/\D/g, '')}?text=Hola%20${encodeURIComponent(data.nombre)}%2C%20gracias%20por%20contactarnos" class="whatsapp-btn">
                            💬 Responder por WhatsApp
                        </a>
                    </center>
                </div>
                <div class="footer">
                    <p>Este mensaje fue enviado desde el formulario de contacto de tu sitio web.</p>
                    <p><strong>Bakevans by Lina Bevans</strong><br>
                    📱 +57 300 2326942 | 📧 linabevans@gmail.com</p>
                </div>
            </body>
            </html>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error al enviar email:', error.message);
        throw error;
    }
}

// ========================================
// RUTAS / ENDPOINTS
// ========================================

/**
 * Ruta principal
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * API: Endpoint para recibir formulario de contacto
 */
app.post('/api/contact', async (req, res) => {
    try {
        const contactData = req.body;

        // Validar datos requeridos
        if (!contactData.nombre || !contactData.telefono || !contactData.email || !contactData.mensaje) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        console.log('📩 Nuevo mensaje de contacto recibido de:', contactData.nombre);

        // 1. Guardar en Excel (siempre se ejecuta)
        try {
            saveToExcel(contactData);
        } catch (excelError) {
            console.error('❌ Error al guardar en Excel:', excelError.message);
            // Continuar aunque falle Excel
        }

        // 2. Intentar enviar email (puede fallar si no está configurado)
        let emailSent = false;
        let emailError = null;

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            try {
                await sendEmail(contactData);
                emailSent = true;
            } catch (error) {
                emailError = error.message;
                console.error('❌ No se pudo enviar el email, pero los datos fueron guardados.');
            }
        } else {
            console.warn('⚠️  Configuración de email no encontrada. Solo se guardó en Excel.');
        }

        // 3. Responder al cliente
        res.json({
            success: true,
            message: 'Mensaje recibido correctamente',
            emailSent: emailSent,
            savedToExcel: true,
            whatsappRedirect: `https://wa.me/${process.env.WHATSAPP_NUMBER || '573002326942'}`
        });

    } catch (error) {
        console.error('❌ Error en /api/contact:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

/**
 * API: Salud del servidor
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        emailConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS)
    });
});

// ========================================
// MANEJO DE ERRORES
// ========================================
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================
app.listen(PORT, () => {
    console.log('');
    console.log('🎂 ========================================');
    console.log('   BAKEVANS BY LINA BEVANS');
    console.log('   Servidor Web Iniciado');
    console.log('========================================');
    console.log('');
    console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`📁 Archivo Excel: ${EXCEL_FILE}`);
    console.log(`📧 Email configurado: ${process.env.SMTP_USER ? 'SÍ ✅' : 'NO ⚠️'}`);
    console.log(`📱 WhatsApp: +${process.env.WHATSAPP_NUMBER || '573002326942'}`);
    console.log('');
    console.log('Presiona Ctrl+C para detener el servidor');
    console.log('========================================');
    console.log('');
});
