module.exports = (sequelize, type) => {
    return sequelize.define("tb_hls", {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        md5file: {
            type: type.STRING,
            allowNull:false,
            unique:true
        },
        content: {
            type: type.STRING,
            allowNull:false
        },
    },{
        engine: "MYISAM",
        underscored: true
    })
}