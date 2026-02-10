const API_URL = 'http://localhost:3000/api/usuarios';

// ==================== FUNCIONES AUXILIARES ====================

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  console.log(' Página cargada:', window.location.pathname);
  
  const token = localStorage.getItem('token');
  console.log(' Token en localStorage:', token ? 'PRESENTE' : 'AUSENTE');
  
  // Redirecciones inteligentes
  const currentPage = window.location.pathname;
  
  // Si estamos en dashboard y no hay token → login
  if (currentPage.includes('dashboard.html') && !token) {
    console.log(' No hay token para dashboard, redirigiendo...');
    window.location.href = 'login.html';
    return;
  }
  
  // Si estamos en login/registro y hay token → dashboard
  if ((currentPage.includes('login.html') || currentPage.includes('registro.html')) && token) {
    console.log(' Ya hay sesión activa, redirigiendo a dashboard...');
    window.location.href = 'dashboard.html';
    return;
  }
  
  // Cargar usuarios automáticamente si estamos en dashboard
  if (currentPage.includes('dashboard.html')) {
    console.log(' Dashboard detectado, cargando usuarios...');
    cargarUsuarios();
  }
});

// ==================== LOGIN ====================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  console.log(' Formulario de login encontrado');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(' Formulario de login enviado');

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje');
    
    console.log(' Datos login:', { email, password: '***' });

    try {
      console.log(' Enviando login a:', `${API_URL}/login`);
      
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log(' Respuesta recibida. Status:', res.status);
      const data = await res.json();
      console.log(' Datos respuesta:', data);

      if (res.ok) {
        console.log(' Login exitoso');
        localStorage.setItem('token', data.token);
        mensaje.style.color = 'green';
        mensaje.textContent = data.mensaje;
        
        setTimeout(() => {
          console.log(' Redirigiendo a dashboard...');
          window.location.href = 'dashboard.html';
        }, 1000);
      } else {
        console.log(' Error en login:', data.error);
        mensaje.style.color = 'red';
        mensaje.textContent = data.error || 'Error en el login';
      }
    } catch (error) {
      console.error(' Error de conexión:', error);
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error de conexión con el servidor';
    }
  });
}

// ==================== REGISTRO ====================

const registroForm = document.getElementById('registroForm');
if (registroForm) {
  console.log(' Formulario de registro encontrado');
  
  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(' Formulario de registro enviado');

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const mensaje = document.getElementById('mensaje');
    
    console.log(' Datos registro:', { nombre, email, password: '***' });

    try {
      console.log(' Enviando registro a:', `${API_URL}/registro`);
      
      const res = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      console.log(' Respuesta recibida. Status:', res.status);
      const data = await res.json();
      console.log(' Datos respuesta:', data);

      if (res.ok) {
        console.log(' Registro exitoso');
        mensaje.style.color = 'green';
        mensaje.textContent = data.mensaje;
        
        setTimeout(() => {
          console.log(' Guardando token y redirigiendo...');
          localStorage.setItem('token', data.token);
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        console.log(' Error en registro:', data.error);
        mensaje.style.color = 'red';
        mensaje.textContent = data.error || 'Error en el registro';
      }
    } catch (error) {
      console.error(' Error de conexión:', error);
      mensaje.style.color = 'red';
      mensaje.textContent = 'Error de conexión con el servidor';
    }
  });
}

// ==================== DASHBOARD ====================

async function cargarUsuarios() {
  console.log(' INICIANDO cargarUsuarios()');
  
  const listaUsuarios = document.getElementById('listaUsuarios');
  if (!listaUsuarios) {
    console.log(' No se encontró #listaUsuarios en el DOM');
    return;
  }
  
  const token = localStorage.getItem('token');
  console.log(' Token para la petición:', token ? 'PRESENTE' : 'AUSENTE');
  
  if (!token) {
    console.log(' No hay token, redirigiendo a login');
    window.location.href = 'login.html';
    return;
  }

  try {
    console.log(' Enviando GET a:', API_URL);
    console.log(' Headers:', { Authorization: `Bearer ${token}` });
    
    const res = await fetch(API_URL, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log(' Respuesta HTTP:', res.status, res.statusText);
    
    if (res.status === 401) {
      console.log(' Token inválido o expirado (401)');
      localStorage.removeItem('token');
      window.location.href = 'login.html';
      return;
    }

    if (!res.ok) {
      console.log(' Error en la respuesta:', res.status);
      throw new Error(`Error HTTP ${res.status}: ${res.statusText}`);
    }

    const usuarios = await res.json();
    console.log(' Usuarios recibidos del servidor:', usuarios);
    
    if (!Array.isArray(usuarios)) {
      console.log('️ La respuesta no es un array:', usuarios);
      listaUsuarios.innerHTML = '<li>Error: Formato de datos incorrecto</li>';
      return;
    }
    
    if (usuarios.length === 0) {
      console.log('ℹ️ No hay usuarios registrados');
      listaUsuarios.innerHTML = '<li>No hay usuarios registrados</li>';
      return;
    }

    console.log(` Mostrando ${usuarios.length} usuario(s)`);
    listaUsuarios.innerHTML = '';
    
    usuarios.forEach((u, index) => {
      console.log(` Usuario ${index + 1}:`, u);
      const li = document.createElement('li');
      li.textContent = `${u.nombre} - ${u.email} (Registrado: ${new Date(u.created_at).toLocaleDateString()})`;
      li.style.padding = '10px';
      li.style.borderBottom = '1px solid #eee';
      listaUsuarios.appendChild(li);
    });
    
  } catch (error) {
    console.error(' Error en cargarUsuarios:', error);
    listaUsuarios.innerHTML = '<li style="color: red;">Error al cargar usuarios</li>';
  }
}

// ==================== LOGOUT ====================

function cerrarSesion() {
  console.log(' Cerrando sesión...');
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// ==================== EXPORTAR PARA PRUEBAS ====================
// (Opcional, para probar en consola)
if (typeof window !== 'undefined') {
  window.cargarUsuarios = cargarUsuarios;
  window.cerrarSesion = cerrarSesion;
}