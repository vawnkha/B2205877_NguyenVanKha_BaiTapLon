const bcrypt = require("bcryptjs");

class ReaderService {
    constructor(client) {
        this.DocGia = client.db().collection("docgia");
    }

    extractData(payload) {
        const docgia = {
            MaDocGia: payload.MaDocGia,
            HoLot: payload.HoLot,
            Ten: payload.Ten,
            NgaySinh: payload.NgaySinh,
            Phai: payload.Phai,
            DiaChi: payload.DiaChi,
            DienThoai: payload.DienThoai,
            Password: payload.Password,
        };

        Object.keys(docgia).forEach(
            (key) => docgia[key] === undefined && delete docgia[key]
        );

        return docgia;
    }

    async create(payload) {
        const data = this.extractData(payload);

        if(data.Password) {
            const salt = await bcrypt.genSalt(10);
            data.Password = await bcrypt.hash(data.Password, salt);
        }
        const result = await this.DocGia.insertOne(data);
        return result;
    }

    async find(filter) {
        const cursor = await this.DocGia.find(filter);
        return await cursor.toArray();
    }

    async findAll() {
        return await this.find({});
    }

    async findByMaDocGia(madocgia) {
        return await this.DocGia.findOne({ MaDocGia: madocgia });
    }

    async update(madocgia, payload) {
        const update = this.extractData(payload);

        if (update.Password) {
            const salt = await bcrypt.genSalt(10);
            update.Password = await bcrypt.hash(update.Password, salt);
        }

        const result = await this.DocGia.findOneAndUpdate(
            { MaDocGia: madocgia },
            { $set: update },
            { returnDocument: "after" }
        );
        return result;
    }

    async delete(madocgia) {
        return await this.DocGia.findOneAndDelete({ MaDocGia: madocgia });
    }

    async deleteAll() {
        const result = await this.DocGia.deleteMany({});
        return result.deletedCount;
    }

    async login(MaDocGia, Password) {
        const docgia = await this.DocGia.findOne({ MaDocGia });
        if (!docgia) return { success: false, message: "Mã độc giả không tồn tại" };

        const isMatch = await bcrypt.compare(Password, docgia.Password);
        if (!isMatch) return { success: false, message: "Mật khẩu không đúng" };

        const { Password: pw, ...safeData } = docgia;
        return { success: true, docgia: safeData };
    }
}

module.exports = ReaderService;