import {Pool, PoolClient} from "pg"

const user = process.env.POSTGRES_USER
const host = process.env.POSTGRES_HOST
const database = process.env.POSTGRES_DATABASE
const password = process.env.POSTGRES_PASSWORD

const pool: Pool = new Pool({
    connectionString: `postgres://${user}:${password}@${host}/${database}?sslmode=require`,
    idleTimeoutMillis: 3000
});

const poolPromise: Promise<PoolClient> = pool
    .connect()
    .then(pool=>{
        console.log('Connected to Postgtresql')
        return pool
    })
    .catch(err => {
        console.error('Connection failed! Bad config:', err)
        throw err
    })

export default poolPromise;