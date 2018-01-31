'use strict'

const got = use('got')
const Env = use('Env')

class ApiController {

	async getFacebookToken({request, response, session}){
		const url = 'https://graph.facebook.com/oauth/access_token?client_id='+ Env.get('FACEBOOK_CLIENT_ID') +'&client_secret='+ Env.get('FACEBOOK_CLIENT_SECRET') +'&grant_type=client_credentials';
		const res = await got(url)
		const facebook_token = JSON.parse(res.body).access_token
		session.put('facebook_token', facebook_token)

		response.json({
			success: true,
			facebook_token: session.get('facebook_token')
		})

	}

	getInstagramToken({request, response}){

		response.send("Epale")

	}

}

module.exports = ApiController
