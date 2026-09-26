/* book-gate.js - three quick questions, then the calendar.

   Wayne, 2026-09-26: "having them fill out the entry form before they book the
   call to make it simple and easy. Who are you? What are you looking for? What
   kind of business are you?" People had told him booking felt like too much.
   Cal's own form was already short (name, email, notes). What felt like too much
   was a whole month of calendar landing on someone cold.

   So the calendar waits for three answers, and the answers ride into Cal as the
   name and the notes. What is left in Cal is the email box and Confirm.

   🔴 Every page with a calendar loads this file and must NOT build the Cal inline
   embed itself. Two builders means two calendars, or one that skips the questions.
   Links that book go to book.html#pick, never straight to cal.com, or they skip
   the questions too.
   🔴 No backend, on purpose (same as the intake form and chat.js). The answers
   reach Vanwayne on the booking. Someone who answers and leaves is not captured.
*/
(function () {
  var CAL_LINK = 'vanwaynechaney/vc2-ai-service-call';
  var CAL_URL = 'https://cal.com/' + CAL_LINK;
  var KEY = 'vc2BookAnswers';
  var LOOKING = ['Automate a job', 'A website', 'A custom tool', 'Not sure yet'];

  var box = document.getElementById('cal-inline');
  if (!box) return;

  var css = [
    /* The calendar box is allowed to break out wider than the text column on
       desktop; the questions are not. They sit on the column. */
    '.bkg-form,.bkg-done{max-width:720px;margin-left:auto!important;margin-right:auto!important;box-sizing:border-box}',
    '.bkg-form{background:#fff;border:1px solid rgba(11,31,58,.14);border-radius:14px;padding:1.35rem 1.2rem;margin:0 0 1rem;text-align:left}',
    '.bkg-step{margin:0 0 1.15rem}',
    '.bkg-q{display:block;font-weight:600;color:#0B1F3A;font-size:1rem;line-height:1.35;margin:0 0 .5rem}',
    '.bkg-in{display:block;width:100%;box-sizing:border-box;font:inherit;font-size:1rem;color:#0B1F3A;background:#fff;border:1px solid rgba(11,31,58,.22);border-radius:10px;padding:.8rem .9rem;min-height:48px}',
    '.bkg-in::placeholder{color:#8593A3}',
    '.bkg-in:focus{outline:2px solid #2F6E9E;outline-offset:1px;border-color:#2F6E9E}',
    '.bkg-chips{display:flex;flex-wrap:wrap;gap:.5rem}',
    '.bkg-chip{font:inherit;font-size:.95rem;cursor:pointer;background:#fff;color:#0B1F3A;border:1px solid rgba(11,31,58,.22);border-radius:999px;padding:.55rem 1rem;min-height:44px}',
    '.bkg-chip:hover{border-color:#1F4E78}',
    '.bkg-chip[aria-pressed="true"]{background:#1F4E78;border-color:#1F4E78;color:#fff}',
    '.bkg-go{display:block;width:100%;font:inherit;font-weight:600;font-size:1rem;cursor:pointer;border:0;border-radius:10px;background:#1F4E78;color:#fff;padding:1rem;min-height:52px}',
    '.bkg-go:hover{background:#0B1F3A}',
    '.bkg-err{color:#B3261E;font-size:.88rem;margin:.6rem 0 0}',
    '.bkg-err:empty{display:none}',
    '.bkg-bad,.bkg-chips.bkg-bad .bkg-chip{border-color:#B3261E!important}',
    '.bkg-done{display:flex;flex-wrap:wrap;align-items:baseline;gap:.35rem .8rem;font-size:.92rem;line-height:1.5;color:#4A5A6E;margin:0 0 .8rem;text-align:left}',
    '.bkg-done b{color:#0B1F3A;font-weight:600}',
    '.bkg-edit{font:inherit;font-size:.88rem;background:none;border:0;padding:0;color:#A8781F;text-decoration:underline;cursor:pointer}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* The "calendar not loading?" link and any other direct Cal link on the page
     would skip the questions, so they wait too, and come back pre-filled. */
  var directLinks = document.querySelectorAll('a[href^="' + CAL_URL + '"]');
  var fallback = box.parentNode.querySelector('.cal-fallback');

  function showCalendarParts(on) {
    box.style.display = on ? '' : 'none';
    if (fallback) fallback.style.display = on ? '' : 'none';
  }

  /* ---- the form ---- */
  var form = el('form', 'bkg-form');
  form.noValidate = true;
  form.setAttribute('aria-label', 'Three quick questions before you pick a time');

  var s1 = el('div', 'bkg-step');
  var l1 = el('label', 'bkg-q', 'Who are you?');
  l1.htmlFor = 'bkg-name';
  var name = el('input', 'bkg-in');
  name.id = 'bkg-name'; name.type = 'text'; name.placeholder = 'Your name';
  name.autocomplete = 'name'; name.maxLength = 80;
  s1.appendChild(l1); s1.appendChild(name);

  var s2 = el('div', 'bkg-step');
  var l2 = el('span', 'bkg-q', 'What are you looking for?');
  l2.id = 'bkg-look-q';
  var chips = el('div', 'bkg-chips');
  chips.setAttribute('role', 'group');
  chips.setAttribute('aria-labelledby', 'bkg-look-q');
  var picked = '';
  LOOKING.forEach(function (label) {
    var b = el('button', 'bkg-chip', label);
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', function () {
      picked = label;
      var all = chips.querySelectorAll('.bkg-chip');
      for (var i = 0; i < all.length; i++) {
        all[i].setAttribute('aria-pressed', all[i] === b ? 'true' : 'false');
      }
      chips.classList.remove('bkg-bad');
    });
    chips.appendChild(b);
  });
  s2.appendChild(l2); s2.appendChild(chips);

  var s3 = el('div', 'bkg-step');
  var l3 = el('label', 'bkg-q', 'What kind of business are you?');
  l3.htmlFor = 'bkg-biz';
  var biz = el('input', 'bkg-in');
  biz.id = 'bkg-biz'; biz.type = 'text';
  biz.placeholder = 'Roofing, bakery, law office…';
  biz.autocomplete = 'off'; biz.maxLength = 120;
  s3.appendChild(l3); s3.appendChild(biz);

  var go = el('button', 'bkg-go', 'See open times →');
  go.type = 'submit';
  var err = el('p', 'bkg-err');
  err.setAttribute('aria-live', 'polite');

  form.appendChild(s1); form.appendChild(s2); form.appendChild(s3);
  form.appendChild(go); form.appendChild(err);

  var done = el('div', 'bkg-done');
  done.style.display = 'none';

  box.parentNode.insertBefore(form, box);
  box.parentNode.insertBefore(done, box);
  showCalendarParts(false);

  [name, biz].forEach(function (i) {
    i.addEventListener('input', function () { i.classList.remove('bkg-bad'); });
  });

  /* ---- after the answers ---- */
  function open(a, scroll) {
    var notes = 'Looking for: ' + a.look + '\nBusiness: ' + a.biz;
    var qs = '?name=' + encodeURIComponent(a.name) + '&notes=' + encodeURIComponent(notes);
    for (var i = 0; i < directLinks.length; i++) directLinks[i].href = CAL_URL + qs;

    if (typeof window.Cal !== 'function') {   /* embed script blocked: hand off, still pre-filled */
      window.location.href = CAL_URL + qs;
      return;
    }

    form.style.display = 'none';
    done.textContent = '';
    var who = el('span');   /* one flex item, so the gap doesn't split the sentence */
    who.appendChild(document.createTextNode('Booking as '));
    who.appendChild(el('b', null, a.name));
    who.appendChild(document.createTextNode(' · ' + a.look + ' · ' + a.biz));
    done.appendChild(who);
    var edit = el('button', 'bkg-edit', 'Change');
    edit.type = 'button';
    edit.addEventListener('click', function () {
      done.style.display = 'none';
      showCalendarParts(false);
      form.style.display = '';
      name.focus();
    });
    done.appendChild(edit);
    done.style.display = '';
    showCalendarParts(true);

    box.innerHTML = '';
    window.Cal('inline', {
      elementOrSelector: '#cal-inline',
      calLink: CAL_LINK,
      layout: 'month_view',
      config: { theme: 'light', name: a.name, notes: notes }
    });
    window.Cal('ui', { hideBranding: true, theme: 'light', hideEventTypeDetails: true, layout: 'month_view' });

    if (scroll && done.scrollIntoView) done.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var a = { name: name.value.trim(), look: picked, biz: biz.value.trim() };
    var missing = null;
    if (!a.name) { name.classList.add('bkg-bad'); missing = missing || name; }
    if (!a.look) { chips.classList.add('bkg-bad'); missing = missing || chips.querySelector('.bkg-chip'); }
    if (!a.biz) { biz.classList.add('bkg-bad'); missing = missing || biz; }
    if (missing) {
      err.textContent = 'Answer all three and the calendar opens.';
      missing.focus();
      return;
    }
    err.textContent = '';
    try { sessionStorage.setItem(KEY, JSON.stringify(a)); } catch (x) {}
    open(a, true);
  });

  /* Answered on another page this visit? Go straight to the calendar. */
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    if (saved && saved.name && saved.look && saved.biz) {
      name.value = saved.name; biz.value = saved.biz; picked = saved.look;
      var all = chips.querySelectorAll('.bkg-chip');
      for (var i = 0; i < all.length; i++) {
        if (all[i].textContent === saved.look) all[i].setAttribute('aria-pressed', 'true');
      }
      open(saved, false);
    }
  } catch (x) {}
})();
