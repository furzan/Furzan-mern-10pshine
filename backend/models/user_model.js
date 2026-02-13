module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        f_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        l_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        },
        token:{
            type: DataTypes.STRING,
            defaultValue: ''
        },
        reset_token: {
            type: DataTypes.STRING,
            defaultValue: ''
        },
        reset_token_expires: {
            type: DataTypes.DATE,
            defaultValue: null
        }

    }, {
        timestamps: true,
        underscored: true,
        tableName: 'users'
    });

    return User;
};
