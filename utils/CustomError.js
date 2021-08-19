// Note: Custom error class with basic fields 
class CustomError extends Error {
    constructor(msg, code) {
        this.msg = msg;
        this.code = code;
    }
}

module.exports = CustomError;