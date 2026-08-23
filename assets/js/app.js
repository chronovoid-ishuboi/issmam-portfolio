/* ============================================================
   Portfolio engine — two-axis navigation, rendering, cursor.
   No dependencies, no build step.
   ============================================================ */
(function () {
  'use strict';

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- SVG helpers ---------- */

  function icon(name, cls) {
    var d = window.ICONS[name];
    if (!d) d = window.ICONS.markdown;
    return '<svg viewBox="0 0 24 24" class="' + (cls || '') + '" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  function esc(s) {
    return String(s).replace(/&(?!(amp|lt|gt|quot|#\d+|[a-z]+);)/gi, '&amp;')
                    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- Ambient backdrops (generated, not fetched) ---------- */

  function paintBackdrops() {
    var slice = function (cx, cy, r, o) {
      var p = '<g opacity="' + o + '" stroke="#C8FF2E" stroke-width="' + (r * 0.075) + '" fill="none">' +
              '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>' +
              '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.76) + '"/>';
      for (var i = 0; i < 10; i++) {
        var a = (Math.PI * 2 / 10) * i;
        p += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(a) * r * 0.76) +
             '" y2="' + (cy + Math.sin(a) * r * 0.76) + '"/>';
      }
      return p + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.09) + '" fill="#C8FF2E" stroke="none"/></g>';
    };

    var limes = '<svg xmlns="http://www.w3.org/2000/svg" width="460" height="460" viewBox="0 0 460 460">' +
      slice(70, 78, 40, 1) + slice(268, 44, 27, 0.8) + slice(392, 128, 46, 0.95) +
      slice(150, 214, 33, 0.85) + slice(320, 268, 38, 0.9) + slice(56, 336, 45, 0.95) +
      slice(220, 384, 29, 0.8) + slice(404, 396, 34, 0.85) + slice(234, 148, 21, 0.7) +
      '</svg>';

    var noise = '<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">' +
      '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>' +
      '<feColorMatrix type="saturate" values="0"/></filter>' +
      '<rect width="180" height="180" filter="url(#n)"/></svg>';

    var root = document.documentElement.style;
    root.setProperty('--limes', 'url("data:image/svg+xml,' + encodeURIComponent(limes) + '")');
    root.setProperty('--noise', 'url("data:image/svg+xml,' + encodeURIComponent(noise) + '")');
  }

  /* ============================================================
     RENDERERS
     ============================================================ */

  function renderAbout(p) {
    $('#about-copy').innerHTML = p.about.map(function (t) {
      return '<p class="body-text">' + t + '</p>';
    }).join('');
    $('#about-now').innerHTML = p.now.map(function (t) { return '<li>' + t + '</li>'; }).join('');
  }

  function renderStack(s) {
    $('#stack-groups').innerHTML = s.groups.map(function (g) {
      return '<div class="stack-group">' +
        '<h3><span class="nm">' + g.name + '</span><span class="nt">' + g.note + '</span></h3>' +
        '<div class="tiles">' + g.items.map(function (it) {
          return '<div class="tile" data-level="' + it.level + '" title="' + esc(it.label) + '">' +
                 icon(it.icon) + '<span>' + it.label + '</span></div>';
        }).join('') + '</div></div>';
    }).join('') +
    '<div class="card mt-md"><p class="eyebrow mb-sm">' + s.ml.title + '</p><div class="chips">' +
      s.ml.items.map(function (i) { return '<span class="tech">' + i + '</span>'; }).join('') +
    '</div></div>';

    $('#stack-legend').innerHTML = s.legend.map(function (l) {
      return '<div><i class="' + l.level + '"></i>' + l.label + '</div>';
    }).join('');
  }

  var ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17L17 7M9 7h8v8"/></svg>';

  function projectPanel(pr, n) {
    return '<section class="panel" id="p-' + pr.id + '" data-panel="' + pr.id + '" data-title="' + esc(pr.title) + '">' +
      '<div class="panel-inner">' +
        '<div class="proj-head" data-lift="1">' +
          '<div><p class="eyebrow">02.' + n + ' — ' + pr.kicker + '</p>' +
          '<h2 class="h-lg mt-sm">' + pr.title + '</h2></div>' +
          '<div class="proj-meta">' +
            '<span class="pill' + (pr.status === 'Ongoing' ? ' live' : '') + '">' + pr.status + '</span>' +
            '<span class="pill">' + pr.year + '</span>' +
            '<span class="pill">' + pr.course + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="proj-grid">' +
          '<div data-lift="2">' +
            '<p class="proj-lead">' + pr.lead + '</p>' +
            '<p class="body-text">' + pr.body + '</p>' +
            '<div class="chips mt-md">' + pr.stackLabels.map(function (l, i) {
              var ic = pr.stack[i] ? icon(pr.stack[i]) : '';
              return '<span class="tech">' + ic + l + '</span>';
            }).join('') + '</div>' +
            '<div class="flexrow gap-sm mt-md">' +
              '<a class="btn ghost" href="' + pr.repo + '" target="_blank" rel="noopener noreferrer">' +
                icon('github') + 'Source' + '</a>' +
            '</div>' +
          '</div>' +
          '<div data-lift="3"><div class="card">' +
            '<p class="eyebrow mb-md">What is in it</p>' +
            '<ul class="hl">' + pr.highlights.map(function (h) { return '<li>' + h + '</li>'; }).join('') + '</ul>' +
          '</div></div>' +
        '</div>' +
      '</div></section>';
  }

  function renderWork(data) {
    var row = $('.row[data-row="work"]');
    var archive = $('#p-archive');
    data.featured.forEach(function (pr, i) {
      row.insertBefore(
        document.createRange().createContextualFragment(projectPanel(pr, i + 1)).firstChild,
        archive);
    });

    $('#work-list').innerHTML = data.featured.map(function (pr, i) {
      return '<button class="work-row" data-goto="' + pr.id + '">' +
        '<span class="idx">0' + (i + 1) + '</span>' +
        '<span><span class="ttl">' + pr.title + '</span>' +
        '<span class="kick">' + pr.kicker + ' · ' + pr.year + '</span></span>' +
        '<span class="go">' + ARROW + '</span></button>';
    }).join('') +
    '<button class="work-row" data-goto="archive">' +
      '<span class="idx">0' + (data.featured.length + 1) + '</span>' +
      '<span><span class="ttl">Archive</span><span class="kick">' + data.more.length +
      ' smaller builds · C, C++, JavaFX, Web</span></span>' +
      '<span class="go">' + ARROW + '</span></button>';

    $('#archive-grid').innerHTML = data.more.map(function (m) {
      return '<a class="card" href="' + m.repo + '" target="_blank" rel="noopener noreferrer">' +
        '<h3 class="h-sm">' + m.title + '</h3>' +
        '<p class="body-text mt-sm" style="font-size:.86rem">' + m.blurb + '</p>' +
        '<div class="chips mt-md">' + m.stackLabels.map(function (l, i) {
          return '<span class="tech">' + (m.stack[i] ? icon(m.stack[i]) : '') + l + '</span>';
        }).join('') + '</div></a>';
    }).join('');
  }

  function renderEducation(e) {
    $('#streak').innerHTML =
      '<div class="fives">' + ['PEC', 'JSC', 'SSC', 'HSC'].map(function (x) {
        return '<div class="five">5<small>' + x + '</small></div>';
      }).join('') + '</div>' +
      '<div><p class="h-sm">' + e.streak.label + '</p><p class="mono mt-sm">' + e.streak.detail + '</p></div>';

    $('#timeline').innerHTML = e.timeline.map(function (t) {
      var badges = '';
      if (t.result) badges += '<span class="badge' + (t.current ? ' plain' : '') + '">' + t.result + '</span>';
      if (t.board)  badges += '<span class="badge plain">' + t.board + '</span>';
      if (t.award)  badges += '<span class="badge gold">★ ' + t.award + '</span>';
      return '<div class="tl-item' + (t.current ? ' now' : '') + '">' +
        '<p class="per">' + t.period + '</p>' +
        '<p class="ttl">' + t.title + '</p>' +
        '<p class="inst">' + t.institution + (t.note ? ' — ' + t.note : '') + '</p>' +
        (badges ? '<div class="res">' + badges + '</div>' : '') + '</div>';
    }).join('');

    $('#ach-grid').innerHTML = e.achievements.map(function (a, i) {
      return '<div class="card ach" data-tier="' + a.tier + '">' +
        '<span class="rank">' + ('0' + (i + 1)) + '</span>' +
        '<div><h4>' + a.title + '</h4><p class="org">' + a.org + '</p><p>' + a.detail + '</p></div></div>';
    }).join('');

    $('#co-list').innerHTML = e.cocurricular.map(function (c) { return '<li>' + c + '</li>'; }).join('');

    $('#lead-list').innerHTML = e.leadership.map(function (l) {
      return '<div class="lead-row">' +
        '<div><p class="rl">' + l.role + (l.current ? ' <span class="pill live" style="vertical-align:middle">Now</span>' : '') + '</p>' +
        '<p class="og">' + l.org + '</p></div>' +
        '<div><p class="pd mb-sm">' + l.period + '</p>' +
        (l.detail ? '<p class="dt">' + l.detail + '</p>' : '') + '</div></div>';
    }).join('');
  }

  function renderInterests(d) {
    $('#int-grid').innerHTML = d.cards.map(function (c) {
      var tag = c.link
        ? '<button class="card int" data-goto="' + c.link + '">'
        : '<div class="card int">';
      var end = c.link ? '</button>' : '</div>';
      return tag +
        '<span class="n">' + c.eyebrow + '</span>' +
        '<h3>' + c.title + '</h3>' +
        '<p class="ln">' + c.line + '</p>' +
        '<p>' + c.body + '</p>' +
        '<span class="tg">' + c.tag + (c.link ? ' — open' : '') + '</span>' + end;
    }).join('');
  }

  var CAM = '<svg viewBox="0 0 24 24"><path d="M9 3l-1.5 2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.5L15 3H9zm3 5.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5z"/></svg>';
  var INFO = '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-6h2zm0-8h-2V7h2z"/></svg>';

  var LIGHTBOX = [];

  function renderLens(g) {
    LIGHTBOX = [];
    var html = '<div class="lens-note">' + INFO +
      '<span><b>These are from 2019.</b> Early frames, kept as they were shot — the gear was modest and the technique was still forming. They are here because they are where it started, not because they are the best of it. Newer work lands in the next collection.</span></div>';

    g.collections.forEach(function (col) {
      html += '<div class="mt-lg"><div class="flexrow gap-sm mb-sm">' +
        '<p class="eyebrow">' + col.title + (col.year ? ' — ' + col.year : '') + '</p>' +
        '<span class="pill">' + (col.photos.length || 'open') + (col.photos.length ? ' frames' : ' slot') + '</span></div>' +
        '<p class="body-text mb-md" style="font-size:.87rem">' + col.blurb + '</p><div class="shots">';

      col.photos.forEach(function (ph) {
        var i = LIGHTBOX.length;
        LIGHTBOX.push(ph);
        html += '<button class="shot' + (ph.orientation === 'portrait' ? ' tall' : '') + '" data-shot="' + i + '">' +
          '<img src="' + ph.src + '" alt="' + esc(ph.title) + '" loading="lazy" ' +
          'onerror="this.closest(\'.shot\').classList.add(\'empty\');' +
          'this.closest(\'.shot\').innerHTML=\'<div class=&quot;ph&quot;>' + CAM.replace(/"/g, '&quot;') +
          '<p>Awaiting upload</p><code>' + ph.src + '</code></div>\';">' +
          '<span class="wm">Issmam’s Photography</span>' +
          '<span class="cap"><b>' + ph.title + '</b><span>' + ph.caption + '</span></span></button>';
      });

      var slots = col.photos.length ? 1 : 3;
      for (var k = 0; k < slots; k++) {
        html += '<div class="shot slot"><div class="ph">' + CAM +
          '<p>Room for more</p><code>assets/img/gallery/</code></div></div>';
      }
      html += '</div></div>';
    });

    html += '<div class="card mt-lg"><p class="eyebrow mb-sm">Adding a photograph</p>' +
      '<p class="body-text" style="font-size:.86rem">Drop the file into <code class="lime">assets/img/gallery/</code> and append one entry to ' +
      '<code class="lime">data/gallery.json</code>. The grid, the lightbox and the counters all rebuild themselves. ' +
      'Empty slots stay as placeholders instead of breaking.</p></div>';

    $('#lens-body').innerHTML = html;
  }

  function renderContact(p) {
    var MAIL = '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2V5zm2 2v.4l8 5 8-5V7H4zm16 10v-7.2l-8 5-8-5V17h16z"/></svg>';
    var PHONE = '<svg viewBox="0 0 24 24"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .58 3.6 1 1 0 0 1-.25 1z"/></svg>';
    var PIN = '<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/></svg>';

    var lines = p.emails.map(function (e) {
      return '<a class="cline" href="mailto:' + e.address + '">' +
        '<span class="ic">' + MAIL + '</span>' +
        '<span><span class="lb">' + e.label + '</span><span class="vl">' + e.address + '</span></span>' +
        '<span class="go">Write →</span></a>';
    }).join('');

    lines += '<a class="cline" href="tel:' + p.phone.replace(/\s/g, '') + '">' +
      '<span class="ic">' + PHONE + '</span>' +
      '<span><span class="lb">Phone</span><span class="vl">Tap to call — number stays hidden</span></span>' +
      '<span class="go">Call →</span></a>';

    lines += '<div class="cline"><span class="ic">' + PIN + '</span>' +
      '<span><span class="lb">Located</span><span class="vl">' + p.location + '</span></span></div>';

    $('#contact-lines').innerHTML = lines;

    $('#socials').innerHTML = p.social.map(function (s) {
      var inner = icon(s.id) + '<span><span class="t">' + s.label + '</span><br><span class="h">' + s.handle + '</span></span>';
      return s.url
        ? '<a class="soc" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' + inner + '</a>'
        : '<button class="soc" data-copy="' + esc(s.handle) + '" title="Copy handle">' + inner + '</button>';
    }).join('');

    $('#contact-cta').innerHTML =
      '<a class="btn solid" href="' + p.resume + '" download>' +
        '<svg viewBox="0 0 24 24"><path d="M12 3v10.2l3.6-3.6L17 11l-5 5-5-5 1.4-1.4L12 13.2V3zM5 19h14v2H5z"/></svg>Download CV</a>' +
      '<button class="btn ghost" data-goto="letter">' +
        '<svg viewBox="0 0 24 24"><path d="M3 3h18v4H3zm0 6h18v12H3zm3 3v2h12v-2z"/></svg>Write a letter</button>';
  }

  /* ============================================================
     NAVIGATION ENGINE
     ============================================================ */

  var Nav = {
    rows: [], map: {}, r: 0, c: 0, busy: false, lastMove: 0,

    build: function () {
      var self = this;
      this.rows = $$('.row').map(function (rowEl, ri) {
        var panels = $$('.panel', rowEl);
        panels.forEach(function (p, ci) {
          self.map[p.dataset.panel] = { r: ri, c: ci };
        });
        return { el: rowEl, panels: panels, title: panels[0].dataset.title };
      });

      $('#rail').innerHTML = this.rows.map(function (row, i) {
        return '<a class="rail-node" href="#' + row.panels[0].dataset.panel + '" data-r="' + i + '">' +
               '<span class="dot"></span><span class="tip">' + row.title + '</span></a>';
      }).join('');

      $('#menu-sheet').innerHTML = this.rows.map(function (row, ri) {
        return row.panels.map(function (p, ci) {
          return '<a href="#' + p.dataset.panel + '"><span class="n">' +
            ri + '.' + ci + '</span><span class="t">' + p.dataset.title + '</span></a>';
        }).join('');
      }).join('');

      // Rows are stacked vertically; each row's own track slides horizontally.
      this.rows.forEach(function (row, i) {
        row.el.style.top = (i * 100) + '%';
      });
    },

    go: function (r, c, push) {
      if (this.busy) return;
      r = Math.max(0, Math.min(this.rows.length - 1, r));
      var row = this.rows[r];
      c = Math.max(0, Math.min(row.panels.length - 1, c || 0));
      if (r === this.r && c === this.c && push !== 'force') return;

      var changedRow = r !== this.r;
      this.r = r; this.c = c;
      this.busy = true;

      $('#rows').style.transform = 'translateY(' + (-r * 100) + '%)';
      row.el.style.transform = 'translateX(' + (-c * 100) + '%)';
      // Reset sibling rows to their first panel so re-entry is always clean.
      this.rows.forEach(function (o, i) {
        if (i !== r) { o.el.style.transform = 'translateX(0)'; }
      });

      this.paint();
      var panel = row.panels[c];
      panel.scrollTop = 0;
      if (history.replaceState) {
        history.replaceState(null, '', '#' + panel.dataset.panel);
      } else {
        location.hash = panel.dataset.panel;
      }
      document.title = (c === 0 && r === 0 ? '' : panel.dataset.title + ' — ') +
                       'Md Woasif Mehmud Issmam';

      var self = this;
      setTimeout(function () { self.busy = false; }, reduced ? 20 : (changedRow ? 900 : 760));
    },

    paint: function () {
      var self = this;
      this.rows.forEach(function (row, ri) {
        row.panels.forEach(function (p, ci) {
          var live = ri === self.r && ci === self.c;
          p.classList.toggle('is-live', live);
          p.setAttribute('aria-hidden', live ? 'false' : 'true');
          $$('a,button,input,textarea', p).forEach(function (el) {
            if (live) el.removeAttribute('tabindex');
            else el.setAttribute('tabindex', '-1');
          });
        });
      });

      $$('.rail-node').forEach(function (n, i) {
        n.setAttribute('aria-current', i === self.r ? 'true' : 'false');
      });

      var row = this.rows[this.r];
      var hint = $('#track-hint');
      if (row.panels.length > 1) {
        hint.classList.add('on');
        $('#hint-pips').innerHTML = row.panels.map(function (p, i) {
          return '<button class="pip' + (i === self.c ? ' on' : '') + '" data-c="' + i +
                 '" aria-label="' + p.dataset.title + '"></button>';
        }).join('');
        $('#hint-label').textContent = row.panels[this.c].dataset.title;
        $('#hint-prev').disabled = this.c === 0;
        $('#hint-next').disabled = this.c === row.panels.length - 1;
      } else {
        hint.classList.remove('on');
      }
      $('#nudge').style.opacity = this.r === 0 && this.c === 0 ? '1' : '0.42';
    },

    named: function (name) {
      var t = this.map[name];
      if (t) this.go(t.r, t.c);
    },

    /* Only hand a wheel/swipe to the navigator when the panel itself
       has nothing left to scroll in that direction. */
    atEdge: function (dir) {
      var p = this.rows[this.r].panels[this.c];
      var slack = p.scrollHeight - p.clientHeight;
      // A panel that overflows by only a few pixels must never trap navigation.
      if (slack <= 40) return true;
      return dir > 0 ? p.scrollTop >= slack - 8 : p.scrollTop <= 8;
    },

    /* body is overflow:hidden, so the panel will never scroll from a key press
       on its own — we have to drive it. */
    nudge: function (dir, frac) {
      var p = this.rows[this.r].panels[this.c];
      p.scrollBy({ top: dir * p.clientHeight * frac, behavior: reduced ? 'auto' : 'smooth' });
    },

    step: function (dr, dc) {
      var now = Date.now();
      if (now - this.lastMove < 260) return;
      this.lastMove = now;
      if (dc) {
        this.go(this.r, this.c + dc);
      } else if (dr) {
        this.go(this.r + dr, 0);
      }
    }
  };

  /* ============================================================
     INPUT
     ============================================================ */

  function wireInput() {
    var wheelAcc = 0, wheelTimer = null;

    window.addEventListener('wheel', function (e) {
      if ($('#menu').classList.contains('on') || $('#lightbox').classList.contains('on')) return;

      var horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4;
      if (horizontal) {
        if (Nav.busy) return;
        wheelAcc += e.deltaX;
        if (Math.abs(wheelAcc) > 60) { Nav.step(0, wheelAcc > 0 ? 1 : -1); wheelAcc = 0; }
      } else {
        var dir = e.deltaY > 0 ? 1 : -1;
        if (!Nav.atEdge(dir)) { wheelAcc = 0; return; }
        e.preventDefault();
        if (Nav.busy) return;
        wheelAcc += e.deltaY;
        if (Math.abs(wheelAcc) > 48) { Nav.step(wheelAcc > 0 ? 1 : -1, 0); wheelAcc = 0; }
      }
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(function () { wheelAcc = 0; }, 200);
    }, { passive: false });

    document.addEventListener('keydown', function (e) {
      if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;

      if ($('#lightbox').classList.contains('on')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') shiftLightbox(1);
        if (e.key === 'ArrowLeft') shiftLightbox(-1);
        return;
      }
      if ($('#menu').classList.contains('on')) {
        if (e.key === 'Escape') toggleMenu(false);
        return;
      }

      switch (e.key) {
        case 'ArrowDown': case 'PageDown': case ' ':
          e.preventDefault();
          if (Nav.atEdge(1)) Nav.step(1, 0);
          else Nav.nudge(1, e.key === 'ArrowDown' ? 0.16 : 0.82);
          break;
        case 'ArrowUp': case 'PageUp':
          e.preventDefault();
          if (Nav.atEdge(-1)) Nav.step(-1, 0);
          else Nav.nudge(-1, e.key === 'ArrowUp' ? 0.16 : 0.82);
          break;
        case 'ArrowRight': e.preventDefault(); Nav.step(0, 1); break;
        case 'ArrowLeft':  e.preventDefault(); Nav.step(0, -1); break;
        case 'Home': e.preventDefault(); Nav.go(0, 0); break;
        case 'End':  e.preventDefault(); Nav.go(Nav.rows.length - 1, 0); break;
        case 'Escape': Nav.go(0, 0); break;
        case 'm': case 'M': toggleMenu(true); break;
      }
    });

    // Touch — direction locked on first movement.
    var t0 = null, axis = null;
    window.addEventListener('touchstart', function (e) {
      t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      axis = null;
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (!t0 || axis) return;
      var dx = e.touches[0].clientX - t0.x, dy = e.touches[0].clientY - t0.y;
      if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
        axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
    }, { passive: true });

    window.addEventListener('touchend', function (e) {
      if (!t0 || !axis) { t0 = null; return; }
      if ($('#menu').classList.contains('on') || $('#lightbox').classList.contains('on')) { t0 = null; return; }
      var dx = e.changedTouches[0].clientX - t0.x;
      var dy = e.changedTouches[0].clientY - t0.y;
      var fast = Date.now() - t0.t < 700;
      if (axis === 'x' && Math.abs(dx) > 55 && fast) {
        Nav.step(0, dx < 0 ? 1 : -1);
      } else if (axis === 'y' && Math.abs(dy) > 62 && fast) {
        var dir = dy < 0 ? 1 : -1;
        if (Nav.atEdge(dir)) Nav.step(dir, 0);
      }
      t0 = null;
    }, { passive: true });

    // Delegated clicks
    document.addEventListener('click', function (e) {
      var goTo = e.target.closest('[data-goto]');
      if (goTo) { e.preventDefault(); Nav.named(goTo.dataset.goto); toggleMenu(false); return; }

      var link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        Nav.named(link.getAttribute('href').slice(1));
        toggleMenu(false);
        return;
      }

      var pip = e.target.closest('.pip');
      if (pip) { Nav.go(Nav.r, +pip.dataset.c); return; }

      var shot = e.target.closest('[data-shot]');
      if (shot) { openLightbox(+shot.dataset.shot); return; }

      var copy = e.target.closest('[data-copy]');
      if (copy) {
        navigator.clipboard && navigator.clipboard.writeText(copy.dataset.copy);
        var t = copy.querySelector('.h');
        if (t) { var o = t.textContent; t.textContent = 'copied'; setTimeout(function () { t.textContent = o; }, 1400); }
      }
    });

    $('#hint-prev').addEventListener('click', function () { Nav.go(Nav.r, Nav.c - 1); });
    $('#hint-next').addEventListener('click', function () { Nav.go(Nav.r, Nav.c + 1); });
    $('#menu-btn').addEventListener('click', function () { toggleMenu(true); });
    $('#menu-close').addEventListener('click', function () { toggleMenu(false); });

    window.addEventListener('hashchange', function () {
      var n = location.hash.slice(1);
      if (n && Nav.map[n]) Nav.named(n);
    });
  }

  function toggleMenu(on) {
    var m = $('#menu');
    if (on === undefined) on = !m.classList.contains('on');
    m.classList.toggle('on', on);
    $('#menu-btn').setAttribute('aria-expanded', String(on));
    if (on) {
      $$('#menu a').forEach(function (a, i) { a.style.transitionDelay = (i * 32) + 'ms'; });
    }
  }

  /* ---------- Lightbox ---------- */

  var lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    var p = LIGHTBOX[i];
    if (!p) return;
    $('#lb-img').src = p.src;
    $('#lb-img').alt = p.title;
    $('#lb-title').textContent = p.title;
    $('#lb-sub').textContent = p.caption + ' · Issmam’s Photography, 2019';
    $('#lightbox').classList.add('on');
  }
  function closeLightbox() { $('#lightbox').classList.remove('on'); }
  function shiftLightbox(d) {
    if (!LIGHTBOX.length) return;
    openLightbox((lbIndex + d + LIGHTBOX.length) % LIGHTBOX.length);
  }

    /* ---------- Portraits ---------- */

  /* A portrait whose file is not uploaded yet degrades to a labelled slot
     instead of a broken image. */
  function initPortraits() {
    $$('.portrait img').forEach(function (img) {
      function fail() {
        var fig = img.closest('.portrait');
        fig.classList.add('empty');
        img.remove();
        var cap = fig.querySelector('figcaption');
        if (cap) cap.remove();
        fig.insertAdjacentHTML('beforeend',
          '<div class="waiting">' + CAM + '<p>Awaiting upload</p><code>' +
          img.getAttribute('src') + '</code></div>');
      }
      if (img.complete && img.naturalWidth === 0) fail();
      else img.addEventListener('error', fail);
    });
  }

  /* ---------- Theme ---------- */

  var SUN = 'M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13V1h0v3zm0 19v-3 3zM4.2 5.6L2.1 3.5l1.4-1.4 2.1 2.1zm14.2 14.2l2.1 2.1 1.4-1.4-2.1-2.1zM1 13v-2h3v2zm19 0v-2h3v2zM5.6 19.8l-2.1 2.1-1.4-1.4 2.1-2.1zM19.8 5.6l2.1-2.1-1.4-1.4-2.1 2.1z';
  var MOON = 'M12.3 2a9.5 9.5 0 1 0 9.4 11.7A8 8 0 0 1 12.3 2z';

  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    $('#theme-icon').innerHTML = '<path d="' + (t === 'dark' ? MOON : SUN) + '"/>';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#060806' : '#F4F6EF');
    try { localStorage.setItem('wi-theme', t); } catch (err) {}
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('wi-theme'); } catch (err) {}
    // Black and lime is the identity — light mode is opt-in, never inferred.
    if (saved !== 'light' && saved !== 'dark') saved = 'dark';
    applyTheme(saved);
    $('#theme-btn').addEventListener('click', function () {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- Cursor & pointer glow ---------- */

  function initCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduced) return;
    document.body.classList.add('cursor-on');

    var slice = $('#cursor-slice'), dot = $('#cursor-dot'), glow = $('#veil-glow');
    var tx = innerWidth / 2, ty = innerHeight / 2, sx = tx, sy = ty, raf = null;

    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      glow.style.setProperty('--mx', tx + 'px');
      glow.style.setProperty('--my', ty + 'px');

      var card = e.target.closest('.card');
      if (card) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      }
      var hot = e.target.closest('a, button, input, textarea, .tile, .shot, [data-goto]');
      document.body.classList.toggle('cursor-hot', !!hot);
      if (!raf) raf = requestAnimationFrame(follow);
    });

    function follow() {
      sx += (tx - sx) * 0.17;
      sy += (ty - sy) * 0.17;
      slice.style.transform = 'translate3d(' + sx + 'px,' + sy + 'px,0)';
      if (Math.abs(tx - sx) > 0.4 || Math.abs(ty - sy) > 0.4) {
        raf = requestAnimationFrame(follow);
      } else { raf = null; }
    }

    document.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-on'); });
    document.addEventListener('mouseenter', function () { document.body.classList.add('cursor-on'); });
  }

  /* ---------- Letter ---------- */

  function initLetter(p) {
    var form = $('#letter-form'), body = $('#lt-body'), note = $('#lt-note');
    var to = p.emails.map(function (e) { return e.address; }).join(',');

    body.addEventListener('input', function () { $('#lt-count').textContent = body.value.length; });

    function compose() {
      var n = $('#lt-name').value.trim() || 'A reader';
      var m = $('#lt-mail').value.trim();
      var text = body.value.trim();
      return {
        subject: 'A letter from ' + n,
        body: text + '\n\n—\n' + n + (m ? '\n' + m : '') + '\nSent from woasifissmam.github.io'
      };
    }

    function flash(msg) {
      note.textContent = msg;
      note.classList.add('on');
      setTimeout(function () { note.classList.remove('on'); }, 3200);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!body.value.trim()) { flash('The letter is empty'); body.focus(); return; }
      var c = compose();
      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(c.subject) +
        '&body=' + encodeURIComponent(c.body);
      flash('Opening your mail client…');
    });

    $('#lt-copy').addEventListener('click', function () {
      var c = compose();
      var txt = 'To: ' + to + '\nSubject: ' + c.subject + '\n\n' + c.body;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(function () { flash('Copied to clipboard'); },
                                                function () { flash('Could not copy'); });
      } else { flash('Clipboard unavailable'); }
    });
  }

  /* ============================================================
     BOOT
     ============================================================ */

  var FILES = ['profile', 'projects', 'education', 'stack', 'interests', 'gallery'];

  function boot() {
    paintBackdrops();
    initTheme();

    var bar = $('#loadbar'), done = 0;
    var loads = FILES.map(function (f) {
      return fetch('data/' + f + '.json')
        .then(function (r) { if (!r.ok) throw new Error(f); return r.json(); })
        .then(function (j) {
          done++;
          bar.style.width = Math.round(done / FILES.length * 100) + '%';
          return j;
        });
    });

    Promise.all(loads).then(function (d) {
      var profile = d[0], projects = d[1], education = d[2],
          stack = d[3], interests = d[4], gallery = d[5];

      renderAbout(profile);
      renderStack(stack);
      renderWork(projects);
      renderEducation(education);
      renderInterests(interests);
      renderLens(gallery);
      renderContact(profile);
      initLetter(profile);

      Nav.build();
      wireInput();
      initCursor();
      initPortraits();

      $('#lb-close').addEventListener('click', closeLightbox);
      $('#lb-prev').addEventListener('click', function () { shiftLightbox(-1); });
      $('#lb-next').addEventListener('click', function () { shiftLightbox(1); });
      $('#lightbox').addEventListener('click', function (e) {
        if (e.target.id === 'lightbox') closeLightbox();
      });

      var start = location.hash.slice(1);
      if (start && Nav.map[start]) {
        var t = Nav.map[start];
        Nav.go(t.r, t.c, 'force');
      } else {
        Nav.go(0, 0, 'force');
      }

      setTimeout(function () { $('#loader').classList.add('done'); }, 340);
    }).catch(function (err) {
      $('#loader').innerHTML =
        '<div class="lo"><p class="txt" style="color:var(--lime)">Content failed to load</p>' +
        '<p class="txt">' + esc(err.message) + '</p>' +
        '<p class="txt" style="max-width:32ch;text-align:center;line-height:1.8">' +
        'Open this over http, not file://</p></div>';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
