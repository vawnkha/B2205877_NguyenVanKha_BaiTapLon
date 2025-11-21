const { ObjectId } = require("mongodb");

class BorrowBooksService {
  constructor(client) {
    this.client = client;
    this.collection = client.db().collection("muonsach");
  }

  extractData(payload) {
    const data = {
      MaDocGia: payload.MaDocGia,
      MaSach: payload.MaSach,
      NgayMuon: payload.NgayMuon || "",
      NgayTra: payload.NgayTra || "",
      TrangThai: payload.TrangThai || "Chờ duyệt",
      NgayKetThuc: payload.NgayKetThuc || "",
      TienPhatTreHan: payload.TienPhatTreHan || 0,
    };

    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key]
    );

    return data;
  }

  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.collection.insertOne(data);
    return { _id: result.insertedId, ...data };
  }

  async find(filter) {
    return await this.collection.find(filter).toArray();
  }

  async findAll() {
    return await this.find({});
  }

  async findById(id) {
    return await this.collection.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const data = this.extractData(payload);
    const result = await this.collection.updateOne(filter, { $set: data });
    return result.modifiedCount > 0;
  }

  async delete(id) {
    const result = await this.collection.deleteOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }

  async findByMaDocGia(maDocGia) {
    const records = await this.collection
      .find({ MaDocGia: maDocGia })
      .toArray();
    const bookCollection = this.client.db().collection("sach");

    for (const record of records) {
      const book = await bookCollection.findOne({ MaSach: record.MaSach });
      record.TenSach = book?.TenSach || "Không tìm thấy tên sách";
    }
    return records;
  }
}

module.exports = BorrowBooksService;
