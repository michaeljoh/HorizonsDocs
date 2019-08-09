function socket(io) {
    io.on('connection', (client) => {
        console.log('a user connected');
    });
}
    
module.exports = socket;
