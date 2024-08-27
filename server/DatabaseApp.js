const { CosmosClient } = require("@azure/cosmos");
let { sd, ed } = require("./api.js");
const { setDate } = require("date-fns");
//klucze powinno być trzymane w azure key vault
const endpoint = "https://research123.documents.azure.com:443/";
const key =
  "NSzazUTHZy6Ih8RLwJI0ejNFtE5hKtjRegvuVM8xq4NOU4G13rdovyaqnOUQiVdj5B1aumMFBgbEACDbFGYUYQ==";
const client = new CosmosClient({ endpoint, key });
const databaseId = "Test Database";
const containerId = "Test Database"; //"TestContainerId";
const partitionKey = { kind: "Hash", paths: ["/partitionKey"] };
let data = [];
let queryData = [];
items = {
  Temperatura: {
    id: "1",
    Value: "21",
    partitionKey: "21",
  },
};
items2 = {
  Temperatura: {
    values: [
      {
        id: "1",
        Value: "21",
        partitionKey: "21",
      },
      {
        id: "2",
        Value: "21",
        partitionKey: "21",
      },
      {
        id: "1",
        Value: "21",
        partitionKey: "21",
      },
    ],
  },
};

async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
  });
  console.log(`Created database:\n${database.id}\n`);
}

async function createContainer() {
  // @ts-ignore
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists({ id: containerId, partitionKey });
  console.log(`Created container:\n${_container.id}\n`);
}

async function createFamilyItem(itemBody) {
  // @ts-ignore
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);
  console.log(`Created family item with id:\n${itemBody.id}\n`);
}
async function readContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  // @ts-ignore
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

async function queryContainer() {
  //console.log(`Querying container:\n${_container.id}`);

  // query to return all children in a family
  // Including the partition key value of country in the WHERE filter results in a more efficient query
  const querySpec = {
    query:
      "SELECT VALUE r.valuesC FROM root r WHERE r.partitionKey = @parameter",
    parameters: [
      {
        name: "@parameter",
        value: "temp",
      },
    ],
  };

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  for (var queryResult of results) {
    let resultString = JSON.stringify(queryResult);
    data.push(queryResult);
    console.log(`\tQuery returned ${resultString}\n`);
    let str = data[0];
    console.log(str[0].Value);
  }
}

function dynamicImport() {
  ({ sd, ed } = require("./api.js"));
  console.log(`1.startdata ${sd}, enddata ${ed}`);
}
async function queryContainerDecybels() {
  //console.log(`Querying container:\n${_container.id}`);
  dynamicImport();
  console.log(`2.startdata ${sd}, enddata ${ed}`);

  // query to return all children in a family
  // Including the partition key value of country in the WHERE filter results in a more efficient query
  const querySpec = {
    query:
      "SELECT c.amount, c.time, c.date FROM root r JOIN c IN r.valuesC WHERE r.partitionKey = @parameter AND c.date >= @startDate AND c.date <= @endDate",
    parameters: [
      {
        name: "@parameter",
        value: "temp",
      },
      {
        name: "@startDate",
        value: sd,
      },
      {
        name: "@endDate",
        value: ed,
      },
    ],
  };
  data[1] = [];
  queryData = [];
  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  for (var queryResult of results) {
    let resultString = JSON.stringify(queryResult);
    queryData.push(queryResult);
    console.log(`\tQuery returned ${resultString}\n`);
  }

  data[1] = queryData;

  console.log(`wpisano do tablicy ${data[1][0]}`);
  console.log(`wpisano do tablicy query results ${queryData}`);
  return data[1];
}

createDatabase()
  .then(() => readContainer())
  .then(() => queryContainer())
  .then(() => queryContainerDecybels()) //createFamilyItem(items2.Temperatura))
  .catch((error) => {
    console.log(error);
  });

module.exports = {
  reply: data,
  queryContainerDecybels: queryContainerDecybels,
};
