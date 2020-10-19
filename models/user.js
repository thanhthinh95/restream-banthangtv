module.exports = (sequelize, type) => {
    return sequelize.define("tb_users", {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        username: {
            type: type.STRING,
            allowNull:false,
            unique:true
        },
        password: {
            type: type.STRING,
            allowNull:false
        },
    },{
        engine: "MYISAM",
        underscored: true
    })
}