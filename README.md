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