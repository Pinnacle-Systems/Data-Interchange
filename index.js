import moment from "moment";
import { dbGetDatabase, dbPushDataBase, getConnect } from "./db.connection.js";

const getQuery = `select  attdate, chk, compcode, 
dtype, hremploymastid, hrmattimportid, idcard, inout,ipadd,pmno,unqid,username  from FKATT where rowNum <= 2`;

const deleteQuery = `delete from fkatt`

const formatValue = (value, index, metaData) => {


    if (metaData[index]?.dbTypeName == "DATE") {
        // return `'${new Date(value)}'`
        return `TO_DATE('${moment(value).format("DD/MM/YYYY")}', 'DD/MM/YYYY')`
        // return `TO_DATE(CURRENT_DATE, 'DD/MM/YY')`
    }
    return `'${value}'`
}

const constructPushQuery = (res) => `
INSERT All   
${res.rows.map(row => `INTO FKATT (${res.metaData.map(i => i?.name).join(",")}) VALUES (${row.map((value, index) =>
    formatValue(value, index, res.metaData)
).join(',')}) `).join(" ")} SELECT * FROM DUAL`;

async function getRes(connection, sqlQuery) {
    try {
        const result = await connection.execute(sqlQuery)
        return result
    } catch (error) {
        console.log(error);
        return false
    }
}
async function main() {
    let connection1;
    let connection2;
    try {
        connection1 = await getConnect(dbGetDatabase)
        let res = await getRes(connection1, getQuery);
        console.log(res, 'data');

        connection2 = await getConnect(dbPushDataBase)
        let pushQuery = constructPushQuery(res);
        console.log(pushQuery, 'ins');

        await getRes(connection2, deleteQuery);
        await getRes(connection2, pushQuery);
        connection2.commit();
    } catch (error) {
        console.log(error)
    } finally {
        await connection1.close()
        await connection2.close()
    }
}

main()