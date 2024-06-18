#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Symbol, Vec};
const WASM: &[u8] = include_bytes!("/root/contract-deploy/soroban-hello-world/target/wasm32-unknown-unknown/release/gdg.wasm");

#[contract]
pub struct HelloContract;

#[contractimpl]
impl HelloContract {
    pub fn hello(env: Env, to: Symbol) -> Vec<Symbol> {
        env.deployer().upload_contract_wasm(WASM);

        vec![&env, symbol_short!("Hello"), to]
    }
}

