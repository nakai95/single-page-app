const canvas = document.getElementById('graph-canvas');
const ctx = canvas.getContext('2d');
const x = $('.graph-article').width();
const y = $('.graph-article').height();
$('#graph-canvas').attr('width', x);
$('#graph-canvas').attr('height', y);
const X = document.getElementById('graph-canvas').width;
const Y = document.getElementById('graph-canvas').height;
let datalist = [];

function initCanvas() {
    ctx.fillStyle = "rgb(235, 235, 235)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(0, 0, 0)";
    // x軸の描画
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(40, Y);
    ctx.closePath();
    ctx.stroke();

    // y軸の描画
    ctx.beginPath();
    ctx.moveTo(0, Y - 40);
    ctx.lineTo(X - 40, Y - 40);
    ctx.closePath();
    ctx.stroke();
}

//描画の開始
function startDraw(event) {
    //canvasの絶対座標を取得
    wbound = event.target.getBoundingClientRect();
    //マウスの座標（始点）をセット
    let data = new Object();
    data.x = event.clientX - wbound.left;
    data.y = event.clientY - wbound.top;

    ctx.fillStyle = "rgb(180, 180, 180)";
    ctx.beginPath();
    ctx.arc(data.x, data.y, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.moveTo(data.x, data.y);
    ctx.restore();

    data.y *= -1;
    datalist.push(data);
}

const lsm = coordinates => {
    const n = coordinates.length;
    const sigX = coordinates.reduce((sum, c) => sum + c.x, 0);
    const sigY = coordinates.reduce((sum, c) => sum + c.y, 0);
    const sigXX = coordinates.reduce((sum, c) => sum + c.x * c.x, 0);
    const sigXY = coordinates.reduce((sum, c) => sum + c.x * c.y, 0);
    // a(傾き)を求める
    const a = (n * sigXY - sigX * sigY) / (n * sigXX - Math.pow(sigX, 2));
    // b(切片)を求める
    const b = (sigXX * sigY - sigXY * sigX) / (n * sigXX - Math.pow(sigX, 2));
    return { a, b };
}

document.getElementById('show-graph').onclick = function () {
    const chatArticle = document.getElementById('chat');
    chatArticle.style.display = 'none';
    const msg = document.getElementById('messages');
    msg.innerHTML = '';
    const planetariumArticle = document.getElementById('planetarium');
    planetariumArticle.style.display = 'none';
    const graphArticle = document.getElementById('graph');
    graphArticle.style.display = 'block';
    initCanvas();
    datalist = [];
};

document.getElementById('lsm').onclick = function () {
    const { a, b } = lsm(datalist);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
    ctx.fillStyle = "rgb(180, 180, 180)";
    for (const data of datalist) {
        ctx.beginPath();
        ctx.arc(data.x, -data.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.moveTo(data.x, -data.y);
        ctx.restore();
    }
    ctx.strokeStyle = "rgb(60, 60, 60)";
    ctx.beginPath();
    ctx.moveTo(0, -(a + b));
    ctx.lineTo(X - 40, -((X - 40) * a + b));
    ctx.stroke();
};

document.getElementById('lsm-reset').onclick = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
    datalist = [];
};
