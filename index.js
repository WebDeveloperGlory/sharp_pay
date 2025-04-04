const http = require("http");
const https = require("https");
const fs = require("fs");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
// const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// const options = {
//     key: fs.readFileSync("/etc/letsencrypt/live/sharp-pay.com.ng/privkey.pem"),
//     cert: fs.readFileSync("/etc/letsencrypt/live/sharp-pay.com.ng/cert.pem"),
//     ca: fs.readFileSync("/etc/letsencrypt/live/sharp-pay.com.ng/fullchain.pem")  // Optional if required by your cert provider
// };

// const server = https.createServer(options,app);
const server = http.createServer(app);

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require("./modules/swaggerOptions");
const { AppRouter } = require("./router");
const swaggerSpec = swaggerJsdoc(swaggerOptions);
const path = require('path');

// web socket 
const { Server } = require("socket.io");
const { VerifySocketToken, getAllAdmins, fetchUsers } = require("./modules/appfunctions");
const { chatConnect } = require("./modules/chatsql");
const io = new Server(server, {
    cors: {
        origin: '*',  // Adjust origin for security in production
        methods: ["GET", "POST"]
    }
});

let onlineAdmins = new Map();
const users = new Map();  // To keep track of users
const messages = new Array();
const updateAdminList = async () => {
    try {
        const allAdmins = await getAllAdmins();  // Fetch all admins from the database
        const adminList = allAdmins.map(admin => ({
            id: admin.id,
            name: admin.name,
            online: onlineAdmins.has(String(admin.id)) // Check if admin is online
        }));
        io.emit('adminList', adminList);  // Send the updated admin list to all connected clients
    } catch (error) {
        console.error('Error fetching admins:', error);
    }
};
io.use(
    (socket, next) => {
        const token = socket.handshake.auth.token;

        if (token) {
            try {
                const user = VerifySocketToken(token);
                socket.user = { ...user.user, role: user.admin ? "admin" : "user" }
                next();
            } catch (err) {
                return next(err);
            }
        } else {
            return next(new Error('Authentication error'));
        }
    }
)
const getPreviousMessages = (id, admin) => {
    const previousMessages = messages.filter(mes => {
        return admin ? mes.adminId == id : mes.userId == id
    })

    for (var i = messages.length - 1; i >= 0; i--) {
        var tarMes = messages[i];
        if(!tarMes)
            break;
        const removeMessageFromList = admin ? tarMes.adminId == id : tarMes.userId == id;
        if (removeMessageFromList)
            messages.splice(i, 1);
    }
    return previousMessages;

}
io.on('connection', (socket) => {
    const user = socket.user;

    console.log(`${user.role} connected: ${user.email}`);

    // Handle Admin joining
    if (user.role === 'admin') {
        onlineAdmins.set(String(user.id), socket.id);  // Track online admin
        updateAdminList();  // Update the list of all admins and their online statu s
        const prevMessages = getPreviousMessages(user.id, true);
        socket.emit("newMessages", prevMessages);
    }

    // Handle User joining
    if (user.role === 'user') {
        users.set(user.id, socket.id);  // Track the user
        updateAdminList();  // Update the list of all admins and their online status
        const prevMessages = getPreviousMessages(user.id, false);
        socket.emit("newMessages", prevMessages);
    }


    socket.on('requestUserList', () => {
        console.log("Got event", user.id, user.role);
        if (user.role === 'admin') {
            fetchUsers().then(
                x => {
                    socket.emit("userList", x);
                }
            );
        }
    });

    socket.on('requestMessages', async ({ targetId }) => {
        const forAdmin = user.role === "admin";

        const chatPool = await chatConnect().getConnection();

        const [messages] = await chatPool.query("SELECT * FROM chats WHERE user_id = ? AND admin_id = ? ORDER BY created_at DESC LIMIT 0,100 ", forAdmin ? [targetId, user.id] : [user.id, targetId]);

        console.log("Got event v", user.id, user.role);
        socket.emit("newMessages", messages.map(mes => {
            return {
                text: mes.message,
                sender: user.role,
                time: new Date(mes.created_at).toLocaleTimeString().toLowerCase(),
                [forAdmin ? "userId" : "adminId"]: targetId
            }
        }));
        chatPool.release();
    });


    socket.on('sendMessage', async ({ adminId, text }) => {
        const adminSocketId = onlineAdmins.get(adminId);
        // console.log(onlineAdmins);
        // console.log(adminSocketId);

        const messageData = {
            text,
            sender: 'user',
            time: new Date().toLocaleTimeString().toLowerCase(),
            userId: socket.user.id,
            adminId
        }

        if (adminSocketId) {
          
            // Send the message to the specified admin
            io.to(adminSocketId).emit('receiveMessage', {
                text,
                sender: 'user',
                time: new Date().toLocaleTimeString().toLowerCase(),
                userId: socket.user.id
            });
        } else {
            messages.push(messageData);
        }
        let chatPool;
        try {
            chatPool = await chatConnect().getConnection();
            chatPool.query("INSERT INTO chats(user_id,admin_id,message) VALUES(?,?,?)", [messageData.userId, messageData.adminId, messageData.text]);
        } catch (err) {
            console.log(err);
        } finally {
            if (chatPool) {
                chatPool.release();
            }
        }
    });
    // socket.on("requestPrevmessages",async ({userId})=>{
    //     const userId = 
    //     let pool;
    //     try{
    //         //
    //         pool = await chatConnect().getConnection();

    //     }catch(err){
    //         //
    //     }finally{}
    // });

    socket.on('sendMessageFromAdmin', async ({ userId, text }) => {
        const userSocketId = users.get(userId);

        const messageData = {
            text,
            sender: 'admin',
            time: new Date().toLocaleTimeString().toLowerCase(),
            adminId: socket.user.id,
            userId
        }

        if (userSocketId) {
            // Send the message to the specified user
            io.to(userSocketId).emit('receiveMessage', {
                text,
                sender: 'admin',
                time: new Date().toLocaleTimeString().toLowerCase(),
                adminId: socket.user.id
            });
        }

        let chatPool;
        try {
            chatPool = await chatConnect().getConnection();
            chatPool.query("INSERT INTO chats(user_id,admin_id,message) VALUES(?,?,?)", [messageData.userId, messageData.adminId, messageData.text]);
        } catch (err) {
            console.log(err);
        } finally {
            if (chatPool) {
                chatPool.release();
            }
        }
    });

    socket.on('disconnect', () => {
        if (user.role === 'admin') {
            onlineAdmins.delete(String(user.id));  // Remove admin from online list
            updateAdminList();  // Update the admin list for all users
        }

        if (user.role === 'user') {
            users.delete(String(user.id));  // Remove user from list
            updateAdminList();  // Update the admin list for all users
        }

        console.log(`${user.role} disconnected: ${user.email}`);
    });
})
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// const { sellCoin, getCoinRoute, getUserInfoRoute, addBankAcc, setPasscode, passcodeSignin, buycoin, buySellHistory } = require("./modules/approutes");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use('/', AppRouter);



app.get("/test/testapp", (req, res) => {
    res.status(200).json({ status: true, message: "Node js set for development !" });
    res.end();
})


server.listen(PORT, () => { console.log("running on port " + PORT) });
