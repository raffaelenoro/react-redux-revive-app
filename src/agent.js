import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

//const API_ROOT = 'https://conduit.productionready.io/api';
const API_ROOT = 'http://3.232.56.22:8080/api';

const encode = encodeURIComponent;
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
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
  save: user =>
    requests.put('/user', { user })
};

const Tags = {
  getAll: () => requests.get('/tags')
};

//
// Pretending to make a request for charts...
// 
// creates a Promise where the resolve callback is called
// after 300ms with some data -- normally it is a request.get()
//
const get_charts = () => {
    let data = [{
        "name": "Billed",
        "index": 1,
        "units": "currency",
        "total": 505068,
        "data": {
            "x_data": [
                "2019-01-26","2019-01-27","2019-01-28","2019-01-29","2019-01-30","2019-01-31","2019-02-01","2019-02-02","2019-02-03","2019-02-04","2019-02-05","2019-02-06","2019-02-07","2019-02-08","2019-02-09","2019-02-10","2019-02-11","2019-02-12","2019-02-13","2019-02-14","2019-02-15","2019-02-16","2019-02-17","2019-02-18","2019-02-19","2019-02-20","2019-02-21","2019-02-22","2019-02-23","2019-02-24","2019-02-25","2019-02-26","2019-02-27"
            ],
            "y_data": [
                "15432","13656","14000","14091","10111","8581","17692","18651","18590","17296","16470","10632","9898","17341","15280","53208","10172","13529","15660","14523","14823","13407","10553","9484","14922","17572","16940","17079","16312","11270","8646","13458","15789"
            ]
        }
    }, {
        "name": "Dimension 3",
        "index": 3,
        "units": "currency",
        "total": 505068,
        "data": {
            "x_data": [
                "2019-01-26","2019-01-27","2019-01-28","2019-01-29","2019-01-30","2019-01-31","2019-02-01","2019-02-02","2019-02-03","2019-02-04","2019-02-05","2019-02-06","2019-02-07","2019-02-08","2019-02-09","2019-02-10","2019-02-11","2019-02-12","2019-02-13","2019-02-14","2019-02-15","2019-02-16","2019-02-17","2019-02-18","2019-02-19","2019-02-20","2019-02-21","2019-02-22","2019-02-23","2019-02-24","2019-02-25","2019-02-26","2019-02-27"
            ],
            "y_data": [
                "15432","13656","14000","14091","10111","8581","17692","18651","18590","17296","16470","10632","9898","17341","15280","53208","10172","13529","15660","14523","14823","13407","10553","9484","14922","17572","16940","17079","16312","11270","8646","13458","15789"
            ]
        }
    }, {
        "name": "Dimension 2",
        "index": 2,
        "units": "float",
        "total": 505068,
        "data": {
            "x_data": [
                "2019-01-26","2019-01-27","2019-01-28","2019-01-29","2019-01-30","2019-01-31","2019-02-01","2019-02-02","2019-02-03","2019-02-04","2019-02-05","2019-02-06","2019-02-07","2019-02-08","2019-02-09","2019-02-10","2019-02-11","2019-02-12","2019-02-13","2019-02-14","2019-02-15","2019-02-16","2019-02-17","2019-02-18","2019-02-19","2019-02-20","2019-02-21","2019-02-22","2019-02-23","2019-02-24","2019-02-25","2019-02-26","2019-02-27"
            ],
            "y_data": [
                "15432","13656","14000","14091","10111","8581","17692","18651","18590","17296","16470","10632","9898","17341","15280","53208","10172","13529","15660","14523","14823","13407","10553","9484","14922","17572","16940","17079","16312","11270","8646","13458","15789"
            ]
        }
    }, {
        "name": "Dimension 5",
        "index": 5,
        "units": "integer",
        "total": 505068,
        "data": {
            "x_data": [
                "2019-01-26","2019-01-27","2019-01-28","2019-01-29","2019-01-30","2019-01-31","2019-02-01","2019-02-02","2019-02-03","2019-02-04","2019-02-05","2019-02-06","2019-02-07","2019-02-08","2019-02-09","2019-02-10","2019-02-11","2019-02-12","2019-02-13","2019-02-14","2019-02-15","2019-02-16","2019-02-17","2019-02-18","2019-02-19","2019-02-20","2019-02-21","2019-02-22","2019-02-23","2019-02-24","2019-02-25","2019-02-26","2019-02-27"
            ],
            "y_data": [
                "15432","13656","14000","14091","10111","8581","17692","18651","18590","17296","16470","10632","9898","17341","15280","53208","10172","13529","15660","14523","14823","13407","10553","9484","14922","17572","16940","17079","16312","11270","8646","13458","15789"
            ]
        }
    }, {
        "name": "Dimension 4",
        "index": 4,
        "units": "currency",
        "total": 505068,
        "data": {
            "x_data": [
                "2019-01-26","2019-01-27","2019-01-28","2019-01-29","2019-01-30","2019-01-31","2019-02-01","2019-02-02","2019-02-03","2019-02-04","2019-02-05","2019-02-06","2019-02-07","2019-02-08","2019-02-09","2019-02-10","2019-02-11","2019-02-12","2019-02-13","2019-02-14","2019-02-15","2019-02-16","2019-02-17","2019-02-18","2019-02-19","2019-02-20","2019-02-21","2019-02-22","2019-02-23","2019-02-24","2019-02-25","2019-02-26","2019-02-27"
            ],
            "y_data": [
                "15432","13656","14000","14091","10111","8581","17692","18651","18590","17296","16470","10632","9898","17341","15280","53208","10172","13529","15660","14523","14823","13407","10553","9484","14922","17572","16940","17079","16312","11270","8646","13458","15789"
            ]
        }
    }];

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                charts: data,
                chartsCount: data.length
            });
        }, 3000);
    });
}
const Charts = {
    all: () => get_charts()
};

