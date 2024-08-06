use zephyr_sdk::{prelude::*, EnvClient, DatabaseDerive};


#[derive(DatabaseDerive, Clone, Serialize)]
#[with_name("ledger")]
struct TimestampTable {
    time: u64,
}

//Runs on every ledger closing
#[no_mangle]
pub extern "C" fn on_close() {
    let env = EnvClient::new();

    let timestamp = env.reader().ledger_timestamp();
    
    // Logging the ledger timestamp
    env.log().debug(format!("Current Timestamp {}", timestamp), None);

    //TODO: Store the timestamp in the database
    let table = TimestampTable {
        time: timestamp.clone(),
    };
    env.log().debug("Successfully wrote to the database", None);
    table.put(&env);
    env.log().debug("Successfully wrote to the database", None);

    //TODO: On every ledger check, store the average fee
    
    //TODO: Query the timestamp

    //TODO: Store the average fee every 5 ledger in the database
    
}            
