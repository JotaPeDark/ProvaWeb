document.addEventListener('DOMContentLoaded', function () {
    const iconeFiltro = document.getElementById('iconeFiltro');
    const modal = document.getElementById('modal');
    const fecharModal = document.getElementById('fecharModal');
    const aplicarFechar = document.getElementById('aplicarFechar');

    iconeFiltro.addEventListener('click', function () {
        modal.showModal(); 
    });

    fecharModal.addEventListener('click', function () {
        modal.close();
    });

    aplicarFechar.addEventListener('click', function (event) {
        event.preventDefault();
        modal.close();
    });
});
