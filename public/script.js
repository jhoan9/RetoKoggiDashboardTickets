document.getElementById('createTicketForm').addEventListener('submit', async e => {
  e.preventDefault();

  const titulo = document.getElementById('title').value.trim();
  const priority = document.getElementById('category').value;
  const description = document.getElementById('description').value.trim();

  // Validación: más de 3 palabras en el título
  if (titulo.split(/\s+/).length <= 3) {
    showError('El título debe tener al menos 3 palabras.');
    return;
  }

  // Validación: más de 100 palabras en la descripción
  if (description.split(/\s+/).length < 50) {
    showError('La descripción debe tener al menos 50 palabras.');
    return;
  }

  const newTicket = { titulo, priority, description };

  try {
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    });
    if (!response.ok) throw new Error('Error al enviar ticket');

    e.target.reset();
    await loadTickets(filterPriority.value);
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  window.filterPriority = document.getElementById('filterPriority');
  filterPriority.addEventListener('change', () => loadTickets(filterPriority.value));
  loadTickets(); // primera carga
});

async function loadTickets(priorityFilter = '') {
  const tableBody = document.querySelector('#ticketsTable tbody');
  tableBody.innerHTML = ''; // VACÍO el body

  // Inserto un único mensaje de carga
  const loadingRow = document.createElement('tr');
  loadingRow.innerHTML = '<td colspan="4">Cargando tickets…</td>';
  tableBody.appendChild(loadingRow);

  try {
    const res = await fetch('http://localhost:3000/api/tickets');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tickets = await res.json();

    // Filtro según 'priority'
    const filtered = priorityFilter
      ? tickets.filter(t => t.priority === priorityFilter)
      : tickets;

    renderTickets(filtered);
  } catch (err) {
    console.error('Error al cargar tickets:', err);
    showError('No se pudieron cargar los tickets');
  }
}

function renderTickets(tickets) {
  const tableBody = document.querySelector('#ticketsTable tbody');
  if (!tickets.length) {
    showError('No hay tickets disponibles');
    return;
  }
  // Limpio antes de pintar
  tableBody.innerHTML = tickets.map(t => `
    <tr>
      <td>${t.titulo}</td>
      <td>${t.summary || 'Sin resumen'}</td>
      <td class="priority-${t.priority.toLowerCase()}">
        <i class="fas fa-exclamation-circle"></i> ${t.priority}
      </td>
      <td>${t.status || 'Abierto'}</td>
    </tr>
  `).join('');
}

function showError(msg) {
  const tableBody = document.querySelector('#ticketsTable tbody');
  tableBody.innerHTML = `<tr><td colspan="4" style="color: red;">${msg}</td></tr>`;
}
