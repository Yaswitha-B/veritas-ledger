module.exports = {
  networks: {
    development: {
      host: "172.22.160.1",
      port: 7545,
      network_id: "5777"
    }
  },

  compilers: {
    solc: {
      version: "0.8.0"
    }
  }
};