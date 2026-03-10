import platform from '../platform/index.js';
import utils from '../utils.js';
import isURLSameOrigin from './isURLSameOrigin.js';
import cookies from './cookies.js';
import buildFullPath from '../core/buildFullPath.js';
import mergeConfig from '../core/mergeConfig.js';
import AxiosHeaders from '../core/AxiosHeaders.js';
import buildURL from './buildURL.js';

export default (config) => {
  const newConfig = mergeConfig({}, config);
  const { data, withXSRFToken, xsrfHeaderName, xsrfCookieName, headers, auth } = newConfig;
  newConfig.headers = headers = AxiosHeaders.from(headers);
  newConfig.url = buildURL(buildFullPath(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);
  setAuthHeader(newConfig, auth);
  processFormData(newConfig, data);
  addXSRFHeader(newConfig, withXSRFToken, xsrfHeaderName, xsrfCookieName);
  return newConfig;
};

const setAuthHeader = (newConfig, auth) => {
  if (auth) {
    newConfig.headers.set('Authorization', 'Basic ' + btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : '')));
  }
};

const processFormData = (newConfig, data) => {
  if (utils.isFormData(data)) {
    if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
      newConfig.headers.setContentType(undefined);
    } else if (utils.isFunction(data.getHeaders)) {
      const formHeaders = data.getHeaders();
      const allowedHeaders = ['content-type', 'content-length'];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          newConfig.headers.set(key, val);
        }
      });
    }
  }
};

const addXSRFHeader = (newConfig, withXSRFToken, xsrfHeaderName, xsrfCookieName) => {
  if (platform.hasStandardBrowserEnv) {
    withXSRFToken && utils.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || (withXSRFToken !== false && isURLSameOrigin(newConfig.url))) {
      const xsrfValue = xsrfHeaderName && xsrfCookieName && cookies.read(xsrfCookieName);
      if (xsrfValue) {
        newConfig.headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
};
