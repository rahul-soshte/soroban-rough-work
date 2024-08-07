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

