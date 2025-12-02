const bcrypt = require("bcryptjs");

class EmployeeService {
  constructor(client) {
    this.Employee = client.db().collection("nhanvien");
    this.Employee.createIndex({ MSNV: 1 }, { unique: true });
  }

  extractData(payload) {
    const employee = {
      MSNV: payload.MSNV,
      HoTenNV: payload.HoTenNV,
      Password: payload.Password,
      Chucvu: payload.Chucvu,
      Diachi: payload.Diachi,
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

  async update(msnv, payload) {
    const update = this.extractData(payload);

    if (update.Password) {
      const salt = await bcrypt.genSalt(10);
      update.Password = await bcrypt.hash(update.Password, salt);
    }

    const result = await this.Employee.findOneAndUpdate(
      { MSNV: msnv },
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(msnv) {
    const result = await this.Employee.findOneAndDelete({ MSNV: msnv });
    return result;
  }

  async deleteAll() {
    const result = await this.Employee.deleteMany({});
    return result;
  }
}

module.exports = EmployeeService;
