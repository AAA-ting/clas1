(function () {
  var header = document.getElementById('header');
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav > a:not(.nav-cta)').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var counters = document.querySelectorAll('[data-count]');
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      cio.unobserve(el);
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var start = performance.now();
      var dur = 1600;
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.4 });
  counters.forEach(function (el) { cio.observe(el); });

  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
      });
      if (!isOpen) item.classList.add('open');
    });
  });

  var filterBar = document.getElementById('filterBar');
  if (filterBar) {
    var works = document.querySelectorAll('.work');
    filterBar.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBar.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var f = btn.getAttribute('data-filter');
        works.forEach(function (w) {
          var show = f === 'all' || w.getAttribute('data-cat') === f;
          w.classList.toggle('hidden', !show);
          if (show) { w.classList.remove('in'); void w.offsetWidth; w.classList.add('in'); }
        });
      });
    });
  }

  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('formMsg');
      var name = form.name, email = form.email, phone = form.phone, text = form.message;
      [name, email, phone, text].forEach(function (i) { i.classList.remove('err'); });
      var bad = [];
      if (!name.value.trim()) bad.push(name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
      if (!/^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$|^\+?\d[\d\s-]{6,14}$/.test(phone.value.trim())) bad.push(phone);
      if (text.value.trim().length < 5) bad.push(text);
      if (bad.length) {
        bad.forEach(function (i) { i.classList.add('err'); });
        msg.className = 'form-msg bad';
        msg.textContent = '请检查标红的字段：姓名、邮箱、电话与留言（至少 5 字）均为必填且格式需正确。';
        return;
      }
      msg.className = 'form-msg ok';
      msg.textContent = '提交成功！我们已收到您的咨询需求，将在 1 个工作日内与您联系。';
      form.reset();
    });
  }
})();
