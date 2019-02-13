const dev = process.env.NODE_ENV === 'development'; // prod 正式环境
const tronConfig = {
    contract: dev ? 'TEuGSa6F91bW2zJGPre2tTVYUqAUPyJFgo' : 'TEuGSa6F91bW2zJGPre2tTVYUqAUPyJFgo',
    tokenContract: dev ? 'TQwTqhRk7DZLiH3Tjwxng7XEiwGqMfKgyc' : 'TQwTqhRk7DZLiH3Tjwxng7XEiwGqMfKgyc',
    TRONGRID_API: dev ? 'https://api.shasta.trongrid.io' : 'https://api.trongrid.io',
    defaultAddress: 'TRR7BaKHje4RcVrDGTzDAKyqeQ9mYVdLQW',
    cancelAt: 18000
};

export default tronConfig;