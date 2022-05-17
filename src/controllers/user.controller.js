async function info(req, res) {
  try {
    res.send({ id: req.state.user.id });
  } catch (e) {
    res.status(e?.status ?? 500).send({ message: e.message });
  }
}

module.exports = {
  info,
};
