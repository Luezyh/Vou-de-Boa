const tabs  = document.querySelectorAll('.tab-btn');
const pages = document.querySelectorAll('.page');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;

    tabs.forEach(t  => t.classList.remove('active'));
    pages.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById('page-' + target).classList.add('active');
  });
});