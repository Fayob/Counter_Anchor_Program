import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import {assert} from "chai"

async function airdropSol(publicKey, amount) {
  let airdroptx = await anchor.getProvider().connection.requestAirdrop(publicKey, amount);
  let latestBlockHash = await anchor.getProvider().connection.getLatestBlockhash();
  await anchor.getProvider().connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdroptx
  })
}

describe("counter", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.counter as Program<Counter>;

  it("Is initialized!", async () => {
    // Add your test here.
    const [CounterStorage, bump] = await anchor.web3.PublicKey.findProgramAddressSync([], program.programId)

    const tx = await program.methods.initialize().accounts({
      counterStorage: CounterStorage
    }).rpc();
    console.log("Bump => ", bump)
    console.log("Counter Storage => ", CounterStorage.toBase58())
    console.log("Your transaction signature", tx);
  });

  it("increments", async () => {
    const newKeypair = anchor.web3.Keypair.generate();
    const seeds = []
    const programId = program.programId
    const [CounterStorage] = await anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)

    await airdropSol(newKeypair.publicKey, 2);

    const tx = await program.methods.increment().accounts({
      storage: CounterStorage,
      signer: newKeypair.publicKey,
    }).signers([newKeypair]).rpc()
    console.log("Counter Storage Address: ", CounterStorage.toBase58());
    
    console.log("Your transaction hash: ", tx)

    await program.methods.printXy().accounts({counterStorage: CounterStorage}).rpc()

    // const counterStorageStruct = await program.account.counterStorage.fetch(CounterStorage)

    // assert.equal(counterStorageStruct.x, 4)
    // assert.equal(counterStorageStruct.y, 8)
  })

  it("decrements", async () => {
    const newKeypair = anchor.web3.Keypair.generate();

    const seeds = []
    const programId = program.programId
    const [CounterStorage] = await anchor.web3.PublicKey.findProgramAddressSync(seeds, programId)

    await airdropSol(newKeypair.publicKey, 2);


    const tx = await program.methods.decrement().accounts({
      counter: CounterStorage,
      authority: newKeypair.publicKey
    }).signers([newKeypair]).rpc()
    console.log("Counter Storage Address: ", CounterStorage.toBase58());
    
    console.log("Your transaction hash: ", tx)

    await program.methods.printXy().accounts({counterStorage: CounterStorage}).rpc()

    // const counterStorageStruct = await program.account.counterStorage.fetch(CounterStorage)

    // assert.equal(counterStorageStruct.x, 4)
    // assert.equal(counterStorageStruct.y, 8)
  })
});
