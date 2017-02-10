import TwitterClient from 'twitter-node-client'
import config from 'config'

const twitter = new TwitterClient.Twitter(config.twitter)
 
const fetch = (id) => new Promise((resolve, reject) => {
  twitter.getTweet({id}, reject, resolve)
})

export default {fetch}