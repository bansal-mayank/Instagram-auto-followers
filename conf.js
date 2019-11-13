module.exports = {
    username: 'kaliya3155',
    password: 'mayankbansal',
    tags: 'photooftheday',
    waitforSecuritycode: 1,
    followtimer: 1,
    nextTagRedirecttimer: 10,
    unfollowstart: 100,
    unfollowtimer: 15,
    unfollowRestart: 1
}
// 
//===========================
// All the units of time are in seconds
// so if you have to wait for 1minute please give 60 
// same if you have to wait for 24hrs then give 86400;
// please do not give the number to follow as more then 10 as the instagram algorithm is very smart
// number to unfollow will be same as number to follow as it will unfollow everybody that it followed in one cycle
//===========================

//==========================
// Please dont edit the following fields and leave the as it is:
// 1: nextTagRedirecttimer
// 2: unfollowRestart
//==========================

//==========================
// explaination of inputs
// 1. username - > Insta user name
// 2. password - > insta password
// 3. tag - > tags to go to
// 4. Follotimer -> It is wait time between following each person from a post 
// 5. nextTagRedirecttimer -> It is the wait time between two diffrent tags pages so when we 
//    are done following the users from one tag page its one post it will wait nextTagRedirecttimer time before going to next tag page
// 6. unfollowstart -> It is the wait time after we are done following user from all the tags and waiting to go to user 
//    profile page and start unfollowing
// 7. unfollowtimer -> It is the wait time between unfollowing users from profile page
