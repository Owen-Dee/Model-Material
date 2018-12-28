import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const StoreConfig = () => {
    return createStore(
        rootReducer,
        applyMiddleware(thunk)
    );
}

const store = StoreConfig();

export default store;