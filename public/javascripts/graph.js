document.getElementById('show-graph').onclick = function () {
    const chatArticle = document.getElementById('chat');
    chatArticle.style.display = 'none';
    const msg = document.getElementById('messages');
    msg.innerHTML = '';
    const planetariumArticle = document.getElementById('planetarium');
    planetariumArticle.style.display = 'none';
    const graphArticle = document.getElementById('graph');
    graphArticle.style.display = 'block';
};


const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const x = $('.graph-article').width();
const y = $('.graph-article').height();
$('#graph-canvas').attr('width', x);
$('#graph-canvas').attr('height', y);
const X = document.getElementById('graph-canvas').width;
const Y = document.getElementById('graph-canvas').height;

// x軸の描画
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(20, Y-20);
ctx.closePath();
ctx.stroke();

// y軸の描画
ctx.beginPath();
ctx.moveTo(20, Y-20);
ctx.lineTo(X-20, Y-20);
ctx.closePath();
ctx.stroke();

let stX = 0;
let stY = 0;
//描画の開始
function startDraw(event){
//canvasの絶対座標を取得
wbound = event.target.getBoundingClientRect();
//マウスの座標（始点）をセット
stX = event.clientX - wbound.left;
stY = event.clientY - wbound.top;

ctx.beginPath();
ctx.arc(stX, stY, 10, 0, Math.PI * 2, false);
ctx.fill();
ctx.moveTo(stX, stY);
ctx.restore();

}
