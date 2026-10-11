// Menu de navegação entre as telas: <menu-navegacao></menu-navegacao>
// Todas as telas ficam em views/, por isso os links são relativos a essa pasta
angular.module('myApp').directive('menuNavegacao', function () {
    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'partials/menu.html',
        link: function (scope) {
            scope.itens = [
                { titulo: 'Início', href: 'index.html' },
                { titulo: 'Artigos', href: 'artigos.html' },
                { titulo: 'Novo artigo', href: 'painelAdm.html' },
                { titulo: 'Categorias', href: 'categorias.html' }
            ];

            const pagina = window.location.pathname.split('/').pop() || 'index.html';
            const editandoArtigo = pagina === 'painelAdm.html' && new URLSearchParams(window.location.search).has('id');

            // Na edição de um artigo, o item ativo é "Artigos" e não "Novo artigo"
            scope.paginaAtual = editandoArtigo ? 'artigos.html' : pagina;
        }
    };
});
