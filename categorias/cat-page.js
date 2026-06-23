/* Bela Vista Auto Peças — Páginas de categoria */
(function () {
  var WA = '5527997776244';

  function waLink(msg) {
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  var warnSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" width="13" height="13"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  var form      = document.getElementById('cat-form');
  var searching = document.getElementById('cat-searching');
  var result    = document.getElementById('cat-result');
  var resetBtn  = document.getElementById('cat-form-reset');
  var resultDesc= document.getElementById('cat-result-desc');
  var wapBtn    = document.getElementById('cat-result-wap');

  if (!form) return;

  /* Garante que o estado de busca nunca aparece sozinho */
  if (searching) searching.hidden = true;
  if (result)    result.hidden    = true;

  var category  = form.dataset.category || 'peça';
  var submitBtn = form.querySelector('[type="submit"]');
  var origBtnHTML = submitBtn ? submitBtn.innerHTML : '';

  /* Insere aviso de estoque no card (uma vez) */
  if (result && resultDesc && !result.querySelector('.cat-result-stock')) {
    var stockEl = document.createElement('p');
    stockEl.className = 'cat-result-stock';
    stockEl.innerHTML = warnSVG + ' Últimas unidades — garanta o seu antes de esgotar o estoque.';
    resultDesc.insertAdjacentElement('afterend', stockEl);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var marca  = document.getElementById('cat-marca').value.trim();
    var modelo = document.getElementById('cat-modelo').value.trim();
    var ano    = document.getElementById('cat-ano').value.trim();
    var peca   = document.getElementById('cat-peca').value.trim() || category;

    if (!marca || !modelo || !ano) return;

    /* Animação no botão de submit */
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="city-search-loading"><span></span><span></span><span></span></span>&nbsp;Verificando…';
      submitBtn.disabled  = true;
    }

    setTimeout(function () {
      /* Transição: esconde formulário, mostra resultado */
      form.hidden   = true;
      result.hidden = false;

      var desc = peca + ' para ' + marca + ' ' + modelo + ' ' + ano;
      if (resultDesc) resultDesc.textContent = desc;

      var msg = 'Olá! Vi no site que está disponível a peça: ' + desc + '. Preciso comprar, pode me passar o orçamento?';
      if (wapBtn) wapBtn.href = waLink(msg);

      /* Restaura botão para uso futuro */
      if (submitBtn) {
        submitBtn.innerHTML = origBtnHTML;
        submitBtn.disabled  = false;
      }
    }, 1800);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      result.hidden = true;
      form.hidden   = false;
      form.reset();
    });
  }
})();
