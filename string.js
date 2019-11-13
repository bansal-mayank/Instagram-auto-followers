const fs = require('fs');
let url = [ 'https://www.instagram.com/aint_your_girlll/',
    'https://www.instagram.com/hannomair/',
    'https://www.instagram.com/oxbig_mike21/',
    'https://www.instagram.com/call_me_abi23/',
    'https://www.instagram.com/ymharoni/',
    'https://www.instagram.com/deepthitejur/',
    'https://www.instagram.com/andywins5/',
    'https://www.instagram.com/manjug1855/' ]
fs.writeFileSync('url.json', JSON.stringify(url))