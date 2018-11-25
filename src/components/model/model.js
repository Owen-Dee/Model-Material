import React from 'react';
import * as THREE from 'three';
import * as OrbitControls from 'three-orbitcontrols';
import * as OBJLoader from 'three-obj-loader';
import * as MTLLoader from 'three-mtl-loader';
import './index.css';

OBJLoader(THREE);

export default class Model extends React.Component {
    constructor(props) {
      super(props);
      this.renderer = null;
      this.width = 0;
      this.height = 0;
      this.camera = null;
      this.scene = null;
    }

    componentDidMount() {
        //1. 创建场景
        let scene = new THREE.Scene();

        // 第一种加载图片材质方式
        let texture = new THREE.Texture();
        let imgLoader = new THREE.ImageLoader();
        imgLoader.load('res/demo.jpg', (img) => {
            texture.image = img;
            texture.needsUpdate = true;
        });
        // 第二种加载图片材质方式
        var loader3 = new THREE.TextureLoader();
        var texture1 = loader3.load( 'res/demo4.jpg' );

        this.THREE = THREE;
        let loader = new this.THREE.OBJLoader(); // obj 模型加载器
        loader.load('grave_1.obj', (doorObj) => {
            // doorObj.scale.set(0.1, 0.1, 0.1);
            doorObj.position.x = -100;
            doorObj.position.y = -100;
            doorObj.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.material.map = texture1;
                }
            });
            scene.add(doorObj);
        });


        let loader2 = new MTLLoader(); // 材质加载器
        let loader4 = new this.THREE.OBJLoader();
        loader2.load('grave_1.mtl', (materials) => {
            materials.preload();
            loader4.setMaterials(materials);
            loader4.load('grave_1.obj', (doorObj) => {
                // doorObj.scale.set(0.1, 0.1, 0.1);
                doorObj.position.x = 100;
                doorObj.position.y = -100;
                scene.add(doorObj);
            });
        });

        //3. 添加点光源
        let light = new THREE.PointLight(0xffffff);
        light.position.set(300, 400, 200);
        scene.add(light);
        // 添加环境光
        scene.add(new THREE.AmbientLight(0xffffff));
        //4. 添加相机
        let camera = new THREE.PerspectiveCamera(400, 800 / 600, 1, 10000);
        camera.position.set(200, 200, 200);
        camera.lookAt(scene.position);
        //5. 添加渲染器
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(800, 600);
        renderer.setClearColor(0xffffff,1.0);
        this.mount.appendChild(renderer.domElement);

        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
        //6. 开始渲染
        this.startRender();
        // 7. 添加相机控制
        let controller = new OrbitControls(this.camera, this.renderer.domElement);
        controller.addEventListener('change', this.startRender.bind(this));
        this.animate = this.animate.bind(this);
        this.animate();
    }

    startRender() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(this.animate)
        this.startRender();
    }
    componentWillUnmount() {
      this.mount.removeChild(this.renderer.domElement)
    }

    initMount(mount) {
        this.mount = mount;
    }

    render() {
      return (
        <div className="canvas-frame" ref={(mount) => {this.mount = mount}} />
      )
    }
}