class ApiSuccess {
    constructor(status, message, response) {
        this.status = status;
        this.message = message;
        this.response = response;
    }

    static created(res) {
        return new ApiSuccess(201,'Created Successfully', res);
    }
    static ok(res) {
        return new ApiSuccess(200,'Success', res);
    }
    static accepted(res) {
        return new ApiSuccess(201,'Accepted', res);
    }
}

module.exports = ApiSuccess;