document.getElementById('createTicketForm').addEventListener('submit', async e => {
  e.preventDefault();

  // Construimos el ticket con la propiedad 'priority' para que coincida con el filtrado/render
  const newTicket = {
    titulo: document.getElementById('title').value,
    priority: document.getElementById('category').value,
    description: document.getElementById('description').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    });
    if (!response.ok) throw new Error('Error al enviar ticket');

    // Limpiamos el formulario **antes** de recargar la tabla
    e.target.reset();

    // Recargamos la tabla
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
