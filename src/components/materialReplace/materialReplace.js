import React from 'react';
import { Modal } from 'antd';
import { Header } from '../header';
import { MaterialCollapse } from '../materialCollapse';
import { ModelViewer } from '../modelViewer';
import './materialReplace.scss';

export class MaterialReplace extends React.Component {
    render() {
        if (!this.props.obsModelId) {
            return '';
        }

        return(
            <Modal className="material-replace-modal"
                destroyOnClose="true"
                visible={this.props.visible}>
                <Header onClick={this.props.onClick}></Header>
                <div className="model-content">
                    <ModelViewer obsModelId={this.props.obsModelId}></ModelViewer>
                    <MaterialCollapse obsModelId={this.props.obsModelId} onClick={this.props.onClick}></MaterialCollapse>
                </div>
            </Modal>
        );
    }
}