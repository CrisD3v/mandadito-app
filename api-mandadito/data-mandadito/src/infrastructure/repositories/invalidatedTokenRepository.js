const { InvalidatedToken } = require('../../config/Db');
const { Op } = require('sequelize');

class InvalidatedTokenRepository {
    async addToken(token, expiresAt) {
        return await InvalidatedToken.create({
            token,
            expiresAt
        });
    }

    async isTokenInvalid(token) {
        const invalidToken = await InvalidatedToken.findOne({
            where: {
                token,
                expiresAt: {
                    [Op.gt]: new Date()
                }
            }
        });
        return !!invalidToken;
    }

    async removeExpiredTokens() {
        return await InvalidatedToken.destroy({
            where: {
                expiresAt: {
                    [Op.lt]: new Date()
                }
            }
        });
    }
}

module.exports = InvalidatedTokenRepository;