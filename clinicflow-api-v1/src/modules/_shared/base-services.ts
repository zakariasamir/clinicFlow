import { Errors } from "@/utils";

export interface BaseServiceDataPropI {
  id?: string;
  query?: Record<string, any>;
  sort?: Record<string, "asc" | "desc"> | any;
  payload?: any;
  selection?: string[] | Record<string, boolean>;
  page?: number;
  limit?: number;
  populate?: string[] | Record<string, any>;
  include?: Record<string, any>;
  throwIfNoResult?: boolean;
}

export interface BaseServiceConfigPropI {
  throwIfNoResult?: boolean;
  decorator?: (doc: any) => Promise<any> | any;
}

const defaultConfig: BaseServiceConfigPropI = {
  throwIfNoResult: false,
  decorator: (doc) => doc,
};

const _mergeDefaultConfig = (
  config: BaseServiceConfigPropI = defaultConfig,
  data?: BaseServiceDataPropI
) => ({
  ...defaultConfig,
  ...config,
  ...(data?.throwIfNoResult !== undefined && { throwIfNoResult: data.throwIfNoResult }),
});

export function BaseServices(Model: any) {
  const countDocuments = async (
    data: BaseServiceDataPropI = {},
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {} } = data;
    const { throwIfNoResult } = _mergeDefaultConfig(config);

    const count = await Model.count({ where: query });
    if (throwIfNoResult && !count) {
      throw Errors.entityDoesntExist();
    }
    return count;
  };

  const existsById = async (
    data: BaseServiceDataPropI,
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { id } = data;
    if (!id) return false;
    const found = await Model.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!found;
  };

  const exists = async (
    data: BaseServiceDataPropI = {},
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {} } = data;
    const found = await Model.findFirst({
      where: query,
      select: { id: true },
    });
    return !!found;
  };

  const fetchAll = async (
    data: BaseServiceDataPropI = {},
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {}, sort = { createdAt: "desc" }, page = 1, limit = 10, include, selection } = data;
    const { throwIfNoResult, decorator } = _mergeDefaultConfig(config, data);

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = limit >= 1 ? Number(limit) : 10;
    const skip = (safePage - 1) * safeLimit;

    const findArgs: any = {
      where: query,
      orderBy: sort,
      skip,
      take: safeLimit,
    };

    if (include) findArgs.include = include;
    if (selection) {
      if (Array.isArray(selection)) {
        findArgs.select = selection.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      } else {
        findArgs.select = selection;
      }
    }

    const [docs, totalDocs] = await Promise.all([
      Model.findMany(findArgs),
      Model.count({ where: query }),
    ]);

    if (throwIfNoResult && !docs.length) {
      throw Errors.entityDoesntExist();
    }

    const totalPages = Math.ceil(totalDocs / safeLimit) || 1;
    const decoratedDocs = decorator ? await Promise.all(docs.map(decorator)) : docs;

    return {
      docs: decoratedDocs,
      totalDocs,
      limit: safeLimit,
      page: safePage,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1,
    };
  };

  const fetchById = async (
    data: BaseServiceDataPropI,
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { id, selection, include } = data;
    const { throwIfNoResult, decorator } = _mergeDefaultConfig(config, data);

    if (!id) {
      if (throwIfNoResult) throw Errors.entityDoesntExist();
      return null;
    }

    const findArgs: any = {
      where: { id },
    };

    if (include) findArgs.include = include;
    if (selection) {
      if (Array.isArray(selection)) {
        findArgs.select = selection.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      } else {
        findArgs.select = selection;
      }
    }

    const result = await Model.findUnique(findArgs);

    if (!result && throwIfNoResult) {
      throw Errors.entityDoesntExist();
    }

    if (result && decorator) {
      return await decorator(result);
    }

    return result;
  };

  const fetchOne = async (
    data: BaseServiceDataPropI = {},
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {}, selection, include, sort } = data;
    const { throwIfNoResult, decorator } = _mergeDefaultConfig(config, data);

    const findArgs: any = {
      where: query,
    };

    if (sort) findArgs.orderBy = sort;
    if (include) findArgs.include = include;
    if (selection) {
      if (Array.isArray(selection)) {
        findArgs.select = selection.reduce((acc, field) => ({ ...acc, [field]: true }), {});
      } else {
        findArgs.select = selection;
      }
    }

    const result = await Model.findFirst(findArgs);

    if (!result && throwIfNoResult) {
      throw Errors.entityDoesntExist();
    }

    if (result && decorator) {
      return await decorator(result);
    }

    return result;
  };

  const createOne = async (
    data: BaseServiceDataPropI,
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { payload } = data;
    const { decorator } = _mergeDefaultConfig(config);

    const result = await Model.create({
      data: payload,
    });

    if (result && decorator) {
      return await decorator(result);
    }

    return result;
  };

  const createMany = async (
    data: BaseServiceDataPropI,
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { payload } = data;
    return await Model.createMany({
      data: payload,
    });
  };

  const updateById = async (
    data: BaseServiceDataPropI,
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { id, payload } = data;
    const { throwIfNoResult, decorator } = _mergeDefaultConfig(config);

    try {
      const result = await Model.update({
        where: { id },
        data: payload,
      });

      if (result && decorator) {
        return await decorator(result);
      }

      return result;
    } catch (err: any) {
      if (err.code === "P2025" && throwIfNoResult) {
        throw Errors.entityDoesntExist();
      }
      throw err;
    }
  };

  const updateOne = async (
    data: BaseServiceDataPropI,
    config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {}, payload } = data;
    const { decorator } = _mergeDefaultConfig(config);

    const existing = await Model.findFirst({ where: query, select: { id: true } });
    if (!existing) {
      return null;
    }

    const result = await Model.update({
      where: { id: existing.id },
      data: payload,
    });

    if (result && decorator) {
      return await decorator(result);
    }

    return result;
  };

  const disableById = async (
    data: BaseServiceDataPropI,
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { id } = data;
    return await Model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  };

  const deleteById = async (
    data: BaseServiceDataPropI,
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { id } = data;
    return await Model.delete({
      where: { id },
    });
  };

  const deleteOne = async (
    data: BaseServiceDataPropI,
    _config: BaseServiceConfigPropI = defaultConfig
  ) => {
    const { query = {} } = data;
    const existing = await Model.findFirst({ where: query, select: { id: true } });
    if (!existing) return null;
    return await Model.delete({
      where: { id: existing.id },
    });
  };

  return {
    countDocuments,
    existsById,
    exists,
    fetchAll,
    fetchOne,
    fetchById,
    createOne,
    createMany,
    updateById,
    updateOne,
    disableById,
    deleteById,
    deleteOne,
  };
}

export default BaseServices;
