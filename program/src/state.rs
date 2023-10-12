use borsh::{BorshSerialize, BorshDeserialize};

// Struct for storing vessel data
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vessel {
    pub is_initialized: bool,
    pub name: String,
    pub description: String,
    pub amount_token: u64,
    pub members: Vec<Member>,
    pub is_created: bool,
    pub categories: Vec<String>,
    pub id: String,
    pub creator_id: String,
    pub owner_key: [u8; 32],
    pub chaos_channel_id: String,
    // Polls
    // Posts
}

// Posts - count of interactions e.g likes, comments; member who created it

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Member {
    pub key: [u8; 32],
    pub owner_key: [u8; 32],
    pub user_type: String,
    pub user_id: String,
    pub chaos_participant_id: String
}

// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct Founder {
//     pub key: u32,
//     pub owner_key: u32
// }

// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct Specialist {
//     pub role: String,
//     pub key: u32,
//     pub owner_key: u32
// }

// impl Specialist {
//     pub fn get_size(& self) -> usize {
//         let size = 4 + (self.role.len()) +  8 + 8;
//         return size;          
//     }
// }