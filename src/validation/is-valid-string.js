module.exports = (input) => {
    if(typeof input !== 'string' || typeof input === 'number' || typeof input === 'object') {
        return false;
    }
    return true;
}