const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.MaSach || !req.body?.TenSach) {
        return next(new ApiError(400, "Thiếu mã hoặc tên sách"));
    }

    try {
        const service = new BookService(MongoDB.client);
        const exists = await service.findByMaSach(req.body.MaSach);
        if (exists) {
            return next(new ApiError(409, "Mã sách đã tồn tại"));
        }
        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) {
        if (error.code === 11000) {
            return next(new ApiError(409, "Mã sách đã tồn tại"));
        }
        return next(new ApiError(500, "Lỗi khi tạo sách"));
    }
};

exports.findAll = async (_req, res, next) => {
    try {
        const service = new BookService(MongoDB.client);
        const docs = await service.findAll();
        return res.send(docs);
    } catch (error) {
        return next(new ApiError(500, "Không thể lấy danh sách sách"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = new BookService(MongoDB.client);
        const doc = await service.findById(req.params.id);
        if (!doc) return next(new ApiError(404, "Không tìm thấy sách"));
        return res.send(doc);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tìm sách"));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
    }

    try {
        const service = await BookService(MongoDB.client);
        const result = await service.update(req.params.id, req.body);
        if (!result) return next(new ApiError(404, "Không tìm thấy sách"));
        return res.send({ message: "Cập nhật sách thành công"});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi cập nhật sách"));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new BookService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (!result) return next(new ApiError(404, "Không tìm thấy sách"));
        return res.send({ message: "Xóa sách thành công" });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa sách" ));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const service = new BookService(MongoDB.client);
        const count = await service.deleteAll();
        return res.send({ message: `Đã xóa ${count} sách`});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa tất sách"));
    }
};

exports.search = async (req, res, next) => {
    try {
        const service = new BookService(MongoDB.client);
        const { ten, masach, tacgia} = req.body;

        const docs = await service.findByCondition({ ten, masach, tacgia });
        return res.send(docs);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tìm kiếm sách"));
    }
};

exports.deductQuantity = async (req, res, next) => {
    const { quantity } = req.body;

    if (typeof quantity !== "number" || quantity <= 0) {
        return next(new ApiError(400, "Số lượng cần trừ phải là số dương"));
    }

    try {
        const service = new BookService(MongoDB.client);
        const book = await service.deductQuantity(req.params.id, quantity);
        return res.send({
            message: "Đã trừ số lượng thành công",
            book,
        });
    } catch (error) {
        return next(new ApiError(500, error.message || "Lỗi khi trừ số lượng sách"));
    }
};