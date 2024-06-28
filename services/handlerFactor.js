const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
// const { Model } = require("mongoose");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) => asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`no document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) => asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  
    if (!document) {
      return next(new ApiError(`no document for this id ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
  });


exports.createOne = (Model)=> asyncHandler(async (req, res) => {
  
    const document = await Model.create(req.body);
    res.status(201).json({ data: document });
  });

exports.getOne =(Model) =>asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      //res.status(404).json({ msg: `no document for this id ${id}` });
      return next(new ApiError(`no document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });


exports.getAll = (Model ,modelName=" " ) => asyncHandler(async (req, res) => {
    //build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures (Model.find(), req.query)
      .search(modelName)
      .filter()
      .limitfields()
      .sort()
      .paginate(documentsCounts);
  
    const { mongooseQuery, paginationResult } = apiFeatures;
    const document = await mongooseQuery;
  
    res
      .status(200)
      .json({ results: document.length, paginationResult, data: document });
  });