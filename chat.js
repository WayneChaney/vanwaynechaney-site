/* ============================================================================
   "Got questions?" — the chat bubble.

   Every branch ends at the same place: picking a time. That is the point of it.
   It is not a support bot and it is not trying to be clever; it answers the four
   things people actually ask before they book, then hands them the calendar.

   No backend, no API key, no model call, nothing to keep running.
     - Booking goes through the three questions (book-gate.js), then Cal.com,
       which emails Vanwayne on every booking.
     - "Send it to me instead" opens the visitor's own mail app with the whole
       conversation already written into the body, addressed to vanwaynec01.
   The Zapier hook the intake form used is dead (HTTP 404, verified 2026-09-22),
   so nothing here depends on a webhook that can rot without anyone noticing.

   Answers are lifted from copy already published on this site. Do not add a
   claim here that is not already on a page, and do not put a price in that is
   not already printed — a price quoted by a bot is a price he has to honour.
   ========================================================================== */
(function () {
  'use strict';

  var MAIL = 'vanwaynec01@gmail.com';

  if (window.__vc2Chat) return;
  window.__vc2Chat = true;

  /* ---- what it knows ------------------------------------------------------
     Each entry: the button the visitor taps, and what comes back. `end: true`
     means the booking row shows after the answer. */
  var TOPICS = [
    {
      q: 'What do you actually build?',
      a: "Three things, mostly. Websites for local businesses. Automation that kills a job somebody does by hand every week. And internal tools — the spreadsheet everybody hates, turned into something that runs itself.\n\nThe honest version: I walk in, find the one repetitive thing eating the most time, build the thing that does it instead, and hand it back finished."
    },
    {
      q: 'How much does it cost?',
      a: "Depends entirely on what the job is, and I would rather look at it than guess at you.\n\nThe first call is free and it is thirty minutes. I tell you what I would automate first and roughly what it would take. No pitch deck, and no obligation after it."
    },
    {
      q: 'How long does it take?',
      a: "A website is usually live on a real URL inside two weeks.\n\nAutomation depends on how tangled the current process is. That is most of what the first call is for — working out whether it is a two-week build or a two-day one."
    },
    {
      q: 'Do you work with cities and villages?',
      a: "Yes. There is a civic assistant running in production for Oakwood Village right now.\n\nMy business is set up and compliant for government contracts, and I'm applying for them now. It carries an active Ohio BWC policy and RITA registration, so a village can contract with me directly, no middleman."
    },
    {
      /* Wayne, 2026-09-25: this branch used to answer "sites" to a question that
         was never only about sites. It asks back now, because the two things are
         bought by different people and the automation is the one he sells. */
      q: 'Can I see work you have done?',
      a: "Which kind — websites, or an automation?\n\nThe websites are live and clickable. Real sites, not mockups.\n\nThe automation you can test on the spot: call the line and one of them picks up and talks to you.",
      links: [
        { href: './live-demos.html', label: 'Websites →' },
        { href: 'tel:+12166161364', label: 'Test an automation: (216) 616-1364' }
      ]
    },
    {
      q: 'Something else',
      a: "Ask it here and it comes straight to me. Or grab a time and just say it out loud — usually faster.",
      ask: true
    }
  ];

  var GREETING = "Hey — I’m Vanwayne. Ask me anything, or pick one of these.";

  /* ---- styles -------------------------------------------------------------
     Scoped under #vc2chat so nothing here can leak into a page's own CSS. */
  var css = [
    '#vc2chat-btn{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:9px;',
    'background:#1F4E78;color:#fff;border:0;border-radius:999px;padding:13px 19px;cursor:pointer;',
    'font:600 0.92rem/1 "DM Sans",system-ui,sans-serif;box-shadow:0 6px 24px rgba(11,31,58,0.28);}',
    '#vc2chat-btn:hover{background:#0B1F3A}',
    '#vc2chat-btn svg{width:18px;height:18px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}',
    '#vc2chat-btn .vc2chat-dot{position:absolute;top:-3px;right:-3px;width:11px;height:11px;border-radius:50%;',
    'background:#C9A24A;border:2px solid #FCFCFA}',

    '#vc2chat{position:fixed;right:18px;bottom:18px;z-index:9999;width:360px;max-width:calc(100vw - 36px);',
    'max-height:min(600px,calc(100vh - 96px));background:#FFFFFF;border:1px solid #D9E3EE;border-radius:16px;',
    'box-shadow:0 18px 50px rgba(11,31,58,0.22);display:none;flex-direction:column;overflow:hidden;',
    'font-family:"DM Sans",system-ui,sans-serif}',
    '#vc2chat.open{display:flex}',

    '#vc2chat header{background:#0B1F3A;color:#fff;padding:15px 17px;display:flex;align-items:center;',
    'justify-content:space-between;gap:10px;flex:0 0 auto}',
    '#vc2chat header b{font-size:0.95rem;font-weight:600;display:block}',
    '#vc2chat header span{font-size:0.75rem;opacity:0.78;display:block;margin-top:2px}',
    '#vc2chat header button{background:transparent;border:0;color:#fff;font-size:1.5rem;line-height:1;',
    'cursor:pointer;padding:0 2px;opacity:0.8}',
    '#vc2chat header button:hover{opacity:1}',

    '#vc2chat-log{flex:1 1 auto;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:11px;',
    'background:#FCFCFA}',
    '.vc2chat-msg{max-width:85%;padding:11px 14px;border-radius:13px;font-size:0.88rem;line-height:1.5;',
    'white-space:pre-wrap;word-break:break-word}',
    '.vc2chat-them{align-self:flex-start;background:#EAF4FB;color:#0B1F3A;border-bottom-left-radius:4px}',
    '.vc2chat-me{align-self:flex-end;background:#1F4E78;color:#fff;border-bottom-right-radius:4px}',

    '#vc2chat-opts{flex:0 0 auto;padding:0 16px 14px;display:flex;flex-direction:column;gap:7px;background:#FCFCFA}',
    '.vc2chat-opt{text-align:left;background:#fff;border:1px solid #D9E3EE;border-radius:10px;padding:10px 13px;',
    'cursor:pointer;font:500 0.84rem/1.35 inherit;color:#1F4E78}',
    '.vc2chat-opt:hover{border-color:#1F4E78;background:#F4F9FD}',
    '.vc2chat-book{background:#1F4E78;color:#fff;border-color:#1F4E78;font-weight:600;text-decoration:none;display:block}',
    '.vc2chat-book:hover{background:#0B1F3A;color:#fff}',

    '#vc2chat-form{flex:0 0 auto;border-top:1px solid #E4EFF9;padding:11px;display:none;gap:8px;',
    'flex-direction:column;background:#fff}',
    '#vc2chat-form.on{display:flex}',
    '#vc2chat-form textarea,#vc2chat-form input{width:100%;border:1px solid #D9E3EE;border-radius:9px;',
    'padding:9px 11px;font:400 0.86rem/1.45 inherit;color:#0B1F3A;resize:vertical;box-sizing:border-box}',
    '#vc2chat-form textarea{min-height:66px}',
    '#vc2chat-form button{background:#1F4E78;color:#fff;border:0;border-radius:9px;padding:10px;',
    'font:600 0.86rem inherit;cursor:pointer}',
    '#vc2chat-form button:hover{background:#0B1F3A}',
    '#vc2chat-note{font-size:0.7rem;color:#4A5A6E;text-align:center;padding:0 11px 10px;background:#fff;display:none}',
    '#vc2chat-note.on{display:block}',

    /* the phone bar is fixed to the bottom on small screens — sit above it */
    '@media (max-width:767px){',
    '  #vc2chat-btn{bottom:calc(var(--bar-h,64px) + 14px);right:14px;padding:12px 17px;font-size:0.86rem}',
    '  #vc2chat{right:10px;left:10px;bottom:calc(var(--bar-h,64px) + 10px);width:auto;max-width:none;',
    '  max-height:calc(100vh - var(--bar-h,64px) - 70px)}',
    '}',
    '@media (prefers-reduced-motion:no-preference){',
    '  #vc2chat.open{animation:vc2chatIn .18s ease-out both}',
    '  @keyframes vc2chatIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '}'
  ].join('');

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function boot() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var btn = el('button', null, '');
    btn.id = 'vc2chat-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Open chat');
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.9 8.9 0 0 1-3.8-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/></svg>' +
      '<span>Got questions?</span><span class="vc2chat-dot"></span>';

    var panel = el('div');
    panel.id = 'vc2chat';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Chat with Vanwayne');
    panel.innerHTML =
      '<header><div><b>Vanwayne Chaney Jr.</b><span>Usually replies the same day</span></div>' +
      '<button type="button" id="vc2chat-x" aria-label="Close chat">&times;</button></header>' +
      '<div id="vc2chat-log"></div>' +
      '<div id="vc2chat-opts"></div>' +
      '<form id="vc2chat-form" novalidate>' +
      '<textarea id="vc2chat-q" placeholder="What do you want to know?" aria-label="Your question"></textarea>' +
      '<input id="vc2chat-e" type="email" placeholder="Your email, so I can reply" aria-label="Your email" />' +
      '<button type="submit">Send it to me</button></form>' +
      '<p id="vc2chat-note"></p>';

    document.body.appendChild(btn);
    document.body.appendChild(panel);

    var log = panel.querySelector('#vc2chat-log');
    var opts = panel.querySelector('#vc2chat-opts');
    var form = panel.querySelector('#vc2chat-form');
    var note = panel.querySelector('#vc2chat-note');
    var qBox = panel.querySelector('#vc2chat-q');
    var eBox = panel.querySelector('#vc2chat-e');
    var transcript = [];

    function say(who, text) {
      var m = el('div', 'vc2chat-msg ' + (who === 'me' ? 'vc2chat-me' : 'vc2chat-them'), text);
      log.appendChild(m);
      log.scrollTop = log.scrollHeight;
      transcript.push((who === 'me' ? 'Them: ' : 'Site: ') + text);
    }

    function bookRow() {
      var a = el('a', 'vc2chat-opt vc2chat-book', 'Pick a time — 30 min, free →');
      /* The calendar opens after three quick questions (book-gate.js), so this goes
         to the questions, never straight to cal.com. On a page that has them it
         scrolls there and closes the chat. 2026-09-26. */
      var gate = document.getElementById('cal-inline');
      var sec = gate && gate.parentNode && gate.parentNode.closest ? gate.parentNode.closest('[id]') : null;
      if (sec) {
        a.href = '#' + sec.id;
        a.addEventListener('click', function () { close(); });
      } else {
        a.href = '/book.html#pick';
      }
      opts.appendChild(a);
    }

    function showMenu(withBooking) {
      opts.innerHTML = '';
      TOPICS.forEach(function (t) {
        var b = el('button', 'vc2chat-opt', t.q);
        b.type = 'button';
        b.addEventListener('click', function () { pick(t); });
        opts.appendChild(b);
      });
      if (withBooking) bookRow();
    }

    function pick(t) {
      say('me', t.q);
      opts.innerHTML = '';
      setTimeout(function () {
        say('them', t.a);
        /* `links` is the list form; `link` stays supported so an older single
           entry keeps rendering. Both produce the same option button. */
        var ls = t.links || (t.link ? [t.link] : []);
        for (var li = 0; li < ls.length; li++) {
          var a = el('a', 'vc2chat-opt', ls[li].label);
          a.href = ls[li].href;
          opts.appendChild(a);
        }
        if (t.ask) {
          form.classList.add('on');
          qBox.focus();
          bookRow();
          return;
        }
        bookRow();
        var more = el('button', 'vc2chat-opt', 'Ask something else');
        more.type = 'button';
        more.addEventListener('click', function () { showMenu(true); });
        opts.appendChild(more);
      }, 260);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = qBox.value.trim();
      if (!q) { qBox.focus(); return; }
      var from = eBox.value.trim();
      say('me', q);

      var body = q + '\n\n' + (from ? 'Reply to: ' + from + '\n\n' : '') +
        '---\nSent from the chat on ' + location.hostname + location.pathname + '\n' +
        transcript.join('\n');
      /* mailto is deliberate: it needs no backend, so there is nothing that can
         quietly stop working the way the Zapier hook did. */
      var href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent('Question from the site') +
        '&body=' + encodeURIComponent(body);

      form.classList.remove('on');
      setTimeout(function () {
        say('them', "Opening your mail app with that already written out. Hit send and it lands with me.\n\nIf nothing opened, my address is " + MAIL + ".");
        note.textContent = 'Nothing is stored on this site.';
        note.classList.add('on');
        opts.innerHTML = '';
        bookRow();
        window.location.href = href;
      }, 220);
    });

    function open() {
      panel.classList.add('open');
      btn.style.display = 'none';
      if (!log.childElementCount) {
        say('them', GREETING);
        showMenu(true);
      }
    }
    function close() {
      panel.classList.remove('open');
      btn.style.display = '';
      btn.focus();
    }

    btn.addEventListener('click', open);
    panel.querySelector('#vc2chat-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) close();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
