import * as Constants from '../actions/constants';

const initState = {
	selectedMeshModelId: '', //选中的网格模型id
	material: '', // 材质贴图
	models: [],// 显示的模型
	obsModelId: '', // 当前模型id
	componentReplaceInfos: [], //模型的材质替换信息
	modelId: '', // 整个模型的id
	createdComponentIds: []
};

export function operateMeshModel(state = initState, action) {
	switch (action.type) {
		case Constants.CHANGE_SELECTED_MESH_MODEL_ID:
			return {
				...state,
				selectedMeshModelId: action.payLoad
			};
		case Constants.CHANGE_SELECTED_MESH_MODEL_MATERAIL:
			return {
				...state,
				material: action.payLoad
			};
		case Constants.RECORD_COMPONENT_REPLACE_INFO:
			return {
				...state,
				componentReplaceInfos: action.payLoad
			};
		case Constants.RECORD_MODEL_ID:
			return {
				...state,
				modelId: action.payLoad
			};
		case Constants.RECORD_HOVER_COMPONENT_MODEL_ID:
			return {
				...state,
				hoverComponentModelId: action.payLoad
			};
		case Constants.RECORD_CREATED_COMPONENTS:
			return {
				...state,
				createdComponentIds: action.payLoad
			};
		default:
			break;
	}

	return state;
}