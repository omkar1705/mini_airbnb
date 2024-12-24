const mongooes = require("mongoose");
const init_data = require("./data");
const listing = require("../models/listing.js");

main()
.then(res=>console.log("sucessful"))
.catch(err=> console.log(err));

async function main() {
    await mongooes.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initbd = async () => {
    await listing.deleteMany({});
    await listing.insertMany(init_data.data);
    console.log ("done ini");
}

initbd();