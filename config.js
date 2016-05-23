config = {
    mysql: {
        host: '127.0.0.1',
        port: '3306',
        database: 'pcg',
        charset: 'utf8_general_ci',
        user: 'root',
        password: 'ww3ww3',
        multipleStatements: true
    },
    listenport: 3000,
    redis_db: 0,
    redis_host: '127.0.0.1',
    redis_port: 6379,
    session_secret: 'pcg',
};

module.exports = config;