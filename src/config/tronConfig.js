const prod = process.env.REACT_APP_SECRET_CODE === 'prod'; // prod 正式环境
const tronConfig = {
    contract: prod ? 'TUSECxQzo9rt3cZSaTisZVCXp6d55VNrJM' : 'TEuGSa6F91bW2zJGPre2tTVYUqAUPyJFgo',
    tokenContract: prod ? 'TPynn6b4J75Pou7ESEBDpCa5G48DfBGLmS' : 'TQwTqhRk7DZLiH3Tjwxng7XEiwGqMfKgyc',
    TRONGRID_API: prod ? 'https://api.trongrid.io' : 'https://api.shasta.trongrid.io',
    defaultAddress: prod ? 'TDhujbFptjzA78A7wkrYogYNCq6SL5c5pW' : 'TRR7BaKHje4RcVrDGTzDAKyqeQ9mYVdLQW',
    cancelAt: 1800,
    iconLink: '//at.alicdn.com/t/font_1046504_irjgdfxp3qm.js',
    wsUrl: prod ? 'ws://d.tronduel.org:8080' : 'ws://111.231.64.75:8080',
};

export default tronConfig;