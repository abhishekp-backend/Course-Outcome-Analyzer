function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function flattenObject(obj, parentKey = '', result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flattenObject(value, newKey, result); // recurse for nested objects
    } else {
      result[newKey] = value;
    }
  }
  return result;
}


module.exports = {isObject, flattenObject}