//
// Mimic again for the tables...
//
const get_tables = () => {
    let data = [{
        "name": "Gender",
        "index": 3,
        "units": "integer",
        "c1_name": "Gender",
        "c2_name": "Billed",
        "total": 503617,
        "data": [{"c1_data":"F","c2_data":"256073"},{"c1_data":"M","c2_data":"247544"}]
    }, {
        "name": "Procedure ID",
        "index": 4,
        "units": "integer",
        "c1_name": "Procedure ID",
        "c2_name": "Billed",
        "total": 483878,
        "data": [{"c1_data":268,"c2_data":"280377"},{"c1_data":265,"c2_data":"110424"},{"c1_data":184,"c2_data":"72480"},{"c1_data":262,"c2_data":"11993"},{"c1_data":266,"c2_data":"8604"}]
    }, {
        "name": "Facility ID",
        "index": 2,
        "units": "integer",
        "c1_name": "Facility ID",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }, {
        "name": "Table 1",
        "index": 5,
        "units": "integer",
        "c1_name": "Table 1",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }, {
        "name": "Diagnosis ID",
        "index": 1,
        "units": "integer",
        "c1_name": "Diagnosis ID",
        "c2_name": "Billed",
        "total": 288941,
        "data": [{"c1_data":16538,"c2_data":"224670"},{"c1_data":35521,"c2_data":"24263"},{"c1_data":13977,"c2_data":"18118"},{"c1_data":35431,"c2_data":"11139"},{"c1_data":23264,"c2_data":"10751"}]
    }, {
        "name": "Zip",
        "index": 10,
        "units": "integer",
        "c1_name": "Zip",
        "c2_name": "Billed",
        "total": 146359,
        "data": [{"c1_data":66104,"c2_data":"33857"},{"c1_data":66062,"c2_data":"33389"},{"c1_data":66061,"c2_data":"32570"},{"c1_data":66048,"c2_data":"26845"},{"c1_data":66212,"c2_data":"19698"}]
    }, {
        "name": "Table 2",
        "index": 6,
        "units": "integer",
        "c1_name": "Table 2",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }, {
        "name": "Table 3",
        "index": 7,
        "units": "integer",
        "c1_name": "Table 3",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }, {
        "name": "Table 4",
        "index": 8,
        "units": "integer",
        "c1_name": "Table 4",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }, {
        "name": "Table 5",
        "index": 9,
        "units": "integer",
        "c1_name": "Table 5",
        "c2_name": "Billed",
        "total": 503442,
        "data": [{"c1_data":4,"c2_data":"144392"},{"c1_data":6,"c2_data":"129698"},{"c1_data":7,"c2_data":"126244"},{"c1_data":5,"c2_data":"81387"},{"c1_data":3,"c2_data":"21721"}]
    }];

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                tables: data,
                tablesCount: data.length
            });
        }, 2000);
    });
}
const Tables = {
    all: (startDate, endDate) => {
        requests.get('/reports/tables?start=2019_01_25&end=2019_02_27');

        // Placeholder to ge removed when CORS is addressed...
        return get_tables();
    }
}

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const omitSlug = article => Object.assign({}, article, { slug: undefined })
const Articles = {
  all: page =>
    requests.get(`/articles?${limit(10, page)}`),
  byAuthor: (author, page) =>
    requests.get(`/articles?author=${encode(author)}&${limit(5, page)}`),
  byTag: (tag, page) =>
    requests.get(`/articles?tag=${encode(tag)}&${limit(10, page)}`),
  del: slug =>
    requests.del(`/articles/${slug}`),
  favorite: slug =>
    requests.post(`/articles/${slug}/favorite`),
  favoritedBy: (author, page) =>
    requests.get(`/articles?favorited=${encode(author)}&${limit(5, page)}`),
  feed: () =>
    requests.get('/articles/feed?limit=10&offset=0'),
  get: slug =>
    requests.get(`/articles/${slug}`),
  unfavorite: slug =>
    requests.del(`/articles/${slug}/favorite`),
  update: article =>
    requests.put(`/articles/${article.slug}`, { article: omitSlug(article) }),
  create: article =>
    requests.post('/articles', { article })
};

const Comments = {
  create: (slug, comment) =>
    requests.post(`/articles/${slug}/comments`, { comment }),
  delete: (slug, commentId) =>
    requests.del(`/articles/${slug}/comments/${commentId}`),
  forArticle: slug =>
    requests.get(`/articles/${slug}/comments`)
};

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
  Articles,
  Auth,
  Comments,
  Profile,
  Tags,
  setToken: _token => { token = _token; }
};
