use borsh::{BorshDeserialize, BorshSerialize};

use solana_program::{
    account_info::{AccountInfo},
    pubkey::Pubkey,
};

// Struct for storing vessel data
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vessel {
    pub is_initialized: bool,
    pub id: u64,
    pub name: String,
    pub description: String,
    pub amount_token: u64,
    pub members: Vec<Member>
    // Polls
    // Posts
}

impl Vessel {
    pub fn add_member(&mut self, member:Member) {
        self.members.push(member)
    }
}

// Posts - count of interactions e.g likes, comments; member who created it

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Member {
    pub key: solana_program::pubkey::Pubkey
}