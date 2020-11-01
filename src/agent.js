import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

//const API_ROOT = 'https://conduit.productionready.io/api';
//
// Use:
//
//  chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
//
// To suppress the CORS warning, since the API has an Access-Control-Allow-Origin
// and it comes from http:// not https://
//
const API_ROOT = 'http://3.232.56.22:8081/api';

//const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) => 
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: () =>
    requests.get('/user'),
  login: (username, password) =>
    requests.post('/users/login', { username, password } ),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const formatDate = date => {
    let yy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    return yy + "_" + mm + "_" + dd;
}

const formatFilters = filters => {
    let str = filters.map(({index, name, value}, i) =>
        "t." + (i+1) + ".k=" + index + "&t." + (i+1) + ".v=" + value.join(";"));

    return str.join("&");
}

const formatSorting = sorting => {
    let str = '';

    if (sorting) {
        str += '&column=c' + sorting.index + '&sorting=' + sorting.sorting;
    }

    return str;
}

const Charts = {
    all: (startDate, endDate) =>
        requests.get(`/reports/charts?start=${formatDate(startDate)}&end=${formatDate(endDate)}`),
    filtered: (startDate, endDate, filters) =>
        requests.get(`/reports/charts?start=${formatDate(startDate)}&end=${formatDate(endDate)}&${formatFilters(filters)}`)
};

const Tables = {
    all: (startDate, endDate) =>
        requests.get(`/reports/tables?start=${formatDate(startDate)}&end=${formatDate(endDate)}`),
    filtered: (startDate, endDate, filters) =>
        requests.get(`/reports/tables?start=${formatDate(startDate)}&end=${formatDate(endDate)}&${formatFilters(filters)}`)
}

const DetailedTable = {
    all: (startDate, endDate, index, sorting) =>
        requests.get(`/reports/tables/${index}?start=${formatDate(startDate)}&end=${formatDate(endDate)}${formatSorting(sorting)}`),
    filtered: (startDate, endDate, index, sorting, filters) =>
        requests.get(`/reports/tables/${index}?start=${formatDate(startDate)}&end=${formatDate(endDate)}${formatSorting(sorting)}&${formatFilters(filters)}`)
}

const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`)
};

export default {
  Charts,
  Tables,
  DetailedTable,
  Auth,
  Profile,
  setToken: _token => { token = _token; }
};
