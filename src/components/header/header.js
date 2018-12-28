import React from 'react';
import store from '../../store';
import * as Actions from '../../actions';
import './header.scss';

export class Header extends React.Component {
    componentWillUnmount() {
        const selectedMeshModelId = null;
        const material = null;
        const hoverComponentModelId = null;
        const modelId = null;
        const createdComponentIds = [];
        store.dispatch(Actions.changeSelectedMeshModelId(selectedMeshModelId));
        store.dispatch(Actions.changeSelectedMeshModelMaterial(material));
        store.dispatch(Actions.recordModelId(modelId));
        store.dispatch(Actions.recordCreatedComponents(createdComponentIds));
        store.dispatch(Actions.recordHoverComponentModelId(hoverComponentModelId));
    }

    handleCloseModal() {
        this.props.onClick();
    }

    render() {
        return(
            <div className="material-replace-header">
                <div className="title">Texture swap setting</div>
                <div className="close-modal">
                    <div className="close-btn" onClick={this.handleCloseModal.bind(this)}>×</div>
                </div>
            </div>
        );
    }
}