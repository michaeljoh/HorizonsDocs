function (socket) {
    socket.on("connect", function () {
        console.log("I'm connected!!")
    })

}

export default socket;