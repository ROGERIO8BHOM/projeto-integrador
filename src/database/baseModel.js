const { QueryBuilder } = require("./queryBuild");

class DataBaseModel {
    static table = null;
    static primaryKey = "id";
    static selectableAllowedFields = []
    static insertAllowedFields = []
    static updateAllowedFields = []

    static validateFields(data, allowedFields) {
        const invalidFields = Object.keys(data).filter(
            field => !allowedFields.includes(field)
        );

        if (invalidFields.length > 0)
            throw new Error(
                `Campos não permitidos: ${invalidFields.join(", ")}`
            );

        return Object.fromEntries(
            allowedFields
                .filter(field =>
                    Object.hasOwn(data, field) &&
                    data[field] !== undefined
                )
                .map(field => [field, data[field]])
        );
    }

    static validateSelectFields(fields) {
        if (this.selectableAllowedFields.includes("*"))
            return fields

        const invalidFields = fields.filter(
            field => !this.selectableAllowedFields.includes(field)
        );

        if (invalidFields.length > 0)
            throw new Error(
                `Campos não permitidos: ${invalidFields.join(", ")}`
            );

        return fields;
    }

    static query() {
        return new QueryBuilder(this.table);
    }

    static select(...fields) {
        return this.query().select(...this.validateSelectFields(fields))
    }

    static where(field, value) {
        return this.query().where(field, value);
    }

    static async all(...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return query.get()
    }

    static async find(key, ...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return query
            .where(this.primaryKey, key)
            .getFirst()
    }

    static async findAll(key, ...fields) {
        const query = fields.length > 0
            ? this.select(...this.validateSelectFields(fields))
            : this.query()

        return query
            .where(this.primaryKey, key)
            .get()
    }

    static async add(data) {
        const result = await this.query().insert(this.validateFields(data, this.insertAllowedFields))
        return result.insertId
    }

    static async delete(key) {
        const result = await this
            .where(this.primaryKey, key)
            .delete()
        return result.affectedRows
    }

    static async update(key, data) {
        const result = await this
            .where(this.primaryKey, key)
            .update(this.validateFields(data, this.updateAllowedFields))

        return result.affectedRows
    }
}

module.exports = DataBaseModel