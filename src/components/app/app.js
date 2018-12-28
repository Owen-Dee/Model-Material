import React from 'react';
import { MaterialReplace } from '../materialReplace';
import { Button } from 'antd';
import './app.scss';

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            visible: false,
            obsModelId: ''
        }
    }

    handleMaterialReplace(obsModelId) {
        this.setState({
            visible: true,
            obsModelId: obsModelId
        });
    }

    handleCloseModal() {
        this.setState({
            visible: false,
            obsModelId: ''
        });
    }

    render() {
        return(
            <div className="app">
                <div className="model">
                    <div className="img">
                        <img src="https://qhyxpicoss.kujiale.com/r/2018/11/26/L4D1113ENDDVCAH5CFEJI4IK2LPH3WKSA8_1000x1000.jpg"/>
                    </div>
                    <div className="description">
                        <Button className="change-material"
                            onClick={this.handleMaterialReplace.bind(this, '3FO4K7DX3HRE')}>
                            3D Material Change
                        </Button>
                    </div>
                </div>
                
                <MaterialReplace visible={this.state.visible}
                    obsModelId={this.state.obsModelId}
                    onClick={this.handleCloseModal.bind(this)}>
                </MaterialReplace>
            </div>
        );
    }
}