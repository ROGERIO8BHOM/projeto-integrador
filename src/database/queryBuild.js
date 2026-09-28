const { sanitizeIdentifier } = require("../utils/validators")
const pool = require("../config/database")
const AppError = require("../errors/appError")

class QueryOptions {
    constructor(data = {}) {
        this.fields = Object.keys(data).map(sanitizeIdentifier)
        this.values = Object.values(data)
        this.placeholders = this.fields.map(() => "?").join(", ")
    }
}

class QueryJoin {
    constructor(table, comparators = [], fields = [], type = "JOIN") {
        this.table = sanitizeIdentifier(table)
        this.comparators = comparators
        this.fields = fields
        this.type = type
    }

    buildSelect() {
        return this.fields.map(field => {
            if (Array.isArray(field)) {
                const [name, alias] = field
                return `${this.table}.${sanitizeIdentifier(name)} AS ${sanitizeIdentifier(alias)}`
            }

            return `${this.table}.${sanitizeIdentifier(field)}`
        }).join(", ")
    }

    buildJoin(baseTable) {
        // table1.field1 = table2.field2 AND ...
        const conditions = this.comparators.map(([field1, field2]) =>
            `${baseTable}.${sanitizeIdentifier(field1)} = ${this.table}.${sanitizeIdentifier(field2)}`
        ).join(" AND ")

        if (!conditions)
            throw new AppError("Comparadores esperados")

        return ` ${this.type} ${this.table} ON ${conditions}`
    }
}

class QueryBuilder {
    constructor(table) {
        this.table = sanitizeIdentifier(table)
        this.fields = "*"
        this.wheres = []
        this.values = []
        this.limitOp = ""
        this.orderByValue = null
        this.joins = []
    }

    // Comparators = [..., [field1, field2], ...]
    join(table, comparators, ...fields) {
        this.joins.push(
            new QueryJoin(table, comparators, fields)
        )

        return this
    }

    leftJoin(table, comparators, ...fields) {
        this.joins.push(
            new QueryJoin(table, comparators, fields, "LEFT JOIN")
        )

        return this
    }

    where(field, value) {
        this.wheres.push(`${this.table}.${sanitizeIdentifier(field)} = ?`)
        this.values.push(value)
        return this
    }

    select(...fields) {
        this.fields = fields.length === 0 ? "*"
            : fields.map(sanitizeIdentifier).join(", ")
        return this
    }

    buildWhere() {
        if (this.wheres.length === 0)
            return ""
        return ` WHERE ${this.wheres.join(" AND ")}`
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
        const fields = this.fields === "*"
            ? `${this.table}.*`
            : this.fields.split(",")
                .map(f => `${this.table}.${f.trim()}`)
                .join(", ");

        const joinFields = this.joins
            .map(join => join.buildSelect())
            .filter(Boolean)

        const joins = this.joins
            .map(join => join.buildJoin(this.table))
            .join("")

        const sql = `SELECT ${[fields, ...joinFields].join(", ")}
                 FROM ${this.table}${joins}`
            + this.buildWhere() + this.limitOp

        const [rows] = await pool.execute(sql, this.values)

        return rows;
    }

    async getFirst() {
        this.limit(1)

        const rows = await this.get()
        return rows[0] ?? null
    }

    async insert(data = {}) {
        const options = new QueryOptions(data)

        if (options.fields.length === 0)
            throw new AppError("Nenhum dado informado")

        const sql = ` INSERT INTO ${this.table} (${options.fields.join(", ")})
            VALUES (${options.placeholders})`

        const [result] = await pool.execute(sql, options.values)

        return result
    }

    async update(data = {}) {
        const options = new QueryOptions(data)

        if (options.fields.length === 0)
            throw new AppError("Nenhum dado informado")
        const where = this.buildWhere()
        if (!where)
            throw new AppError("WHERE esperado", 500)

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
            throw new AppError("WHERE esperado", 500)

        const sql = `DELETE FROM ${this.table}${where}`

        const [result] = await pool.execute(sql, this.values)

        return result
    }

}

module.exports = { QueryBuilder, QueryOptions }
