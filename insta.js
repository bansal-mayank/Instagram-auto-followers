const pupeter = require('puppeteer');
const conf = require('./conf');
const fs = require('fs');

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
    process.exit();    
});

// put your code here
(async () => {
    const url = 'https://www.instagram.com/accounts/login/?source=auth_switcher';
    let username = conf.username;
    const baseUrl = 'https://www.instagram.com/explore/tags/'
    const unfollowUrl = `https://www.instagram.com/${username}/`
    const browser = await pupeter.launch({headless: false,defaultViewport: null,timeout:0});
    const page  = await browser.newPage();
    let pass = conf.password
    let tags = conf.tags
    tags = tags.split(',')
    await page.goto(url);
    await page.waitFor(5000);
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', pass);
    await page.waitFor(1000);
    const workflow = await page.$('._0mzm-.sqdOP.L3NKy');    
    await workflow.click();
    await page.waitFor(conf.waitforSecuritycode*1000);
    try {
        await page.click('.aOOlW.HoLwm');
    } catch (e) {
        console.log('Error')
    }
    let cycle = 1;
    let following = true;    
    while(true) {
        setTimeout(async function(){
            console.log('Inside settimeout')
            following = false;
            console.log(following)
        },conf.unfollowstart*1000, following);
        while (following) {
            let UsersFollowed = [];
            for (let i=0;i<tags.length;i++){
                await page.goto(baseUrl + tags[i],{ 'waitUntil' : 'domcontentloaded' });
    
                try {
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                } catch(e) {
                    console.log('Error occured while waiting for navigation',e);
                }
    
                try {
                    await page.waitFor(2000);
                } catch (e) {
                    console.log('Error occured after waiting for tag page')
                }
    
                await page.evaluate(function(cycle){
                    document.querySelectorAll('.v1Nh3.kIKUG._bz0w a')[cycle].click()
                },cycle)
    
                try {
                    await page.waitFor(2000);
                } catch (e) {
                    console.log('Error occured whilw wating for post modal')
                }
    
                try {
                    await page.click('._0mzm-.sqdOP.yWX7d._8A5w5');
                } catch (e) {
                    console.log('Erro occured while click on the Likes button on tag page');
                    break;
                }
    
                await page.waitFor(2000);
    
                try {
                    await page.waitForSelector('.pbNvD');
                } catch (e) {
                    console.log('Error occured while Waiting for selector .pbNvD');
                }
    
                let users = await page.$$('.Igw0E.rBNOH.eGOV_._0mzm-')
                for (const user of users) {
                    const singleUser = await page.evaluate(el => {
                        if (el.querySelector('._0mzm-.sqdOP.L3NKy').innerText === 'Follow') {
                            try {
                                el.querySelector('._0mzm-.sqdOP.L3NKy').click();
                            } catch (e) {
                                console.log('Error occured while clicking on follow a user');
                            }
                            return el.querySelector('a').href
                        }
                        else return ''
                    },user)
                    console.log('Value of following', following);
                    if (singleUser) {
                        UsersFollowed.push(singleUser)
                        let file = fs.readFileSync('url.json');
                        let Urls = JSON.parse(file)
                        Urls = Urls.concat(singleUser)
                        fs.writeFileSync('url.json', JSON.stringify(Urls));
                        console.log(singleUser)
                    }
                    if (!following) {
                        console.log('Stop following as the unfollow timer kick in');
                        break;
                    }
                    await page.waitFor(conf.followtimer*1000);
                }
                await page.waitFor(conf.nextTagRedirecttimer*1000);
                if(!following) {
                    console.log('Stop following as the unfollow timer kick in')
                    break;
                }
            }
            console.log(UsersFollowed);
            cycle++;
            console.log(`ycle ${cycle} Done`);
        }
        
        if (!following) {
            console.log('timeout done')
            await page.goto(unfollowUrl,{ 'waitUntil' : 'domcontentloaded' });
            // await page.waitFor(conf.unfollowstart*1000)
            await page.waitFor(1000)
            let file = fs.readFileSync('url.json');
            let leftUrl = JSON.parse(file)
            let UsersFollowed = leftUrl;
            let userUnfollowed = [];
            while (UsersFollowed.length!=0) {
                await page.goto(unfollowUrl,{ 'waitUntil' : 'domcontentloaded' });
                try {
                    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                } catch(e) {
                    console.log('Error occured while waiting for navigation',e);
                }
                await page.waitFor(2000)
                await page.$eval(`a[href="/${username}/following/"]`, (e) => {
                    e.click();
                });
                await page.waitFor(2000)
                let userstoUnfollow = await page.$$('._0mzm-.sqdOP.L3NKy._8A5w5')
                let count = 1;
                let userNotPresentCount = 0;
                for (let user of userstoUnfollow){
                    if (count != 1){
                        const singleUserLink = await page.evaluate(el => {
                            return el.parentElement.previousSibling.querySelector('a').href
                        },user)
                        if (UsersFollowed.indexOf(singleUserLink)> - 1 || userUnfollowed.indexOf(singleUserLink) > -1) {
                            let removedUser = UsersFollowed.splice(UsersFollowed.indexOf(singleUserLink), 1);
                            userUnfollowed.push(removedUser);
                            leftUrl = UsersFollowed;
                            fs.writeFileSync('url.json', JSON.stringify(leftUrl));
                            console.log(removedUser);
                            console.log(UsersFollowed.length);
                            console.log('Link', singleUserLink)
                            await page.evaluate(el => {
                                el.click();
                            },user)
                            await page.waitFor(1000)
                            await page.evaluate(function(){
                                document.querySelector('.aOOlW.-Cab_').click();
                            })
                        } else {
                            userNotPresentCount++;
                            console.log('User is not present goint out to the next cycle');
                            if (userNotPresentCount > 5) {
                                break;
                            }
                        }
    
                        try {
                            await page.waitFor(conf.unfollowtimer*1000);
                        } catch (e) {
                            console.log('Error occured while waiting to unfollowing the next user');
                        }
                    }
                    count++;
                    if (UsersFollowed.length === 0) {
                        break;
                    }
                }
    
                await page.evaluate(() => {
                    document.querySelector('.glyphsSpriteX__outline__24__grey_9').click()
                })
    
                if (userNotPresentCount > 5) {
                    break;
                }
    
                try {
                    await page.waitFor(conf.unfollowRestart*1000);
                } catch(e) {
                    console.log('Error occured while waiting for unfollowRestart',e);
                }
            }
            following = true
            fs.writeFileSync('url.json', JSON.stringify([]));
            
        }
    }
    await page.waitFor(2000000);
    await browser.close();
})();
