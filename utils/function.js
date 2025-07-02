const generateOtp = ()=> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString().substring(0,6)

    return otp
}

module.exports = {generateOtp}