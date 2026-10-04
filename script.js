'use strict';

const navigation = document.getElementById('navigation');
const toggle = document.querySelector('.nav-toggle');
function closeNavigation() {
  navigation.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation');
  toggle.querySelector('span').textContent = '+';
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  toggle.querySelector('span').textContent = open ? '−' : '+';
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeNavigation(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeNavigation(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', closeNavigation);

const filters = document.querySelectorAll('[data-filter]');
const dishes = document.querySelectorAll('[data-category]');
filters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  dishes.forEach(dish => {
    dish.hidden = category !== 'all' && dish.dataset.category !== category;
    if (!dish.hidden) count++;
  });
  document.getElementById('menu-status').textContent = `Showing ${count} ${category === 'all' ? 'dishes' : category === 'grill' ? 'grill dishes' : 'kitchen dishes'}.`;
}));

const dialog = document.getElementById('reservation');
const form = document.getElementById('reservation-form');
const dateInput = document.getElementById('booking-date');
const bookingView = document.getElementById('booking-view');
const resultView = document.getElementById('booking-result');
const error = document.getElementById('booking-error');
let previousFocus;
function philippineDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const get = type => parts.find(part => part.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
document.querySelectorAll('[data-reserve]').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  closeNavigation();
  form.reset();
  dateInput.min = philippineDate();
  bookingView.hidden = false;
  resultView.hidden = true;
  error.hidden = true;
  document.body.classList.add('dialog-open');
  dialog.showModal();
}));
function closeDialog() { dialog.close(); }
document.querySelector('.dialog-close').addEventListener('click', closeDialog);
document.getElementById('booking-done').addEventListener('click', closeDialog);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  form.reset();
  document.getElementById('booking-summary').textContent = '';
  previousFocus?.focus();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  error.hidden = true;
  dateInput.min = philippineDate();
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const name = String(values.get('name')).trim();
  const date = String(values.get('date'));
  const selectedDay = new Date(`${date}T12:00:00Z`);
  if (!name) {
    error.textContent = 'Please enter your first name.';
    error.hidden = false;
    form.elements.name.focus();
    return;
  }
  if (selectedDay.getUTCDay() === 1) {
    error.textContent = 'Our kitchen rests on Mondays. Please choose another day.';
    error.hidden = false;
    dateInput.focus();
    return;
  }
  const formattedDate = new Intl.DateTimeFormat('en', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(selectedDay);
  const guests = values.get('guests');
  document.getElementById('booking-summary').textContent = `${name}, a table for ${guests} ${guests === '1' ? 'guest' : 'guests'} on ${formattedDate} at ${values.get('time')} (Philippine time).`;
  bookingView.hidden = true;
  resultView.hidden = false;
  document.getElementById('booking-done').focus();
});
document.getElementById('year').textContent = String(new Date().getFullYear());
