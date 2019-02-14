const prod = process.env.NODE_ENV === 'production'; // prod 正式环境
const tronConfig = {
    contract: prod ? 'TEuGSa6F91bW2zJGPre2tTVYUqAUPyJFgo' : 'TEuGSa6F91bW2zJGPre2tTVYUqAUPyJFgo',
    tokenContract: prod ? 'TQwTqhRk7DZLiH3Tjwxng7XEiwGqMfKgyc' : 'TQwTqhRk7DZLiH3Tjwxng7XEiwGqMfKgyc',
    TRONGRID_API: prod ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io',
    defaultAddress: 'TRR7BaKHje4RcVrDGTzDAKyqeQ9mYVdLQW',
    cancelAt: 18000
};

export default tronConfig;