export interface Coin {
    id: string;
    name: string;
    symbol: string;
    logo: string;
    bg: string;
    network: string;
    address: string;
}

export const COINS: Coin[] = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', bg: 'bg-[#FF5722]', network: 'Proof of Work', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', bg: 'bg-[#00E5FF]', network: 'Proof of Stake', address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', bg: 'bg-[#FFD700]', network: 'Proof of History', address: '7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFLtV' }
];
