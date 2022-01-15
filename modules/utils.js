const clog = console.log;

function dlog() {
  console.log.apply(this, arguments);
}

module.exports = {
  clog,
  dlog,
};
