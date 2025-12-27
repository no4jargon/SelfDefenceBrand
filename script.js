(function () {
  const successMessage = 'Thank you! We received your submission and will be in touch shortly.';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const feedback = form.querySelector('.form-feedback');

    const formData = new FormData(form);
    const submitted = Object.fromEntries(formData.entries());
    console.log('Form submitted:', submitted);

    feedback.textContent = successMessage;
    feedback.hidden = false;
    form.reset();
  }

  function attachHandlers() {
    document.querySelectorAll('form').forEach((form) => {
      if (!form.querySelector('.form-feedback')) {
        const feedback = document.createElement('p');
        feedback.className = 'form-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');
        feedback.hidden = true;
        form.append(feedback);
      }
      form.addEventListener('submit', handleSubmit);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachHandlers);
  } else {
    attachHandlers();
  }
})();
