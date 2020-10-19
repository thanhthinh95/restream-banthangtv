module.exports = (sequelize, type) => {
    return sequelize.define("tb_links", {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        url: {
            type: type.STRING,
            allowNull:false,
            unique:true
        },
        md5file: {
            type: type.STRING,
            allowNull:false,
            unique:true
        },
        host: {
            type: type.STRING,
            allowNull:false,
            defaultValue:""
        },
        status: {
            type: type.INTEGER,
            allowNull:false,
            defaultValue: 0
        },
        delete: {
            type: type.INTEGER,
            allowNull:false,
            defaultValue: 0
        },
    },{
        engine: "MYISAM",
        underscored: true
    })
}