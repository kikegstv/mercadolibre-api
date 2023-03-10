function success (req, res, message, status) {
    res.status(status || 200).send({
        error: '',
        body: message
    });
}

function error (req, res, message, status) {
    res.status(status || 500).send({
        error: message,
        body: ''
    });
}

export {success, error};