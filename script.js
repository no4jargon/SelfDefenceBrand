(function () {
  const successMessage = 'Thank you! We received your submission and will be in touch shortly.';
  const errorMessage = 'Sorry, we could not send your response right now. Please try again.';

  const endpoints = {
    contact: '/api/contact',
    survey: '/api/survey',
  };

  async function sendToBackend(formType, payload) {
    const response = await fetch(endpoints[formType], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      const message = data.error || errorMessage;
      throw new Error(message);
    }

    return response.json();
  }

  function buildPayload(formType, formData) {
    if (formType === 'contact') {
      return {
        fullName: (formData.get('full-name') || '').trim(),
        phone: (formData.get('phone') || '').trim(),
      };
    }

    return {
      nameChoice: (formData.get('name-choice') || '').trim(),
      customName: (formData.get('custom-name') || '').trim(),
      surveyName: (formData.get('survey-name') || '').trim(),
      surveyPhone: (formData.get('survey-phone') || '').trim(),
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formType = form.dataset.formType;
    const feedback = form.querySelector('.form-feedback');
    const submitButton = form.querySelector('button[type="submit"]');

    const formData = new FormData(form);
    const payload = buildPayload(formType, formData);

    submitButton.disabled = true;
    feedback.textContent = 'Sending...';
    feedback.hidden = false;

    try {
      await sendToBackend(formType, payload);
      feedback.textContent = successMessage;
      form.reset();
    } catch (error) {
      feedback.textContent = error.message || errorMessage;
    } finally {
      submitButton.disabled = false;
    }
  }

  function attachHandlers() {
    document.querySelectorAll('form').forEach((form) => {
      if (!form.dataset.formType) return;

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
