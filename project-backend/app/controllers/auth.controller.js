const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const EmployeeService = require("../services/employee.service");
const ReaderService = require("../services/reader.service");
const ApiError = require("../api-error");

exports.login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next(new ApiError(400, "Thiếu tài khoản hoặc mật khẩu"));
    }

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const readerService = new ReaderService(MongoDB.client);

        let user = await employeeService.findByEmployee(username);
        if (user) {
            const matched = await bcrypt.compare(password, user.Password);
            if (matched) {
                delete user.Password;
                return res.send({ role: "admin", user });
            }
        }

        user = await readerService.findByReader(username);
        if (user) {
            const matched = await bcrypt.compare(password, user.Password);
            if (matched) {
                delete user.Password;
                return res.send({ role: "user", user});
            }
        }
        return next(new ApiError(401, "Sai tài khoản hoặc mật khẩu"));
    } catch (error) {
        return next(new ApiError(500, "Đăng nhập thất bại"));
    }
}