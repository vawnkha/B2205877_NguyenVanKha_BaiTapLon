import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async search(params) {
    return (await this.api.get("/tim-kiem", { params })).data;
  }

  async get(masach) {
    return (await this.api.get(`/${masach}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(masach, data) {
    return (await this.api.put(`/${masach}`, data)).data;
  }

  async delete(masach) {
    return (await this.api.delete(`/${masach}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }

  async deductQuantity(masach, data) {
    return (await this.api.put(`/cap-nhat-so-luong/${masach}`, data)).data;
  }

  async addQuantity(masach, data) {
    return (await this.api.put(`/tra-sach/${masach}`, data)).data;
  }
}

export default new BookService();
