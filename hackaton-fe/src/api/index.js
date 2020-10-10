import axios from 'axios';
import config from './config';
import qs from 'qs';

export const api = {
  get,
  post,
  post_noAuth,
  put,
  patch,
  download,
  deleted,
};

async function get(apiEndpoint){
  try {
    const response = await axios.get(config.baseUrl+apiEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access')
      }
    });
    return response;
  } catch (error) {
    return Promise.reject(error.response);
  }  
}

function put(apiEndpoint, payload) {
  return axios.put(config.baseUrl+apiEndpoint, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    }
  })
  .then((response) => {
    return response;
  }).catch((error) => {
    return Promise.reject(error.response);
  });
}

async function post_noAuth(apiEndpoint, payload) {
  try {
    const response = await axios({
      method: 'post',
      url: config.baseUrl+apiEndpoint,
      data: payload,
      headers: {'Content-Type': 'multipart/form-data' }
    })
    return response;
  } catch (error) {
    console.log(error)
    return Promise.reject(error.response); 
  }
}

async function post(apiEndpoint, payload) {
  try {
    const response = await axios({
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access'),
      },
      method: 'post',
      url: config.baseUrl+apiEndpoint,
      data: payload,
    })
    return response;
  } catch (error) {
    return Promise.reject(error.response);
  }
}

function download(apiEndpoint, payload) {
  return axios.post(config.baseUrl+apiEndpoint, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    },
    responseType: 'blob',
  })
  .then((response) => {
    return response;
  }).catch((error) => {
    return Promise.reject(error.response);
  });
}

function patch(apiEndpoint, body){
  return axios({
    method: 'PATCH',
    url: config.baseUrl+apiEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    },
    data: qs.stringify(body),
  })
  .then((response) => {
    return response;
  }).catch((error) => {
    return Promise.reject(error.response);
  });
}

function deleted(apiEndpoint, body) {
  return axios({
    method: 'DELETE',
    url: config.baseUrl+apiEndpoint,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + localStorage.getItem('access'),
    },
    data: qs.stringify(body),
  })
  .then((response) => {
    return response;
  }).catch((error) => {
    return Promise.reject(error.response);
  });
}
