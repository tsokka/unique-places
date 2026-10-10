function serialize(doc) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (obj._id) { obj.id = String(obj._id); delete obj._id; }
  delete obj.__v;
  delete obj.passwordHash;
  return obj;
}
module.exports = { serialize };
