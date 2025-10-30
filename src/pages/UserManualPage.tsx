import Layout from "../components/Layout";

/**
 * User Manual Page
 * Displays comprehensive user manual and documentation
 * Generated with AI assistance
 * 
 * @component
 * @returns {JSX.Element} User manual page with instructions
 */
const UserManualPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-darkblue text-white px-4 py-8 md:px-8 lg:px-16">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4 text-center">
            Manual de Usuario
          </h1>
          <p className="text-white/70 text-center text-lg">
            Guía completa para utilizar la plataforma de videos
          </p>
        </div>

        {/* Table of Contents */}
        <div className="max-w-4xl mx-auto mb-12 bg-white/5 p-6 rounded-lg border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Tabla de Contenidos</h2>
          <ul className="space-y-2">
            <li><a href="#introduction" className="text-lightblue hover:text-green transition">1. Introducción</a></li>
            <li><a href="#getting-started" className="text-lightblue hover:text-green transition">2. Primeros Pasos</a></li>
            <li><a href="#features" className="text-lightblue hover:text-green transition">3. Funcionalidades Principales</a></li>
            <li><a href="#accessibility" className="text-lightblue hover:text-green transition">4. Navegación por Teclado</a></li>
            <li><a href="#faq" className="text-lightblue hover:text-green transition">5. Preguntas Frecuentes</a></li>
          </ul>
        </div>

        {/* Content Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 border-b border-white/20 pb-2">
              1. Introducción
            </h2>
            <div className="space-y-4 text-white/80">
              <p>
                Bienvenido a la <strong>Plataforma de Videos</strong>, una aplicación web moderna diseñada para explorar, 
                calificar y gestionar contenido de video de manera intuitiva y accesible.
              </p>
              <div className="bg-green/10 border border-green/30 rounded-lg p-4">
                <h3 className="font-semibold text-green mb-2">Características Destacadas:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Exploración de videos con búsqueda avanzada</li>
                  <li>Sistema de favoritos personalizado</li>
                  <li>Calificaciones con estrellas (1-5)</li>
                  <li>Sistema de comentarios completo (CRUD)</li>
                  <li>Subtítulos en español e inglés</li>
                  <li>100% navegable por teclado (WCAG 2.1)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Getting Started */}
          <section id="getting-started" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 border-b border-white/20 pb-2">
              2. Primeros Pasos
            </h2>
            <div className="space-y-6">
              
              {/* Registration */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-lightblue">2.1 Registro de Usuario</h3>
                <ol className="list-decimal list-inside space-y-2 text-white/80">
                  <li>Haz clic en el botón <strong>"Registrarse"</strong> en la página de inicio</li>
                  <li>Completa el formulario con:
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>Nombre completo</li>
                      <li>Correo electrónico válido</li>
                      <li>Contraseña segura (mínimo 8 caracteres)</li>
                    </ul>
                  </li>
                  <li>Acepta los términos y condiciones</li>
                  <li>Haz clic en <strong>"Crear cuenta"</strong></li>
                </ol>
              </div>

              {/* Login */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-lightblue">2.2 Inicio de Sesión</h3>
                <ol className="list-decimal list-inside space-y-2 text-white/80">
                  <li>Ingresa tu correo electrónico</li>
                  <li>Ingresa tu contraseña</li>
                  <li>Haz clic en <strong>"Iniciar sesión"</strong></li>
                  <li>Serás redirigido a la página principal</li>
                </ol>
              </div>

              {/* Forgot Password */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-lightblue">2.3 Recuperar Contraseña</h3>
                <ol className="list-decimal list-inside space-y-2 text-white/80">
                  <li>Haz clic en <strong>"¿Olvidaste tu contraseña?"</strong></li>
                  <li>Ingresa tu correo electrónico registrado</li>
                  <li>Revisa tu correo para el enlace de recuperación</li>
                  <li>Sigue las instrucciones del correo</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 border-b border-white/20 pb-2">
              3. Funcionalidades Principales
            </h2>
            <div className="space-y-6">

              {/* Explore Videos */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-green">3.1 Explorar Videos</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Navegación:</strong> Desplázate por la página principal para ver videos destacados
                  </li>
                  <li>
                    <strong>Búsqueda:</strong> Usa la barra de búsqueda para encontrar videos específicos por título o categoría
                  </li>
                  <li>
                    <strong>Ver detalles:</strong> Haz clic en la imagen del video para ver información completa
                  </li>
                </ul>
              </div>

              {/* Favorites */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-red">3.2 Sistema de Favoritos</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Agregar a favoritos:</strong> Haz clic en el ícono de corazón ❤️ en cualquier video
                  </li>
                  <li>
                    <strong>Quitar de favoritos:</strong> Vuelve a hacer clic en el corazón para eliminar de tu lista
                  </li>
                  <li>
                    <strong>Ver tus favoritos:</strong> Navega a "Favoritos" desde la barra de navegación
                  </li>
                  <li>
                    <strong>Acceso rápido:</strong> El ícono cambia de color cuando un video está en favoritos
                  </li>
                </ul>
              </div>

              {/* Ratings */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-yellow">3.3 Sistema de Calificaciones</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Calificar un video:</strong> Haz clic en "Calificar este video" en la página de detalles
                  </li>
                  <li>
                    <strong>Seleccionar estrellas:</strong> Elige de 1 a 5 estrellas según tu opinión:
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>⭐ = Muy malo</li>
                      <li>⭐⭐ = Malo</li>
                      <li>⭐⭐⭐ = Regular</li>
                      <li>⭐⭐⭐⭐ = Bueno</li>
                      <li>⭐⭐⭐⭐⭐ = Excelente</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Actualizar calificación:</strong> Puedes cambiar tu calificación en cualquier momento
                  </li>
                  <li>
                    <strong>Ver calificaciones:</strong> La calificación promedio se muestra en cada video
                  </li>
                </ul>
              </div>

              {/* Comments */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-blue">3.4 Sistema de Comentarios</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Agregar comentario:</strong>
                    <ol className="list-decimal list-inside ml-6 mt-2">
                      <li>Desplázate a la sección de comentarios</li>
                      <li>Haz clic en "Agregar comentario"</li>
                      <li>Escribe tu comentario (máximo 1000 caracteres)</li>
                      <li>Haz clic en "Enviar"</li>
                    </ol>
                  </li>
                  <li>
                    <strong>Editar comentario:</strong> Haz clic en el ícono de editar (lápiz) en tu comentario
                  </li>
                  <li>
                    <strong>Eliminar comentario:</strong> Haz clic en el ícono de eliminar (basura) y confirma la acción
                  </li>
                  <li>
                    <strong>Información visible:</strong> Cada comentario muestra el autor, fecha y hora de publicación
                  </li>
                </ul>
              </div>

              {/* Subtitles */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-lightblue">3.5 Subtítulos</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Activar subtítulos:</strong> Haz clic en el ícono CC en el reproductor de video
                  </li>
                  <li>
                    <strong>Cambiar idioma:</strong> Selecciona entre:
                    <ul className="list-disc list-inside ml-6 mt-2">
                      <li>🇪🇸 Español</li>
                      <li>🇬🇧 English</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Desactivar:</strong> Selecciona "Desactivar" en el menú de subtítulos
                  </li>
                </ul>
              </div>

              {/* Profile */}
              <div className="bg-white/5 p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-semibold mb-3 text-green">3.6 Perfil de Usuario</h3>
                <ul className="space-y-3 text-white/80">
                  <li>
                    <strong>Editar perfil:</strong>
                    <ol className="list-decimal list-inside ml-6 mt-2">
                      <li>Navega a tu perfil desde la barra de navegación</li>
                      <li>Haz clic en "Editar perfil"</li>
                      <li>Modifica tu nombre o correo</li>
                      <li>Guarda los cambios</li>
                    </ol>
                  </li>
                  <li>
                    <strong>Cambiar contraseña:</strong>
                    <ol className="list-decimal list-inside ml-6 mt-2">
                      <li>En el modal de edición, haz clic en "¿Deseas cambiar tu contraseña?"</li>
                      <li>Ingresa tu contraseña actual</li>
                      <li>Ingresa tu nueva contraseña (dos veces)</li>
                      <li>Confirma el cambio</li>
                    </ol>
                  </li>
                  <li>
                    <strong>Eliminar cuenta:</strong>
                    <ol className="list-decimal list-inside ml-6 mt-2">
                      <li>Haz clic en "Hazlo Aquí" en la sección de eliminación</li>
                      <li>Ingresa tu contraseña</li>
                      <li>Escribe "ELIMINAR" para confirmar</li>
                      <li>Esta acción es irreversible</li>
                    </ol>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 border-b border-white/20 pb-2">
              4. Navegación por Teclado (Accesibilidad)
            </h2>
            <div className="bg-green/10 border border-green/30 rounded-lg p-6">
              <p className="text-white/80 mb-4">
                Esta aplicación cumple con las pautas de accesibilidad <strong>WCAG 2.1 Level AA</strong> 
                y puede ser completamente navegada usando solo el teclado.
              </p>
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-semibold text-lightblue mb-2">Teclas Principales</h3>
                  <ul className="space-y-2 text-white/80">
                    <li><kbd className="bg-darkblue px-2 py-1 rounded border border-white/20">Tab</kbd> - Navegar al siguiente elemento</li>
                    <li><kbd className="bg-darkblue px-2 py-1 rounded border border-white/20">Shift + Tab</kbd> - Navegar al elemento anterior</li>
                    <li><kbd className="bg-darkblue px-2 py-1 rounded border border-white/20">Enter</kbd> - Activar botón o enlace</li>
                    <li><kbd className="bg-darkblue px-2 py-1 rounded border border-white/20">Space</kbd> - Activar botón</li>
                    <li><kbd className="bg-darkblue px-2 py-1 rounded border border-white/20">Esc</kbd> - Cerrar modal</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-semibold text-lightblue mb-2">Navegación en Modales</h3>
                  <ul className="list-disc list-inside space-y-1 text-white/80">
                    <li>El foco se captura dentro del modal (focus trap)</li>
                    <li>Tab cicla solo entre elementos del modal</li>
                    <li>Escape cierra el modal</li>
                    <li>El foco regresa al elemento que abrió el modal</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-4 rounded">
                  <h3 className="font-semibold text-lightblue mb-2">Indicadores Visuales</h3>
                  <p className="text-white/80">
                    Todos los elementos interactivos muestran un <strong>anillo de enfoque</strong> visible 
                    cuando se navega con teclado, facilitando la identificación del elemento activo.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-24">
            <h2 className="text-3xl font-bold mb-4 border-b border-white/20 pb-2">
              5. Preguntas Frecuentes
            </h2>
            <div className="space-y-4">
              
              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Puedo usar la aplicación sin registrarme?</summary>
                <p className="mt-3 text-white/80">
                  No, necesitas crear una cuenta para acceder a todas las funcionalidades de la plataforma.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Cuántos videos puedo agregar a favoritos?</summary>
                <p className="mt-3 text-white/80">
                  No hay límite. Puedes agregar tantos videos como desees a tu lista de favoritos.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Puedo cambiar mi calificación después de haberla enviado?</summary>
                <p className="mt-3 text-white/80">
                  Sí, puedes actualizar tu calificación en cualquier momento. Tu nueva calificación reemplazará la anterior.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Otros usuarios pueden ver mis comentarios?</summary>
                <p className="mt-3 text-white/80">
                  Sí, todos los comentarios son públicos y visibles para todos los usuarios de la plataforma.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Los videos tienen audio?</summary>
                <p className="mt-3 text-white/80">
                  Los videos provienen de Pexels y la mayoría no tienen audio original. Por eso ofrecemos subtítulos 
                  descriptivos en español e inglés.
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Qué navegadores son compatibles?</summary>
                <p className="mt-3 text-white/80">
                  La aplicación funciona en todos los navegadores modernos: Chrome, Firefox, Safari, Edge (últimas 2 versiones).
                </p>
              </details>

              <details className="bg-white/5 p-4 rounded-lg border border-white/10 cursor-pointer">
                <summary className="font-semibold text-lightblue">¿Puedo recuperar mi cuenta si la elimino?</summary>
                <p className="mt-3 text-white/80">
                  No, la eliminación de cuenta es permanente e irreversible. Todos tus datos serán eliminados.
                </p>
              </details>
            </div>
          </section>
        </div>

        {/* Back to Home Button */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <a
            href="/home"
            className="inline-block bg-green hover:bg-green/80 text-white font-semibold px-8 py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green"
          >
            ← Volver al Inicio
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default UserManualPage;
