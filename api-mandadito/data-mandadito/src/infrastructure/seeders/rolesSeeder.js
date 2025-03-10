const { Role } = require("../../config/Db"); // Asegúrate de importar tus modelos correctamente

const seedRoles = async () => {
    try {
        const count = await Role.count(); // Verifica cuántos roles existen
        if (count > 0) {
            console.log("🔹 Los roles ya están en la base de datos, omitiendo seed.");
            return;
        }

        // Inserta los roles si la tabla está vacía
        await Role.bulkCreate([
            { id: 1, name: "admin" },
            { id: 2, name: "user" },
            { id: 3, name: "delivery" },
        ]);

        console.log("✅ Roles insertados correctamente");
    } catch (error) {
        console.error("❌ Error al insertar roles:", error);
    }
};

module.exports = seedRoles;
