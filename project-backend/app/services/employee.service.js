const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class EmployeeService{
    constructor(client) {
        this.Employee = client.db().collection("nhanvien");
        this.Employee.createIndex({ MSNV: 1 }, { unique: true });
    }

    extractData(payload) {
        const employee = {
            MSNV: payload.MSNV,
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        };

        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return employee;
    }

    async create(payload) {
        const data = this.extractData(payload);

        if (data.Password) {
            const salt = await bcrypt.genSalt(10);
            data.Password = await bcrypt.hash(data.Password, salt);
        }

        const result = await this.Employee.insertOne(data);
        return result;
    }

    async find(filter) {
        const cursor = await this.Employee.find(filter);
        return await cursor.toArray();
    }

    async findAll() {
        return await this.find({});
    }

    async findByEmployee(msnv) {
        return await this.Employee.findOne({ MSNV: msnv });
    }

    async findById(id) {
        return await this.Employee.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractData(payload);
        if (update.Password) {
            const salt = await bcrypt.genSalt(10);
            update.Password = await bcrypt.hash(update.Password, salt);
        }
        const result = await this.Employee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Employee.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Employee.deleteMany({});
        return result;
    }
}

module.exports = EmployeeService;