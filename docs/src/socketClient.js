function socketClient(socket) {
    socket.on("connect", function () {
        console.log("I'm connected!!")
    })

}

export default socketClient;