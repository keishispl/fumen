const refresh = document.getElementById(`scroll`);
refresh.classList.add('hidden');

refresh.addEventListener('click', () => {
     document.body.scrollTo({ top: 0, behavior: 'smooth' });
     document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
});

window.onscroll = function () { scrollFunction() };
function scrollFunction() {
     if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
          refresh.classList.remove('hidden');
     } else {
          refresh.classList.add('hidden');
     }
}