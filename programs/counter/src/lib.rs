use anchor_lang::prelude::*;
use std::mem::size_of;

declare_id!("5LsJUyuoV2zzS5fktRyqqK4q235fpMYTCzGYdSF7Y3cL");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        ctx.accounts.counter_storage.authority = ctx.accounts.signer.key();
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        // if ctx.accounts.storage.authority != ctx.accounts.signer.key() {
        //     return err!(CounterError::Unathorize);
        // }
        require!(ctx.accounts.storage.authority == ctx.accounts.signer.key(), CounterError::Unathorize);
        let counter = &mut ctx.accounts.storage;
        counter.x += 1;
        counter.y += 2;
        Ok(())
    }

    pub fn decrement(ctx: Context<Decrement>) -> Result<()> {
        ctx.accounts.counter.x -= 1;
        ctx.accounts.counter.y -= 2;
        Ok(())
    }

    pub fn print_xy(ctx: Context<PrintXY>) -> Result<()> {
        let cs = &ctx.accounts.counter_storage;
        msg!("X value is {} and Y value is {}", cs.x, cs.y);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct PrintXY<'info> {
    pub counter_storage: Account<'info, CounterStorage>
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(
        mut,
        // has_one = authority,
        constraint = counter.authority == authority.key(),
        seeds = [], 
        bump)]
    pub counter: Account<'info, CounterStorage>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub storage: Account<'info, CounterStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = signer, space = size_of::<CounterStorage>() + 8, seeds = [], bump)]
    pub counter_storage: Account<'info, CounterStorage>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>
}

#[account]
pub struct CounterStorage {
    pub x: u64,
    pub y: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum CounterError {
    #[msg("You are not authorize to write to this storage")]
    Unathorize
}
