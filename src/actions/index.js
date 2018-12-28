import * as Constants from './constants';

/**
 * 改变被选中模型的id
 * @param {*} id : 被选中的模型id
 */
export function changeSelectedMeshModelId(id) {
    return {
        type: Constants.CHANGE_SELECTED_MESH_MODEL_ID,
        payLoad: id
    }
}

/**
 * 替换模型的材质
 * @param {*} material: 贴图材质 
 */
export function changeSelectedMeshModelMaterial(material) {
    return {
        type: Constants.CHANGE_SELECTED_MESH_MODEL_MATERAIL,
        payLoad: material
    }
}

/**
 * 记录整个模型id
 * @param {*} modelId 
 */
export function recordModelId(modelId) {
    return {
        type: Constants.RECORD_MODEL_ID,
        payLoad: modelId
    }
}

/**
 * 记录模型组件的材质替换信息
 * @param {*} componentReplaceInfos: 模型材质替换信息
 */
export function recordComponentReplaceInfo(componentReplaceInfos) {
    return {
        type: Constants.RECORD_COMPONENT_REPLACE_INFO,
        payLoad: componentReplaceInfos
    }
}

/**
 * 记录鼠标hover到材质折叠面板头部的模型组件id
 * @param {*} hoverComponentModelId : 模型组件id
 */
export function recordHoverComponentModelId(hoverComponentModelId) {
    return {
        type: Constants.RECORD_HOVER_COMPONENT_MODEL_ID,
        payLoad: hoverComponentModelId
    }
}

/**
 * 记录已创建模型部位名称的信息
 * @param {*} val 
 */
export function recordCreatedComponents(val) {
    return {
        type: Constants.RECORD_CREATED_COMPONENTS,
        payLoad: val
    }
}