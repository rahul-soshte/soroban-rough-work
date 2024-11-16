# Rough work for Soroban Projects

## Build Command for Zephyr
```bash
cargo build --release --target wasm32-unknown-unknown
``` 

## Deploy Zephyr for Testnet
```bash
mercury-cli --jwt $MERCURY_JWT --local false --mainnet false deploy
```

## Deploy Zephyr for Mainnet
```bash
mercury-cli --jwt $MERCURY_JWT --local false --mainnet true deploy
```

## Invoking hello world from CLI
```bash
soroban contract invoke --id CD4BKH6OMPUSOCJHDDJVN2UD5OOHJYQHTAHU2KXPT4EFSQYXLYGG3D2V --network testnet --source SB66VLFNPAMBIAS5FLPY5NEKALZA64INYELFYEGPT53UI7S6ORPMSLK5 --cost -- hello --arg "World"
```


## Deploying TTL Example
```bash
soroban contract deploy   --wasm target/wasm32-unknown-unknown/release/soroban_ttl_example.wasm   --source SDTJQOTJLSVZSVTDX2OU4C7PC6CORXEZ3S65QWEMAHEXCMIHKNW6FCPP   --network testnet
```

## Deploying Increment Example
```bash
soroban contract deploy   --wasm target/wasm32-unknown-unknown/release/soroban_increment_contract.wasm  --source SDTJQOTJLSVZSVTDX2OU4C7PC6CORXEZ3S65QWEMAHEXCMIHKNW6FCPP   --network testnet
```

## Invoking setup function
```bash
soroban contract invoke --id CCRCQUZMKESHHSLSONSKNW26D43V4CLLKRME6J6PHKR3MSDLQVRIRE4X --network testnet --source SD4QOBGVANZWLGNXXCQUNOETLUI5WNABANY3VDCEGGJ6MZMYZQXQGGRH --cost -- setup
```