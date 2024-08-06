use zephyr_sdk::{prelude::*, soroban_sdk::xdr::{ScString, ScVal}, EnvClient, DatabaseDerive};

#[derive(DatabaseDerive, Clone)]
#[with_name("test")]
struct TestTable {
    hello: ScVal,
}

#[no_mangle]
pub extern "C" fn on_close() {
    let env = EnvClient::new();

    let sequence = env.reader().ledger_sequence();
    env.log().debug(format!("Got sequence {}", sequence), None);

    let message = {
        let message = format!("World at ledegr sequence {}", sequence);
        ScVal::String(ScString(message.try_into().unwrap()))
    };

    let table = TestTable {
        hello: message.clone(),
    };

    env.log().debug(
        "Writing to the database",
        Some(bincode::serialize(&message).unwrap()),
    );
    table.put(&env);
    env.log().debug("Successfully wrote to the database", None);
}