import createApiCilent from "./api.service";

class BorrowBookService {
  constructor(baseUrl = "/api/muon-sach") {
    this.api = createApiCilent(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async findByMaDocGia(maDocGia) {
    return (await this.api.get(`/ma-doc-gia/${maDocGia}`)).data;
  }
}

export default new BorrowBookService();
