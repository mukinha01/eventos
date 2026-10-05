const $ = (selector) => document.querySelector(selector);
const pageTitles = { eventos: "Eventos", "novo-evento": "Cadastro palestrante", palestrantes: "Cadastro palestrante" };
let eventos = [];
let palestrantes = [];
let editingEventId = null;
let toastTimer;

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function initials(name) {
  return String(name || "?").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function notify(message, kind = "success") {
  const toast = $("#toast");
  toast.textContent = message;
  toast.className = `toast show ${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.className = "toast"; }, 3200);
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers }
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.erro || "Não foi possível concluir a solicitação.");
  }
  return response.status === 204 ? null : response.json();
}

function showPage(name) {
  const page = pageTitles[name] ? name : "eventos";
  document.querySelectorAll(".page").forEach((section) => section.classList.toggle("page-visible", section.id === `page-${page}`));
  document.querySelectorAll("[data-page-link]").forEach((link) => link.classList.toggle("active", link.dataset.pageLink === page));
  if (page === "novo-evento") {
    $("#event-form-heading").textContent = editingEventId ? "Editar evento" : "Cadastro palestrante";
    $("#save-event").textContent = editingEventId ? "Salvar alterações" : "Cadastrar";
    fillEventForm();
  }
  if (page === "eventos") loadEvents();
  if (page === "palestrantes") loadSpeakers();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function eventSpeakers(evento) {
  return (evento.palestrantes || []).map((entry) => entry.palestrante).filter(Boolean);
}

function renderEvents() {
  const target = $("#events-list");
  if (!eventos.length) {
    target.innerHTML = '<div class="empty-state"><strong>Nenhum evento cadastrado.</strong><span>Cadastre um evento para vê-lo nesta lista.</span><a class="button button-primary" href="#novo-evento">+ Cadastrar evento</a></div>';
    return;
  }
  target.innerHTML = eventos.map((evento) => {
    const names = eventSpeakers(evento);
    const speakers = names.length ? names.map((person) => escapeHTML(person.nome)).join(", ") : "Não informado";
    return `<article class="event-card"><h2 class="event-title">${escapeHTML(evento.nome)}</h2><p class="event-description"><strong>Descrição</strong><span>${escapeHTML(evento.descricao)}</span></p><p class="event-detail"><strong>Local</strong><span>${escapeHTML(evento.local)}</span></p><p class="event-detail event-speaker"><strong>Palestrante</strong><span>${speakers}</span></p><div class="event-actions"><button type="button" class="button button-edit" data-edit-event="${Number(evento.id)}">Editar</button><button type="button" class="button button-delete" data-delete-event="${Number(evento.id)}">Excluir</button></div></article>`;
  }).join("");
}

async function loadEvents() {
  const target = $("#events-list");
  target.innerHTML = '<div class="loading-cell">Carregando eventos…</div>';
  try {
    const [eventList, speakerList] = await Promise.all([api("/eventos"), api("/palestrantes")]);
    eventos = eventList;
    palestrantes = speakerList;
    renderEvents();
  } catch (error) {
    target.innerHTML = `<div class="empty-state"><strong>Não foi possível carregar os eventos.</strong><span>${escapeHTML(error.message)}</span><button class="button button-secondary" id="retry-events" type="button">Tentar novamente</button></div>`;
  }
}

function renderSpeakers() {
  return palestrantes;
}

async function loadSpeakers() {
  try {
    palestrantes = await api("/palestrantes");
    renderSpeakers();
  } catch (error) {
    notify(error.message, "error");
  }
}

async function fillEventForm() {
  const form = $("#event-form");
  const select = $("#event-speakers");
  try {
    palestrantes = await api("/palestrantes");
    select.innerHTML = palestrantes.length
      ? '<option value="" disabled selected>Selecione um palestrante</option>' + palestrantes.map((person) => `<option value="${Number(person.id)}">${escapeHTML(person.nome)}</option>`).join("")
      : '<option value="" disabled selected>Cadastre um palestrante primeiro</option>';
    if (!palestrantes.length) $("#speaker-hint").innerHTML = 'Nenhum palestrante cadastrado. <a href="#palestrantes">Cadastre um palestrante</a> para continuar.';
    else $("#speaker-hint").textContent = "Selecione o palestrante do evento.";
    if (!editingEventId) {
      form.reset();
      return;
    }
    const evento = await api(`/eventos/${editingEventId}`);
    form.elements.nome.value = evento.nome;
    form.elements.descricao.value = evento.descricao;
    form.elements.local.value = evento.local;
    select.value = String(eventSpeakers(evento)[0]?.id || "");
  } catch (error) {
    notify(error.message, "error");
  }
}

$("#event-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const button = $("#save-event");
  const data = new FormData(form);
  const speakerId = Number($("#event-speakers").value);
  const palestranteIds = speakerId ? [speakerId] : [];
  if (!palestranteIds.length) return;
  const payload = { nome: data.get("nome").trim(), descricao: data.get("descricao").trim(), local: data.get("local").trim(), palestranteIds };
  button.disabled = true;
  try {
    if (editingEventId) await api(`/eventos/${editingEventId}`, { method: "PUT", body: JSON.stringify(payload) });
    else await api("/eventos", { method: "POST", body: JSON.stringify(payload) });
    editingEventId = null;
    form.reset();
    notify("cadastro concluído com sucesso");
    window.location.hash = "eventos";
  } catch (error) {
    notify(error.message, "error");
  } finally {
    button.disabled = false;
  }
});

$("#speaker-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const button = $("#save-speaker");
  const data = new FormData(form);
  button.disabled = true;
  try {
    await api("/palestrantes", { method: "POST", body: JSON.stringify({ nome: data.get("nome").trim(), email: data.get("email").trim() }) });
    form.reset();
    await loadSpeakers();
    notify("cadastro concluído com sucesso");
  } catch (error) {
    notify(error.message, "error");
  } finally {
    button.disabled = false;
  }
});

$("#events-list").addEventListener("click", async (event) => {
  const editButton = event.target.closest("[data-edit-event]");
  const deleteButton = event.target.closest("[data-delete-event]");
  if (editButton) {
    editingEventId = Number(editButton.dataset.editEvent);
    window.location.hash = "novo-evento";
  }
  if (deleteButton) {
    const id = Number(deleteButton.dataset.deleteEvent);
    const evento = eventos.find((item) => Number(item.id) === id);
    if (!window.confirm(`Deseja realmente excluir o evento "${evento?.nome || ""}"? Esta ação não pode ser desfeita.`)) return;
    deleteButton.disabled = true;
    try {
      await api(`/eventos/${id}`, { method: "DELETE" });
      notify("Evento excluído com sucesso.");
      await loadEvents();
    } catch (error) {
      notify(error.message, "error");
      deleteButton.disabled = false;
    }
  }
});

$("#events-list").addEventListener("click", (event) => {
  if (event.target.id === "retry-events") loadEvents();
});
window.addEventListener("hashchange", () => showPage(decodeURIComponent(location.hash.slice(1))));

showPage(decodeURIComponent(location.hash.slice(1)) || "eventos");
