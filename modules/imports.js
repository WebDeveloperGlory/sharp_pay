const { validParameter,
    generateFourDigitNumber,
    generateSixDigitNumber,
    generateLongCharUserID,
    bcryptMe,
    defaultTransport,
    generateTransactionRef
} = require("./appfunctions");
const connnectDB = require("./sqldb");
const baseUrl = "http://102.212.246.14:5000";
// const docs = [
//     {
//         name: "signup",
//         url: "/users/signup",
//         accepts: [
//             { parametr: "email", name: "email", info: "plain text", required: true },
//             { parametr: "firstName", name: "firstName", info: "plain text", required: true },
//             { parametr: "lastName", name: "lastName", info: "plain text", required: true },
//             { parametr: "phoneNumber", name: "phoneNumber", info: "plain text", required: true },
//             { parametr: "pswd", name: "Password", info: "plain text", required: true },
//             { parametr: "cpswd", name: "Confirm Password", info: "plain text", required: true },
//             { parametr: "reff", name: "referral Code", info: "6 character plain text", required: false },
//         ],
//         expectedReturn: {
//             status: true,
//             message: "Account succesfylly created please check your mail for verification code ",
//             data: { process: 1 }
//         },
//         returns: {
//             "status": false,
//             "message": "An account already exists with this email",
//             "data": {
//                 "proceed": 0
//             }
//         }
//     },
//     {
//         name: "signin",
//         url: "/users/signin",
//         accepts: [
//             { parametr: "email", name: "email", info: "plain text", required: true },
//             { parametr: "pswd", name: "Password", info: " plain text", required: true },
//         ],
//         expectedReturn: {
//             "status": false,
//             "message": "Login Successful.",
//             "data": {
//                 "id": "f52bf8f0ffbaae4bce2a9a0f7b4143a5",
//                 "name": "Tony Sexyy",
//                 "phone": "8144171295",
//                 "referralId": 250402,
//                 "referredBy": "---",
//                 "balance": "0",
//                 "proceed": 2
//             },
//             "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MmJmOGYwZmZiYWFlNGJjZTJhOWEwZjdiNDE0M2E1IiwiaWF0IjoxNzEzMTAyNTkxLCJleHAiOjE3MTMzNjE3OTF9.HOwmn-Dw-v5aOuMlv4QELG_D9RTjjizL2EtHO9VIdw0"
//         },
//         returns: {
//             "status": false,
//             "message": "Invalid login details",
//             "data": {
//                 "proceed": 0
//             }
//         }
//     },
//     {
//         name: "Resend Otp",
//         url: "/users/resend-otp",
//         accepts: [
//             { parametr: "email", name: "email", info: "plain text", required: true },
//             { parametr: "otp", name: "Password", info: "4 character plain text", required: true },
//         ],
//         expectedReturn:{status:false,message:"OTP sent"},
//         returns: {
//             "status": false,
//             "message": "Invalid Otp",
//         }
//     },
//     {
//         name: "Verify Otp",
//         url: "/users/verify-otp",
//         accepts: [
//             { parametr: "email", name: "email", info: "plain text", required: true },
//             { parametr: "otp", name: "Password", info: "4 character plain text", required: true },
//         ],
//         expectedReturn:{status:false,message:"Account successfully verified"},
//         returns: {
//             "status": false,
//             "message": "Invalid Otp",
//         }
//     },
//     {
//         name: "signin",
//         url: "/users/signin",
//         accepts: [
//             { parametr: "email", name: "email", info: "plain text", required: true },
//             { parametr: "pswd", name: "Password", info: " plain text", required: true },
//         ],
//         expectedReturn: {
//             "status": false,
//             "message": "Login Successful.",
//             "data": {
//                 "id": "f52bf8f0ffbaae4bce2a9a0f7b4143a5",
//                 "name": "Tony Sexyy",
//                 "phone": "8144171295",
//                 "referralId": 250402,
//                 "referredBy": "---",
//                 "balance": "0",
//                 "proceed": 2
//             },
//             "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY1MmJmOGYwZmZiYWFlNGJjZTJhOWEwZjdiNDE0M2E1IiwiaWF0IjoxNzEzMTAyNTkxLCJleHAiOjE3MTMzNjE3OTF9.HOwmn-Dw-v5aOuMlv4QELG_D9RTjjizL2EtHO9VIdw0"
//         },
//         returns: {
//             "status": false,
//             "message": "Invalid login details",
//             "data": {
//                 "proceed": 0
//             }
//         }
//     },
// ]

module.exports = {
    validParameter,
    connnectDB,
    generateFourDigitNumber,
    generateSixDigitNumber,
    generateLongCharUserID,
    generateTransactionRef,
    bcryptMe,
    defaultTransport,
    baseUrl
}
