Anchor (Solana) — Setup From Scratch

**Introduction**

This README explains how to set up Anchor (the Solana framework) from scratch on macOS/Linux. It covers prerequisites, installing the Solana toolchain and Anchor CLI, creating a new Anchor program, building, testing locally, and deploying to localnet and public networks.

**Prerequisites**

- **Rust**: stable toolchain (recommended via `rustup`).
- **Node**: LTS (v18+ recommended).
- **Yarn** or `npm`.
- **Solana CLI**: for local validator and deployments.
- **Anchor CLI**: Anchor development toolchain.

**Quick environment checks**

Run these to verify core tools are installed:

```bash
rustc --version
node --version
npm --version
yarn --version
solana --version
anchor --version
```

**1. Install Rust (if needed)**

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**2. Install Node.js and package manager**

Use nvm or your preferred installer. Example with Homebrew:

```bash
brew install node
npm install -g yarn
```

If you want to enable yarn through corepack and you don't have it installed even after you install Node, you can run the command below:

```bash
    brew install corepack
    corepack enable
```

**3. Install Solana CLI and Anchor**

Follow the official installer. Example:

```bash
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash
solana --version
```

Alternative command to install solana cli:

```bash
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    solana --version
```

**4. Install Anchor CLI**

Anchor is distributed as an npm package that bundles the Rust programs and TypeScript helpers.

```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
anchor --version
```

If you see permission errors, prefer installing with `cargo` or use a node version manager to avoid global permission problems.


Ensure the program_id is synced with the Anchor key

```bash
anchor keys sync
``` 

**5. Start local validator (for local testing)**

Configure default CLI cluster (use `localnet` for local development):

```bash
solana config set --url localhost
```

Anchor provides an integrated local environment, but you can also run `solana-test-validator` directly.

```bash
# in one terminal, start the local validator
solana-test-validator --reset

# in another terminal, confirm cluster
solana cluster-version
```

**6. Create a new Anchor project**

```bash
anchor init my_anchor_project
cd my_anchor_project
```

**7. Build the program**

```bash
anchor build
```

This compiles the Rust program and generates IDL JSON in `target/idl/`.

**8. Run tests (local)**

By default Anchor tests use a local validator. Run:

```bash
anchor test
```

Ensure Node dependencies are installed:

```bash
yarn install
```

**9. Deploy to localnet**

Anchor deploys using the program keypair and configured cluster.

```bash
# This will deploy to the cluster set in solana config (use localhost for local)
anchor deploy
```

To ensure you're on localnet:

```bash
solana config set --url localhost
```

**10. Deploy to Devnet/Testnet**

1. Set cluster URL:

```bash
solana config set --url https://api.devnet.solana.com
```

2. Airdrop SOL for payer (devnet):

```bash
solana airdrop 2 $(solana-keygen pubkey ~/.config/solana/id.json) --url https://api.devnet.solana.com
```

3. Deploy using Anchor (ensure `Anchor.toml` provider cluster is correct):

```bash
anchor deploy --provider.cluster devnet
```

Note: For real deployments, set up a secure program keypair and proper payer account. Consider CI-based deploy pipelines.

**11. Upgrading Programs**

If your program is upgradeable (BPFUpgradeableLoader), you can use `anchor upgrade`:

```bash
anchor upgrade ./target/deploy/<program-name>-so --provider.cluster devnet
```

Replace `<program-name>-so` with the compiled shared object file.

**12. Verify deployment and inspect IDL**

The IDL is generated at `target/idl/<program>.json`. Use it in clients (TypeScript, Anchor client). To check deployed program ID:

```bash
solana program show <PROGRAM_ID> --url https://api.devnet.solana.com
```

**Troubleshooting**

- If `anchor` binary is not found: ensure `cargo` bin path is in `$PATH` (`$HOME/.cargo/bin`).
- Build fails due to Rust toolchain: ensure `rustup` target `bpfel-unknown-unknown` is installed as required by your Anchor/Rust toolchain (Anchor automates some of this).
- `solana-test-validator` crash: try `solana-test-validator --reset` and increase system resources if necessary.
- Permission issues on macOS: avoid `sudo` with npm/cargo; use user-local installs or version managers.

**Useful commands summary**

```bash
# Start local validator
solana-test-validator --reset

# Build
anchor build

# Run tests
anchor test

# Deploy (local)
anchor deploy

# Deploy (devnet)
solana config set --url https://api.devnet.solana.com
anchor deploy
```

**Resources**

- Anchor docs: https://www.anchor-lang.com/docs
- Solana docs: https://docs.solana.com
- Anchor GitHub: https://github.com/coral-xyz/anchor
