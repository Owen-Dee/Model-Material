import { combineReducers } from 'redux';
import { operateMeshModel } from './meshModel';

const rootReducer = combineReducers({
	meshModel: operateMeshModel,
});

export default rootReducer;