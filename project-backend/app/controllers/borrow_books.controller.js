const BorrowBooksService = require("../services/borrow_books.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.MaDocGia || !req.body?.MaSach) {
    return next(new ApiError(400, "Thiếu mã độc giả hoặc mã sách"));
  }

  try {
    const service = new BorrowBooksService(MongoDB.client);
    const result = await service.create(req.body);
    return res.send(result);
  } catch (error) {
    return next(new ApiError(500, "Không thể tạo phiếu mượn"));
  }
};

exports.findAll = async (_req, res, next) => {
  try {
    const service = new BorrowBooksService(MongoDB.client);
    const docs = await service.findAll();
    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi lấy danh sách phiếu mượn"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const service = new BorrowBooksService(MongoDB.client);
    const doc = await service.findById(req.params.id);
    if (!doc) return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    return res.send(doc);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm phiếu mượn"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }

  try {
    const service = new BorrowBooksService(MongoDB.client);
    const update = await service.update(req.params.id, req.body);
    if (!update) return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    return res.send({ message: "Cập nhật phiếu mượn thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật phiếu mượn"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const service = new BorrowBooksService(MongoDB.client);
    const deleted = await service.delete(req.params.id);
    if (!deleted) return next(new ApiError(404, "Không tìm thấy phiếu mượn"));
    return res.send({ message: "Xóa phiếu mượn thành công" });
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi xóa phiếu mượn"));
  }
};

exports.findByMaDocGia = async (req, res, next) => {
  try {
    const service = new BorrowBooksService(MongoDB.client);
    const docs = await service.findByMaDocGia(req.params.MaDocGia);
    return res.send(docs);
  } catch (error) {
    return next(new ApiError(500, "Lỗi truy xuất phiếu mượn theo mã độc giả"));
  }
};
