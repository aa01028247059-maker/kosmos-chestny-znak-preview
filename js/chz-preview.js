/* ==========================================================================
   chz-preview.js — только для локального предпросмотра.
   На сайте аккордеон FAQ (.faq_item) работает через JS темы, события — через систему аналитики.
   Разработчику этот файл переносить не нужно.
   ========================================================================== */
(function () {
  // Открыто двойным кликом (file://) — пути /wp-content/... не работают. Показываем, как открыть правильно.
  if (location.protocol === 'file:') {
    var rel = location.pathname.replace(/\\/g, '/').split('/design/')[1] || '';
    var url = 'http://127.0.0.1:8765/' + rel;
    var bar = document.createElement('div');
    bar.style.cssText = 'position:sticky;top:0;z-index:100;padding:12px 24px;background:#c42624;color:#fff;font:600 14px/1.5 Manrope,sans-serif';
    bar.innerHTML = 'Страница открыта как файл — иконки, шрифт и галочки не загрузятся. ' +
      'Запустите <b>preview.bat</b> в корне проекта или откройте <a style="color:#fff;text-decoration:underline" href="' + url + '">' + url + '</a>';
    document.body.prepend(bar);
  }

  // Аккордеон FAQ. Два режима:
  //  • «режим правок» — на странице есть пункты .faq_item.pv-open (вопросы с правками, задание 1):
  //    они открыты сразу, пункты открываются независимо — разработчику видно все правки;
  //  • иначе — копия логики темы (функция faq() в main.js сайта): при загрузке открыт первый
  //    .faq_item на всей странице, одновременно открыт один пункт.
  // На сайте всегда работает логика темы (этот файл не переносится).
  var items = document.querySelectorAll('.faq_item');
  var reviewMode = document.querySelector('.faq_item.pv-open') !== null;
  function setItem(item, open) {
    var panel = item.querySelector('.faq_item_content');
    var btn = item.querySelector('.faq_item_trigger');
    item.classList.toggle('faq_item_active', open);
    if (panel) {
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  items.forEach(function (item, i) {
    setItem(item, reviewMode ? item.classList.contains('pv-open') : i === 0);
    (item.querySelector('.faq_item_trigger') || item).addEventListener('click', function () {
      var wasOpen = item.classList.contains('faq_item_active');
      if (!reviewMode) {
        var active = document.querySelector('.faq_item_active');
        if (active && active !== item) setItem(active, false);
      }
      setItem(item, !wasOpen);
    });
  });

  // Проверка разметки событий из ТЗ: клик по элементу с data-event пишет событие в консоль
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-event]');
    if (el && el.tagName !== 'DETAILS') console.info('[event]', el.dataset.event, '←', el.textContent.trim().slice(0, 60));
  });
  document.querySelectorAll('details[data-event]').forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) console.info('[event]', d.dataset.event, '← open'); });
  });
})();
