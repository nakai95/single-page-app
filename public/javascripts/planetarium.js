// ページの読み込みを待つ
window.addEventListener('load', init);

document.getElementById('show-pla').onclick = function () {
    const chatArticle = document.getElementById('chat');
    chatArticle.style.display = 'none';
    const msg = document.getElementById('messages');
    msg.innerHTML = '';
    const graphArticle = document.getElementById('graph');
    graphArticle.style.display = 'none';
    const planetariumArticle = document.getElementById('planetarium');
    planetariumArticle.style.display = 'block';
};

// サイズを指定
const w = $('.pla-article').width();
const h = $('.pla-article').height();
$('#canvas').attr('width', w);
$('#canvas').attr('height', h);
const width = document.getElementById('canvas').width;
const height = document.getElementById('canvas').height;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
};
function getRadian(degrees) {
    return degrees * Math.PI / 180;
};
let rat = 0;

function init() {
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#canvas')
    });
    renderer.setSize(width, height);

    // シーンを作成
    const scene = new THREE.Scene();

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    camera.position.set(0, 0, +1000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    // 光源
    const pointLight = new THREE.PointLight(0x3cb371,2.0, 0, 1.0);
    pointLight.position.set(0, 0, 0);
    const spotLight = new THREE.SpotLight(0xffffff, 2, 1000, Math.PI / 2, 10, 0.5);
    spotLight.position.set(-800, 200, 200);
    const ambientLight = new THREE.AmbientLight(0x3cb371, 0.15);
    // シーンに追加
    scene.add(pointLight);
    scene.add(spotLight);
    scene.add(ambientLight);

    let geometry = new THREE.SphereGeometry(80, 30, 30);
    let material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('moonmap1k.jpg')
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    let boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    let boxMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });

    let radrate = 0.001;

    let boxObj = function(){
        this.scale = getRandomArbitrary(10, 25);
        this.rad = getRadian(getRandomArbitrary(0, 360));
        this.rad2 = getRadian(getRandomArbitrary(0, 360));
        this.r = 250;
        this.radAccel = getRandomArbitrary(0, 1);
        this.x = Math.cos(this.rad) * Math.cos(this.rad2) * this.r;
        this.y = Math.cos(this.rad) * Math.sin(this.rad2) * this.r; 
        this.z = Math.sin(this.rad) * this.r;
        this.mesh = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(mesh);

        this.changeScale = function() {
            this.mesh.scale.x = this.scale;
            this.mesh.scale.y = this.scale;
            this.mesh.scale.z = this.scale;
        };

        this.changeRad = function() {
            this.rad += radrate*this.radAccel;
            this.rad2 += radrate*(1-this.radAccel);
        };
    
        this.changePosition = function() {
            this.x = Math.cos(this.rad) * Math.cos(this.rad2) * this.r;
            this.y = Math.cos(this.rad) * Math.sin(this.rad2) * this.r; 
            this.z = Math.sin(this.rad) * this.r
        };

        this.setPosition = function() {
            this.mesh.position.set(this.x, this.y, this.z);
        };

        this.setRotation = function() {
            this.mesh.rotation.set(this.rad,this.rad,this.rad); 
        };
    };

    let boxArray = [];
    let boxNum = 0;
    let xxxflag = false;
    let xxxrate = 300;
    var audio = new Audio('free_music.mp3');
    document.getElementById('in').onclick = function() {
        audio.play();
        boxArray[boxNum] = new boxObj();
        boxArray[boxNum].changeScale();
        boxArray[boxNum].setPosition();
        scene.add(boxArray[boxNum].mesh);
        boxNum++;
    };

    document.getElementById('reset').onclick = function() {
        audio.pause();
        audio.currentTime = 0;  
        for (const elem of boxArray) {
            scene.remove(elem.mesh);
          }
        boxArray = null;
        boxArray = [];
        boxNum = 0;
        xxxflag = false;
    };

    document.getElementById('xxx').onclick = function() {
        if(xxxflag){
            xxxflag = false;
        } else {
            xxxflag = true;
        }
    };

    const volume = document.getElementById('volume');
    volume.addEventListener('change', function () {
      audio.volume = volume.value;
    }, false);
     
    // 星屑を作成します (カメラの動きをわかりやすくするため)
    createStarField();

    tick();

    // 毎フレーム時に実行されるループイベントです
    function tick() {
        if(xxxflag){
            if(xxxrate>120){
                xxxrate -= 0.5;
                radrate += 0.0001;
            }
        } else {
            if(xxxrate<300){
                xxxrate += 0.5;
                radrate -= 0.0001;
            }
        }

        if(boxArray!=null){
            for(let i=0;i<boxArray.length;i++){
                boxArray[i].r = xxxrate;
                boxArray[i].changeRad();
                boxArray[i].changePosition();
                boxArray[i].setPosition();
                boxArray[i].setRotation();
                scene.add(boxArray[i].mesh);
            }
        }
        rat += 0.01; // 毎フレーム角度を0.5度ずつ足していく
        // ラジアンに変換する
        const radian = (rat * Math.PI) / 180;
        // 角度に応じてカメラの位置を設定
        camera.position.x = 1000 * Math.sin(radian);
        camera.position.z = 1000 * Math.cos(radian);
        mesh.rotation.set(Math.cos(radian),Math.cos(radian),Math.cos(radian)); 
        // 原点方向を見つめる
        camera.lookAt(new THREE.Vector3(0, 0, 0));
        scene.add(mesh);

        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame(tick);
    }


    function createStarField() {
        // 形状データを作成
        const geometry = new THREE.Geometry();
        for (let i = 0; i < 1000; i++) {
        geometry.vertices.push(
            new THREE.Vector3(
                3000 * (Math.random() - 0.5),
                3000 * (Math.random() - 0.5),
                3000 * (Math.random() - 0.5)
            ));
        }
        // マテリアルを作成
        const material = new THREE.PointsMaterial({
            size: 5,
            color: 0xffffff
        });

        // 物体を作成
        const mesh = new THREE.Points(geometry, material);
        scene.add(mesh);
    }
}
