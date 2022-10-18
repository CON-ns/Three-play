import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import envTop from "./envMap/top.png";
import envBottom from "./envMap/bottom.png";
import envRight from "./envMap/right.png";
import envLeft from "./envMap/left.png";
import envFront from "./envMap/front.png";
import envBack from "./envMap/back.png";



let camera, scene, renderer,pointLight,diamond,diamond2,diamond3;

//canvasを定義
const canvas = document.getElementById("canvas");

//サイズを定義
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

init();
animate();

function init() {
  //シーンを定義
  scene = new THREE.Scene();

  //カメラ
  const fov = 50; //視野角(degree)
  const aspect = sizes.width / sizes.height; //アスペクト比
  const near = 1; //撮影開始距離
  const far = 1000; //撮影終了距離
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far); //カメラを定義
  scene.add(camera); //カメラをシーンに追加
  camera.position.z = -30; //カメラの位置を変更

  //レンダラーを定義
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true, //アンチエイリアスを適応
  });
  renderer.setSize(sizes.width, sizes.height); //サイズを指定
  renderer.setPixelRatio(window.devicePixelRatio); //アスペクト比を指定

  //envimages
  const urls = [
    envRight,
    envLeft,
    envTop,
    envBottom,
    envBack,
    envFront,
  ];

  //環境キューブマッピングを実行
  const textureCube = new THREE.CubeTextureLoader().load(urls);
  textureCube.mapping = THREE.CubeRefractionMapping;
  scene.background = textureCube;

  //ライトを定義
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);

  pointLight = new THREE.PointLight(0xffffff, 2);
  scene.add(pointLight);

  //ジオメトリを定義
  const sphere = new THREE.SphereGeometry(10, 16, 8);

  //メッシュ化
  const mesh = new THREE.Mesh(
    sphere,
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  mesh.scale.set(0.05, 0.05, 0.05);
  pointLight.intensity = 1.5;
  pointLight.add(mesh); //ポイントライトにメッシュを追加

  // material samples
  const cubeMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xf5f5f5,
    envMap: textureCube,
    refractionRatio: 0.98,
    refractionRatio: 0.9,
  });
  const cubeMaterial2 = new THREE.MeshPhongMaterial({
    color: 0xb0c4de,
    envMap: textureCube,
    refractionRatio: 0.985,
  });
  const cubeMaterial3 = new THREE.MeshPhongMaterial({
    color: 0xffa07a,
    envMap: textureCube,
    refractionRatio: 0.98,
    reflectivity: 0.9,
  });

  //デバッグを追加
  const gui = new GUI();
  gui.addColor(cubeMaterial1, "color").name("center");
  gui.addColor(cubeMaterial2, "color").name("left");
  gui.addColor(cubeMaterial3, "color").name("right");

  
  //オブジェクトの生成
  const diamondTop = new THREE.ConeGeometry(5,9,6,1);
  const diaTop1 = new THREE.Mesh(diamondTop, cubeMaterial1);
  const diaBottom = diaTop1.clone();
  const diaTop2 = new THREE.Mesh(diamondTop, cubeMaterial2);
  const diaBottom2 = diaTop2.clone();
  const diaTop3 = new THREE.Mesh(diamondTop, cubeMaterial3);
  const diaBottom3 = diaTop3.clone();

  diaTop1.position.y = 7;
  diaBottom.position.y = -2;
  diaBottom.rotation.x = Math.PI;
  scene.add(diaTop1, diaBottom);
  diaTop2.position.y = 7;
  diaBottom2.position.y = -2;
  diaBottom2.rotation.x = Math.PI;
  scene.add(diaTop2, diaBottom2);
  diaTop3.position.y = 7;
  diaBottom3.position.y = -2;
  diaBottom3.rotation.x = Math.PI;
  scene.add(diaTop3, diaBottom3);
  
  diamond = new THREE.Group();
  diamond.add(diaTop1, diaBottom);
  diamond2 = new THREE.Group();
  diamond2.add(diaTop2, diaBottom2);
  diamond3 = new THREE.Group();
  diamond3.add(diaTop3, diaBottom3);
  scene.add(diamond, diamond2, diamond3);
  diamond2.position.x = 15;
  diamond3.position.x = -15;

}

/*
マウスでカメラ操作を有効化する
*/
const orbitControls = new OrbitControls(camera, renderer.domElement); //マウス操作用のorbitControlsを定義
orbitControls.enableDamping = true;

/*
ブラウザのリサイズに対応
*/
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//アニメーションを定義
function animate() {
  requestAnimationFrame(animate);
  render();
}

function render() {
  const timer = -0.0002 * Date.now();
  camera.lookAt(scene.position);
  diamond.rotation.y = timer;
  diamond2.rotation.y = timer;
  diamond3.rotation.y = timer;
  pointLight.position.x = 100 * Math.cos(timer);
  pointLight.position.z = 100 * Math.sin(timer);
  renderer.render(scene, camera);
}
