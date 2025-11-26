🌟 SmartInvoice — Generador de Facturas con PDF (Next.js + Tailwind + jsPDF)

<p align="center"> <strong>Sistema moderno para crear facturas, generar PDF profesionales y organizar tus documentos todo en un solo lugar.</strong> </p>
🚀 Descripción

SmartInvoice es una aplicación moderna construida con Next.js, TailwindCSS, jsPDF y html2canvas-pro que permite:

Crear facturas de manera rápida

Agregar ítems dinámicamente

Calcular subtotal, impuestos, descuentos y totales

Previsualizar la factura en tiempo real

Exportarla a un PDF profesional, centrado y estilizado

Diseñada para freelancers, agencias, pymes o cualquier persona que necesite generar facturas de manera simple y efectiva.

🛠️ Tecnologías utilizadas
Front-End

⚛️ Next.js 14+ (App Router)

🎨 TailwindCSS

🧩 TypeScript

🧮 React Hooks

Generación de PDF

🖨 jsPDF

🖼 html2canvas-pro (con soporte para colores modernos como lab())

✨ Características principales
🧾 Generación instantánea de facturas

Crea una factura completa incluyendo:

Datos del cliente

Ítems con cantidad, precio unitario y total

Notas y observaciones

Fecha de emisión

Moneda configurable (CLP, USD, EUR)

Número de factura generado dinámicamente

🖨 Exportación a PDF de alta calidad

SmartInvoice genera un PDF:

Centrado en formato A4

Con diseño profesional minimalista

Con ajuste automático de escala

Con ancho expandido en modo pdf-mode para evitar recortes

Con estilo consistente al del preview

👁 Vista previa en tiempo real

La interfaz muestra una previsualización exacta del PDF antes de descargarlo:

Diseño limpio

Encabezado corporativo

Tabla responsiva de ítems

Resumen detallado de valores

📱 100% Responsivo

Funciona perfectamente en:

Desktop

Tablet

Móvil

El invoice-preview se adapta a la UI mientras que el PDF sale en su ancho óptimo.


📦 Instalación

Clona el repositorio:

git clone https://github.com/CIgnacio-dev/smartinvoice.git
cd smartinvoice


Instala dependencias:

npm install


Inicia el proyecto:

npm run dev


Abre en tu navegador:

http://localhost:3000

🧩 Generación de PDF — Explicación técnica

Para evitar problemas de recorte o desbordes, SmartInvoice utiliza una técnica que:

Aplica una clase .pdf-mode al contenedor

aumenta el ancho

incrementa padding

asegura un layout estable para A4

Usa html2canvas-pro para capturar el nodo

Inserta la imagen en un documento jsPDF ajustado al ancho del PDF

element.classList.add("pdf-mode");

const canvas = await html2canvas(element, {
  scale: 2,
});

element.classList.remove("pdf-mode");

pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);


Esto garantiza un PDF ancho, nítido y sin cortes, incluso si la UI es responsiva.

🗺️ Roadmap

 Agregar logo personalizado

 Generación de facturas en formato “landscape”

 Soporte de múltiples plantillas (Minimal, Corporativa, Dark)

 Enviar factura por email

 Persistencia con base de datos (SQLite / Prisma / PostgreSQL)

 Autenticación y dashboard de facturas

 Exportar factura a JSON o XML

🤝 Contribuciones

¡Las contribuciones son bienvenidas!
Puedes abrir un issue, enviar un pull request o sugerir mejoras.

📄 Licencia

Este proyecto está bajo la licencia MIT.
Consulta el archivo LICENSE para más detalles.

💬 Autor

Desarrollado con ❤️ por Carlos Ignacio Roa Troncoso