const yandexForm = document.querySelector('.yandex-form-embed');

if (yandexForm) {
  yandexForm.addEventListener('load', () => {
    yandexForm.classList.add('is-loaded');
  });
}
