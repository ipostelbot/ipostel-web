/* ============================================
   TRACKING API - IPOSTEL Inline
   ============================================ */

(function () {
  'use strict';

  const CONFIG = {
    key: '3rud1c10n*2025',
    url: 'http://sispven.ipostel.gob.ve/api/envios'
  };

  const form = document.getElementById('tracking-form');
  const input = document.getElementById('tracking-input');
  const results = document.getElementById('tracking-results');

  if (!form || !input || !results) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const code = input.value.trim();
    if (!code) return;
    performTracking(code);
  });

  async function performTracking(code) {
    results.innerHTML = `
      <div class="tracking-results__loading">
        <div class="spinner"></div>
        Consultando sistema postal...
      </div>
    `;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    try {
      const response = await fetch(CONFIG.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': CONFIG.key
        },
        body: JSON.stringify({ codigo: code })
      });

      const data = await response.json();

      if (response.ok) {
        renderTrackingResults(data);
      } else {
        renderError(response.status);
      }
    } catch (error) {
      results.innerHTML = `
        <div class="tracking-results__error">
          Error de conexion con el servidor. Intente nuevamente.
        </div>
      `;
    }
  }

  function renderError(status) {
    const messages = {
      401: 'No autorizado. Verifique el codigo de envio.',
      404: 'No se encontro ningun envio con ese codigo.',
      422: 'Parametros obligatorios faltantes.'
    };
    const msg = messages[status] || `Error al procesar la solicitud (${status}).`;
    results.innerHTML = `
      <div class="tracking-results__error">${msg}</div>
    `;
  }

  function renderTrackingResults(data) {
    const { encaminamientos, ...generales } = data;

    let html = `<div class="tracking-results__card">`;

    /* Header */
    html += `
      <div class="tracking-results__header">
        <div class="tracking-results__header-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;display:inline;vertical-align:middle;margin-right:6px;color:var(--teal);">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
          Detalles del Paquete
        </div>
        <button class="tracking-results__close" onclick="document.getElementById('tracking-results').innerHTML=''" title="Cerrar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    /* Detail table */
    html += `<div class="tracking-detail"><table class="tracking-detail__table"><tbody>`;
    for (const [key, val] of Object.entries(generales)) {
      if (typeof val !== 'object' && val !== null && val !== undefined && val !== '') {
        const label = key.replace(/_/g, ' ');
        html += `<tr><td>${label}</td><td>${val}</td></tr>`;
      }
    }
    html += `</tbody></table></div>`;

    /* Timeline */
    if (encaminamientos && Array.isArray(encaminamientos) && encaminamientos.length > 0) {
      html += `
        <div class="tracking-timeline">
          <div class="tracking-timeline__title">Historial de Movimientos</div>
          <div class="tracking-timeline__list">
      `;

      encaminamientos.forEach(function (paso) {
        const oficina = paso.oficina || 'OFICINA CENTRAL';
        const oficinaExterna = paso.oficina_externa ? ' \u2192 ' + paso.oficina_externa : '';
        const estatus = paso.estatus || 'Sin estatus';
        const estatusLower = estatus.toLowerCase();

        let statusClass = 'tracking-timeline__status--default';
        let itemClass = '';
        if (estatusLower.includes('procesado') || estatusLower.includes('salida') || estatusLower.includes('entregado')) {
          statusClass = 'tracking-timeline__status--processed';
          itemClass = 'tracking-timeline__item--success';
        } else if (estatusLower.includes('en ') || estatusLower.includes('recibido')) {
          statusClass = 'tracking-timeline__status--pending';
        }

        html += `
          <div class="tracking-timeline__item ${itemClass}">
            <div class="tracking-timeline__date">${paso.fecha || 'Fecha no disponible'}</div>
            <div class="tracking-timeline__office">${oficina}${oficinaExterna}</div>
            <span class="tracking-timeline__status ${statusClass}">${estatus}</span>
          </div>
        `;
      });

      html += `</div></div>`;
    }

    html += `</div>`;
    results.innerHTML = html;
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();
