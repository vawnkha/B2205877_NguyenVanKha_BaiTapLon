import createApiCilent from "./api.service";

class EmployeeService {
  constructor(baseUrl = "/api/nhan-vien") {
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

  async login(MSNV, Password) {
    return (await this.api.post("/login", { MSNV, Password })).data;
  }
}

export default new EmployeeService();
