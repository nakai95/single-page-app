
document.getElementById('show-chat').onclick = function () {
    const planetariumArticle = document.getElementById('planetarium');
    planetariumArticle.style.display = 'none';
    const graphArticle = document.getElementById('graph');
    graphArticle.style.display = 'none';
    const chatArticle = document.getElementById('chat');
    chatArticle.style.display = 'block';
};
