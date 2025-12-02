class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("nhaxuatban");
    this.Publisher.createIndex({ MaNXB: 1 }, { unique: true });
  }

  extractData(payload) {
    const publisher = {
      MaNXB: payload.MaNXB,
      TenNXB: payload.TenNXB,
      DiaChi: payload.DiaChi,
    };

    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );

    return publisher;
  }

  async create(payload) {
    const data = this.extractData(payload);
    const result = await this.Publisher.insertOne(data);
    return result;
  }

  async find(filter) {
    const cursor = await this.Publisher.find(filter);
    return await cursor.toArray();
  }

  async findAll() {
    return await this.find({});
  }

  async findByMaNXB(manxb) {
    return await this.Publisher.findOne({ MaNXB: manxb });
  }

  async update(manxb, payload) {
    const update = this.extractData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      { MaNXB: manxb },
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(manxb) {
    const result = await this.Publisher.findOneAndDelete({
      MaNXB: manxb,
    });
    return result;
  }

  async deleteAll() {
    const result = await this.Publisher.deleteMany({});
    return result.deleteCount;
  }
}

module.exports = PublisherService;
