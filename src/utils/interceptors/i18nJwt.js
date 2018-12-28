import tokenCache from '../token-cache';

const {
    accessToken
} = tokenCache.get();

// 可以使用axiosInstance.interceptor.use方法来注册的interceptor
const i18nJwt = (config) => {
    const { headers } = config;
    headers.Authorization = `Bearer ${accessToken}`;
    config.headers = headers;
    return config;
};

export default i18nJwt;
