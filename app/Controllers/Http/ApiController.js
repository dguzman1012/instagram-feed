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

	async getFacebookLocations({request, response, session}){
		let query = request.get()
		const url = "https://graph.facebook.com/v2.11/search?type=place&q="+query.q+"&fields=name,checkins,picture,location,rating_count&access_token=" + session.get("facebook_token");
		const res = await got(url)
		const locations = JSON.parse(res.body)
		if (locations.data){
			response.json({
				success: true,
				locations: locations.data
			})
		}else{
			response.json({
				success: false
			})
		}
					


		
	}

	getInstagramToken({request, response}){

		response.send("Epale")

	}

}

module.exports = ApiController
