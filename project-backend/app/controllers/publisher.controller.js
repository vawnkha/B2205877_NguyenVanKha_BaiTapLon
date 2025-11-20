const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.MaNXB || !req.body?.TenNXB) {
        return next(new ApiError(400, "Thiếu mã hoặc tên nhà xuất bản"));
    }

    try {
    const service = new PublisherService(MongoDB.client);
    const exists = await service.findByMaNXB(req.body.MaNXB);
    if (exists) {
        return next(new ApiError(409, "Mã nhà xuất bản đã tồn tại"));
    }

    const result = await service.create(req.body);
    return res.send(result);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo nhà xuất bản"));
    }
};

exports.findAll = async (_req, res, next) => {
    try {
        const service = new PublisherService(MongoDB.client);
        const docs = await service.findAll();
        return res.send(docs);
    } catch (error) {
        return next(new ApiError(500, "Không thể lấy danh sách nhà xuất bản"));
    }
};

exports.findOne = async (req, res, next) => {
    try {
        const service = new PublisherService(MongoDB.client);
        const doc = await service.findById(req.params.id);
        if (!doc) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        return res.send(doc);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tìm nhà xuất bản"));
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
    }
    try {
        const service = new PublisherService(MongoDB.client);
        const result = await service.update(req.params.id, req.body);
        if (!result) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        return res.send({ message: "Cập nhật thành công" });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi cập nhật nhà xuất bản"));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const service = new PublisherService(MongoDB.client);
        const result = await service.delete(req.params.id);
        if (!result) return next(new ApiError(404, "Không tìm thấy nhà xuất bản"));
        return res.send({ message: "Xóa thành công" });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa nhà xuất bản"));
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const service = new PublisherService(MongoDB.client);
        const count = await service.deleteAll();
        return res.send({ message: `Đã xóa ${count} nhà xuất bản` });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi xóa tất cả nhà xuất bản"));
    }
};