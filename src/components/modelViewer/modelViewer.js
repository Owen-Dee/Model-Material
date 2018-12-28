import React from 'react';
import * as THREE from 'three';
import * as TrackballControls from 'three-trackballcontrols';
import * as OBJLoader from 'three-obj-loader';
import store from '../../store';
import * as Actions from '../../actions';
import ModelCollections from './config';
import './modelViewer.scss';

OBJLoader(THREE);

const MY = {
    MIN_DIST: 1,
    MAX_DIST: 1000,
    SPACE_SIZE: 100,
    OBJ_RATIO_IN_SPACE: 0.9
};

export class ModelViewer extends React.Component {
    constructor(props) {
        super(props);

        this.THREE = THREE; // 保存three库
        this.modelCollections = ModelCollections; // 记录模型数据
        this.renderer = null; // 渲染器
        this.width = 0; // canvas 宽度
        this.height = 0; // canvas 高度
        this.camera = null; // 记录相机
        this.scene = null; //记录场景
        this.controllerRotateSpeed = 2.5; // 控制器的旋转速度
        this.meshHashMap = {}; // 记录材质id对应的模型mesh
        this.selectedMeshModel = {};// 记录被选中的模型

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.objGroup = new THREE.Group();
        this.modelBBoxSize = 0; // 包裹模型盒子的大小
        this.posOffsetY = 0; // 记录y轴的偏移量
        this.raotOffsetX = 0; // 记录x轴的旋转弧度
        this.scaleRatio = 0; // 模型的缩放比例

        this.state = {
            material: '', // 模型材质
            selectedMeshModelId: '', // 记录被选中的模型id
            models: []
        };
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                material: store.getState().meshModel.material,
                selectedMeshModelId: store.getState().meshModel.selectedMeshModelId,
                models: store.getState().meshModel.models
            }, () => {
                this.changeMaterial();
                this.hightLightMeshModel(this.state.selectedMeshModelId);
            });
        });
    }

    componentDidMount() {
        this.initThree();
        this.initScene();
        this.initCamera();
        this.initLight();
        this.initObject();
        this.initControllers();
        this.animate = this.animate.bind(this);
        this.animate();
        this.addEventListener();
    }

    componentWillUnmount() {
        this.unsubscribe(); // 解除监听
    }

    initThree() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;
        const renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setSize(width, height);
        renderer.setClearColor(0xf2f2f2, 1.0);
        this.mount.appendChild(renderer.domElement);

        this.renderer = renderer;
        this.width = width;
        this.height = height;
    }

    initScene() {
        const scene = new THREE.Scene();
        this.scene = scene;
    }

    initCamera() {
        const cameraDefaults = {
            fov: 45, //视角
            aspectRatio: 1, // 纵横比
            near: 1, // 近平面
            far: 1000 // 远平面
        };

        const camera = new THREE.PerspectiveCamera(cameraDefaults.fov, cameraDefaults.aspectRatio, cameraDefaults.near, cameraDefaults.far);
        camera.position.set(-200, 200, 200);
        camera.lookAt(this.scene.position);
        this.camera = camera;
    }

    initLight() {
        // 添加点光源
        const light = new THREE.PointLight(0xffffff); // 0xffffff: 白光
        light.position.set(300, 400, 200);
        this.scene.add(light);
        // 添加环境光
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        // 添加模拟太阳发出的光源
        var directionalLight = new THREE.DirectionalLight( 0xC0C090 );
        directionalLight.position.set(100, 50, -100);
        this.scene.add(directionalLight);
    }

    initObject() {
        let objLoader = new this.THREE.OBJLoader(); // obj 模型加载器
        let promises = [];
        this.modelCollections.forEach((model) => {
            let promise = new Promise((resolve, reject) => {
                objLoader.load(model.objPath, (obj) => {
                    const mesh = obj.children instanceof Array ? obj.children[0] : {};
                    this.meshHashMap[model.materialId] = mesh; // 保存模型数据
                    mesh.textureUrl = model.textureUrl;
                    mesh.name = model.materialId; // 将mesh的name属性替换成模型的材质Id,用于之后点击模型时所用
                    resolve(mesh);
                });
            });

            promises.push(promise);
        });

        Promise.all(promises).then((result) => {
            if (!result || result.length === 0) {
                return;
            }

            result.forEach((mesh) => {
                if (mesh instanceof THREE.Mesh ) {
                    this.loadModelTexture(mesh.textureUrl, mesh);
                }

                this.objGroup.add(mesh);
            });

            this.calcModelSize();
            this.setModelScale();
            this.scene.add(this.objGroup);
            // 添加网格
            const gridHelper = new THREE.GridHelper(150, 20, 0xcccccc, 0xe5dad5);
            gridHelper.position.set(0, (-this.modelBBoxSize.y / 2) * this.scaleRatio, 0);
            this.scene.add(gridHelper);
        });
    }

    initControllers() {
        const controllers = new TrackballControls(this.camera, this.renderer.domElement);
        controllers.rotateSpeed = this.controllerRotateSpeed;
        controllers.addEventListener('change', this.startRender.bind(this));
        this.controllers = controllers;
    }

    calcModelSize() {
        const modelBBox = new THREE.Box3().setFromObject(this.objGroup);
        this.modelBBoxSize = modelBBox.getSize();
        const bBoxMax = Math.max(this.modelBBoxSize.x, this.modelBBoxSize.y, this.modelBBoxSize.z);
        this.scaleRatio = 1 / bBoxMax * MY.OBJ_RATIO_IN_SPACE * MY.SPACE_SIZE;
        this.posOffsetY = (this.modelBBoxSize.z - this.modelBBoxSize.y) * this.scaleRatio / 2;
        this.raotOffsetX = -90 * Math.PI / 180;
    }

    setModelScale() {
        this.objGroup.scale.multiplyScalar(this.scaleRatio);
        this.objGroup.rotation.x = this.raotOffsetX;
        this.objGroup.position.y = this.posOffsetY;
    }

    loadModelTexture(textureUrl, obj) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(textureUrl);
        obj.material.map = texture;
    }

    startRender() {
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        this.controllers.update();
        window.requestAnimationFrame(this.animate);
        this.startRender();
    }
    componentWillUnmount() {
      this.mount.removeChild(this.renderer.domElement)
    }

    onMouseClick(event) {
        //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
        this.mouse.x = (event.offsetX / this.width) * 2 - 1;
        this.mouse.y = -(event.offsetY / this.height) * 2 + 1;
        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.objGroup.children, false);
        //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
        let meshModelId = null;
        if (intersects.length > 0) {
            const intersect = intersects[0];
            meshModelId = intersect.object.name;
        }

        this.hightLightMeshModel(meshModelId);
        // // 记录被选中的网状模型
        const mesh = this.meshHashMap[meshModelId];
        if (!mesh) {
            return;
        }
        const material = mesh.textureUrl;
        // 更改全局状态的相关数据
        store.dispatch(Actions.changeSelectedMeshModelId(meshModelId));
        store.dispatch(Actions.changeSelectedMeshModelMaterial(material));
    }

    hightLightMeshModel(meshModelId) {
        const mesh = this.meshHashMap[meshModelId];
        if (!mesh) {
            return;
        }
        // 网状模型已被选中就不再再次选中
        if (this.selectedMeshModel[meshModelId]) {
            return;
        }
        // 删除之前选中的模型
        if (this.selectedMeshModel) {
            for (let key in this.selectedMeshModel) {
                this.scene.remove(this.selectedMeshModel[key]);
                delete this.selectedMeshModel[key];
            }
        }

        let geometry = mesh.geometry;
        let wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x3b78e7,
            wireframe: true,
            transparent: true,
            opacity: 0.6,
            depthTest: true
        });
        let wireframeObj = new THREE.Mesh(geometry, wireframeMat);
        wireframeObj.material = wireframeMat;
        wireframeObj.scale.multiplyScalar(this.scaleRatio);
        wireframeObj.rotation.x = -90 * Math.PI / 180;
        wireframeObj.position.y = this.posOffsetY;
        this.scene.add(wireframeObj);
        // 记录被选中的网状模型
        this.selectedMeshModel[meshModelId] = wireframeObj;
    }

    addEventListener() {
        this.mount.addEventListener('click', this.onMouseClick.bind(this), false);
        window.addEventListener('resize', this.handleWindowResize.bind(this), false);
    }

    handleWindowResize() {
        if (!this.mount) {
            return;
        }

        this.width = this.mount.clientWidth;
        this.height = this.mount.clientHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.controllers.handleResize();
    }

    changeMaterial() {
        let meshObj = this.meshHashMap[this.state.selectedMeshModelId];
        const textureUrl = this.state.material;
        if (!meshObj || !textureUrl) {
            return;
        }
        
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(textureUrl);
        // 贴图平铺方式设置为连续平铺
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        meshObj.material.map = texture;
        meshObj.material.needsUpdate = true;
        meshObj.textureUrl = textureUrl; // 更改材质后,记录下当前材质的url
    }

    render() {
        return (
            <div className="model-viewer-canvas" ref={(mount) => {this.mount = mount}} />
        )
    }
}