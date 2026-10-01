const form = document.querySelector('#lead-form');

function setError(field, message) {
  const input = form.elements[field];
  const error = document.querySelector(`[data-error-for="${field}"]`);
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
  if (error) error.textContent = message;
}

function formatPhone(value) {
  let digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
  if (digits.length === 10 && !digits.startsWith('7')) digits = `7${digits}`;
  if (!digits) return '';

  let result = '+7';
  if (digits.length > 1) result += ` (${digits.slice(1, 4)}`;
  if (digits.length >= 4) result += ')';
  if (digits.length > 4) result += ` ${digits.slice(4, 7)}`;
  if (digits.length > 7) result += `-${digits.slice(7, 9)}`;
  if (digits.length > 9) result += `-${digits.slice(9, 11)}`;
  return result;
}

function validateForm() {
  const name = form.elements.name.value.trim();
  const phone = form.elements.phone.value;
  const email = form.elements.email.value.trim();
  let valid = true;

  if (name.length < 2) {
    setError('name', 'Введите имя');
    valid = false;
  } else {
    setError('name', '');
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11 || !digits.startsWith('7')) {
    setError('phone', 'Введите номер в формате +7 (___) ___-__-__');
    valid = false;
  } else {
    setError('phone', '');
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Проверьте email');
    valid = false;
  } else {
    setError('email', '');
  }

  if (!form.elements.consent.checked) {
    form.elements.consent.setAttribute('aria-invalid', 'true');
    setError('consent', 'Нужно согласиться с политикой конфиденциальности');
    valid = false;
  } else {
    form.elements.consent.setAttribute('aria-invalid', 'false');
    setError('consent', '');
  }

  return valid;
}

form?.addEventListener('submit', (event) => {
  const status = form.querySelector('.form-status');
  status.textContent = '';

  if (!validateForm()) {
    event.preventDefault();
    return;
  }

  form.elements['client-copy'].value = form.elements.email.value.trim();
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'ОТПРАВЛЯЕМ…';
});

form?.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.name === 'phone') input.value = formatPhone(input.value);
    if (input.getAttribute('aria-invalid') === 'true') validateForm();
  });
});

form?.elements.consent?.addEventListener('change', () => {
  if (form.elements.consent.getAttribute('aria-invalid') === 'true') validateForm();
});
