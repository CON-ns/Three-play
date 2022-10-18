import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { TDSLoader } from "three/addons/loaders/TDSLoader.js";
import envTop from "./envMap/top.png";
import envBottom from "./envMap/bottom.png";
import envRight from "./envMap/right.png";
import envLeft from "./envMap/left.png";
import envFront from "./envMap/front.png";
import envBack from "./envMap/back.png";

let camera, scene, renderer,pointLight;

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
  camera.position.z = -10; //カメラの位置を変更

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
    envFront,
    envBack,
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
  pointLight.intensity = 0.7;
  pointLight.add(mesh); //ポイントライトにメッシュを追加

  // material samples
  const cubeMaterial1 = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    envMap: textureCube,
    refractionRatio: 0.98,
    refractionRatio: 0.9,
  });
  const cubeMaterial2 = new THREE.MeshPhongMaterial({
    color: 0xccfffd,
    envMap: textureCube,
    refractionRatio: 0.985,
  });
  const cubeMaterial3 = new THREE.MeshPhongMaterial({
    color: 0xccddff,
    envMap: textureCube,
    refractionRatio: 0.98,
    reflectivity: 0.9,
  });
  const cubeMaterial4 = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    envMap: textureCube,
    transmission: 1,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.5,
    thickness: 0.01,
    specularIntensity: 1,
    specularColor: 0xffffff,
    envMapIntensity: 1,
    lightIntensity: 1,
    exposure: 1,
  });
  const cubeMaterial5 = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    envMap: textureCube,
    refractionRatio: 0.95,
  });

  //モデルデータの読み込み
  const loader = new PLYLoader();
  loader.load("ply/Wolf_One_ply.ply", function (geometry) {
    createScene(geometry, cubeMaterial4);
  });
}

function createScene(geometry, m1) {
  geometry.computeVertexNormals();

  const s = 8;

  let wolf = new THREE.Mesh(geometry, m1);
  wolf.scale.x = wolf.scale.y = wolf.scale.z = s;
  wolf.rotation.x = (Math.PI / 2) * 3;
  wolf.rotation.z = Math.PI / 2;
  wolf.position.y = -2;
  scene.add(wolf);
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
  // camera.position.x = Math.sin(Math.PI * 0.1 * timer) * 10;
  // camera.position.z = Math.cos(Math.PI * 0.1 * timer) * 7;
  pointLight.position.x = 100 * Math.cos(timer);
  pointLight.position.z = 100 * Math.sin(timer);

  renderer.render(scene, camera);
}
