class BookService {
  constructor(client) {
    this.Book = client.db().collection("sach");
    this.Book.createIndex({ MaSach: 1 }, { unique: true });
  }

  extractData(payload) {
    const book = {
      MaSach: payload.MaSach,
      TenSach: payload.TenSach,
      DonGia: payload.DonGia,
      SoQuyen: payload.SoQuyen,
      NamXuatBan: payload.NamXuatBan,
      MaNXB: payload.MaNXB,
      NguonGoc: payload.NguonGoc,
    };
    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.Book.insertOne(data);
    return result;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findAll() {
    return await this.find({});
  }

  async findByMaSach(masach) {
    return await this.Book.findOne({ MaSach: masach });
  }

  async update(masach, payload) {
    const update = this.extractData(payload);
    const result = await this.Book.findOneAndUpdate(
      { MaSach: masach },
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(masach) {
    const result = await this.Book.findOneAndDelete({
      MaSach: masach,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }

  async findByCondition({ ten, masach, tacgia }) {
    const filter = {};

    if (ten) {
      filter.TenSach = { $regex: new RegExp(ten, "i") };
    }
    if (masach) {
      filter.MaSach = { $regex: new RegExp(masach, "i") };
    }
    if (tacgia) {
      filter.NguonGoc = { $regex: new RegExp(tacgia, "i") };
    }

    return await this.Book.find(filter).toArray();
  }

  async deductQuantity(masach, quantityToDeduct) {
    if (typeof quantityToDeduct !== "number" || quantityToDeduct <= 0) {
      throw new Error("Giá trị cần trừ phải là một số dương");
    }

    const book = await this.Book.findOne({ MaSach: masach });
    if (!book) {
      throw new Error("Không tìm thấy sách");
    }
    if (book.SoQuyen < quantityToDeduct) {
      throw new Error("Không đủ số lượng để trừ");
    }

    const result = await this.Book.findOneAndUpdate(
      { MaSach: masach },
      { $inc: { SoQuyen: -quantityToDeduct } },
      { returnDocument: "after" }
    );
    return result.value;
  }
}

module.exports = BookService;
