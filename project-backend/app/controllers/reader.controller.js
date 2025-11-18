const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.MaDocGia || !req.body?.Ten || !req.body?.Password) {
        return next(new ApiError(400, "Thiếu thông tin cần thiết"));
    }
    try {
        const service = new ReaderService(MongoDB.client);
        const exists = await service.findByReader(req.body.MaDocGia);
        if (exists) {
            return next(new ApiError(409, "Mã độc giả đã tồn tại"));
        }

        const result = await service.create(req.body);
        return res.send(result);
    } catch (error) {
        if (error.code === 11000) {
            return next(new ApiError(409, "Mã độc giả đã tồn tại"));
        }
        return next(new ApiError(500, "Lỗi khi tạo độc giả"));
    }
};

exports.findAll = async (_req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const docs = await service.findAll();
        docs.forEach(doc => delete doc.Password);
        return res.send(docs);
    } catch (error) {
        return next(new ApiError(500, "Không thể lấy danh sách độc giả"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const docs = await service.findById(req.params.id);
        if (!docs) return next(new ApiError(404, "Không tìm thấy độc giả"));
        return res.send(docs);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tìm độc giả"));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
    }

    try {
        const service = new ReaderService(MongoDB.client);
        const result = await service.update(req.params.id, req.body);
        if (!result) return next(new ApiError(404, "Không tìm thấy độc giả"));
        return res.send({message: "Cập nhật độc giả thành công"});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi cập nhật độc giả"));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (!result) return next(new ApiError(404, "Không tìm thấy độc giả"));
        return res.send({message: "Xóa độc giả thành công"});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa độc giả"));
    }
};

exports.deleteAll = async (_req, res, next) => {
    try {
        const service = new ReaderService(MongoDB.client);
        const count = await service.deleteAll();
        return res.send({message: `Đã xóa ${count} độc giả`});
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa tất cả độc giả"));
    }
};