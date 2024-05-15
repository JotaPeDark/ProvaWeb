const iconeFiltro = document.getElementById('iconeFiltro');
const modal = document.getElementById('modal');
const fecharModal = document.getElementById('fecharModal');

iconeFiltro.addEventListener('click', function() {
    modal.showModal();
});

fecharModal.addEventListener('click', function() {
    modal.close();
})