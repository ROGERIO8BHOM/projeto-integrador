const { sanitizeIdentifier } = require("../utils/validators")
const pool = require("../config/database")

class QueryOptions {
    constructor(data = {}) {
        this.fields = Object.keys(data).map(sanitizeIdentifier)
        this.values = Object.values(data)
        this.placeholders = this.fields.map(() => "?").join(", ")
    }
}

class QueryBuilder {
    constructor(table) {
        this.table = sanitizeIdentifier(table);
        this.fields = "*"
        this.wheres = []
        this.values = []
        this.limitOp = ""
        this.orderByValue = null
    }

    where(field, value) {
        this.wheres.push(`${sanitizeIdentifier(field)} = ?`);
        this.values.push(value);
        return this;
    }

    select(...fields) {
        this.fields = fields.length === 0 ? "*"
            : fields.map(sanitizeIdentifier).join(", ")
        return this
    }

    buildWhere() {
        if (this.wheres.length === 0)
            return "";

        return ` WHERE ${this.wheres.join(" AND ")}`;
    }


    limit(amount) {
        if (!Number.isInteger(amount) || amount <= 0) {
            this.limitOp = ""
            return this
        }
        this.limitOp = ` LIMIT ${amount}`
        return this
    }

    async get() {
        const sql = `SELECT ${this.fields}
                 FROM ${this.table}`
            + this.buildWhere() + this.limitOp

        const [rows] = await pool.execute(sql, this.values)

        return rows
    }

    async getFirst() {
        this.limit(1)

        const rows = await this.get()
        return rows[0] ?? null
    }

    async insert(data = {}) {
        const options = new QueryOptions(data)

        if (options.fields.length === 0)
            throw new Error("Nenhum dado informado")

        const sql = ` INSERT INTO ${this.table} (${options.fields.join(", ")})
            VALUES (${options.placeholders})`

        const [result] = await pool.execute(sql, options.values)

        return result
    }

    async update(data = {}) {
        const options = new QueryOptions(data)

        if (options.fields.length === 0)
            throw new Error("Nenhum dado informado")
        const where = this.buildWhere()
        if (!where)
            throw new Error("WHERE esperado", 500)

        const set = options.fields
            .map(field => `${field} = ?`)
            .join(", ")

        const sql =
            `UPDATE ${this.table} SET ${set}${where}`
            
        const values = [
            ...options.values,
            ...this.values
        ]

        const [result] = await pool.execute(sql, values)

        return result
    }

    async delete() {
        const where = this.buildWhere()
        if (!where)
            throw new Error("WHERE esperado", 500)

        const sql = `DELETE FROM ${this.table}${where}`

        const [result] = await pool.execute(sql, this.values)

        return result
    }

}

module.exports = { QueryBuilder, QueryOptions }