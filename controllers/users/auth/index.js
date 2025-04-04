const { deleteAccount } = require("./deleteAccount");
const { otpRouter } = require("./otp");
const { passcodeSigninRoute } = require("./passcodeSignin");
const { setPasscodeRoute } = require("./setPasscode");
const { sgin_in_up_route } = require("./sign-in-up");

const authRoute = require("express").Router();

authRoute.use("/",otpRouter);
authRoute.use("/",deleteAccount);
authRoute.use("/",sgin_in_up_route);
authRoute.use("/",setPasscodeRoute);
authRoute.use("/",passcodeSigninRoute);

module.exports = {
    authRoute
}