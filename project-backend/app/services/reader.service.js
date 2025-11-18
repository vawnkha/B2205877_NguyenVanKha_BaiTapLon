const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

class ReaderService {
    constructor(client) {
        this.Reader = client.db().collection("docgia");
        this.Reader.createIndex({ MaDocGia: 1 }, { unique: true });
    }

    extractData(payload) {
        const reader = {
            MaDocGia: payload.MaDocGia,
            HoLot: payload.HoLot,
            Ten: payload.Ten,
            NgaySinh: payload.NgaySinh,
            Phai: payload.Phai,
            DiaChi: payload.DiaChi,
            DienThoai: payload.DienThoai,
            Password: payload.Password,
        };

        Object.keys(reader).forEach(
            (key) => reader[key] === undefined && delete reader[key]
        );

        return reader;
    }

    async create(payload) {
        const data = this.extractData(payload);

        if(data.Password) {
            const salt = await bcrypt.genSalt(10);
            data.Password = await bcrypt.hash(data.Password, salt);
        }
        const result = await this.Reader.insertOne(data);
        return result;
    }

    async find(filter) {
        const cursor = await this.Reader.find(filter);
        return await cursor.toArray();
    }

    async findAll() {
        return await this.find({});
    }

    async findByReader(madocgia) {
        return await this.Reader.findOne({ MaDocGia: madocgia });
    }

    async findById(id) {
        return await this.Reader.findOne({
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

        const result = await this.Reader.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(id) {
        const result = await this.Reader.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    async deleteAll() {
        const result = await this.Reader.deleteMany({});
        return result.deletedCount;
    }

    async login(MaDocGia, Password) {
        const reader = await this.Reader.findOne({ MaDocGia });
        if (!reader) return { success: false, message: "Mã độc giả không tồn tại" };

        const isMatch = await bcrypt.compare(Password, reader.Password);
        if (!isMatch) return { success: false, message: "Mật khẩu không đúng" };

        const { Password: pw, ...safeData } = reader;
        return { success: true, reader: safeData };
    }
}

module.exports = ReaderService;