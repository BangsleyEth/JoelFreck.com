const form = document.querySelector('#booking-form');
const {name, email, session, format, area, level, message} = form.elements;
const submitButton = form.querySelector('button[type="submit"]');

function updateBookingFields() {
  const isIntro = session.value === 'intro';
  const showArea = !isIntro && ['in-person', 'either'].includes(format.value);

  format.disabled = isIntro;
  format.closest('.field').hidden = isIntro;
  level.disabled = isIntro;
  level.closest('.field').hidden = isIntro;
  area.disabled = !showArea;
  area.closest('.field').hidden = !showArea;

  submitButton.textContent = isIntro ? 'Open intro call email' : 'Open booking email';
}

document.querySelectorAll('[data-session]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.dataset.session || session.value === 'intro') {
      session.value = link.dataset.session;
    }
    updateBookingFields();
    if (link.dataset.session) {
      event.preventDefault();
      form.scrollIntoView({block: 'start'});
    }
    session.focus({preventScroll: true});
  });
});

session.addEventListener('change', updateBookingFields);
format.addEventListener('change', updateBookingFields);

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const isIntro = session.value === 'intro';
  const subject = isIntro
    ? 'Free 15-minute intro call'
    : `Session booking: ${session.selectedOptions[0].text}`;
  const lines = [
    'Hi Joel,',
    '',
    isIntro ? 'I’d like to request a free 15-minute intro call.' : 'I’d like to book a one-on-one session.',
    '',
    `Name: ${name.value.trim()}`,
    `Email: ${email.value.trim()}`
  ];

  if (!isIntro) {
    lines.push(`Session: ${session.selectedOptions[0].text}`, `Where: ${format.selectedOptions[0].text}`);
    if (!area.disabled && area.value.trim()) {
      lines.push(`Neighbourhood: ${area.value.trim()}`);
    }
    if (level.value) {
      lines.push(`Experience: ${level.selectedOptions[0].text}`);
    }
  }

  if (message.value.trim()) {
    lines.push('', message.value.trim());
  }

  const draft = new URL('mailto:joel.freck@gmail.com');
  draft.searchParams.set('subject', subject);
  draft.searchParams.set('body', lines.join('\r\n'));
  window.location.href = draft.href.replaceAll('+', '%20');
});

updateBookingFields();
form.hidden = false;
