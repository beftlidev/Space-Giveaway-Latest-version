const { Sequelize, DataTypes, Model } = require("sequelize")
const sequelize = new Sequelize({
    logging: false,
    dialect: "sqlite",
    storage: "../databases/Poll/data.sqlite",
})

class Poll extends Model {}
Poll.init(
    {
        uuid: {
            type: DataTypes.UUID,
            unique: true,
            primaryKey: true,
        },
        userId: DataTypes.STRING,
        guildId: DataTypes.STRING,
        item: DataTypes.STRING,
        channelId: DataTypes.STRING,
        endDate: DataTypes.STRING,
        requirements: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        messageId: DataTypes.STRING,
        isFinished: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    { sequelize, modelName: "poll" }
)

class Entrant extends Model {}
Entrant.init(
    {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            unique: true,
        },
        userId: DataTypes.STRING,
        pollUuid: {
            type: DataTypes.UUID,
            foreignKey: true,
        },
    },
    { sequelize, modelName: "entrant" }
)
class GuildPref extends Model {}
GuildPref.init(
    {
        guildId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        pollChannelId: DataTypes.STRING,
        extraPollMessage: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
        pollRoleId: {
            type: DataTypes.STRING,
            defaultValue: null,
        },
    },
    { sequelize, modelName: "GuildPref" }
)
Poll.hasMany(Entrant)
Entrant.belongsTo(Poll)

module.exports = {
    GuildPrefs: GuildPref,
    Entrants: Entrant,
    Polls: Poll,
    Sequelize: sequelize,
}
