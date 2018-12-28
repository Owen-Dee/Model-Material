import React from 'react';
import { Collapse } from 'antd';
import store from '../../store';
import * as Actions from '../../actions';
import './materialCollapse.scss';

const Panel = Collapse.Panel;

export class MaterialCollapse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMeshModelId: '', // 选中的网格模型id
            imgSource: [
                {
                    key: 'm1',
                    material: 'material/m1.jpg',
                    imgUrl: require('./res/m1.jpg')
                },
                {
                    key: 'm2',
                    material: 'material/m2.jpg',
                    imgUrl: require('./res/m2.jpg')
                },
                {
                    key: 'm3',
                    material: 'material/m3.jpg',
                    imgUrl: require('./res/m3.jpg')
                },
                {
                    key: 'm4',
                    material: 'material/m4.jpg',
                    imgUrl: require('./res/m4.jpg')
                }
            ]
        };
        this.unsubscribe = store.subscribe(() => {
            this.setState({
                selectedMeshModelId: store.getState().meshModel.selectedMeshModelId,
            });
        });
    }

    componentWillUnmount() {
        this.unsubscribe(); // 解除监听
    }

    handleMaterialClick(item) {
        const material = item.material;
        store.dispatch(Actions.changeSelectedMeshModelMaterial(material));
    }

    getImgList() {
        const listItems = this.state.imgSource.map((item) =>
            <div className="img-control" key={item.key}
                onClick={this.handleMaterialClick.bind(this, item)}>
                <img src={item.imgUrl} className="img" />
            </div>
        );

        return listItems;
    }

    handlePanelChange(val) {
        if (!(val instanceof Array) || val.length < 2) {
            return;
        }

        const meshModelId = val[1];
        store.dispatch(Actions.changeSelectedMeshModelId(meshModelId));
    }

    render() {
        const listItems = this.getImgList();
        return(
            <Collapse className="material-collapse"
                activeKey={[this.state.selectedMeshModelId]}
                onChange={this.handlePanelChange.bind(this)}>
                <Panel header="枕套材质" key="5bc6f56d3cf8ab2821789ca1">
                    {listItems}
                </Panel>
                <Panel header="马甲材质" key="5bc6f56d3cf8ab2821789cae">
                    {listItems}
                </Panel>
                <Panel header="枕边材质" key="5bc6f56d3cf8ab2821789caa">
                    {listItems}
                </Panel>
            </Collapse>
        );
    }
}