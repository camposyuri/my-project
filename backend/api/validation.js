module.exports = (app) => {
  // Have
  function existsOrError(value, msg) {
    if (!value) {
      throw msg;
    } else if (Array.isArray(value) && value.length === 0) {
      throw msg;
    } else if (typeof value === "string" && !value.trim()) {
      throw msg;
    } else {
      return;
    }
  }

  // hasn't
  function notExistsOrError(value, msg) {
    try {
      existsOrError(value, msg);
    } catch (msg) {
      return;
    }
    throw msg;
  }

  //equal values
  function equalOrError(valueA, valueB, msg) {
    if (valueA !== valueB) {
      throw msg;
    }
  }

  return {
    existsOrError,
    notExistsOrError,
    equalOrError,
  };
};
