import { createRequire } from "module";
const require = createRequire(import.meta.url);
const oracledb = require('oracledb');
oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_19_20" });

export const dbGetDatabase = {
    user: "PSSFK",
    password: "PSSFK_JUL2023",
    connectString: "203.95.216.155:1555/AVT05p",

};
export const dbPushDataBase = {
    user: "PSSPAYROLL",
    password: "PSSPAYROLL_OCT2024",
    connectString: "103.125.155.220:1555/AN01P",
};


export async function getConnect(dbConfig) {

    let connection;
    try {
        connection = await oracledb.getConnection({
            user: dbConfig.user,
            password: dbConfig.password,
            connectString: dbConfig.connectString
        });

        return connection
    } catch (err) {
        return console.log(err);

    }
}

