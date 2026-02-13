module.exports = (sequelize, DataTypes) => {
    const Note = sequelize.define('Note', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'users', 
                key: 'id'       
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        content: {
            type: DataTypes.TEXT, 
            allowNull: true
        }
    }, {
        // Options
        timestamps: true,       
        underscored: true,     
        tableName: 'notes'      
    });

    return Note;
};